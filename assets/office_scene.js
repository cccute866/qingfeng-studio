"use strict";
const O_W = 1152;
const O_H = 864;
function oMin(s) {
    const p = s.split(":");
    return Number(p[0]) * 60 + Number(p[1]);
}
function oStateAt(d, m, min) {
    if (m.joinsMeeting && min >= oMin(d.meeting.from) && min < oMin(d.meeting.to)) {
        return { st: d.meeting.status, where: "meeting" };
    }
    let cur = m.before;
    for (const s of m.slots) {
        if (min >= oMin(s.from) && min < oMin(s.to))
            return { st: s.during, where: "desk" };
        if (min >= oMin(s.to))
            cur = s.after;
    }
    return { st: cur, where: "desk" };
}
function oLerp(a, b, k) {
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}
function oDist(a, b) {
    return Math.hypot(b[0] - a[0], b[1] - a[1]);
}
// 沿多段路徑走：回傳位置與目前方向
function oAlong(path, dist) {
    let left = dist;
    for (let i = 0; i < path.length - 1; i++) {
        const seg = oDist(path[i], path[i + 1]);
        if (left <= seg) {
            return { p: oLerp(path[i], path[i + 1], seg === 0 ? 1 : left / seg), dx: path[i + 1][0] - path[i][0], dy: path[i + 1][1] - path[i][1], done: false };
        }
        left -= seg;
    }
    const n = path.length;
    return { p: path[n - 1], dx: path[n - 1][0] - path[n - 2][0], dy: path[n - 1][1] - path[n - 2][1], done: true };
}
function oPathLen(path) {
    let s = 0;
    for (let i = 0; i < path.length - 1; i++)
        s += oDist(path[i], path[i + 1]);
    return s;
}
// Q 版像素小人：12x16 格，每格 u 像素；(x,y) 為底部中心
function oChibi(ctx, look, x, y, u, view, pose, frame) {
    const rows = pose === "sit" ? 13 : 16;
    const ox = Math.round(x - 6 * u);
    const oy = Math.round(y - rows * u);
    const R = [];
    const add = (rx, ry, w, h, c) => { R.push([rx, ry, w, h, c]); };
    const hl = "rgba(255,255,255,0.28)";
    const back = view === "back";
    // 頭髮後層／髮型
    if (look.style === "long") {
        add(1, 3, 10, 9, look.hair);
    }
    if (look.style === "tail") {
        add(10, 2, 2, 7, look.hair);
    }
    if (look.style === "bun") {
        add(4, -2, 4, 3, look.hair);
        add(4, -0.5, 4, 0.75, look.trim);
    }
    if (look.style === "knot") {
        add(5, -2, 2, 2.5, look.hair);
        add(3.5, -0.75, 5, 0.75, look.trim);
    }
    // 身體
    const lift = pose === "type" || pose === "sit" ? frame % 2 : 0;
    add(2, 8, 8, 5, look.outfit);
    if (!back) {
        add(5, 8, 2, 5, look.trim);
        add(4.5, 8, 3, 1, look.skin);
    }
    else {
        add(2, 11, 8, 0.75, look.trim);
    }
    // 手臂（打字時左右交替抬手）
    add(0.5, 8.5 - (pose === "type" ? lift : 0), 1.75, 3.5, look.outfit);
    add(9.75, 8.5 - (pose === "type" ? 1 - lift : 0), 1.75, 3.5, look.outfit);
    add(0.5, 12 - (pose === "type" ? lift : 0), 1.75, 1, look.skin);
    add(9.75, 12 - (pose === "type" ? 1 - lift : 0), 1.75, 1, look.skin);
    // 腿
    if (pose === "walk" || pose === "stand") {
        const a = pose === "walk" ? (frame % 2) : 0;
        add(3, 13, 2.5, 3 - a, look.pants);
        add(6.5, 13, 2.5, 2 + a, look.pants);
        add(3, 15.25 - a, 2.5, 0.75, "#2a1d16");
        add(6.5, 14.25 + a, 2.5, 0.75, "#2a1d16");
    }
    // 頭
    if (back) {
        add(0.25, 4, 1.25, 2, look.skin);
        add(10.5, 4, 1.25, 2, look.skin);
        add(3.5, 7.25, 5, 1, look.skin);
        add(1.5, 0.25, 9, 7.25, look.hair);
        add(1, 1, 10, 5.5, look.hair);
        add(3, 1, 3, 1, hl);
        add(2, 2, 1, 3, hl);
    }
    else {
        add(1.5, 0, 9, 1, look.hair);
        add(1, 0.75, 10, 2.25, look.hair);
        add(2, 3, 8, 5, look.skin);
        add(1, 2.5, 1.25, 4.5, look.hair);
        add(9.75, 2.5, 1.25, 4.5, look.hair);
        add(2, 2.5, 3, 1.25, look.hair);
        add(3, 1, 3, 1, hl);
        const blink = frame % 17 === 0 ? 0.35 : 1;
        add(4, 5, 1, blink, "#1b1410");
        add(7, 5, 1, blink, "#1b1410");
        add(3, 6.5, 1, 0.6, "rgba(232,120,120,0.55)");
        add(8, 6.5, 1, 0.6, "rgba(232,120,120,0.55)");
    }
    if (look.style === "band") {
        add(1, 2, 10, 0.8, look.trim);
    }
    const bob = pose === "type" ? (frame % 4 < 2 ? 1 : 0) : pose === "sit" ? frame % 2 : 0;
    // 外框：每個色塊外擴 2px 的深色
    ctx.fillStyle = "#140d0a";
    for (const r of R) {
        const c = String(r[4]);
        if (c.indexOf("rgba") === 0)
            continue;
        ctx.fillRect(ox + Number(r[0]) * u - 2, oy + Number(r[1]) * u - 2 + bob, Number(r[2]) * u + 4, Number(r[3]) * u + 4);
    }
    for (const r of R) {
        ctx.fillStyle = String(r[4]);
        ctx.fillRect(ox + Number(r[0]) * u, oy + Number(r[1]) * u + bob, Number(r[2]) * u, Number(r[3]) * u);
    }
}
function oPoly(ctx, p) {
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    for (let i = 2; i < p.length; i += 2)
        ctx.lineTo(p[i], p[i + 1]);
    ctx.closePath();
}
// 畫整個辦公室；回傳每個人頭頂位置（底圖座標）
function oDraw(ctx, img, d, min, t, moves, opts) {
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, O_W, O_H);
    ctx.drawImage(img, 0, 0, O_W, O_H);
    const u = 4;
    const frame = Math.floor(t * 6);
    const speed = 120;
    const anchors = [];
    const late = [];
    d.members.forEach((m, idx) => {
        const s = oStateAt(d, m, min);
        const mv = moves[m.id] || { where: s.where, since: -1e9 };
        const seat = m.seat;
        const sitAt = [seat.x, seat.y];
        // 螢幕光
        const on = s.where === "desk";
        const working = on && (s.st.tone === "work");
        const flick = working ? 0.16 + 0.1 * Math.abs(Math.sin(t * 9 + idx)) + (frame % 5 === 0 ? 0.06 : 0) : on ? 0.07 + 0.03 * Math.sin(t * 2 + idx) : 0.0;
        if (seat.screen.length >= 6 && flick > 0) {
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            oPoly(ctx, seat.screen);
            ctx.fillStyle = "rgba(140,220,255," + flick.toFixed(3) + ")";
            ctx.fill();
            if (working) {
                oPoly(ctx, seat.screen);
                ctx.clip();
                let minY = 1e9, maxY = -1e9, minX = 1e9, maxX = -1e9;
                for (let i = 0; i < seat.screen.length; i += 2) {
                    minX = Math.min(minX, seat.screen[i]);
                    maxX = Math.max(maxX, seat.screen[i]);
                    minY = Math.min(minY, seat.screen[i + 1]);
                    maxY = Math.max(maxY, seat.screen[i + 1]);
                }
                const h = maxY - minY;
                for (let k = 0; k < 4; k++) {
                    const yy = minY + ((t * 18 + k * h / 4) % h);
                    ctx.fillStyle = "rgba(190,255,220,0.35)";
                    ctx.fillRect(minX + 4 + ((k * 7) % 9), yy, (maxX - minX) * (0.35 + 0.12 * ((k + idx) % 3)), 2);
                }
            }
            ctx.restore();
        }
        // 位置：會議／回座／泡茶
        const meetPath = [seat.stand, m.meet];
        let pos = null;
        let dir = [0, 1];
        let walking = false;
        const el = t - mv.since;
        if (s.where === "meeting") {
            const r = oAlong(meetPath, Math.max(0, el) * speed);
            pos = r.p;
            dir = [r.dx, r.dy];
            walking = !r.done;
            if (r.done)
                dir = [0, 1];
        }
        else if (mv.where === "desk" && el < oPathLen(meetPath) / speed && mv.since > -1e8) {
            const r = oAlong([m.meet, seat.stand], Math.max(0, el) * speed);
            pos = r.p;
            dir = [r.dx, r.dy];
            walking = true;
        }
        else if (opts.ambient && (s.st.tone === "wait" || s.st.tone === "done") && (opts.teaWho === "" || opts.teaWho === m.id)) {
            const P = opts.teaPeriod;
            const teaPath = [seat.stand, d.tea];
            const len = oPathLen(teaPath);
            const solo = opts.teaWho !== "";
            const stay = solo ? P * 0.25 : 5;
            const sp = solo ? len / (P * 0.3) : speed;
            const dur = len / sp;
            const off = solo ? 0 : (idx * 13.7) % P;
            const ph = ((t + off) % P + P) % P;
            if (ph < dur) {
                const r = oAlong(teaPath, ph * sp);
                pos = r.p;
                dir = [r.dx, r.dy];
                walking = true;
            }
            else if (ph < dur + stay) {
                pos = d.tea;
                dir = [0, -1];
            }
            else if (ph < 2 * dur + stay) {
                const r = oAlong([d.tea, seat.stand], (ph - dur - stay) * sp);
                pos = r.p;
                dir = [r.dx, r.dy];
                walking = true;
            }
        }
        if (pos === null) {
            const typing = s.st.tone === "work" || s.st.tone === "you";
            const pose = typing ? "type" : "sit";
            const fr = typing ? frame : Math.floor(t * 1.5);
            if (seat.facing === "front") {
                oChibi(ctx, m.look, sitAt[0], sitAt[1], u, "front", pose, fr);
            }
            else {
                oChibi(ctx, m.look, sitAt[0], sitAt[1], u, "back", pose, fr);
                if (seat.back.length >= 6) {
                    ctx.save();
                    oPoly(ctx, seat.back);
                    ctx.clip();
                    ctx.drawImage(img, 0, 0, O_W, O_H);
                    ctx.restore();
                }
            }
            anchors.push({ id: m.id, x: sitAt[0], y: sitAt[1] - 13 * u - 6 });
        }
        else {
            const p = pos;
            const view = dir[1] < -0.01 ? "back" : "front";
            const fr = walking ? Math.floor(t * 7) : 0;
            late.push({ y: p[1], fn: () => {
                    ctx.fillStyle = "rgba(0,0,0,0.25)";
                    ctx.beginPath();
                    ctx.ellipse(p[0], p[1], 18, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    oChibi(ctx, m.look, p[0], p[1], u, view, walking ? "walk" : "stand", fr);
                } });
            anchors.push({ id: m.id, x: p[0], y: p[1] - 16 * u - 6 });
        }
    });
    late.sort((a, b) => a.y - b.y);
    for (const l of late)
        l.fn();
    if (opts.night > 0) {
        ctx.fillStyle = "rgba(8,10,30," + opts.night.toFixed(2) + ")";
        ctx.fillRect(0, 0, O_W, O_H);
    }
    return anchors;
}
// ===== SCENE:END =====
