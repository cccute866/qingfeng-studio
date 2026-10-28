"use strict";
// 排程狀態（大樓小人位置用）；Q版立繪改由 assets/chars/*.webp 繪製
function oMin(s) {
    const p = String(s || "0:0").split(":");
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
