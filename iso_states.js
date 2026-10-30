"use strict";
/**
 * 等角辦公室三種行為（純邏輯，可給 node 測試）：
 * 需要你 > 卡住了 > 工作中 > 閒晃
 * 只依真實狀態資料，不捏造。
 */
(function (root) {
  var ISO_IDS = { trade: 1, pr: 1, fin: 1 };

  /** 手點座標：相對房間 0–1；走路時用 walk，停靠用 stand→present 立繪 */
  /** 站立點須在地板上（非桌面／欄杆外）。座標相對房間 0–1。 */
  /** 閒晃點：開闊地板磁磚（非桌面／懶骨頭／玻璃欄杆）。對照 preview_iso_scale 與房間圖校正。 */
  var ISO_WANDER = {
    trade: [
      { x: 0.42, y: 0.80, label: "圓桌前地板" },
      { x: 0.65, y: 0.74, label: "右側走道" },
      { x: 0.58, y: 0.78, label: "近景地板" },
      { x: 0.32, y: 0.76, label: "左側走道" }
    ],
    pr: [
      { x: 0.42, y: 0.50, label: "公關桌前" },
      { x: 0.48, y: 0.52, label: "中央走道" },
      { x: 0.45, y: 0.50, label: "桌右地板" }
    ],
    fin: [
      { x: 0.64, y: 0.56, label: "財會桌前" },
      { x: 0.55, y: 0.60, label: "中央走道" },
      { x: 0.58, y: 0.56, label: "桌左地板" }
    ]
  };

  /** 可行走地板多邊形（房間圖分數座標，順時針）。坐點可在椅／懶骨頭上，不強制在此內。 */
  var ISO_FLOOR = {
    trade: [
      [0.10, 0.60], [0.30, 0.50], [0.55, 0.46], [0.82, 0.50], [0.92, 0.60],
      [0.88, 0.78], [0.60, 0.88], [0.35, 0.86], [0.15, 0.78]
    ],
    /* 夾層：欄杆內側走道（y 不宜超過 ≈0.62，否則踩到玻璃欄杆） */
    mz: [
      [0.12, 0.46], [0.32, 0.40], [0.55, 0.40], [0.80, 0.44], [0.88, 0.54],
      [0.84, 0.68], [0.55, 0.70], [0.35, 0.68], [0.18, 0.58]
    ]
  };

  function pointInPoly(x, y, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1];
      var xj = poly[j][0], yj = poly[j][1];
      var intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function spotOnFloor(room, x, y) {
    var poly = ISO_FLOOR[room];
    if (!poly) return true;
    return pointInPoly(x, y, poly);
  }

  /** 站姿高度／房間寬（源圖 242px／房間寬）；坐姿比＝179/242 */
  var ISO_SCALE = {
    trade: { standOverWidth: 242 / 1761, sitRatio: 179 / 242, deskPx: 110, standPx: 242 },
    mz: { standOverWidth: 242 / 1630, sitRatio: 179 / 242, deskPx: 100, standPx: 242 }
  };

  var STUCK_MS = 3 * 3600 * 1000; // 3 小時

  function parseForce(search) {
    try {
      var q = String(search || "").replace(/^\?/, "");
      var parts = q.split("&");
      for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split("=");
        if (kv[0] === "isoForce") {
          var v = decodeURIComponent(kv[1] || "");
          if (v === "wander" || v === "needYou" || v === "stuck" || v === "work") return v;
        }
      }
    } catch (e) {}
    return "";
  }

  /**
   * @param {object} input
   * @param {string} input.id - trade|pr|fin
   * @param {string} input.baseCat - work|wait|done|meet|you
   * @param {string} [input.baseText]
   * @param {string} [input.baseFull]
   * @param {object|null} [input.live] - {status, task, updatedAt}
   * @param {array} [input.decisions] - [{item,tag,verdict,dri,due}]
   * @param {function} [input.driIds] - (dri)=>string[]
   * @param {string} [input.today] - YYYY-MM-DD 台北
   * @param {number} [input.nowMs]
   * @param {string} [input.force] - wander|needYou|stuck|work
   * @param {object|null} [input.tradePerf]
   * @param {boolean} [input.reducedMotion]
   * @param {function} [input.parseTP] - (s)=>ms
   * @param {function} [input.plainDecision] - (d)=>string
   */
  function pickIsoBehavior(input) {
    var id = input.id;
    var force = input.force || "";
    var baseCat = input.baseCat || "wait";
    var baseText = input.baseText || "";
    var baseFull = input.baseFull || baseText;

    if (force === "needYou") {
      return {
        mode: "needYou",
        pose: "present",
        tag: "等你決定",
        bubble: "等你決定",
        detail: "（預覽）有件事等你拍板",
        reducedMotion: !!input.reducedMotion
      };
    }
    if (force === "stuck") {
      return {
        mode: "stuck",
        pose: id === "trade" ? "sit" : "present",
        tag: "好像卡住了",
        bubble: "好像卡住了",
        detail: "（預覽）從稍早之後沒有進度更新",
        reducedMotion: !!input.reducedMotion
      };
    }
    if (force === "wander") {
      return {
        mode: "wander",
        pose: "walk",
        tag: "",
        bubble: "下班閒晃",
        detail: "現在沒有排定工作，在辦公室走走",
        reducedMotion: !!input.reducedMotion
      };
    }
    if (force === "work") {
      return {
        mode: "work",
        pose: id === "trade" ? "sit" : "present",
        tag: "",
        bubble: baseText || "工作中",
        detail: baseFull || baseText || "工作中",
        reducedMotion: !!input.reducedMotion
      };
    }

    var ny = findNeedYou(input);
    if (ny) {
      return {
        mode: "needYou",
        pose: "present",
        tag: "等你決定",
        bubble: "等你決定",
        detail: ny.detail,
        reducedMotion: !!input.reducedMotion
      };
    }

    var sk = findStuck(input);
    if (sk) {
      return {
        mode: "stuck",
        pose: id === "trade" ? "sit" : "present",
        tag: "好像卡住了",
        bubble: "好像卡住了",
        detail: sk.detail,
        reducedMotion: !!input.reducedMotion
      };
    }

    if (baseCat === "work" || baseCat === "meet") {
      return {
        mode: "work",
        pose: id === "trade" ? "sit" : "present",
        tag: "",
        bubble: baseText || "工作中",
        detail: baseFull || baseText || "工作中",
        reducedMotion: !!input.reducedMotion
      };
    }

    // wait / done / you（非 needYou 路徑）→ 閒晃
    return {
      mode: "wander",
      pose: "walk",
      tag: "",
      bubble: baseText || "待命",
      detail: baseFull || "現在沒有排定工作，在辦公室走走",
      reducedMotion: !!input.reducedMotion
    };
  }

  function findNeedYou(input) {
    var id = input.id;
    var live = input.live;
    var today = input.today || "";
    if (live && live.status === "等你") {
      var upd = live.updatedAt || "";
      if (!today || upd.slice(0, 10) === today) {
        var task = live.task || "有件事等你拍板";
        return { detail: String(task).slice(0, 80) };
      }
    }
    var decisions = input.decisions || [];
    var driIds = input.driIds || function () { return []; };
    var plain = input.plainDecision || function (d) {
      return String((d && (d.item || d.tag)) || "決定");
    };
    for (var i = 0; i < decisions.length; i++) {
      var d = decisions[i];
      var ids = driIds(d.dri);
      if (ids.indexOf(id) < 0) continue;
      var blob = String(d.tag || "") + String(d.verdict || "") + String(d.item || "") + String(d.dri || "");
      if (ids.indexOf("weixiang") >= 0 || /等你|待批|待核|偉翔決定|等偉翔/.test(blob)) {
        return { detail: plain(d) };
      }
    }
    return null;
  }

  function findStuck(input) {
    var id = input.id;
    var baseCat = input.baseCat || "wait";
    if (baseCat !== "work") return null;
    var nowMs = input.nowMs != null ? input.nowMs : Date.now();
    var parseTP = input.parseTP || function () { return NaN; };
    var live = input.live;
    var last = live && live.updatedAt;

    if (id === "trade") {
      var perf = input.tradePerf || {};
      // 等待未來預計成交日 → 不是卡住
      if (perf.waitingFirstFill) {
        var trades = perf.trades || [];
        var today = input.today || "";
        var hasFuture = false;
        var hasDue = false;
        for (var i = 0; i < trades.length; i++) {
          var t = trades[i];
          if (!(t && t.planned && t.date)) continue;
          if (today && t.date > today) hasFuture = true;
          if (today && t.date <= today) hasDue = true;
        }
        if (hasFuture && !hasDue) return null;
        // 仍在等首筆、且預計日未到或資料正常 → 不標卡住
        return null;
      }
      if (!last) last = perf.asof || perf.updatedAt || "";
    }

    if (!last) return null;
    var t = parseTP(last);
    if (isNaN(t)) return null;
    if (nowMs - t < STUCK_MS) return null;
    var sinceLabel = String(last).slice(0, 16).replace("T", " ");
    return {
      detail: "從 " + sinceLabel + " 之後沒有進度更新",
      since: last
    };
  }

  /** 減少動態時：閒晃只停在第一個點，不走路 */
  function wanderPlacement(id, reducedMotion, wanderIdx) {
    var spots = ISO_WANDER[id] || [];
    if (!spots.length) return { x: 0.5, y: 0.7, moving: false };
    if (reducedMotion) {
      return { x: spots[0].x, y: spots[0].y, moving: false, label: spots[0].label };
    }
    var idx = (wanderIdx || 0) % spots.length;
    return { x: spots[idx].x, y: spots[idx].y, moving: true, label: spots[idx].label, idx: idx };
  }

  var api = {
    ISO_IDS: ISO_IDS,
    ISO_WANDER: ISO_WANDER,
    ISO_FLOOR: ISO_FLOOR,
    ISO_SCALE: ISO_SCALE,
    STUCK_MS: STUCK_MS,
    parseForce: parseForce,
    pickIsoBehavior: pickIsoBehavior,
    findNeedYou: findNeedYou,
    findStuck: findStuck,
    wanderPlacement: wanderPlacement,
    pointInPoly: pointInPoly,
    spotOnFloor: spotOnFloor
  };

  root.IsoStates = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
