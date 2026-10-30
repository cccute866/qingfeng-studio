"use strict";
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const noemo=s=>String(s||"").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}\uFE0F]/gu,"").trim();

function iconSVG(kind){
  const common='xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3FD8A0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const paths={
    director:'<circle cx="12" cy="8" r="3.2"/><path d="M5 19c1.5-3.2 4-4.8 7-4.8s5.5 1.6 7 4.8"/><path d="M12 2.5v1.2"/>',
    council:'<rect x="3.5" y="5" width="17" height="11" rx="1.5"/><path d="M8 19h8M12 16v3"/>',
    trade:'<path d="M4 16l4-4 3 3 6-7"/><path d="M15 8h4v4"/>',
    dev:'<path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/><path d="M13 6l-2 12"/>',
    art:'<path d="M12 3.5l1.8 5.4H19l-4.4 3.2 1.7 5.4L12 14.8 7.7 17.5l1.7-5.4L5 8.9h5.2z"/>',
    num:'<path d="M5 6h6M5 12h6M5 18h6M15 6v12M15 6l4 3.5M15 18l4-3.5"/>',
    qa:'<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l4.5 4.5"/>',
    eng:'<path d="M14.7 6.3l2 2-1.4 1.4 2.1 2.1 1.4-1.4 2 2-6.4 6.4-2-2 1.4-1.4-2.1-2.1-1.4 1.4-2-2z"/><circle cx="8" cy="16" r="1.2"/>',
    lobby:'<path d="M4 20V9.5L12 4l8 5.5V20"/><path d="M10 20v-6h4v6"/>',
    mz:'<rect x="4" y="8" width="7" height="10" rx="1"/><rect x="13" y="8" width="7" height="10" rx="1"/><path d="M11 10h2M11 13h2M11 16h2"/>',
    schedule:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3.5v3M16 3.5v3M4 10h16"/>',
    roadmap:'<circle cx="6" cy="7" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="17" r="2"/><path d="M8 8l2.5 2.5M14 13.5l2.5 2.5"/>'
  };
  const p=paths[kind]||paths.lobby;
  return `<svg class="ic" ${common}>${p}</svg>`;
}

const FLOORS=[
 {id:"director",no:"9F",name:"總裁辦公室",who:"偉翔 創辦人／總監",icon:"ic_director",room:"room_director",member:"weixiang",unit:"exec",band:"f9_top"},
 {id:"council",no:"8F",name:"決策會議室",who:"每日 09:47 Top-5 會議（DRI／新點子實驗；10:45 建版）",icon:"ic_council",room:"room_council",unit:"exec",band:"f8"},
 {id:"trade",no:"7F",name:"交易室",who:"青鋒交易 · 模擬營運中",icon:"ic_trade",room:"room_trade",unit:"trade",band:"f7"},
 {id:"dev",no:"6F",name:"開發部",who:"智雅 主程式／整合 · 遊戲事業部",icon:"ic_dev",room:"room_dev",member:"zhiya",unit:"game",band:"f6"},
 {id:"art",no:"5F",name:"美術部",who:"青鋒美術 · 遊戲事業部",icon:"ic_art",room:"room_art",member:"art",unit:"game",band:"f5"},
 {id:"num",no:"4F",name:"數值部",who:"青鋒數值 · 遊戲事業部",icon:"ic_num",room:"room_num",member:"num",unit:"game",band:"f4"},
 {id:"qa",no:"3F",name:"品管部",who:"青鋒監管 · 遊戲事業部",icon:"ic_qa",room:"room_qa",member:"qa",unit:"game",band:"f3"},
 {id:"eng",no:"2F",name:"工程部",who:"青鋒工程 修復／介面打磨 · 遊戲事業部",icon:"ic_eng",room:"room_eng",member:"eng",unit:"game",band:"f2"},
 {id:"mz",no:"夾層",name:"公關／財會",who:"青鋒公關 沈沐禾 · 青鋒財會 蒲小棠",icon:"ic_mz",room:"room_mz",unit:"ops",band:"mz"},
 {id:"lobby",no:"1F",name:"大廳",who:"遊戲入口 · 進度 · 路線圖",icon:"ic_lobby",room:"room_lobby",unit:"lobby",band:"lobby"}];
/* tower.webp 900×1800 樓層 y 帶（manifest）；百分比相對整張圖 */
/* LED 實測對齊：頂兩薄層併為 9F，其餘一層一帶；lobby 自 1439 */
const BANDS={f9_top:[202,349],f8:[349,490],f7:[490,629],f6:[629,769],f5:[769,906],f4:[906,1042],f3:[1042,1178],f2:[1178,1360],mz:[1360,1455],lobby:[1455,1799]};
const TOWER_H=1800;
/* 座位：room2 floor_y/520；view back=背對螢幕 */
const SPOT={weixiang:{f:"director",x:.30,y:.70,floor:.75},zhiya:{f:"dev",x:.52,y:.68,floor:.74},art:{f:"art",x:.34,y:.66,floor:.73},num:{f:"num",x:.44,y:.70,floor:.75},qa:{f:"qa",x:.58,y:.68,floor:.74},eng:{f:"eng",x:.48,y:.74,floor:.81},trade:{f:"trade",x:.38,y:.58,floor:.72},pr:{f:"mz",x:.28,y:.58,floor:.70},fin:{f:"mz",x:.72,y:.58,floor:.70}};
/* 半寫實正常比例：以房間高度比例對家具；eng 機櫃區略小、總裁室略大 */
const ROOM_SCALE={director:.44,council:.42,trade:.34,mz:.34,lobby:.42,dev:.42,art:.41,num:.41,qa:.41,eng:.38};
const SEAT={weixiang:.29,zhiya:.37,art:.45,num:.53,qa:.61,eng:.69}; const TABLE_TOP=.62;
const NAMES={weixiang:"偉翔",zhiya:"智雅",art:"青鋒美術",num:"青鋒數值",qa:"青鋒監管",eng:"青鋒工程",council:"全員會議",trade:"青鋒交易",pr:"沈沐禾",fin:"蒲小棠"};
const SHORT={weixiang:"偉翔",zhiya:"智雅",art:"美術",num:"數值",qa:"監管",eng:"工程",trade:"交易",pr:"公關",fin:"財會"};
const ROLES={eng:"工程師（修復／QA／介面）",pr:"青鋒公關（遊戲公關：商店上架、IG／脆小編；只起草不上傳）",fin:"青鋒財會（用量與花費、模擬帳核對）",trade:"青鋒交易（紙上模擬）"};
const CAT={work:"工作中",meet:"開會中",done:"完成",wait:"待命",you:"等你"};
const LIVEMAP={"工作中":"work","開會中":"meet","完成":"done","待命":"wait","等你":"you"};
let D=null, floorsEl={}, chars={}, thinking=null, view="city", activeFloor="lobby";

function tpNow(){return new Date(Date.now()+8*3600e3);}
function hm(d){return String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0");}
function nowMin(){const d=tpNow();return d.getUTCHours()*60+d.getUTCMinutes()+d.getUTCSeconds()/60;}
function todayStr(){return tpNow().toISOString().slice(0,10);}
function parseTP(s){const m=/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+)/.exec(s||"");return m?Date.UTC(+m[1],m[2]-1,+m[3],+m[4]-8,+m[5]):NaN;}
function agoText(s){const t=parseTP(s);if(isNaN(t))return"";const m=Math.max(0,Math.round((Date.now()-t)/60000));return m<1?"剛剛更新":m<60?m+" 分鐘前更新":m<1440?Math.floor(m/60)+" 小時前更新":Math.floor(m/1440)+" 天前更新";}
function mm(s){const p=s.split(":");return +p[0]*60+ +p[1];}
function fmtAt(s){if(!s)return"";return s.slice(0,10)===todayStr()?s.slice(11,16):s.slice(5,16).replace("-","/");}

// ---- 狀態 ----
function meetingNow(){
  const lv=D&&D.live&&D.live.zhiya;
  if(lv&&lv.status&&lv.updatedAt&&lv.updatedAt.slice(0,10)===todayStr()){const age=(Date.now()-parseTP(lv.updatedAt))/60000;
    if(age>=0&&age<180)return lv.status==="開會中"?{since:parseTP(lv.updatedAt)}:null;}
  const c=(D&&D.schedule||[]).find(x=>x.who==="council");if(!c)return null;const min=nowMin();
  if(min>=mm(c.from)&&min<mm(c.to)){const d=tpNow();return{since:Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),0,0)-8*3600e3+mm(c.from)*60000};}
  return null;}
function meeters(){return ["zhiya","art","num","qa","eng"].concat(D&&D.weixiangJoins?["weixiang"]:[]);}
function memberState(id){
  if(id==="pr"||id==="fin"){
    const min=nowMin();
    const role=id==="pr"
      ?"遊戲公關：商店上架、IG／脆小編（只起草，不上傳）"
      :"財會：用量與花費、模擬帳核對";
    const name=id==="pr"?"沈沐禾":"蒲小棠";
    if(min>=9*60&&min<18*60)
      return{cat:"work",text:name+" 值班中",full:role,where:"desk",live:false};
    return{cat:"wait",text:"下班／待命",full:role,where:"desk",live:false};
  }
  if(id==="trade"){
    const tr=D&&D.trade||{}; const perf=tr.perf||{};
    const focus=perf.focusTw||perf.todayFocus||perf.status||"紙上模擬交易";
    if(perf.waitingFirstFill) return{cat:"work",text:perf.status||"等待首筆模擬單成交",full:focus,where:"desk",live:false};
    const nPend=(perf.trades||[]).filter(t=>t&&t.planned).length || perf.pendingOrderCount || 0;
    if(nPend) return{cat:"work",text:"預計掛單 "+nPend+" 筆",full:focus,where:"desk",live:false};
    return{cat:"work",text:perf.status||"模擬營運中",full:focus,where:"desk",live:false};
  }
  {const mt=meetingNow();if(mt&&meeters().includes(id))return{cat:"meet",text:id==="zhiya"?"主持全員會議":"全員會議中",full:"全員會議：智雅主持，美術、數值、監管、工程帶提案，ChatGPT、Claude、Gemini 一起辯論"+(D&&D.weixiangJoins?"；偉翔今天也給了意見":"")+"。",where:"meeting",live:true,since:mt.since};}
  const lv=D&&D.live&&D.live[id];
  if(lv&&lv.status&&LIVEMAP[lv.status]){const age=(Date.now()-parseTP(lv.updatedAt))/60000;
    if(age>=0&&age<180)return{cat:LIVEMAP[lv.status],text:lv.task||lv.status,full:lv.task,live:true,updatedAt:lv.updatedAt,where:LIVEMAP[lv.status]==="meet"?"meeting":"desk",since:parseTP(lv.updatedAt)};}
  const o=D&&D.office, m=o&&o.members[id];
  if(!m||typeof oStateAt!=="function"){const min=nowMin(),sc=(D&&D.schedule||[]).filter(x=>x.who===id);
    const cur=sc.find(x=>min>=mm(x.from)&&min<mm(x.to));if(cur)return{cat:"work",text:cur.what,full:cur.what+"（"+cur.from+"–"+cur.to+"）",where:"desk"};
    const nx=sc.find(x=>min<mm(x.from));return{cat:"wait",text:nx?nx.from+" 開工":"待命",where:"desk"};}
  const min=nowMin(); const r=oStateAt(o,m,min); const st=r.st||{};
  let cat=st.tone||"wait";
  let text=st.short||CAT[cat],full=st.full;
  if(id==="weixiang"&&D){const n=(D.director&&D.director.needYou||[]).length;if(n&&cat!=="work")cat="you";text="試玩 "+((D.game&&D.game.version)||"")+"，"+n+" 件等你決定";full="新版 "+((D.game&&D.game.version)||"")+" 已上線，等你試玩回饋手感；上架路線圖有 "+n+" 件需要你本人決定或開通（細節在總監室）。";}
  let since=NaN; if(r.where==="meeting"){const d=tpNow();since=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),0,0)-8*3600e3+mm(o.meeting.from)*60000;}
  return{cat,text,full,where:r.where,live:false,since};
}
function floorState(f){
  if(!D) return{cat:"wait",label:"載入中",text:"資料讀取中"};
  if(f.id==="trade"){
    const tr=D&&D.trade||{}; const perf=tr.perf||{};
    if(perf.waitingFirstFill) return{cat:"work",label:"模擬營運中",text:perf.status||"等待首筆模擬單成交"};
    const eq=perf.equityReturnPct, bh=perf.benchmark0050ReturnPct;
    if(eq!=null && bh!=null){
      const sign=eq>=0?"+":"";
      return{cat:"work",label:"模擬營運中",text:`報酬 ${sign}${Number(eq).toFixed(1)}% · 0050 ${bh>=0?"+":""}${Number(bh).toFixed(1)}%`};
    }
    const sm=tr.summary||{};
    const ok=sm.ok||0, total=sm.total||0;
    return{cat:"work",label:"模擬營運中",text:total?(`行情已連線 ${ok}/${total}`):"模擬交易 · 非投資建議"};
  }
  if(f.id==="mz"){
    const min=nowMin();
    if(min>=9*60&&min<18*60) return{cat:"work",label:"值班中",text:"公關起草／財會核對 · 排程建立中"};
    return{cat:"wait",label:"休息中",text:"公關／財會 · 排程建立中"};
  }
  if(f.id==="director"){const a=typeof usageAlert==="function"?usageAlert():{level:""};
    if(a.level==="red")return{cat:"you",label:"額度警示",text:a.short||"可能額度用完或例行失敗"};
    if(a.level==="yellow")return{cat:"you",label:"用量偏高",text:a.short||"今日估算超預算"};}
  if(f.member){const s=memberState(f.member);return{cat:s.cat,label:CAT[s.cat],text:s.text};}
  if(f.id==="council"){const ids=meeters().filter(i=>memberState(i).where==="meeting");
    const o=D.office;const min=nowMin();
    if(ids.length)return{cat:"meet",label:"開會中",text:ids.length+" 人在會議室"};
    if(o&&min>=mm(o.meeting.to))return{cat:"done",label:"完成",text:D.council?("裁決 "+D.council.verdicts.length+" 項"):"今日會議結束"};
    return{cat:"wait",label:"待命",text:"約 09:47 全員開會"};}
  return{cat:"done",label:"營業中",text:D.game.version+" 可玩"};
}
function nextStep(id){
  if(!D) return "";
  const o=D.office,m=o&&o.members[id],min=nowMin();
  if(m){if(m.joinsMeeting&&min<mm(o.meeting.from))return o.meeting.from+" 開會："+(o.meeting.status.short||"");
    for(const s of m.slots)if(min<mm(s.from))return s.from+" "+(s.during.short||"");}
  if(!m){const sc=(D.schedule||[]).find(x=>x.who===id&&min<mm(x.from));if(sc)return sc.from+" "+sc.what;}
  return (D.cards[id]||{}).next||"";
}

// ---- 視圖導覽：城市 → 大樓剖面 → 樓層房間 ----
function setView(v, floorId){
  view=v;
  if(floorId) activeFloor=floorId;
  const city=$("#view-city"), tow=$("#view-tower"), room=$("#view-room");
  if(city) city.hidden=v!=="city";
  if(tow) tow.hidden=v!=="tower";
  if(room) room.hidden=v!=="room";
  const sub=$("#view-sub");
  if(sub) sub.textContent=v==="city"?"城市地圖 · 點大樓進入":v==="tower"?"大樓剖面 · 點樓層進入":"樓層現場 · 點小人看他在想什麼";
  if(v==="room"){
    for(const k in floorsEl){
      const on=k===activeFloor;
      floorsEl[k].el.hidden=!on;
      floorsEl[k].visible=on;
    }
    const f=FLOORS.find(x=>x.id===activeFloor);
    const rt=$("#room-title");
    if(rt&&f) rt.innerHTML=`<span class="no">${f.no}</span>${esc(f.name)}`;
    resize();
    renderFloors();
    renderRoomDash();
  } else if(v==="tower"){
    for(const k in floorsEl) floorsEl[k].visible=false;
    renderBands();
  }
  if(typeof renderBoard==="function" && D) renderBoard();
  try{history.replaceState(null,"",v==="city"?"#":v==="tower"?"#tower":"#room="+activeFloor);}catch(e){}
}
function renderBands(){
  const box=$("#bands"); if(!box) return;
  box.innerHTML="";
  for(const f of FLOORS){
    const yr=BANDS[f.band]; if(!yr) continue;
    const top=(yr[0]/TOWER_H*100), h=((yr[1]-yr[0])/TOWER_H*100);
    const b=document.createElement("button");
    b.type="button"; b.className="band"+(f.prep?" prep":""); b.setAttribute("role","listitem");
    b.style.top=top.toFixed(2)+"%"; b.style.height=h.toFixed(2)+"%";
    b.setAttribute("aria-label",f.no+" "+f.name+(f.prep?"（籌備中）":""));
    let tag=f.prep?'<span class="tag prep">籌備中</span>':(f.unit==="trade"?'<span class="tag trade">模擬</span>':(f.unit==="ops"?'<span class="tag ops">夾層</span>':(f.unit==="game"?'<span class="tag">遊戲</span>':(f.unit==="exec"?'<span class="tag">總裁</span>':""))));
    const decN=((typeof decisionsByFloor==="function"?decisionsByFloor():{})[f.id]||[]).length;
    if(decN) tag+=`<span class="tag dec">${decN} 決定</span>`;
    b.innerHTML=`<span class="blabel"><b>${f.no}</b>${esc(f.name)}${tag}</span>`;
    b.addEventListener("click",()=>setView("room",f.id));
    box.appendChild(b);
  }
}

// ---- 建樓 ----
function buildTower(){
  const t=$("#tower");t.innerHTML="";
  for(const f of FLOORS){
    const el=document.createElement("div");el.className="floor";el.tabIndex=0;el.hidden=true;el.setAttribute("role","button");el.setAttribute("aria-label",f.no+" "+f.name+"，打開細節");
    el.innerHTML=`<div class="room${(f.id==="trade"||f.id==="mz")?" room-iso":""}${f.id==="mz"?" room-iso-mz":""}" data-floor="${f.id}" style="background-image:url(assets/${f.room}.webp)"><canvas></canvas><div class="hits"></div>
      <div class="plate"><span class="no">${f.no}</span>${iconSVG(f.id)}<span><span class="nm">${f.name}</span><span class="who">${esc(f.who)}</span></span></div>
      <div class="bubble"><span class="dot"></span><b></b><span class="t"></span></div>
      <div class="fviz" aria-hidden="true"></div>
      ${f.id==="lobby"?'<div class="lobby-sign"><a class="btn play-link" target="_blank" rel="noopener" href="#">進入遊戲</a></div>':""}
      </div>`;
    el.addEventListener("click",e=>{if(e.target.closest(".hit,.btn"))return;openFloor(f.id);});
    el.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target===el)openFloor(f.id);});
    t.appendChild(el);
    floorsEl[f.id]={el,cv:el.querySelector("canvas"),hits:el.querySelector(".hits"),room:el.querySelector(".room"),f,visible:false};
  }
  for(const id of Object.keys(SPOT)){
    const b=document.createElement("button");b.className="hit";b.setAttribute("aria-label",NAMES[id]+"：看他在做什麼");b.innerHTML=`<span class="tag">${SHORT[id]}</span>`;
    b.addEventListener("click",e=>{e.stopPropagation();react(id);openMember(id);});
    chars[id]={id,btn:b,x:SPOT[id].x,y:SPOT[id].y,floor:SPOT[id].f,pose:"type",view:"back",bounce:0,wave:0,stroll:null,lastStroll:performance.now()+Math.random()*8000};
  }
  preloadSprites();
  renderBands();
  const et=$("#enter-tower"); if(et) et.onclick=()=>setView("tower");
  const bc=$("#back-city"); if(bc) bc.onclick=()=>setView("city");
  const bt=$("#back-tower"); if(bt) bt.onclick=()=>setView("tower");
  const od=$("#open-detail"); if(od) od.onclick=()=>openFloor(activeFloor);
  // deep link
  const h=location.hash||"";
  if(h.startsWith("#room=")) setView("room", h.slice(6)||"lobby");
  else if(h==="#tower") setView("tower");
  else setView("city");
  resize();
}
function resize(){const dpr=Math.min(window.devicePixelRatio||1,2.5);for(const k in floorsEl){const c=floorsEl[k].cv,r=floorsEl[k].room;c.width=Math.round(r.clientWidth*dpr);c.height=Math.round(r.clientHeight*dpr);
    if((k==="trade"||k==="mz")&&r){const w=r.clientWidth;const base=k==="mz"?"room_mz":"room_trade";const url=w<=480?`assets/${base}_sm.webp`:(w<=720?`assets/${base}_md.webp`:`assets/${base}.webp`);if(r.dataset.bg!==url){r.style.backgroundImage=`url(${url})`;r.dataset.bg=url;}}
  }}
window.addEventListener("resize",resize);

// ---- 角色位置 ----
function placeChar(c,now){
  const s=memberState(c.id),sp=SPOT[c.id];c.state=s;
  c.clip=null;
  if(s.where==="meeting"){
    const el=(isNaN(s.since)?1e9:(Date.now()-s.since)/1000)-meeters().indexOf(c.id)*6; // 秒，錯開出發
    if(el<0){c.floor=sp.f;c.x=sp.x;c.y=sp.floor;c.pose="stand";c.view="front";c.stroll=null;return;}
    if(el<70){c.floor=sp.f;const k=el/70;c.x=sp.x+(1.08-sp.x)*k;c.y=sp.floor;c.pose="walk";c.view="front";c.flip=1;}
    else if(el<120){c.floor="council";const k=(el-70)/50;c.x=1.06+(SEAT[c.id]-1.06)*k;c.y=.9;c.pose="walk";c.view="front";}
    else{c.floor="council";c.x=SEAT[c.id];c.y=TABLE_TOP+.08;c.pose="sit";c.view="front";c.clip=TABLE_TOP;}
    c.stroll=null;return;}
  c.floor=sp.f;
  if(s.cat==="work"){const iso=c.id==="trade"||c.id==="pr"||c.id==="fin";c.x=sp.x;c.y=sp.y;c.pose=(iso?"sit":"type");c.view=(iso?"front":"back");c.stroll=null;return;}
  // 閒置：偶爾散步（尊重減少動態）
  const reduce=typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(!reduce&&!c.stroll&&now-c.lastStroll>9000+Math.random()*9000){const tx=(c.id==="trade"?.20+.45*Math.random():(c.id==="pr"?.12+.28*Math.random():(c.id==="fin"?.55+.28*Math.random():.15+Math.random()*.7)));c.stroll={t0:now,from:sp.x,to:tx,dur:Math.abs(tx-sp.x)*9000+600};}
  if(c.stroll){const e=(now-c.stroll.t0);const tot=c.stroll.dur*2+2500;
    if(e>tot){c.stroll=null;c.lastStroll=now;}
    else{let x;if(e<c.stroll.dur)x=c.stroll.from+(c.stroll.to-c.stroll.from)*e/c.stroll.dur;else if(e<c.stroll.dur+2500)x=c.stroll.to;else x=c.stroll.to+(c.stroll.from-c.stroll.to)*(e-c.stroll.dur-2500)/c.stroll.dur;
      c.x=x;c.y=sp.floor;c.pose=(e<c.stroll.dur||e>c.stroll.dur+2500)?"walk":"stand";c.view="front";return;}}
  const iso=c.id==="trade"||c.id==="pr"||c.id==="fin";
  c.x=sp.x;c.y=s.cat==="you"?sp.floor:sp.y;c.pose=s.cat==="you"?"stand":"sit";c.view=(s.cat==="you"||iso)?"front":"back";
}
// ---- 半寫實立繪（assets/chars/<id>_<idle|walk|wave>.webp，128×160，腳底 y=152）＋棚拍頭像 ----
const SPR={};
function sprite(id,pose){const k=id+"_"+pose;let im=SPR[k];if(!im){im=new Image();im.decoding="async";im.src="assets/chars/"+k+".webp";SPR[k]=im;}return im;}
function preloadSprites(){for(const id of Object.keys(SPOT))for(const p of ["idle","walk","wave"])sprite(id,p);}
function avatarURL(id,lg){return lg?`assets/avatars/avatar_${id}_lg.webp`:`assets/avatars/avatar_${id}.webp`;}
function spritePose(c,now){
  if(c.wave>now)return"wave";
  if(c.pose==="walk")return Math.floor(now/220)%2?"walk":"idle";
  // sit/type/stand/present → idle（trade idle＝sit、wave＝present）
  return"idle";
}
let last=0;
function loop(now){
  requestAnimationFrame(loop);
  if(!D||now-last<66)return;last=now;
  const frame=Math.floor(now/250);
  const by={};for(const id in chars){placeChar(chars[id],now);(by[chars[id].floor]=by[chars[id].floor]||[]).push(chars[id]);}
  for(const k in floorsEl){const F=floorsEl[k];const list=by[k]||[];
    for(const c of list)if(c.btn.parentNode!==F.hits)F.hits.appendChild(c.btn);
    if(!F.visible)continue;const cv=F.cv,ctx=cv.getContext("2d");ctx.clearRect(0,0,cv.width,cv.height);
    const u=Math.max(2,cv.width*.0068);
    list.sort((a,b)=>a.y-b.y);
    for(const c of list){const x=c.x*cv.width,y=c.y*cv.height;let b=0;
      if(c.bounce>now){const p=1-(c.bounce-now)/700;b=-Math.abs(Math.sin(p*Math.PI*2))*5*u;}
      else if(c.pose==="walk")b=-Math.abs(Math.sin(now/220*Math.PI))*1.2*u;
      else if(c.pose==="type")b=-(frame%2)*.6*u;
      if(c.px!=null&&Math.abs(c.x-c.px)>1e-4)c.dir=c.x<c.px?-1:1;c.px=c.x;
      ctx.save();if(c.clip){ctx.beginPath();ctx.rect(0,0,cv.width,c.clip*cv.height);ctx.clip();}
      if(c.x<1.02&&c.x>-.02){ctx.fillStyle="rgba(0,0,0,.35)";if(!c.clip){ctx.beginPath();ctx.ellipse(x,y+u*.3,5*u,1.4*u,0,0,7);ctx.fill();}
        const im=sprite(c.id,spritePose(c,now));
        if(im.complete&&im.naturalWidth){const sc=ROOM_SCALE[k]||.42,dh=(c.pose==="sit"||c.pose==="type"?sc*.78:sc)*cv.height,dw=dh*.8,top=y+b-dh*.95;
          ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
          if(c.dir===-1&&c.pose==="walk"){ctx.translate(x,0);ctx.scale(-1,1);ctx.drawImage(im,-dw/2,top,dw,dh);}
          else ctx.drawImage(im,x-dw/2,top,dw,dh);}}
      ctx.restore();
      const px=c.x*100,py=(c.clip?c.clip:c.y)*100;c.btn.style.left=Math.min(96,Math.max(4,px))+"%";c.btn.style.top=py+"%";c.btn.style.display=(c.x>1.02||c.x<-.02)?"none":"";
    }
  }
  if(thinking){const c=chars[thinking.id];const F=floorsEl[c.floor];if(thinking.el.parentNode!==F.room)F.room.appendChild(thinking.el);
    thinking.el.style.left=Math.min(80,Math.max(20,c.x*100))+"%";thinking.el.style.top=((c.clip?c.clip:c.y)*100-30)+"%";
    if(now>thinking.until){thinking.el.remove();thinking=null;}}
}
function thoughtOf(id){const lv=D.live&&D.live[id];const s=memberState(id);if(s.live&&lv&&lv.thought)return lv.thought;return noemo((D.cards[id]||{}).thought)||"先把手上的事做好。";}
function showThought(id,ms){if(thinking)thinking.el.remove();const el=document.createElement("div");el.className="think";el.textContent=thoughtOf(id);thinking={id,el,until:performance.now()+(ms||4500)};}
function react(id){const c=chars[id];const now=performance.now();if(c.view==="front"&&Math.random()<.6)c.wave=now+1400;else c.bounce=now+700;showThought(id,4000);}
setInterval(()=>{if(!D||document.hidden||!$("#sheet").hidden)return;const ids=Object.keys(chars).filter(i=>{const c=chars[i];return c.x<1&&c.x>0&&floorsEl[c.floor].visible;});if(ids.length)showThought(ids[Math.floor(Math.random()*ids.length)]);},9000);


// ---- 用量室（真實 token + 估算活動；額度警示純前端） ----
function fmtN(n){n=+n||0;return n>=1e6?(n/1e6).toFixed(2)+"M":n>=1e3?(n/1e3).toFixed(1)+"k":String(n);}
function usageToday(){const u=D&&D.usage;if(!u||!u.days)return null;const t=todayStr();return u.days.find(d=>d.date===t)||u.days.slice(-1)[0]||null;}
function usageAlert(){
  const u=D&&D.usage; if(!u) return {level:"",short:"",html:""};
  const grace=+(u.graceMin||60);
  const min=nowMin(), tod=todayStr();
  const live=D.live||{};
  const dayU=usageToday()||{};
  const evAt=Object.assign({}, dayU.evidenceAt||{});
  // live 心跳併入證據時間
  for(const [id,lv] of Object.entries(live)){
    const upd=lv&&lv.updatedAt||"";
    if(upd.slice(0,10)===tod && upd>(evAt[id]||"")) evAt[id]=upd;
  }
  // last seen = 全部門證據（含心跳）最大值
  let lastSeen=dayU.lastSeen||"";
  for(const v of Object.values(evAt)) if(v&&v>lastSeen) lastSeen=v;
  const whoKey=w=>w==="council"?"council":w;
  const misses=[];
  for(const s of (D.schedule||[])){
    if(s.soft) continue;
    const end=mm(s.to);
    if(min < end + grace) continue;          // 時段結束 + 寬限尚未到
    if(min > 22*60) continue;
    const key=whoKey(s.who);
    const alt=s.who==="council"?"zhiya":s.who; // 會議時智雅也算主持證據
    const since=tod+" "+s.from;
    const et= [evAt[key], evAt[alt], evAt[s.who]].filter(Boolean).sort().slice(-1)[0]||"";
    // 需有「時段開始之後」的產出／心跳
    if(!et || et < since){
      misses.push({chip:s.chip||s.who, from:s.from, to:s.to, last:et||"—"});
    }
  }
  if(misses.length){
    const short = "可能額度用完或例行失敗（缺 "+misses.length+" 時段）";
    const html = `<div class="ub-row"><span><b>可能額度用完或例行失敗</b> · 已過時段仍無心跳／產出：`
      + misses.map(m=>esc(m.chip)+" "+m.from+"–"+m.to).join("、")
      + `。最後見到活動 ${esc(lastSeen||"—")}（台北時間）。請到設定 → Usage & Billing 查看真實額度。</span>`
      + `<button type="button" class="ub-act" id="ub-open">打開總監室用量</button></div>`;
    return {level:"red", short, html, misses, lastSeen};
  }
  // 黃色／待核對：建站自檢 needsCheck（超預算或高於近三日均×2）
  const todD = dayU, bud=u.budget||{};
  if(todD){
    const nc = todD.needsCheck||[];
    if(nc.length){
      const bits=nc.map(f=>esc((f.label||f.key)+" "+(f.reason||"")));
      const short="待核對："+(nc[0].label||nc[0].key);
      const html=`<div class="ub-row"><span><b>待核對</b> · ${bits.join("、")}。計數只認日期資料夾／檔名；點總監室用量看明細。此非帳單餘額；真實額度請看設定 → Usage & Billing。</span>`
        +`<button type="button" class="ub-act" id="ub-open">打開總監室用量</button></div>`;
      return {level:"yellow", short, html, overs:bits, needsCheck:nc, lastSeen};
    }
    const overs=[];
    const checks=[
      ["artImages","美術新圖", (todD.est||{}).artImages],
      ["numReports","數值報告", (todD.est||{}).numReports],
      ["qaReports","QA 報告", (todD.est||{}).qaReports],
      ["proposals","提案／答辯", (todD.est||{}).proposals],
      ["councilCalls","會議呼叫", ((todD.real||{}).council||{}).calls],
      ["councilInputTokens","會議輸入 token", ((todD.real||{}).council||{}).inputTokens],
      ["councilOutputTokens","會議輸出 token", ((todD.real||{}).council||{}).outputTokens],
    ];
    for(const [k,label,val] of checks){
      const lim=bud[k]; if(!lim) continue;
      if((+val||0) > lim) overs.push(label+" "+fmtN(val)+"／"+fmtN(lim));
    }
    if(overs.length){
      const short="待核對："+overs[0];
      const html=`<div class="ub-row"><span><b>待核對</b> · ${esc(overs.join("、"))}。此非帳單餘額；真實額度請看設定 → Usage & Billing。</span>`
        +`<button type="button" class="ub-act" id="ub-open">打開總監室用量</button></div>`;
      return {level:"yellow", short, html, overs, lastSeen};
    }
  }
  return {level:"", short:"", html:"", lastSeen};
}
function renderUsageBanner(){
  const el=$("#usage-banner"); if(!el) return;
  const a=usageAlert();
  if(!a.level){el.hidden=true;el.className="usage-banner";el.innerHTML="";return;}
  el.hidden=false; el.className="usage-banner "+a.level; el.innerHTML=a.html;
  const btn=$("#ub-open"); if(btn) btn.onclick=()=>openFloor("director");
}

function bindUsageDetails(root){
  // 事件委派掛在 sheetbody：openFloor 必須先 openSheet 再綁，否則 .ud-tog 還不在 DOM。
  // 委派一次即可，之後每次重開總監室不用重綁。
  const el=root||document.getElementById("sheetbody")||document;
  if(el._udBound) return; el._udBound=1;
  el.addEventListener("click",e=>{
    const btn=e.target&&e.target.closest&&e.target.closest(".ud-tog");
    if(!btn||!el.contains(btn)) return;
    e.stopPropagation();
    const id=btn.getAttribute("data-ud");
    const box=id&&document.getElementById(id);
    if(!box) return;
    const on=box.hasAttribute("hidden");
    if(on) box.removeAttribute("hidden"); else box.setAttribute("hidden","");
    btn.textContent=on?"收合明細":"看明細";
  });
}
function usageBarRows(rows){
  return `<div class="ubar">${rows.map((r,i)=>{
    const pct=Math.min(100, Math.round((r.val/(r.lim||1))*100));
    const over=r.val>(r.lim||0)||r.needCheck;
    const cls=(r.real?"real ":"")+(over?"over":"");
    const tags=(r.real?'<span class="tag-real">實數</span>':'<span class="tag-est">估算</span>')
      +(r.needCheck?'<span class="tag-check">待核對</span>':'');
    let detail="";
    if(r.needCheck||(r.items&&r.items.length)||(r.excluded&&r.excluded.length)){
      const id="ud-"+i;
      const list=[];
      (r.items||[]).forEach(x=>list.push(`<li>${esc(x)}</li>`));
      (r.excluded||[]).forEach(x=>list.push(`<li class="ex">${esc(x)}</li>`));
      if(r.note) list.unshift(`<li class="why">${esc(r.note)}</li>`);
      if(r.reason) list.unshift(`<li class="why">${esc(r.reason)}</li>`);
      detail=`<button type="button" class="ud-tog" data-ud="${id}">看明細</button>`
        +`<div class="ud-list" id="${id}" hidden><ul>${list.join("")||"<li>（無清單）</li>"}</ul></div>`;
    }
    return `<div class="row${r.needCheck?" need-check":""}"><span class="lab">${esc(r.label)}${tags}</span>`
      +`<div class="track"><i class="${cls}" style="width:${pct}%"></i></div>`
      +`<span class="val">${fmtN(r.val)}／${fmtN(r.lim)}</span>${detail}</div>`;
  }).join("")}</div>`;
}
function usagePanelHTML(){
  const u=D.usage; if(!u) return '<div class="muted">尚無用量資料</div>';
  const tod=usageToday()||{est:{},real:{council:{}},counted:{},needsCheck:[],excluded:[]};
  const c=(tod.real&&tod.real.council)||{};
  const e=tod.est||{}, bud=u.budget||{};
  const counted=tod.counted||{};
  const ncMap={}; (tod.needsCheck||[]).forEach(f=>{ncMap[f.key]=f;});
  const mk=(key,label,val,lim,real)=>{
    const fl=ncMap[key];
    let items=[];
    if(key==="artImages") items=counted.artImages||[];
    else if(key==="numReports") items=counted.numReports||[];
    else if(key==="qaReports") items=counted.qaReports||[];
    else if(key==="proposals") items=counted.proposals||[];
    const ex=(tod.excluded||[]).filter(x=>
      (key==="numReports"&&x.includes("數值報告"))||
      (key==="artImages"&&x.includes("incoming"))||
      (key==="qaReports"&&x.includes("screenshots/qa"))||
      (key==="proposals"&&x.includes("會議/"))
    );
    return {label, val:val||0, lim:lim||0, real:!!real, key, needCheck:!!fl,
      reason:fl?fl.reason:"", note:key==="artImages"?(tod.artNote||""):"", items, excluded:ex};
  };
  const rows=[
    mk("councilCalls","會議呼叫",c.calls,bud.councilCalls,true),
    mk("councilInputTokens","會議輸入 token",c.inputTokens,bud.councilInputTokens,true),
    mk("councilOutputTokens","會議輸出 token",c.outputTokens,bud.councilOutputTokens,true),
    mk("artImages","美術新圖",e.artImages,bud.artImages),
    mk("numReports","數值報告",e.numReports,bud.numReports),
    mk("qaReports","QA 報告",e.qaReports,bud.qaReports),
    mk("proposals","提案／答辯",e.proposals,bud.proposals),
  ];
  const days=[...(u.days||[])].slice().reverse();
  const maxIn=Math.max(1,...days.map(d=>((d.real||{}).council||{}).inputTokens||0));
  let hist=`<table class="utable"><tr><th>日期</th><th>呼叫<span class="tag-real">實</span></th><th>輸入 token</th><th>輸出 token</th><th>美術圖<span class="tag-est">估</span></th><th>報告</th><th>提案</th></tr>`;
  for(const d of days){
    const cc=(d.real||{}).council||{}, ee=d.est||{};
    const bar=Math.round(((cc.inputTokens||0)/maxIn)*100);
    const flag=(d.needsCheck&&d.needsCheck.length)?'<span class="tag-check">待核對</span>':"";
    hist+=`<tr><td>${esc(d.date.slice(5))}${flag}<div class="track" style="margin-top:3px"><i class="real" style="width:${bar}%"></i></div></td>`
      +`<td>${cc.calls||0}</td><td>${fmtN(cc.inputTokens||0)}</td><td>${fmtN(cc.outputTokens||0)}</td>`
      +`<td>${ee.artImages||0}</td><td>${(ee.numReports||0)+(ee.qaReports||0)}</td><td>${ee.proposals||0}</td></tr>`;
  }
  hist+="</table>";
  const a=usageAlert();
  const commitBits=[];
  const ch=(counted.commits)||{};
  for(const [repo,hs] of Object.entries(ch)){
    if(hs&&hs.length) commitBits.push(`${repo} ${hs.length}：${hs.slice(0,8).join(", ")}${hs.length>8?"…":""}`);
  }
  const commitHtml=commitBits.length?`<div class="muted" style="margin-top:6px">今日提交（短 hash）：${esc(commitBits.join("；"))}</div>`:"";
  return `<div class="muted">${esc(u.note||"")}</div>
    <div class="muted" style="margin-top:4px">${esc(u.sources||"")}</div>
    ${a.level?`<div class="chips" style="margin-top:8px"><span class="chip ${a.level==="red"?"no":"mid"}">${esc(a.short)}</span></div>`:""}
    <h4>今日對照預算（${esc(tod.date||u.today||"")}）</h4>
    ${usageBarRows(rows)}
    ${commitHtml}
    <div class="muted">預算可改 live/usage_budget.json。超預算或高於近三日均×2 標「待核對」，可點「看明細」核對檔名；例行無心跳亮紅燈。計數不用 mtime 歸日。</div>
    <h4>近 7 天</h4>${hist}
    <h4>怎麼判斷「可能額度用完」</h4>
    <ul><li>排程時段結束後超過 ${u.graceMin||60} 分鐘，且該時段開始後仍無心跳／產出 → 紅燈</li>
    <li>監管 11:00 時段：沒有新版上線（或已寫「無新版，略過實測」）就不算缺，不亮紅燈</li>
    <li>今日任一證據（交件、提案、提交、心跳）都算活著；「最後見到」取全部門最新時間</li>
    <li>用量自檢：只認日期資料夾／檔名；異常標「待核對」並附計入清單，不必等你先質疑</li>
    <li>判斷在瀏覽器端算；真實餘額請到設定 → Usage & Billing；此頁從不顯示金額</li></ul>`;
}

// ---- 畫面資料 ----

function sparkSVG(series,key){
  const pts=(series||[]).map(s=>s[key]).filter(v=>typeof v==="number"&&!isNaN(v));
  if(pts.length<2)return"";
  const W=160,H=36,pad=2;
  const min=Math.min(...pts),max=Math.max(...pts);
  const span=Math.max(1,max-min);
  const xy=pts.map((v,i)=>{
    const x=pad+i*(W-2*pad)/Math.max(1,pts.length-1);
    const y=H-pad-((v-min)/span)*(H-2*pad);
    return x.toFixed(1)+","+y.toFixed(1);
  });
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" width="160" height="36" aria-hidden="true"><polyline fill="none" stroke="currentColor" stroke-width="2" points="${xy.join(" ")}"/></svg>`;
}
function lightHTML(light,label){
  const L=light||"green";
  return `<span class="light ${esc(L)}" title="${esc(label||"")}"><i></i><b>${L==="red"?"紅燈":L==="yellow"?"黃燈":"綠燈"}</b></span>`;
}
function pipeHTML(pipe,compact){
  if(!pipe||!pipe.stages)return `<div class="muted">今天尚無建版進度</div>`;
  const stages=pipe.stages.map(s=>{
    const cls=s.done?"done":(s.current?"cur":"todo");
    return `<span class="pstep ${cls}"><i></i>${esc(s.name)}</span>`;
  }).join('<span class="parrow">→</span>');
  if(compact) return `<div class="pipe compact">${stages}</div>`;
  return `<div class="pipe">${stages}</div><div class="muted" style="margin-top:4px">${esc(pipe.version||"")} · ${esc(pipe.note||"")}</div>`;
}
function artTrendSVG(trend){
  const pts=(trend||[]).map(t=>+t.count||0);
  if(pts.length<2) return "";
  const W=120,H=28,pad=2;
  const max=Math.max(1,...pts);
  const xy=pts.map((v,i)=>{
    const x=pad+i*(W-2*pad)/Math.max(1,pts.length-1);
    const y=H-pad-(v/max)*(H-2*pad);
    return x.toFixed(1)+","+y.toFixed(1);
  });
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" width="120" height="28" aria-hidden="true"><polyline fill="none" stroke="currentColor" stroke-width="2" points="${xy.join(" ")}"/></svg>`;
}
function gaugeSVG(pct,color){
  const p=Math.max(0,Math.min(100,+pct||0));
  const r=14,c=2*Math.PI*r,dash=c*p/100;
  return `<span class="fv-gauge"><svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="${r}" fill="none" stroke="#1a2433" stroke-width="4"/><circle cx="18" cy="18" r="${r}" fill="none" stroke="${color||"#3FD8A0"}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${dash.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 18 18)"/></svg><b>${p}%</b></span>`;
}

function fmtPct(v, digits=1){
  if(v==null||v==="") return "—";
  const n=Number(v); if(!Number.isFinite(n)) return "—";
  return (n>=0?"+":"")+n.toFixed(digits)+"%";
}
function equityCurveSVG(curve){
  const pts=(curve||[]).filter(p=>p&&p.date);
  if(pts.length<2){
    const n=pts.length;
    return `<div class="muted">權益曲線資料累積中（目前 ${n} 點；滿 2 點後顯示對照圖）</div>`;
  }
  const W=320,H=120,padL=36,padR=10,padT=12,padB=22;
  const keys=["equityReturnPct","bench0050ReturnPct","benchBtcReturnPct"];
  const vals=[];
  pts.forEach(p=>keys.forEach(k=>{const v=p[k]; if(typeof v==="number"&&!isNaN(v)) vals.push(v);}));
  if(!vals.length) return `<div class="muted">尚無資料</div>`;
  const min=Math.min(...vals), max=Math.max(...vals);
  const span=Math.max(0.01, max-min);
  const xOf=i=>padL+i*(W-padL-padR)/Math.max(1,pts.length-1);
  const yOf=v=>padT+(1-(v-min)/span)*(H-padT-padB);
  function poly(key){
    const xy=[];
    pts.forEach((p,i)=>{const v=p[key]; if(typeof v!=="number"||isNaN(v)) return; xy.push(xOf(i).toFixed(1)+","+yOf(v).toFixed(1));});
    return xy.length>=2?xy.join(" "):"";
  }
  const cEq=poly("equityReturnPct"), c50=poly("bench0050ReturnPct"), cB=poly("benchBtcReturnPct");
  const y0=yOf(0);
  const zero=(min<0&&max>0)?`<line x1="${padL}" y1="${y0.toFixed(1)}" x2="${W-padR}" y2="${y0.toFixed(1)}" stroke="#ffffff22" stroke-width="1" stroke-dasharray="3 3"/>`:"";
  const labMin=`${min>=0?"+":""}${min.toFixed(1)}%`, labMax=`${max>=0?"+":""}${max.toFixed(1)}%`;
  const d0=esc(pts[0].date||""), d1=esc(pts[pts.length-1].date||"");
  return `<div class="eq-chart"><svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="模擬權益對照 0050 與 BTC">
    ${zero}
    <text x="4" y="${padT+4}" fill="#8a9bb0" font-size="9">${labMax}</text>
    <text x="4" y="${H-padB+4}" fill="#8a9bb0" font-size="9">${labMin}</text>
    ${c50?`<polyline fill="none" stroke="#7ab6ee" stroke-width="1.8" points="${c50}"/>`:""}
    ${cB?`<polyline fill="none" stroke="#e6c56d" stroke-width="1.8" points="${cB}"/>`:""}
    ${cEq?`<polyline fill="none" stroke="#3FD8A0" stroke-width="2.4" points="${cEq}"/>`:""}
    <text x="${padL}" y="${H-4}" fill="#8a9bb0" font-size="9">${d0}</text>
    <text x="${W-padR}" y="${H-4}" fill="#8a9bb0" font-size="9" text-anchor="end">${d1}</text>
  </svg>
  <div class="eq-legend"><span class="eq-lg eq"><i></i>模擬組合</span><span class="eq-lg b50"><i></i>0050</span><span class="eq-lg btc"><i></i>BTC</span></div>
  </div>`;
}
function liveGateHTML(){
  const tr=D&&D.trade||{}; const p=tr.perf||{}; const g=p.liveGate;
  const disc=esc((g&&g.disclaimer)||p.disclaimer||"模擬結果，非投資建議");
  if(!g||!(g.items||[]).length){
    return `<div class="feed-panel"><div class="muted">尚無往實盤進度資料</div><div class="feed-disc">${disc}</div></div>`;
  }
  const days=g.daysElapsed||0, tgt=g.targetDays||90;
  const head=`<div class="chips" style="margin-bottom:8px"><span class="chip mid">第一階段 · 模擬</span><span class="chip">第 ${esc(String(days))}/${esc(String(tgt))} 天</span>${g.allMet?`<span class="chip ok">門檻已齊（仍須偉翔核准）</span>`:`<span class="chip">門檻未齊</span>`}</div>`;
  const chart=equityCurveSVG(p.equityCurve||[]);
  const rows=(g.items||[]).map(it=>{
    const ok=it.ok;
    const lite=ok===true?"green":(ok===false?"red":"yellow");
    const st=ok===true?"達標":(ok===false?"未達":"尚無");
    const stCls=ok===true?"ok":"no";
    let curTxt="—", tgtTxt="—";
    if(it.id==="days"||it.id==="samples"){
      curTxt=it.current==null?"—":String(Math.round(Number(it.current)));
      tgtTxt=it.target==null?"—":String(Math.round(Number(it.target)));
    } else if(it.id==="drawdown"){
      curTxt=it.current==null?"—":(Number(it.current).toFixed(1)+"%");
      tgtTxt=it.target==null?"—":("≥ "+Number(it.target).toFixed(0)+"%");
    } else if(it.id==="beat0050"||it.id==="beatBtc"){
      curTxt=it.current==null?"—":fmtPct(it.current,2);
      tgtTxt=it.target==null?"尚無資料":("基準 "+fmtPct(it.target,2));
    } else if(it.id==="audit"||it.id==="approval"){
      curTxt=ok===true?"是":(ok===false?"否":"尚無");
      tgtTxt="需要";
    } else {
      curTxt=it.current==null?"—":String(it.current);
      tgtTxt=it.target==null?"—":String(it.target);
    }
    const prog=it.progressPct==null?null:Math.max(0,Math.min(100,Number(it.progressPct)));
    const bar=prog==null?`<div class="muted" style="font-size:11px">尚無進度</div>`:`<div class="gate-bar"><i style="width:${prog}%"></i></div><div class="gate-barlbl">${prog.toFixed(0)}%</div>`;
    const note=it.note?`<div class="gate-note">${esc(it.note)}</div>`:"";
    return `<div class="gate-row"><div class="gate-hd"><span class="slite ${lite}"></span><span class="gate-lab">${esc(it.label)}</span><span class="feed-st ${stCls}">${st}</span></div><div class="gate-vals"><span>目前 ${esc(curTxt)}</span><span>目標 ${esc(tgtTxt)}</span></div>${bar}${note}</div>`;
  }).join("");
  const asof=p.asOf?`更新 ${esc(p.asOf)}（台北）`:"";
  return `<div class="feed-panel">${head}<div class="feed-mkt"><div class="feed-mhd">權益曲線（報酬%，對照 0050／BTC）</div>${chart}</div><div class="feed-mkt"><div class="feed-mhd">實盤門檻清單</div>${rows}</div><div class="feed-meta muted">${asof}</div><div class="feed-disc">${disc} · 達標後仍須偉翔在青鋒交易對話親口核准，先小額</div></div>`;
}
function tradePerfHTML(){
  const tr=D&&D.trade||{}; const p=tr.perf||{};
  const disc=esc(p.disclaimer||tr.disclaimer||"模擬結果，非投資建議");
  const asof=p.asOf?`更新 ${esc(p.asOf)}（台北）`:"";
  const regime=p.regime||{};
  const vs=regime.vsSma200==="above"?"站上 SMA200":(regime.vsSma200==="below"?"跌破 SMA200":"均線未知");
  const dist=regime.distancePct!=null?` ${fmtPct(regime.distancePct)}`:" ";
  const sleeves=(p.sleeves||[]).map(s=>`<div class="feed-row"><span class="slite green"></span><span class="feed-src">${esc(s.name)}（目標 ${esc(String(s.targetPct))}%）</span><span class="feed-st ok">${esc(s.status||"")}</span></div>`).join("");
  const pos=(p.positions||[]).length
    ? (p.positions||[]).map(x=>`<div class="feed-row"><span class="slite green"></span><span class="feed-src">${esc(symLabel(x.symbol)||x.symbol)}</span><span class="feed-st ok">權重 ${esc(String(x.weightPct))}%，未實現 ${fmtPct(x.unrealizedPct)}</span></div>`).join("")
    : `<div class="muted">尚無持倉</div>`;
  const ev=(p.recentEvents||[]).length
    ? `<ul>${(p.recentEvents||[]).map(e=>`<li><span class="muted">${esc(e.date)}</span> ${esc(e.text)}</li>`).join("")}</ul>`
    : `<div class="muted">尚無日誌</div>`;
  const st=p.strategies;
  const stHtml=st?`<div class="chips" style="margin-top:8px"><span class="chip">已測 ${st.tested||0}</span><span class="chip no">失敗 ${st.failed||0}</span><span class="chip ok">通過 ${st.passed||0}</span>${st.weak?`<span class="chip mid">偏弱 ${st.weak}</span>`:""}</div>`:"";
  const wait=p.waitingFirstFill?`<div class="chips" style="margin-bottom:8px"><span class="chip mid">${esc(p.status||"等待首筆模擬單成交")}</span></div>`:"";
  const loop=p.scanLoop||null;
  let trainHtml="";
  if(loop){
    const tr=loop.training||{};
    const tod=loop.today||{};
    const layers=tod.layers||{};
    const layerChips=["L1","L3","L2L3","ALL3"].filter(k=>layers[k]!=null)
      .map(k=>`<span class="chip">${esc(k)} ${esc(String(layers[k]))}</span>`).join("");
    const nL1=tod.nL1Total!=null?` · L1 全部 ${tod.nL1Total}`:"";
    const pendingNote=tr.pending?`<div class="muted" style="margin-top:4px">${esc(tr.note||"尚未結算，不下假勝率")}</div>`:"";
    const dimRows=(loop.dimensions||[]).filter(d=>!d.pending).map(d=>{
      const ic=d.rankIc==null?"—":Number(d.rankIc).toFixed(3);
      const wr=d.winRatePct==null?"—":(Number(d.winRatePct).toFixed(0)+"%");
      const ax=d.avgExcessPct==null?"—":fmtPct(d.avgExcessPct);
      const flag=d.overfit?` <span class="chip mid">overfit</span>`:"";
      return `<div class="feed-row"><span class="feed-src">${esc(d.name)}${flag}</span><span class="feed-st ok">n=${esc(String(d.n||0))} · IC ${esc(ic)} · 勝 ${esc(wr)} · 超額 ${ax}</span></div>`;
    }).join("");
    const dimBlock=dimRows||`<div class="muted">維度勝率／IC 待 20 交易日結算後顯示</div>`;
    const gaps=(loop.gaps||[]).slice(0,2).map(g=>`<li class="muted">${esc(g)}</li>`).join("");
    trainHtml=`<div class="feed-mkt"><div class="feed-mhd">每日訓練結果</div>
      <div class="muted">掃描日 ${esc(tod.asOf||"—")}${esc(nL1)} · 持有 ${esc(String(loop.holdDays||20))} 日</div>
      <div class="chips" style="margin:6px 0">${layerChips||""}</div>
      <div class="chips"><span class="chip">記錄 ${esc(String(tr.recorded??"—"))}</span><span class="chip mid">未結算 ${esc(String(tr.open??"—"))}</span><span class="chip ok">已結算 ${esc(String(tr.settled??"—"))}</span><span class="chip">下次結算 ${esc(tr.nextSettleDate||"—")}</span></div>
      ${pendingNote}
      <div class="feed-mhd" style="margin-top:8px">AgentX 維度</div>
      ${dimBlock}
      ${gaps?`<ul style="margin-top:6px">${gaps}</ul>`:""}
    </div>`;
  }
  return `<div class="feed-panel">${wait}
    <div class="big" style="margin-top:4px">
      <div><b>${fmtPct(p.equityReturnPct)}</b><span>模擬報酬</span></div>
      <div><b>${fmtPct(p.benchmark0050ReturnPct)}</b><span>0050 同期</span></div>
      <div><b>${fmtPct(p.benchmarkBtcReturnPct)}</b><span>BTC 同期</span></div>
      <div><b>${p.maxDrawdownPct==null?"—":(Number(p.maxDrawdownPct).toFixed(1)+"%")}</b><span>最大回撤</span></div>
    </div>
    <div class="feed-mkt" style="margin-top:8px"><div class="feed-mhd">市場狀態 · 0050 <span class="muted">${esc(vs)}${esc(dist.trim()?dist:"")}</span></div>
      <div class="muted">資料日 ${esc(regime.asOfDate||"—")} · 待成交單 ${esc(String(p.pendingOrderCount||0))} · 下次檢討 ${esc(p.nextReview||"—")}</div>
    </div>
    <div class="feed-mkt"><div class="feed-mhd">部位配置</div>${sleeves||'<div class="muted">—</div>'}</div>
    <div class="feed-mkt"><div class="feed-mhd">持倉（權重）</div>${pos}</div>
    ${trainHtml}
    <div class="feed-mkt"><div class="feed-mhd">近期事件</div>${ev}</div>
    ${st?`<div class="feed-mkt"><div class="feed-mhd">策略研究紀錄</div>${stHtml}</div>`:""}
    <div class="feed-meta muted">${asof}</div>
    <div class="feed-disc">${disc}</div>
  </div>`;
}
function stratStatusCls(st){
  if(st==="執行中") return "ok";
  if(st==="觀察"||st==="觀察中") return "mid";
  if(st==="待驗證") return "mid";
  if(st==="已拒絕"||st==="已淘汰") return "no";
  return "";
}
function stratDisplayName(s){
  return (s&& (s.displayName||s.name)) || "—";
}
function stratStatusLabel(s){
  if(!s) return "—";
  if(s.statusLabel) return s.statusLabel;
  const m={"觀察":"觀察中","已拒絕":"已淘汰"};
  return m[s.status]||s.status||"—";
}
function stratPeriodHTML(label, blk){
  const b=blk||{};
  const ret=b.returnPct==null?"—":fmtPct(b.returnPct,2);
  const n=b.trades==null?"—":String(b.trades);
  const per=b.period?`<span class="muted">（${esc(b.period)}）</span>`:"";
  return `<div class="strat-metric"><span class="strat-mlab">${esc(label)}</span><span class="strat-mval">${ret}</span><span class="muted">· ${esc(n)} 筆</span>${per}</div>`;
}
function strategyListHTML(){
  const tr=D&&D.trade||{}; const p=tr.perf||{};
  const list=p.strategyList||[];
  const disc=esc(p.disclaimer||"模擬結果，非投資建議");
  if(!list.length){
    return `<div class="feed-panel" id="strat-panel"><div class="muted">尚無策略清單</div><div class="feed-disc">${disc}</div></div>`;
  }
  const counts={}; list.forEach(s=>{counts[s.status]=(counts[s.status]||0)+1;});
  const countChips=["執行中","觀察","待驗證","已拒絕"].map(st=>{
    const n=counts[st]||0;
    return `<span class="chip ${stratStatusCls(st)}">${esc(st)} ${n}</span>`;
  }).join("");
  const filters=`<div class="strat-filters" data-role="strat-filters">
    <div class="chips strat-mkt">
      <button type="button" class="chip on" data-mkt="全部">全部</button>
      <button type="button" class="chip" data-mkt="台股">台股</button>
      <button type="button" class="chip" data-mkt="幣圈">幣圈</button>
    </div>
    <div class="chips strat-st">
      <button type="button" class="chip on" data-st="全部">狀態全部</button>
      <button type="button" class="chip" data-st="執行中">執行中</button>
      <button type="button" class="chip" data-st="觀察">觀察</button>
      <button type="button" class="chip" data-st="待驗證">待驗證</button>
      <button type="button" class="chip" data-st="已拒絕">已拒絕</button>
    </div>
  </div>`;
  const cards=list.map(s=>{
    const cls=stratStatusCls(s.status);
    const reason=s.reason?`<div class="strat-reason">${esc(withSymNames(s.reason))}</div>`:"";
    const fail=s.failureCondition?`<div class="strat-fail"><span class="muted">失效條件</span> ${esc(withSymNames(s.failureCondition))}</div>`:"";
    const upd=s.updatedAt?`<div class="muted strat-upd">更新 ${esc(s.updatedAt)}</div>`:"";
    return `<div class="strat-card" data-market="${esc(s.market)}" data-status="${esc(s.status)}">
      <div class="strat-hd"><span class="strat-name">${esc(stratDisplayName(s))}</span><span class="chip ${cls}">${esc(stratStatusLabel(s))}</span></div>
      <div class="strat-meta"><span class="chip">${esc(s.market)}</span></div>
      ${stratPeriodHTML("訓練期", s.is)}
      ${stratPeriodHTML("驗證期", s.oos)}
      ${reason}${fail}${upd}
    </div>`;
  }).join("");
  return `<div class="feed-panel" id="strat-panel">
    <div class="chips" style="margin-bottom:6px">${countChips}</div>
    ${filters}
    <div class="strat-list" id="strat-list">${cards}</div>
    <div class="feed-disc">${disc}</div>
  </div>`;
}
function dailyLogHTML(){
  const tr=D&&D.trade||{}; const p=tr.perf||{};
  const log=(p.dailyLog||[]).filter(d=>d && !d.empty);
  const disc=esc(p.disclaimer||"模擬結果，非投資建議");
  if(!log.length){
    return `<div class="feed-panel"><div class="muted">尚無每日訓練紀錄</div><div class="feed-disc">${disc}</div></div>`;
  }
  const days=log.map(d=>{
    const pTw=d.plainTw&&d.plainTw.length?d.plainTw:(d.tw||[]);
    const pCr=d.plainCrypto&&d.plainCrypto.length?d.plainCrypto:(d.crypto||[]);
    const hasPlain=(pTw&&pTw.length)||(pCr&&pCr.length);
    if(!hasPlain && !(d.tw||[]).length && !(d.crypto||[]).length) return "";
    const sentences=[];
    (pTw||[]).slice(0,3).forEach(x=>sentences.push(withSymNames(x)));
    (pCr||[]).slice(0,3).forEach(x=>sentences.push(withSymNames(x)));
    const plain=sentences.slice(0,3).map(x=>`<p class="dlog-plain">${esc(x)}</p>`).join("")||`<p class="muted">這天沒有特別紀錄</p>`;
    const rawTw=(d.tw||[]).map(x=>`<li>${esc(withSymNames(x))}</li>`).join("");
    const rawCr=(d.crypto||[]).map(x=>`<li>${esc(withSymNames(x))}</li>`).join("");
    const detail=(rawTw||rawCr)?`<details class="dlog-detail"><summary>詳細</summary>
      <div class="dlog-cols">
        <div class="dlog-col"><div class="feed-mhd">台股</div>${rawTw?`<ul>${rawTw}</ul>`:`<div class="muted">無</div>`}</div>
        <div class="dlog-col"><div class="feed-mhd">幣圈</div>${rawCr?`<ul>${rawCr}</ul>`:`<div class="muted">無</div>`}</div>
      </div>
    </details>`:"";
    return `<div class="dlog-day">
      <div class="dlog-date">${esc(d.date)}</div>
      <div class="dlog-summary">${plain}</div>
      ${detail}
    </div>`;
  }).filter(Boolean).join("");
  return `<div class="feed-panel"><div class="dlog-list">${days||`<div class="muted">尚無每日訓練紀錄</div>`}</div><div class="feed-disc">${disc}</div></div>`;
}
function bindStrategyFilters(root){
  const panel=(root||document).querySelector("#strat-panel");
  if(!panel) return;
  const list=panel.querySelector("#strat-list");
  const filt=panel.querySelector('[data-role="strat-filters"]');
  if(!list||!filt) return;
  let mkt="全部", st="全部";
  function apply(){
    list.querySelectorAll(".strat-card").forEach(card=>{
      const okM=mkt==="全部"||card.dataset.market===mkt;
      const okS=st==="全部"||card.dataset.status===st;
      card.hidden=!(okM&&okS);
    });
  }
  filt.querySelectorAll("[data-mkt]").forEach(btn=>{
    btn.onclick=()=>{
      mkt=btn.dataset.mkt;
      filt.querySelectorAll("[data-mkt]").forEach(b=>b.classList.toggle("on", b===btn));
      apply();
    };
  });
  filt.querySelectorAll("[data-st]").forEach(btn=>{
    btn.onclick=()=>{
      st=btn.dataset.st;
      filt.querySelectorAll("[data-st]").forEach(b=>b.classList.toggle("on", b===btn));
      apply();
    };
  });
}
function feedStatusHTML(){
  const tr=D&&D.trade||{};
  const markets=tr.markets||[];
  const sm=tr.summary||{};
  const checked=tr.checkedAt?`最後檢查 ${esc(tr.checkedAt)}（台北）`:"";
  const disc=esc(tr.disclaimer||"模擬交易，非投資建議、不碰真錢");
  if(!markets.length){
    return `<div class="feed-panel"><div class="muted">尚無行情檢查資料</div><div class="feed-disc">${disc}</div></div>`;
  }
  const blocks=markets.map(m=>{
    const rows=(m.feeds||[]).map(f=>{
      const ok=f.status==="ok";
      const lite=ok?"green":(f.status==="blocked"?"yellow":"red");
      const why=(!ok && f.reason)?`<span class="feed-why">${esc(f.reason)}</span>`:"";
      return `<div class="feed-row"><span class="slite ${lite}"></span><span class="feed-src">${esc(f.source)}</span><span class="feed-st ${ok?"ok":"no"}">${esc(f.label|| (ok?"已連線":"未連線"))}</span>${why}</div>`;
    }).join("");
    return `<div class="feed-mkt"><div class="feed-mhd">${esc(m.name)} <span class="muted">${m.ok||0}/${m.total||0} 已連線</span></div>${rows}</div>`;
  }).join("");
  const chips=[`<span class="chip ok">已連線 ${sm.ok||0}</span>`]; if(sm.need_key) chips.push(`<span class="chip mid">需金鑰 ${sm.need_key}</span>`); chips.push(`<span class="chip no">封鎖／離線 ${(sm.blocked||0)+(sm.down||0)}</span>`); return `<div class="feed-panel"><div class="chips" style="margin-bottom:8px">${chips.join("")}</div>${blocks}<div class="feed-meta muted">${checked}</div><div class="feed-disc">${disc}</div></div>`;
}
function floorVizHTML(id){
  if(!D)return"";
  if(id==="trade"){
    const tr=D.trade||{}; const perf=tr.perf||{}; const sm=tr.summary||{};
    const g=perf.liveGate||{};
    if(g.daysElapsed!=null){
      const d=g.daysElapsed, t=g.targetDays||90;
      const lite=g.allMet?"green":(d>=1?"yellow":"red");
      return lightHTML(lite)+`<span class="fv-cap">往實盤 ${d}/${t} 天 · 模擬</span>`;
    }
    if(perf.waitingFirstFill) return lightHTML("yellow")+`<span class="fv-cap">等待開盤成交 · 模擬</span>`;
    if(perf.equityReturnPct!=null){
      const eq=Number(perf.equityReturnPct), bh=perf.benchmark0050ReturnPct;
      const lite=eq>=0?"green":"yellow";
      const bhTxt=bh==null?"":` · vs0050 ${bh>=0?"+":""}${Number(bh).toFixed(1)}%`;
      return lightHTML(lite)+`<span class="fv-cap">${eq>=0?"+":""}${eq.toFixed(1)}%${bhTxt}</span>`;
    }
    const ok=sm.ok||0, total=sm.total||0;
    const lite=total&&ok===total?"green":(ok?"yellow":"red");
    return lightHTML(lite)+`<span class="fv-cap">行情 ${ok}/${total} · 模擬</span>`;
  }
  if(id==="art"){
    const a=D.art||{};
    const n=a.todayCount||0;
    const base=a.baseCount||0;
    const trend=artTrendSVG(a.trend);
    return (trend||"")+`<span class="fv-cap">${n?("今日 "+n+" 張"):("最新批次 "+base+" 張")} · 近 7 日</span>`;
  }
  if(id==="num"){
    const n=D.numbers||{};
    if((n.series||[]).length>=2) return sparkSVG(n.series,"free")+`<span class="fv-cap">免費戰力 · ${esc(n.date||"")}</span>`;
    if((n.stats||[]).length) return `<div class="fv-chips">${n.stats.slice(0,2).map(s=>`<span class="chip">${esc(s.label)} ${esc(s.value)}</span>`).join("")}</div>`;
    return `<div class="fv-empty">今天尚無模擬資料</div>`;
  }
  if(id==="qa"){
    const q=D.qa||{};
    const imp=(q.important||0)+(q.openImportant||0);
    const min=(q.minor||0)+(q.openMinor||0);
    return lightHTML(q.light||"green")+`<span class="fv-cap">重要 ${imp} · 次要 ${min}</span>`;
  }
  if(id==="dev"||id==="eng"){
    const pipe=(D.dev&&D.dev.pipeline)||null;
    return pipeHTML(pipe,true)+`<span class="fv-cap">${esc((pipe&&pipe.version)||(D.game&&D.game.version)||"")}</span>`;
  }
  if(id==="council"){
    const dec=((D.council||{}).decisions)||[];
    if(!dec.length) return `<div class="fv-empty">今天尚無裁決</div>`;
    const top=dec.slice(0,2).map(d=>`<span class="chip ok">${esc(d.item)}</span>`).join("");
    return `<div class="fv-chips">${top}</div><span class="fv-cap">${dec.length} 項決定</span>`;
  }
  if(id==="mz"){
    const min=nowMin();
    const on=min>=9*60&&min<18*60;
    return lightHTML(on?"green":"yellow")+`<span class="fv-cap">${on?"公關／財會值班中":"公關／財會休息中"} · 排程建立中</span>`;
  }
  if(id==="lobby"){
    const b=D.backlog||{}; const p=b.total?Math.round(b.done/b.total*100):0;
    return gaugeSVG(p)+`<span class="fv-cap">待辦 ${b.done||0}/${b.total||0}</span>`;
  }
  if(id==="director"){
    const a=usageAlert();
    if(a.level) return `<span class="fv-cap">${esc(a.short||"用量警示")}</span>`;
    return `<span class="fv-cap">用量面板 · 點明細</span>`;
  }
  return "";
}
function driIds(dri){
  const s=String(dri||"");
  const out=[];
  // 依出現順序收集，支援 工程＋監管／工程、智雅／工程/監管
  const rules=[["eng",/工程/],["zhiya",/智雅/],["art",/美術/],["num",/數值/],["qa",/監管/],["weixiang",/偉翔|總監|總裁/],["trade",/交易/],["pr",/公關|沈沐禾/],["fin",/財會|蒲小棠/]];
  // 用分隔符切開再對每段匹配，保留順序
  const parts=s.split(/[＋+、／/,，&與和]+/).map(x=>x.trim()).filter(Boolean);
  const src=parts.length?parts:[s];
  for(const p of src){
    for(const [id,re] of rules){ if(re.test(p) && !out.includes(id)){ out.push(id); break; } }
  }
  if(!out.length){ for(const [id,re] of rules){ if(re.test(s)) out.push(id); } }
  return out;
}
function driId(dri){return driIds(dri)[0]||"";}
function dueStatus(due){
  if(!due) return {lite:"green", text:"—", cls:""};
  const m=/^(\d{1,2}):(\d{2})$/.exec(due);
  if(m){
    const target=+m[1]*60+ +m[2], now=nowMin();
    const diff=target-now;
    if(diff<-30) return {lite:"red", text:due+" 已過", cls:"over"};
    if(diff<0) return {lite:"yellow", text:due+" 剛過", cls:"soon"};
    if(diff<=60) return {lite:"yellow", text:due+" · "+Math.round(diff)+" 分內", cls:"soon"};
    return {lite:"green", text:due, cls:""};
  }
  const d=/^(\d{1,2})\/(\d{1,2})$/.exec(due);
  if(d){
    const tp=tpNow(); const y=tp.getUTCFullYear();
    const dueMs=Date.UTC(y,+d[1]-1,+d[2],16,0); // 約台北日終
    const left=dueMs-Date.now();
    if(left<-864e5) return {lite:"red", text:due+" 已過", cls:"over"};
    if(left<864e5) return {lite:"yellow", text:due+" · 今天", cls:"soon"};
    return {lite:"green", text:due, cls:""};
  }
  return {lite:"green", text:due, cls:""};
}

/* ---- 人性化：白話摘要／關鍵卡／收合列表／桌上決定標示 ---- */
function emptySoon(what, when){
  return `<div class="empty-soon"><b>${esc(what||"這裡還沒有內容")}</b><span class="muted">${esc(when||"有資料時會出現在這裡")}</span></div>`;
}
function floorBriefHTML(text){
  if(!text) return "";
  return `<div class="floor-brief">${esc(text)}</div>`;
}
function keyCardsHTML(cards){
  if(!cards||!cards.length) return "";
  return `<div class="key-cards">${cards.map(c=>{
    const note=c.note?`<em>${esc(c.note)}</em>`:"";
    return `<div class="kc"><b>${esc(String(c.v==null?"—":c.v))}</b><span>${esc(c.l||"")}</span>${note}</div>`;
  }).join("")}</div>`;
}
function listTopHTML(items, n, renderOne, moreLabel){
  const arr=items||[];
  if(!arr.length) return "";
  const top=arr.slice(0, n||3);
  const rest=arr.slice(n||3);
  let h=top.map(renderOne).join("");
  if(rest.length){
    const id="more-"+Math.random().toString(36).slice(2,8);
    h+=`<details class="list-more"><summary>${esc(moreLabel||("看全部（+"+rest.length+"）"))}</summary><div>${rest.map(renderOne).join("")}</div></details>`;
  }
  return h;
}
function detailFoldHTML(summary, bodyHtml){
  if(!bodyHtml) return "";
  return `<details class="detail-fold"><summary>${esc(summary||"詳細")}</summary><div class="detail-body">${bodyHtml}</div></details>`;
}
function plainDecisionSentence(d){
  if(!d) return "";
  const tag=String(d.tag||d.verdict||"決定");
  const item=String(d.item||"");
  const who=String(d.dri||"未指派");
  const due=String(d.due||"期限未定");
  let head;
  if(tag==="採納"||tag==="縮小後採納") head=`${tag}了「${item}」`;
  else if(/不採納|拒絕|淘汰/.test(tag)) head=`${tag}「${item}」`;
  else head=`${tag}：${item}`;
  return `${head}。負責：${who}。期限：${due}`;
}
function decisionsList(){
  return ((D&&D.council)||{}).decisions||[];
}
function decisionsByFloor(){
  // floorId -> [{d, mids}]
  const out={};
  for(const d of decisionsList()){
    const mids=driIds(d.dri);
    const floors=new Set();
    if(!mids.length) floors.add("council");
    for(const mid of mids){
      if(mid==="trade") floors.add("trade");
      else if(SPOT[mid]) floors.add(SPOT[mid].f);
      else floors.add("council");
    }
    // 一律也掛一份在 8F 會議室外觀提示
    floors.add("council");
    for(const f of floors){
      (out[f]=out[f]||[]).push({d, mids});
    }
  }
  return out;
}
function renderDeskSigns(){
  document.querySelectorAll(".desk-sign").forEach(e=>e.remove());
  if(!D) return;
  const by=decisionsByFloor();
  for(const [fid, rows] of Object.entries(by)){
    const F=floorsEl[fid]; if(!F||!F.room) continue;
    // 每層最多 2 則桌上標示，其餘點明細看
    const show=rows.slice(0,2);
    if(!show.length) continue;
    const wrap=document.createElement("div");
    wrap.className="desk-sign";
    wrap.setAttribute("aria-label","今日決定標示");
    wrap.innerHTML=show.map(({d,mids})=>{
      const av=mids.filter(id=>id!=="council"&&NAMES[id]).slice(0,2)
        .map(id=>`<img class="ds-av" src="${avatarURL(id)}" alt="" width="22" height="22">`).join("");
      return `<button type="button" class="ds-item" data-goto-council="1"><span class="ds-avs">${av}</span><span class="ds-txt">${esc(plainDecisionSentence(d))}</span></button>`;
    }).join("");
    if(rows.length>2){
      wrap.innerHTML+=`<button type="button" class="ds-more" data-goto-council="1">還有 ${rows.length-2} 項 · 看 8F</button>`;
    }
    wrap.querySelectorAll("[data-goto-council]").forEach(btn=>{
      btn.addEventListener("click",e=>{e.stopPropagation(); setView("room","council"); openFloor("council");});
    });
    F.room.appendChild(wrap);
  }
}

function decisionBoardHTML(){
  const dec=decisionsList();
  if(!dec.length) return emptySoon("今天還沒有已裁決的決定","會議結束後會出現在這裡");
  return `<div class="dboard">${dec.map(d=>{
    const ids=driIds(d.dri); const st=dueStatus(d.due);
    const av=ids.length
      ?`<div class="davs">${ids.map(id=>`<img class="dav" src="${avatarURL(id)}" alt="" width="36" height="36">`).join("")}</div>`
      :`<div class="davs"><div class="dav"></div></div>`;
    const line=plainDecisionSentence(d);
    return `<div class="dcard">${av}<div class="dmeta"><div class="ditem">${esc(line)}</div><div class="ddri muted">負責人桌上也有標示</div></div><div class="dright"><span class="slite ${st.lite}"></span><span class="ddue ${st.cls}">${esc(st.text)}</span></div></div>`;
  }).join("")}</div>`;
}

/* ---- 7F 交易室：投資先生風格分頁（原創版面，無元大商標／色票複製） ---- */
const TRADE_TABS = [
  {id:"home", label:"首頁"},
  {id:"watch", label:"自選"},
  {id:"strat", label:"策略中心"},
  {id:"book", label:"庫存"},
  {id:"log", label:"紀錄"},
];
const CORE_TW = [
  {code:"2330", name:"台積電"}, {code:"2317", name:"鴻海"}, {code:"2454", name:"聯發科"},
  {code:"2303", name:"聯電"}, {code:"2382", name:"廣達"}, {code:"2308", name:"台達電"},
  {code:"2412", name:"中華電"}, {code:"2881", name:"富邦金"}, {code:"2882", name:"國泰金"},
  {code:"2891", name:"中信金"}, {code:"2002", name:"中鋼"}, {code:"1301", name:"台塑"}, {code:"00631L", name:"元大台灣50正2"},
];
const CORE_CRYPTO = [
  {code:"BTC", name:"比特幣"}, {code:"ETH", name:"以太幣"},
  {code:"SOL", name:"Solana"}, {code:"XRP", name:"瑞波幣"},
];

function quotesMap(){
  const p=(D&&D.trade&&D.trade.perf)||{};
  const q=p.quotes;
  if(!q) return {};
  if(Array.isArray(q)){
    const m={};
    q.forEach(it=>{ const c=(it.code||it.symbol||""); if(c) m[c]=it; });
    return m;
  }
  return q;
}
function symName(code){
  const q=quotesMap()[code];
  if(q&&q.name) return q.name;
  const tw=CORE_TW.find(x=>x.code===code); if(tw) return tw.name;
  const cx=CORE_CRYPTO.find(x=>x.code===code); if(cx) return cx.name;
  if(code==="TAIEX") return "加權指數";
  if(code==="0050") return "元大台灣50";
  if(code==="00631L") return "元大台灣50正2";
  return "";
}
function symLabel(code){
  const n=symName(code);
  if(!code) return "—";
  if(code==="TAIEX") return n||"加權指數";
  return n?`${code} ${n}`:`${code}`;
}
function quoteOf(code){
  return quotesMap()[code]||null;
}
function fmtPrice(v, code){
  if(v==null || v==="" || Number.isNaN(Number(v))) return "—";
  const n=Number(v);
  if(code==="XRP") return n.toFixed(4);
  if(code==="BTC"||code==="ETH") return n.toLocaleString("en-US",{maximumFractionDigits:2});
  if(code==="TAIEX") return n.toLocaleString("en-US",{maximumFractionDigits:2});
  if(n>=1000) return n.toLocaleString("en-US",{maximumFractionDigits:1});
  return n.toFixed(2);
}
/** 在文字中把已知代號補上中文名（避免重複加） */
function withSymNames(text){
  let s=String(text||"");
  const codes=["0050","00631L","2330","2317","2454","2303","2382","2308","2412","2881","2882","2891","2002","1301","BTC","ETH","SOL","XRP"];
  codes.forEach(code=>{
    const lab=symLabel(code);
    if(lab===code) return;
    // skip if already "code name"
    const re=new RegExp(code+"(?!\\s*"+symName(code).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","g");
    s=s.replace(re, lab);
  });
  return s;
}

let tradeTab = "home";
let stratExpand = "";

function fmtDash(v, digits){
  if(v==null || v==="" || Number.isNaN(Number(v))) return "—";
  const n = Number(v);
  if(digits==null) return String(n);
  return n.toFixed(digits);
}
function fmtChg(v){
  if(v==null || v==="" || Number.isNaN(Number(v))) return "—";
  const n = Number(v);
  const s = (n>0?"+":"") + n.toFixed(2) + "%";
  return s;
}
function wxSVG(kind){
  // 晴／陰／雨 — 簡易 SVG，非 emoji
  if(kind==="晴") return `<svg class="wx" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="#C9A227"/><g stroke="#C9A227" stroke-width="1.6" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M5.2 18.8l1.6-1.6"/></g></svg>`;
  if(kind==="雨") return `<svg class="wx" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14a5 5 0 019.6-1.8A3.8 3.8 0 1117 18H8.2A3.2 3.2 0 017 14z" fill="#6a7a90" stroke="#9aa8b8" stroke-width="1"/><g stroke="#5ab0ff" stroke-width="1.6" stroke-linecap="round"><path d="M9 19.5v2.2M12 19.2v2.5M15 19.5v2.2"/></g></svg>`;
  return `<svg class="wx" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 15a5 5 0 019.7-1.7A3.8 3.8 0 1117 19H8.2A3.2 3.2 0 017 15z" fill="#7a8796" stroke="#a8b4c0" stroke-width="1"/><circle cx="9.5" cy="11" r="3.2" fill="#8a96a4" opacity=".85"/></svg>`;
}
function weatherFor(code){
  const p=(D&&D.trade&&D.trade.perf)||{};
  const regime=p.regime||{};
  if(code==="0050" || code==="0050.TW"){
    if(regime.vsSma200==="above") return {wx:"晴", view:"看多", label:"看多", note:"站上 200 日均線，核心策略可抱"};
    if(regime.vsSma200==="below") return {wx:"雨", view:"看空", label:"看空", note:"跌破 200 日均線，核心策略空手"};
    return {wx:"陰", view:"觀望", label:"觀望", note:"目前沒有策略建議進場"};
  }
  const list=p.strategyList||[];
  const hit=list.find(s=>s.status==="執行中" && ((s.name||"").includes(code) || (s.displayName||"").includes(code) || (s.reason||"").includes(code)));
  if(hit) return {wx:"晴", view:"看多", label:"看多", note:stratDisplayName(hit)};
  const obs=list.find(s=>(s.status==="觀察"||s.statusLabel==="觀察中") && ((s.name||"").includes(code) || (s.reason||"").includes(code)));
  if(obs) return {wx:"陰", view:"觀望", label:"觀望", note:stratDisplayName(obs)};
  return {wx:"陰", view:"觀望", label:"觀望", note:"目前沒有策略建議進場"};
}
function groupAsOf(items){
  let asOf="", src="", cached=false;
  (items||[]).forEach(it=>{
    const q=quoteOf(it.code);
    if(q&&q.asOf&&!asOf) asOf=q.asOf;
    if(q&&q.source&&!src) src=q.source;
    if(q&&q.cached) cached=true;
  });
  return {asOf, src, cached};
}
function indexStripHTML(){
  const items=[
    {code:"TAIEX", name:"加權指數"},
    {code:"0050", name:symLabel("0050")},
    {code:"BTC", name:symLabel("BTC")},
    {code:"ETH", name:symLabel("ETH")},
  ];
  let asOf="", src="";
  return `<div class="idx-strip" role="list">${items.map(it=>{
    const q=quoteOf(it.code);
    const close=q&&q.close!=null?q.close:null;
    const chg=q&&q.changePct!=null?q.changePct:null;
    if(q&&q.asOf&&!asOf) asOf=q.asOf;
    if(q&&q.source&&!src) src=q.source;
    const chgCls = chg==null?"":(Number(chg)>0?"up":(Number(chg)<0?"down":""));
    const cached=q&&q.cached?`<span class="idx-cached" title="沿用快取">快取</span>`:"";
    return `<div class="idx-item" role="listitem"><div class="idx-name">${esc(it.code==="TAIEX"?"加權指數":symLabel(it.code))}</div><div class="idx-close">${esc(fmtPrice(close, it.code))}${cached}</div><div class="idx-chg ${chgCls}">${esc(fmtChg(chg))}</div></div>`;
  }).join("")}</div>
  <div class="idx-meta muted">${asOf?`截至 ${esc(asOf)} 台北`:"報價截至 —"}${src?` · ${esc(src)}`:""} · 缺值顯示 —，不捏造</div>`;
}
function stripEnglishIds(s){
  return String(s||"").replace(/\b[A-Z][A-Z0-9_]{3,}\b/g,"").replace(/[／/]\s*[／/]/g,"／").replace(/\s{2,}/g," ").replace(/^[／/\s；;，,：:]+|[／/\s；;，,：:]+$/g,"").trim();
}
function jargonToPlain(s){
  let t=String(s||"");
  const pairs=[["SCREEN3_REFINE","三層掃描"],["SCREEN3_PIT","三層掃描"],["SCREEN3","三層掃描"],["FALLBACK 0050+S1","退回方案（對照 0050）"],["FALLBACK 0050","退回方案（對照 0050）"],["FALLBACK","退回"],["VOL_BREAKOUT_GAP","量增突破＋跳空"],["CHIPREV","籌碼反轉"],["OHLV","價量資料"],["FAIL","沒贏過"],["WEAK","偏弱"],["FRAGILE","不穩"],["OOS","新資料驗證"],["PIT","當時可知資料"],["套筒","部位"]];
  pairs.forEach(([a,b])=>{ t=t.split(a).join(b); });
  return stripEnglishIds(t);
}
function focusCardsHTML(){
  const p=(D&&D.trade&&D.trade.perf)||{};
  const log=(p.dailyLog||[]).find(d=>d && !d.empty) || (p.dailyLog||[])[0];
  const rawLine=log?((log.tw&&log.tw[0])||(log.crypto&&log.crypto[0])||""):"";
  let headline=p.todayFocus||p.focusTw||(log&&(log.focusTw||(log.plainTw&&log.plainTw[0])||(log.plainCrypto&&log.plainCrypto[0])))||"";
  if(!headline && rawLine) headline=jargonToPlain(rawLine);
  if(!headline) headline=p.status||"今日尚無訓練紀錄";
  headline=jargonToPlain(headline);
  if(log&&log.date&&headline&&!headline.startsWith(log.date)) headline=log.date+" · "+headline;
  const sm=(D.trade&&D.trade.summary)||{};
  const feedTxt = (sm.total!=null)?(`行情已連線 ${sm.ok||0}/${sm.total}`):"尚無行情檢查";
  const g=p.liveGate||{};
  const gateTxt = g.daysElapsed!=null?`往實盤 ${g.daysElapsed}/${g.targetDays||90} 天`:"往實盤進度 —";
  const detail=rawLine&&rawLine!==headline?`<details class="focus-raw"><summary>詳細</summary><div class="muted" style="margin-top:6px;font-size:12px;word-break:break-word">${esc(rawLine)}</div></details>`:"";
  return `<div class="focus-grid">
    <div class="focus-card"><div class="focus-k">今日焦點</div><div class="focus-v">${esc(headline)}</div>${detail}</div>
    <div class="focus-card"><div class="focus-k">行情連線</div><div class="focus-v">${esc(feedTxt)}</div><div class="muted" style="margin-top:4px;font-size:11px">${esc(gateTxt)} · 紙上模擬</div></div>
  </div>`;
}
function watchRowHTML(it){
  const w=weatherFor(it.code);
  const q=quoteOf(it.code);
  const close=q&&q.close!=null?q.close:null;
  const chg=q&&q.changePct!=null?q.changePct:null;
  const chgCls=chg==null?"muted":(Number(chg)>0?"up":(Number(chg)<0?"down":"muted"));
  const name=symName(it.code)||it.name||it.code;
  return `<button type="button" class="wl-row wl-tap" data-sym="${esc(it.code)}">
    <div class="wl-wx" title="${esc(w.label+(w.note?(" · "+w.note):""))}">${wxSVG(w.wx)}<span class="wl-wxlab">${esc(w.wx)}</span></div>
    <div class="wl-meta"><div class="wl-name">${esc(name)} <span class="wl-codeinline">${esc(it.code)}</span></div><div class="wl-viewline">${esc(w.label)}：${esc(w.note||"目前沒有策略建議進場")}</div></div>
    <div class="wl-px"><div class="wl-close">${esc(fmtPrice(close, it.code))}</div><div class="wl-chg ${chgCls}">${esc(fmtChg(chg))}</div></div>
  </button>`;
}
function watchHTML(){
  const twMeta=groupAsOf(CORE_TW.concat([{code:"0050"}]));
  const crMeta=groupAsOf(CORE_CRYPTO);
  const asOfTw=twMeta.asOf?`資料時間 ${esc(twMeta.asOf)} 台北${twMeta.cached?" · 快取":""}`:`資料時間 —`;
  const asOfCr=crMeta.asOf?`資料時間 ${esc(crMeta.asOf)} 台北${crMeta.cached?" · 快取":""}`:`資料時間 —`;
  const perf=(D&&D.trade&&D.trade.perf)||{};
  const sleeves=(perf.sleeves||[]).filter(s=>s&&s.name);
  const active=sleeves.filter(s=>/執行|等待|掛單/.test(String(s.status||"")));
  const sleeveTxt=active.length?active.map(s=>s.name).join("、"):(sleeves[0]?sleeves[0].name:"");
  const explain=sleeveTxt
    ?(`為什麼大多是「觀望」？目前配置看 ${sleeveTxt}；0050 只作對照基準。其餘策略驗證沒過或已淘汰，所以個股／幣圈先不建議進場。`)
    :(`為什麼大多是「觀望」？目前沒有執行中的進場策略；0050 只作對照基準。其餘策略驗證沒過或已淘汰，所以個股／幣圈先不建議進場。`);
  return `<div class="wl-panel">
    <div class="wl-explain">${esc(explain)}</div>
    <div class="wl-group"><div class="wl-ghd">台股核心</div><div class="wl-asof muted">${asOfTw}</div>${CORE_TW.map(watchRowHTML).join("")}</div>
    <div class="wl-group"><div class="wl-ghd">幣圈</div><div class="wl-asof muted">${asOfCr}</div>${CORE_CRYPTO.map(watchRowHTML).join("")}</div>
    <div class="feed-disc">天氣＝策略觀點（晴看多／陰觀望／雨看空）。報價缺值顯示 —，不捏造。點進可看日 K 與模擬／回測標記。紙上模擬，非投資建議。</div>
  </div>`;
}
function sleevesDonutHTML(sleeves){
  const arr=(sleeves||[]).filter(s=>s && s.targetPct!=null);
  if(!arr.length) return `<div class="muted">尚無配置資料</div>`;
  const colors=["#C9A227","#5ab0ff","#3FD8A0","#ff9a3c"];
  const r=36, c=2*Math.PI*r;
  let off=0;
  const arcs=arr.map((s,i)=>{
    const pct=Math.max(0,Math.min(100,Number(s.targetPct)||0));
    const len=c*pct/100;
    const stroke=colors[i%colors.length];
    const el=`<circle cx="50" cy="50" r="${r}" fill="none" stroke="${stroke}" stroke-width="10" stroke-dasharray="${len} ${c-len}" stroke-dashoffset="${-off}" transform="rotate(-90 50 50)"/>`;
    off += len;
    return el;
  }).join("");
  const legend=arr.map((s,i)=>`<div class="donut-leg"><i style="background:${colors[i%colors.length]}"></i>${esc(s.name||"")} ${esc(String(s.targetPct))}%</div>`).join("");
  return `<div class="donut-wrap"><svg class="donut" viewBox="0 0 100 100" aria-hidden="true">${arcs}<circle cx="50" cy="50" r="26" fill="#0c141e"/><text x="50" y="52" text-anchor="middle" fill="#e8eef6" font-size="11" font-weight="700">配置</text></svg><div class="donut-legs">${legend}</div></div>`;
}

function strategyBookRows(){
  const p=(D&&D.trade&&D.trade.perf)||{};
  const book=p.strategyBook;
  if(book&&Array.isArray(book.all)&&book.all.length) return book.all;
  // fallback: sleeves + virtual benches
  const rows=(p.sleeves||[]).map(s=>({
    id:s.id||s.name, name:s.name, status:s.status, allocPct:s.targetPct, navPct:s.navPct,
    market:s.market==="tw"||s.market==="台股"?"台股":(s.market==="crypto"||s.market==="幣圈"?"幣圈":(s.market||"")),
    bench:false
  }));
  (p.benchmarksVirtual||[]).forEach(b=>{
    const lab=b.id==="BENCH_0050"?"對照：0050":(b.id==="BENCH_BTC"?"對照：比特幣":(b.symbol||b.id||"對照線"));
    rows.push({id:b.id, name:lab, status:"對照線", allocPct:0, navPct:b.returnPct, market:"", bench:true, note:b.note, symbol:b.symbol});
  });
  return rows;
}
function bookCardHTML(r){
  const bench=!!r.bench || r.status==="對照線";
  const name=bench
    ? (r.id==="BENCH_0050"||/0050/.test(String(r.symbol||r.name||""))?"對照：0050":(/BTC|比特幣/.test(String(r.symbol||r.name||r.id||""))?"對照：比特幣":(r.name||"對照線")))
    : (r.name||"—");
  const status=bench?"對照線（不占資金）":(r.status||"—");
  const alloc=bench?"—":(r.allocPct!=null?`${r.allocPct}%`:"—");
  const nav=r.navPct==null?"—":fmtPct(r.navPct);
  const mkt=r.market&&!bench?`<span class="chip">${esc(r.market)}</span>`:"";
  const cls=bench?"bench":stratStatusCls(r.status);
  return `<div class="sbook-card${bench?" is-bench":""}">
    <div class="sbook-hd"><span class="sbook-name">${esc(name)}</span><span class="chip ${cls}">${esc(status)}</span></div>
    <div class="sbook-grid">
      <div><span class="sbook-k">分到資金</span><span class="sbook-v">${esc(alloc)}</span></div>
      <div><span class="sbook-k">淨值</span><span class="sbook-v">${esc(nav)}</span></div>
      <div><span class="sbook-k">${bench?"對照線":"市場"}</span><span class="sbook-v">${bench?"不占資金":esc(r.market||"—")}</span></div>
    </div>
    ${mkt}
  </div>`;
}
function strategyBookHTML(){
  const p=(D&&D.trade&&D.trade.perf)||{};
  const rows=strategyBookRows();
  const disc=esc((p.strategyBook&&p.strategyBook.disclaimer)||p.disclaimer||"模擬結果，非投資建議");
  const note=(p.strategyBook&&p.strategyBook.note)?`<div class="muted sbook-note">${esc(jargonToPlain(p.strategyBook.note))}</div>`:"";
  if(!rows.length) return `<div class="muted">尚無策略簿</div><div class="feed-disc">${disc}</div>`;
  const tw=rows.filter(r=>!r.bench && (r.market==="台股"||r.market==="tw"));
  const cr=rows.filter(r=>!r.bench && (r.market==="幣圈"||r.market==="crypto"));
  const cash=rows.filter(r=>!r.bench && /^CASH_/.test(String(r.id||"")));
  const other=rows.filter(r=>!r.bench && !tw.includes(r) && !cr.includes(r) && !cash.includes(r));
  const benches=rows.filter(r=>r.bench);
  const sec=(title,list)=>list.length?`<div class="sbook-sec"><div class="feed-mhd">${esc(title)}</div><div class="sbook-grid-cards">${list.map(bookCardHTML).join("")}</div></div>`:"";
  return `${note}
    ${sec("台股策略", tw.concat(other.filter(r=>r.market==="台股")))}
    ${sec("幣圈策略", cr)}
    ${sec("現金保留", cash)}
    ${sec("對照線（不占資金）", benches)}
    ${sec("其他", other.filter(r=>r.market!=="台股"&&r.market!=="幣圈"))}
    <div class="feed-disc">${disc}</div>`;
}

function bookHTML(){
  const p=(D&&D.trade&&D.trade.perf)||{};
  const pos=p.positions||[];
  const sleeves=p.sleeves||[];
  const cap=p.capital||{};
  const availRaw=cap.availableLabel||cap.label||"";
  const avail=String(availRaw).replace(/^可用資金[：:]\s*/,"");
  const vs = p.vs0050Sentence || `模擬獲利 ${fmtPct(p.equityReturnPct)}，同期買 0050 ${fmtPct(p.benchmark0050ReturnPct)}`;
  const posRows=pos.length?pos.map(x=>`<div class="wl-row"><div class="wl-meta"><div class="wl-name">${esc(symLabel(x.symbol)||x.symbol)}</div></div><div class="wl-px"><div class="wl-close">權重 ${esc(fmtDash(x.weightPct,1))}%</div><div class="wl-chg">未實現 ${fmtPct(x.unrealizedPct)}</div></div></div>`).join(""):emptySoon("尚無紙上持倉","紙上掛單等開盤成交後會出現；0050／BTC 為對照線");
  const planned=(p.trades||[]).filter(t=>t&&t.planned);
  const planRows=planned.length?planned.map(t=>{
    const sym=normTradeSym(t.symbol);
    return `<button type="button" class="wl-row wl-tap" data-sym="${esc(sym)}"><div class="wl-meta"><div class="wl-name">${esc(symLabel(sym)||sym)} <span class="chip mid">預計</span></div><div class="wl-viewline">${esc(t.strategyZh||t.label||"")} · ${esc(t.date||"")}</div></div><div class="wl-px"><div class="wl-close">${t.stopPx!=null?"停 "+fmtDash(t.stopPx,2):"—"}</div><div class="wl-chg">${t.targetPx!=null?"目標 "+fmtDash(t.targetPx,2):"—"}</div></div></button>`;
  }).join(""):"";
  return `<div class="book-panel">
    <div class="sim-banner">紙上模擬 · 非投資建議 · 不碰真錢</div>
    ${avail?`<div class="capital-avail"><span class="ca-lab">可用資金</span><span class="ca-val">${esc(avail)}</span></div>`:""}
    <div class="vs-bench">${esc(vs)}</div>
    <div class="big" style="margin-top:8px">
      <div><b>${fmtPct(p.equityReturnPct)}</b><span>模擬報酬</span><em>${Number(p.equityReturnPct)==0?"還沒開始漲跌":(Number(p.equityReturnPct)>0?"比開始好":"比開始差")}</em></div>
      <div><b>${fmtPct(p.dailyChangePct)}</b><span>日變動</span><em>${p.dailyChangePct==null||Number(p.dailyChangePct)==0?"與昨天差不多":(Number(p.dailyChangePct)>0?"比昨天好":"比昨天差")}</em></div>
      <div><b>${p.closedTrades==null?"—":esc(String(p.closedTrades))}</b><span>已平倉</span></div>
      <div><b>${p.maxDrawdownPct==null?"—":(Number(p.maxDrawdownPct).toFixed(1)+"%")}</b><span>最大回撤</span></div>
    </div>
    <div class="feed-mkt" style="margin-top:10px"><div class="feed-mhd">策略簿</div>${strategyBookHTML()}</div>
    <div class="feed-mkt" style="margin-top:10px"><div class="feed-mhd">目標配置</div>${sleevesDonutHTML(sleeves)}</div>
    ${planRows?`<div class="feed-mkt"><div class="feed-mhd">預計進場</div>${planRows}</div>`:""}
    <div class="feed-mkt"><div class="feed-mhd">持倉</div>${posRows}</div>
  </div>`;
}
function normTradeSym(sym){
  return String(sym||"").replace(/\.TW$/,"").replace(/\.TWO$/,"").replace(/-USD$/,"").replace(/-USDT$/,"");
}
function stratCenterHTML(){
  const p=(D&&D.trade&&D.trade.perf)||{};
  const disc=esc(p.disclaimer||"模擬結果，非投資建議");
  const vs = p.vs0050Sentence || `模擬獲利 ${fmtPct(p.equityReturnPct)}，同期買 0050 ${fmtPct(p.benchmark0050ReturnPct)}`;
  const rows=strategyBookRows();
  const hasBook=rows.length>0;
  // 仍保留舊 strategyList 展開詳情（驗證期數字）於下方摺疊
  const list=p.strategyList||[];
  const legacy = list.length?`<details class="focus-raw" style="margin-top:10px"><summary>研究清單（舊版驗證數字）</summary><div class="strat-list" style="margin-top:8px">${list.map(s=>{
    const lab=stratStatusLabel(s);
    const cls=stratStatusCls(lab);
    return `<div class="strat-card"><div class="strat-hd"><span class="strat-name">${esc(stratDisplayName(s))}</span><span class="chip ${cls}">${esc(lab)}</span></div>
      <div class="strat-meta"><span class="chip">${esc(s.market||"")}</span><span class="muted strat-oneline">${esc(s.plainReason||softenInline(s.reason)||"")}</span></div>
      ${stratPeriodHTML("訓練期", s.is)}${stratPeriodHTML("驗證期", s.oos)}</div>`;
  }).join("")}</div></details>`:"";
  if(!hasBook && !list.length) return `<div class="feed-panel"><div class="muted">尚無策略清單</div><div class="feed-disc">${disc}</div></div>`;
  return `<div class="feed-panel" id="strat-panel">
    <div class="vs-bench">${esc(vs)}</div>
    <div class="feed-mhd">策略簿</div>
    ${strategyBookHTML()}
    ${legacy}
  </div>`;
}
function softenInline(s){
  return String(s||"").replace(/\bOOS\b/g,"樣本外").replace(/\bIS\b/g,"訓練期").replace(/\bFAIL\b/g,"沒過關").replace(/\bWEAK\b/g,"偏弱");
}
function bindTradeApp(root){
  const app=(root||document).querySelector(".trade-app");
  if(!app) return;
  function refresh(){
    const parent=app.parentElement;
    if(!parent) return;
    app.outerHTML=tradeAppHTML();
    bindTradeApp(parent);
  }
  app.querySelectorAll("[data-trade-tab]").forEach(btn=>{
    btn.onclick=()=>{
      tradeTab=btn.dataset.tradeTab;
      refresh();
    };
  });
  const stFilt=app.querySelector('[data-role="strat-status"]');
  if(stFilt){
    window.__stratStatusFilter=window.__stratStatusFilter||"全部";
    stFilt.querySelectorAll("[data-st]").forEach(btn=>{
      btn.onclick=()=>{
        window.__stratStatusFilter=btn.dataset.st;
        stFilt.querySelectorAll("[data-st]").forEach(b=>b.classList.toggle("on", b===btn));
        const list=app.querySelector("#strat-list");
        if(!list) return;
        const st=window.__stratStatusFilter;
        list.querySelectorAll(".strat-card").forEach(card=>{
          card.hidden=!(st==="全部"||card.dataset.status===st);
        });
      };
    });
    const st=window.__stratStatusFilter||"全部";
    stFilt.querySelectorAll("[data-st]").forEach(b=>b.classList.toggle("on", b.dataset.st===st));
    app.querySelectorAll("#strat-list .strat-card").forEach(card=>{
      card.hidden=!(st==="全部"||card.dataset.status===st);
    });
  }
  app.querySelectorAll(".strat-tap").forEach(card=>{
    card.onclick=(e)=>{
      e.preventDefault();
      const name=card.dataset.name;
      stratExpand = stratExpand===name?"":name;
      refresh();
    };
  });
  app.querySelectorAll(".wl-tap").forEach(row=>{
    row.onclick=(e)=>{
      e.preventDefault();
      const code=row.dataset.sym;
      if(code) openSymbolSheet(code);
    };
  });
}

/* ---- 個股／幣詳情：自架 canvas 日K + 模擬／回測標記 ---- */
const _chartCache = {};
async function openSymbolSheet(code){
  const name=symName(code)||code;
  openSheet(`<h3>${esc(name)} <span class="muted">${esc(code)}</span></h3>
    <div class="sym-loading muted">載入日 K…</div>`);
  try{
    let pack=_chartCache[code];
    if(!pack){
      const url=`assets/charts/${encodeURIComponent(code)}.json?t=${Date.now()}`;
      const res=await fetch(url, {cache:"no-store"});
      if(!res.ok) throw new Error("no chart");
      pack=await res.json();
      _chartCache[code]=pack;
    }
    renderSymbolSheet(code, pack);
  }catch(err){
    openSheet(`<h3>${esc(name)} <span class="muted">${esc(code)}</span></h3>
      <div class="muted">目前沒有這檔的日 K 資料（不捏造）。</div>
      <div class="feed-disc">紙上模擬，非投資建議</div>`);
  }
}
function renderSymbolSheet(code, pack){
  const name=symName(code)||code;
  const q=quoteOf(code);
  const close=q&&q.close!=null?q.close:null;
  const chg=q&&q.changePct!=null?q.changePct:null;
  const chgCls=chg==null?"":(Number(chg)>0?"up":(Number(chg)<0?"down":""));
  const w=weatherFor(code);
  const levels=pack.levels;
  let levelsHtml="";
  if(levels && (levels.entry!=null || levels.rule)){
    levelsHtml=`<div class="sym-levels">
      <div class="feed-mhd">目前策略看法 · ${esc(levels.strategyName||"")}</div>
      <p>${esc(levels.rule||"")}</p>
      <ul>
        ${levels.entry!=null?`<li>進場參考 ${esc(fmtPrice(levels.entry, code))}</li>`:""}
        ${levels.stop?`<li>停損／出場 ${esc(String(levels.stop))}</li>`:""}
        ${levels.target?`<li>目標 ${esc(String(levels.target))}</li>`:""}
        ${levels.note?`<li class="muted">${esc(levels.note)}</li>`:""}
      </ul>
    </div>`;
  }else{
    levelsHtml=`<div class="sym-levels"><div class="feed-mhd">目前策略看法</div><p>${esc(w.label)}：${esc(w.note||"目前沒有策略建議進場")}</p><p class="muted">沒有執行中的策略掛在這檔上。</p></div>`;
  }
  const trades=pack.trades||[];
  let tradesHtml="";
  if(!trades.length){
    tradesHtml=`<div class="muted">尚未有模擬交易</div>`;
  }else{
    tradesHtml=`<div class="sym-trades">${trades.slice().reverse().slice(0,20).map(t=>{
      const kind=t.kind==="模擬"?"模擬":"回測";
      const pnl=t.pnlPct==null?"—":((Number(t.pnlPct)>0?"+":"")+Number(t.pnlPct).toFixed(2)+"%");
      const pnlCls=t.pnlPct==null?"":(Number(t.pnlPct)>=0?"up":"down");
      return `<div class="sym-tr">
        <div class="sym-tr-hd"><span class="chip ${kind==="模擬"?"ok":"mid"}">${esc(kind)}</span><span class="muted">${esc(t.strategyName||"")}</span></div>
        <div class="sym-tr-row">買 ${esc(t.entryDate||"—")} @ ${esc(t.entryPx!=null?fmtPrice(t.entryPx,code):"—")}</div>
        <div class="sym-tr-row">賣 ${esc(t.exitDate||"—")} @ ${esc(t.exitPx!=null?fmtPrice(t.exitPx,code):"—")}</div>
        <div class="sym-tr-row ${pnlCls}">獲利 ${esc(pnl)}${t.note?` · ${esc(t.note)}`:""}</div>
      </div>`;
    }).join("")}</div>`;
  }
  openSheet(`<h3>${esc(name)} <span class="muted">${esc(code)}</span></h3>
    <div class="sym-quote"><span class="sym-px">${esc(fmtPrice(close, code))}</span><span class="sym-chg ${chgCls}">${esc(fmtChg(chg))}</span>
      <span class="chip">${esc(w.wx)} ${esc(w.label)}</span></div>
    <div class="sym-chart-wrap"><canvas id="sym-k" width="360" height="200" aria-label="日K線"></canvas>
      <div class="sym-chart-leg muted"><span class="leg-buy">▲ 買</span> <span class="leg-sell">▼ 賣</span> · 黃＝模擬／藍＝回測 · 近約半年</div>
    </div>
    ${levelsHtml}
    <div class="feed-mkt"><div class="feed-mhd">交易紀錄</div>${tradesHtml}</div>
    <div class="feed-disc">${esc(pack.disclaimer||"模擬結果，非投資建議")}${pack.source?` · 來源 ${esc(String(pack.source).replace(/^cache:/,""))}`:""}${pack.asOf?` · 截至 ${esc(pack.asOf)}`:""}</div>`);
  requestAnimationFrame(()=>drawCandleChart(document.getElementById("sym-k"), pack.candles||[], pack.markers||[]));
}
function drawCandleChart(canvas, candles, markers){
  if(!canvas || !candles.length) return;
  const dpr=Math.min(window.devicePixelRatio||1, 2);
  const cssW=canvas.clientWidth||360;
  const cssH=200;
  canvas.width=Math.floor(cssW*dpr);
  canvas.height=Math.floor(cssH*dpr);
  const ctx=canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const padL=2, padR=2, padT=10, padB=18;
  const W=cssW-padL-padR, H=cssH-padT-padB;
  let lo=Infinity, hi=-Infinity;
  candles.forEach(c=>{ lo=Math.min(lo,c.l); hi=Math.max(hi,c.h); });
  if(!(hi>lo)) { hi=lo+1; }
  const y=v=> padT + (1-(v-lo)/(hi-lo))*H;
  const n=candles.length;
  const slot=W/Math.max(n,1);
  const bodyW=Math.max(1, Math.min(6, slot*0.6));
  ctx.clearRect(0,0,cssW,cssH);
  ctx.fillStyle="#0b121a";
  ctx.fillRect(0,0,cssW,cssH);
  ctx.strokeStyle="#ffffff12";
  ctx.lineWidth=1;
  for(let i=0;i<4;i++){
    const gy=padT + (H*i)/3;
    ctx.beginPath(); ctx.moveTo(padL,gy); ctx.lineTo(padL+W,gy); ctx.stroke();
  }
  candles.forEach((c,i)=>{
    const x=padL + slot*i + slot/2;
    const up=c.c>=c.o;
    ctx.strokeStyle=up?"#3FD8A0":"#ff8a8a";
    ctx.fillStyle=up?"#3FD8A0":"#ff8a8a";
    ctx.beginPath();
    ctx.moveTo(x, y(c.h));
    ctx.lineTo(x, y(c.l));
    ctx.stroke();
    const top=y(Math.max(c.o,c.c)), bot=y(Math.min(c.o,c.c));
    const bh=Math.max(1, bot-top);
    ctx.fillRect(x-bodyW/2, top, bodyW, bh);
  });
  const byT={};
  candles.forEach((c,i)=>{ byT[c.t]=i; });
  (markers||[]).forEach(m=>{
    let i=byT[m.t];
    const planned=!!m.planned || (m.label&&String(m.label).indexOf("預計")>=0) || (m.note==="預計");
    // 預計單若日期超出 K 線，釘在右緣
    if(i==null && planned) i=candles.length-1;
    if(i==null) return;
    const x=padL + slot*i + slot/2 + (planned && byT[m.t]==null ? slot*0.35 : 0);
    const px=m.px!=null?Number(m.px): (candles[i].c);
    const yy=y(px);
    const sim=m.kind==="模擬";
    ctx.fillStyle=planned?"#E8C547":(sim?"#C9A227":"#5ab0ff");
    ctx.beginPath();
    if(m.side==="buy"){
      ctx.moveTo(x, yy-7); ctx.lineTo(x-5, yy); ctx.lineTo(x+5, yy);
    }else{
      ctx.moveTo(x, yy+7); ctx.lineTo(x-5, yy); ctx.lineTo(x+5, yy);
    }
    ctx.closePath(); ctx.fill();
    if(planned){
      ctx.fillStyle="#E8C547";
      ctx.font="9px system-ui,sans-serif";
      ctx.textAlign="center";
      ctx.fillText("預計", x, yy-10);
      ctx.textAlign="left";
    }
  });
  const last=candles[candles.length-1];
  ctx.fillStyle="#9aa8b8";
  ctx.font="10px system-ui,sans-serif";
  ctx.fillText(String(last.t), padL, cssH-4);
  ctx.textAlign="right";
  ctx.fillText(String(last.c), cssW-padR, cssH-4);
  ctx.textAlign="left";
}

function tradeHomeHTML(){
  const p=(D&&D.trade&&D.trade.perf)||{};
  const vs=p.vs0050Sentence||`模擬獲利 ${fmtPct(p.equityReturnPct)}，同期買 0050 ${fmtPct(p.benchmark0050ReturnPct)}`;
  return `<div class="trade-home">
    ${indexStripHTML()}
    ${focusCardsHTML()}
    <div class="card" style="margin-top:10px"><h2>往實盤進度圖</h2>${liveGateHTML()}</div>
    <div class="card" style="margin-top:10px"><h2>模擬績效摘要</h2>
      <div class="vs-bench">${esc(vs)}</div>
      <div class="big">
        <div><b>${fmtPct(p.equityReturnPct)}</b><span>模擬報酬</span></div>
        <div><b>${fmtPct(p.benchmark0050ReturnPct)}</b><span>0050 同期</span></div>
        <div><b>${fmtPct(p.benchmarkBtcReturnPct)}</b><span>BTC 同期</span></div>
        <div><b>${fmtPct(p.dailyChangePct)}</b><span>日變動</span></div>
      </div>
      <div class="feed-disc" style="margin-top:8px">${esc(p.disclaimer||"模擬結果，非投資建議")}</div>
    </div>
  </div>`;
}
function tradeAppBody(){
  if(tradeTab==="watch") return watchHTML();
  if(tradeTab==="strat") return stratCenterHTML();
  if(tradeTab==="book") return bookHTML();
  if(tradeTab==="log") return dailyLogHTML();
  return tradeHomeHTML();
}
function tradeAppHTML(){
  const tabs=TRADE_TABS.map(t=>`<button type="button" class="ttab${tradeTab===t.id?" on":""}" data-trade-tab="${t.id}"><span class="ttab-ic" aria-hidden="true"></span><span>${esc(t.label)}</span></button>`).join("");
  const p=(D&&D.trade&&D.trade.perf)||{};
  const st=p.status||"模擬營運中";
  const cap=((p.capital||{}).availableLabel||(p.capital||{}).label||"");
  const brief="這層做紙上模擬交易（非真錢）。今天重點："+st+(cap?"。"+String(cap).replace(/^可用資金[：:]\s*/, "可用資金 "):"");
  return `<div class="trade-app">
    ${tradeHead()}
    ${floorBriefHTML(brief)}
    <div class="sim-banner">青鋒交易 · 紙上模擬 · 非投資建議</div>
    <div class="trade-body" data-tab="${esc(tradeTab)}">${tradeAppBody()}</div>
    <nav class="trade-tabs" aria-label="交易室分頁">${tabs}</nav>
  </div>`;
}

function renderRoomDash(){
  const el=$("#room-dash"); if(!el||!D) return;
  const id=activeFloor;
  if(id==="trade"){ el.innerHTML=tradeAppHTML(); bindTradeApp(el); return; }
  if(id==="council"){
    const n=decisionsList().length;
    el.innerHTML=`<div class="card"><h2>今日決定</h2>${floorBriefHTML(n?("這層保存完整決定列表；桌上標示也看得到。共 "+n+" 項。"):"今天還沒有已裁決的決定。")}${n?decisionBoardHTML():emptySoon("今天還沒有已裁決的決定","會議結束後會出現在這裡")}</div>`; return;
  }
  if(id==="art"){
    const a=D.art||{}; const n=a.todayCount||0;
    el.innerHTML=`<div class="card"><h2>美術交件</h2>${floorBriefHTML("今天交了 "+n+" 張"+(a.integrated?"，已整合":"，待整合")+"。")}${keyCardsHTML([{v:n,l:"今日"},{v:a.baseCount||0,l:"最新批次"},{v:a.integrated?"已整合":"待整合",l:"狀態"}])}<div class="spark-wrap" style="margin-top:8px">${artTrendSVG(a.trend)}<span class="muted">近 7 日交件量</span></div></div>`; return;
  }
  if(id==="num"){
    const n=D.numbers||{}; const ser=n.series||[];
    el.innerHTML=`<div class="card"><h2>數值模擬</h2>${floorBriefHTML("建議 "+((n.suggestions||[]).length)+" 條 · 已採納 "+(n.adopted||0)+"。")}${ser.length>=2?`<div class="spark-wrap">${sparkSVG(ser,"free")}<span class="muted">免費</span>${sparkSVG(ser,"v10")}<span class="muted">V10</span></div>`:emptySoon("今天尚無模擬資料","數值跑完會出現曲線")}</div>`; return;
  }
  if(id==="qa"){
    const q=D.qa||{}; el.innerHTML=`<div class="card"><h2>品管燈號</h2>${floorBriefHTML("重要 "+((q.important||0)+(q.openImportant||0))+" · 次要 "+((q.minor||0)+(q.openMinor||0))+"。")}${lightHTML(q.light||"green")}<div class="chips" style="margin-top:8px"><span class="chip">重要 ${(q.important||0)+(q.openImportant||0)}</span><span class="chip">次要 ${(q.minor||0)+(q.openMinor||0)}</span></div></div>`; return;
  }
  if(id==="dev"||id==="eng"){
    const v=(D.dev||{}).version||"";
    el.innerHTML=`<div class="card"><h2>${id==="dev"?"開發發版":"工程修復"}</h2>${floorBriefHTML(id==="dev"?("目前版本 "+v+"。"):"修 bug 與介面打磨。")}${pipeHTML((D.dev||{}).pipeline)}</div>`; return;
  }
  if(id==="mz"){
    el.innerHTML=`<div class="card"><h2>夾層 · 公關／財會</h2>${floorBriefHTML("沈沐禾（公關，只起草不上傳）與蒲小棠（財會核對）。排程建立中。")}${keyCardsHTML([{v:"沈沐禾",l:"公關"},{v:"蒲小棠",l:"財會"},{v:"建立中",l:"排程"}])}</div>`; return;
  }
  if(id==="lobby"){
    el.innerHTML=`<div class="card"><h2>遊戲入口</h2>${floorBriefHTML("從這裡進遊戲，也可看待辦與排程。")}<div class="play"><div class="ver">目前版本 <b>${esc(D.game.version)}</b><br>${esc(D.game.subtitle)}</div><a class="btn" target="_blank" rel="noopener" href="${esc(D.game.url)}">進入遊戲</a></div></div>`; return;
  }
  if(id==="director"){
    const n=((D.director||{}).needYou||[]).length;
    el.innerHTML=`<div class="card" id="usage-card-room" style="cursor:pointer"><h2>總裁辦公室</h2>${floorBriefHTML("今天有 "+n+" 件等你決定；用量明細點「看明細」。")}<div class="muted">點右上「看明細」打開完整面板</div></div>`;
    return;
  }
  el.innerHTML="";
}
function renderFloors(){for(const f of FLOORS){const F=floorsEl[f.id],s=floorState(f);const b=F.el.querySelector(".bubble");
  b.querySelector(".dot").className="dot "+s.cat;b.querySelector("b").textContent=s.label;b.querySelector(".t").textContent=noemo(s.text);
  const fv=F.el.querySelector(".fviz"); if(fv) fv.innerHTML=D?floorVizHTML(f.id):"";
  if(f.id==="director"&&D){const a=usageAlert();F.el.classList.toggle("usage-alert",a.level==="red");F.el.classList.toggle("usage-warn",a.level==="yellow");}}
  if(D&&D.game) document.querySelectorAll(".play-link").forEach(a=>{a.href=D.game.url;a.textContent="進入遊戲 "+D.game.version;});
  if(typeof renderDeskSigns==="function") renderDeskSigns();
}
function chipOf(s){
  if(s.chip)return s.chip;
  if(s.who==="council")return"會議";
  if(s.who==="zhiya")return /補跑/.test(s.what||"")?"智雅補跑":"智雅建版";
  return SHORT[s.who]||NAMES[s.who]||"排程";
}
function timelineHTML(){
  const min=nowMin();
  const items=(D.schedule||[]).map(s=>{
    const a=mm(s.from),b=Math.max(mm(s.to),a+1);
    const soft=!!s.soft||/補跑|若尚未|若進度/.test(s.what||"");
    return{...s,a,b,soft,chip:chipOf(s)};
  }).sort((x,y)=>x.a-y.a||x.b-y.b);
  const S=6*60;
  let E=17*60;
  if(items.length) E=Math.max(E, Math.min(21*60, Math.max(...items.map(x=>x.b))+30));
  const span=E-S,pct=m=>((m-S)/span*100).toFixed(2)+"%";
  // 時間重疊或短 slot（min-width）視覺會撞時，分到不同 lane
  const minGap=Math.ceil(span*96/360);
  const laneEnds=[];
  items.forEach(it=>{
    const visEnd=Math.max(it.b,it.a+minGap);
    let lane=0;
    while(lane<laneEnds.length&&laneEnds[lane]>it.a)lane++;
    it.lane=lane;
    laneEnds[lane]=visEnd;
  });
  const nLane=Math.max(1,laneEnds.length);
  const rowH=30,baseTop=36,axisY=baseTop+11;
  const hTl=baseTop+nLane*rowH+22;
  let h=`<div class="tl" style="height:${hTl}px"><div class="axis" style="top:${axisY}px"></div>`;
  items.forEach(s=>{
    const cls=(min>=s.b?"past":(min>=s.a?"cur":""))+(s.soft?" soft":"");
    const top=baseTop+s.lane*rowH;
    const wPct=((s.b-s.a)/span*100);
    h+=`<div class="seg ${s.who} ${cls}" style="left:${pct(s.a)};width:max(${wPct.toFixed(2)}%,96px);top:${top}px;z-index:${3+s.lane}" title="${esc(s.from+"–"+s.to+" "+s.what)}"><span class="tm">${s.from}</span><span class="sg">${esc(s.chip)}</span></div>`;
  });
  if(min>=S&&min<=E)h+=`<div class="now${min>E-120?" r":""}" style="left:${pct(min)}"><span>現在 ${hm(tpNow())}</span></div>`;
  h+="</div>";
  const cur=items.filter(s=>min>=s.a&&min<s.b);
  const liveWork=Object.keys(SHORT).filter(i=>{const st=memberState(i);return st.live&&(st.cat==="work"||st.cat==="meet");});
  const names=[...new Set([...cur.map(s=>s.who==="council"?"全員會議（智雅主持）":(s.soft?s.chip:NAMES[s.who])),...liveWork.map(i=>NAMES[i])])];
  h+=`<div class="working">現在工作中：${names.length?esc(names.join("、")):"沒有排程（大家待命）"}</div>`;
  if(D.scheduleNote) h+=`<div class="muted sched-note" style="margin-top:6px;font-size:11.5px;line-height:1.4">${esc(D.scheduleNote)}</div>`;
  return h;}
function roadmapHTML(){return '<div class="rm">'+D.roadmap.map(r=>`<div class="tr"><div class="hd"><span class="n">${r.n}</span>${esc(r.name)}<span class="st ${r.state}">${{doing:"進行中",todo:"未開始",blocked:"卡住"}[r.state]}</span></div><dl><dt>已完成</dt><dd>${esc(r.done)}</dd><dt>下一步</dt><dd>${esc(r.next)}</dd>${r.needYou?`<dt>${r.state==="blocked"?"卡在":"等你"}</dt><dd class="need">${esc(r.needYou.replace(/^無（(.*)）$/,"$1"))}</dd>`:""}</dl></div>`).join("")+"</div>";}
function progressHTML(){const b=D.backlog;const p=Math.round(b.done/b.total*100);return `<div class="bar"><i style="width:${p}%"></i></div><div class="barlbl"><span>已完成 ${b.done} 項（${p}%）</span><span>還剩 ${b.open} 項</span></div>${tiersHTML()}`;}
function tiersHTML(){const t=(D.backlog||{}).tiers;if(!t)return"";return `<div class="tiers"><span class="chip ok">本週目標 ${t.weekDone}/${t.week}</span><span class="chip mid">排隊中 ${t.queue}</span><span class="chip">長期 ${t.long}</span><span class="chip">已關閉 ${t.closed}</span></div>`;}
function ownerChip(o){return o?`<span class="own ${o==="工程"?"eng":"zy"}">${esc(o)}</span>`:"";}
function weekHTML(filter){const w=(D.backlog.week||[]).filter(x=>!filter||x.owner===filter);if(!w.length)return '<div class="muted">本週沒有指派的項目</div>';
  return `<ol class="wk">${w.map(x=>`<li class="${x.done?"dn":""}">${ownerChip(x.owner)}<b>${esc(x.text)}</b>${x.done?' <span class="chip ok">完成</span>':""}<div class="muted">${esc(x.detail)}</div></li>`).join("")}</ol>`;}
function queueHTML(filter,max){const q=(D.backlog.queue||[]).filter(x=>!filter||x.owner===filter);const sh=q.slice(0,max||99);
  return `<ul class="qu">${sh.map(x=>`<li>${ownerChip(x.owner)}${x.sev?`<span class="sev ${x.sev==="🔴"?"s1":x.sev==="🟠"?"s2":"s3"}"><i></i></span>`:""}${esc(x.text)}</li>`).join("")}</ul>${q.length>sh.length?`<div class="muted">還有 ${q.length-sh.length} 項</div>`:""}`;}
function renderBoard(){
  const a=usageAlert();
  const board=$("#board"); if(!board) return;
  board.hidden = view==="room";
  if(view==="room") return;
  const decN=decisionsList().length;
  const decHint = decN
    ? `<button type="button" class="hint-card" id="hint-decisions"><span class="hint-ico">📋</span><span>今天有 <b>${decN}</b> 項決定 · 點進大樓，會掛在負責人桌上</span><span class="hint-go">看大樓 →</span></button>`
    : `<div class="hint-card muted"><span class="hint-ico">📋</span><span>今天還沒有新決定 · 會議後會掛在桌上</span></div>`;
  const usageHint = a.level
    ? `<button type="button" class="hint-card warn" id="hint-usage"><span class="hint-ico">⚡</span><span>${esc(a.short||"用量需要留意")} · 到 9F 總裁辦公室看</span><span class="hint-go">去 9F →</span></button>`
    : `<button type="button" class="hint-card" id="hint-usage"><span class="hint-ico">⚡</span><span>用量與額度 · 在 9F 總裁辦公室看明細</span><span class="hint-go">去 9F →</span></button>`;
  board.innerHTML=`${decHint}${usageHint}
  <div class="card"><h2>${iconSVG("lobby")}大廳 · 遊戲入口</h2><div class="play"><div class="ver">目前版本 <b>${esc(D.game.version)}</b><br>${esc(D.game.subtitle)}</div><a class="btn" target="_blank" rel="noopener" href="${esc(D.game.url)}">進入遊戲</a></div></div>
  <div class="card"><h2>待辦進度</h2>${progressHTML()}</div>
  <div class="card"><h2>${iconSVG("schedule")}今日排程</h2>${timelineHTML()}</div>
  <div class="card"><h2>${iconSVG("roadmap")}上架路線圖 · 7 條</h2>${roadmapHTML()}</div>`;
  const hd=$("#hint-decisions"); if(hd) hd.onclick=()=>{setView("tower");};
  const hu=$("#hint-usage"); if(hu) hu.onclick=()=>{setView("room","director"); openFloor("director");};
}
function renderFeed(){$("#feed").innerHTML=D.feed.map(e=>`<li><time>${esc(fmtAt(e.at))}<small>${esc(e.at.slice(0,10)===todayStr()?"今天":"")}</small></time><div><span class="k ${esc(e.kind)}">${esc(e.kind)}</span>${esc(noemo(e.text))}</div></li>`).join("");
  const ws=Object.keys(SHORT).map(i=>[i,memberState(i)]).filter(x=>x[1].cat==="work"||x[1].cat==="meet");
  $("#nowline").textContent="台北 "+hm(tpNow())+" · "+(ws.length?ws.map(x=>SHORT[x[0]]+CAT[x[1].cat]).join("、"):"目前沒人在趕工");}
function renderAll(){if(!D)return;const U=D.updatedAt||D.builtAt;const LA=D.lastActivity||"";$("#updated").textContent="更新時間 "+U.slice(5).replace("-","/")+(LA?" · 最後進度 "+LA.slice(5).replace("-","/"):"")+(D.notice?" · "+D.notice:"");$("#foot-upd").textContent="資料更新時間 "+U+"（台北時間）";
  const cap=document.querySelector(".city-caption");
  if(cap){const n=decisionsList().length; cap.textContent=n?(`點大樓進入 · 今天有 ${n} 項決定會掛在負責人桌上 · 遊戲／交易／總裁`):"點大樓進入 · 遊戲事業部 · 交易事業部（模擬）· 總裁辦公室";}
  renderFloors();renderBoard();renderFeed();renderUsageBanner();if(view==="room")renderRoomDash();if(view==="tower")renderBands();}
function tick(){$("#clock").textContent=hm(tpNow());if(D){renderFloors();renderFeed();const tl=document.querySelector("#board .tl");if(tl)tl.parentNode.innerHTML='<h2>'+iconSVG('schedule')+'今日排程</h2>'+timelineHTML();}}

// ---- 細節面板 ----
function openSheet(html){$("#sheetbody").innerHTML=html;$("#sheet").hidden=false;$("#sheetbg").hidden=false;$("#sheet").scrollTop=0;$("#close").focus();}
function closeSheet(){$("#sheet").hidden=true;$("#sheetbg").hidden=true;}
$("#close").onclick=closeSheet;$("#sheetbg").onclick=closeSheet;document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet();});
function sevHTML(c){const L=[["🔴","s1","致命"],["🟠","s2","重要"],["🟡","s3","次要"]];return L.map(([k,cl,n])=>`<span class="sev ${cl}"><i></i>${n} ${typeof c[k]==="object"?c[k].new+" 新 / "+c[k].old+" 舊":c[k]}</span>`).join("");}
function tradeHead(){return `<div class="who trade-who trade-brand"><img class="ava ava-trade" width="56" height="56" alt="AgentX+" src="${avatarURL("trade",true)}"><div class="trade-brand-txt"><div class="trade-wm" aria-label="AgentX+">AgentX+</div><div class="trade-sub">青鋒交易 · 紙上模擬</div></div></div>`;}
function memberBtn(id){return `<div class="mbtn"><button data-m="${id}" class="mbtn-ava"><img class="mava" src="${avatarURL(id)}" alt="" width="28" height="28">看 ${esc(NAMES[id])} 在想什麼</button></div>`;}
function head(f,extra){const s=floorState(f);return `<h3>${iconSVG(f.id)}<span class="no">${f.no}</span> ${f.name}</h3><div class="muted"><span class="dot ${s.cat}"></span> ${esc(s.label)} · ${esc(noemo(s.text))}${extra||""}</div>`;}
function openFloor(id){const f=FLOORS.find(x=>x.id===id);let h=head(f);
  if(id==="director"){const d=D.director; const need=d.needYou||[]; const fb=d.feedback||[];
    h+=floorBriefHTML("這層是偉翔看全局與用量的地方。今天有 "+need.length+" 件等你本人決定或開通。");
    h+=keyCardsHTML([
      {v:need.length,l:"等你決定",note:need.length?"點下面看細節":"目前沒有卡住的事"},
      {v:(D.backlog.tiers?`${D.backlog.tiers.weekDone}/${D.backlog.tiers.week}`:"—"),l:"本週目標",note:"每週一會議挑選"},
      {v:(D.backlog.tiers&&D.backlog.tiers.queue)||0,l:"排隊中",note:"新建議先排這裡"},
    ]);
    h+=`<h4>等你決定／開通</h4>`+(need.length?`<ul class="plain-list">${listTopHTML(need,3,x=>`<li><b>${esc(x.track)}</b>：${esc(x.what)}</li>`)}</ul>`:emptySoon("沒有等你決定的事項","有新需求時會出現在這裡"));
    if(D.backlog.tiers){
      h+=`<h4>本週目標（${D.backlog.tiers.weekDone}/${D.backlog.tiers.week}）</h4>${weekHTML()}`;
      h+=detailFoldHTML("排隊中詳細（"+D.backlog.tiers.queue+" 項）", `<div class="muted">新建議先排在這裡，週一會議再挑進本週。</div>${queueHTML(null,8)}<div class="tiers"><span class="chip">長期／上架前 ${D.backlog.tiers.long}</span><span class="chip">已關閉 ${D.backlog.tiers.closed}</span></div>`);
    }
    h+=`<h4>你的回饋</h4>`+(fb.length?`<ul class="plain-list">${listTopHTML(fb,3,x=>`<li>${x.done?'<span class="chip ok">已處理</span>':'<span class="chip mid">處理中</span>'} ${esc(x.text)} <span class="muted">（${esc(x.from)}）</span></li>`)}</ul>`:emptySoon("還沒有回饋紀錄","試玩後的意見會出現在這裡"));
    h+=detailFoldHTML("用量與額度詳細", usagePanelHTML());
    h+=memberBtn("weixiang");
  }
  if(id==="council"){const c=D.council;if(c){const dec=c.decisions||[]; const ver=c.verdicts||[];
    const adopt=(c.counts&& (c.counts["採納"]||0)+(c.counts["縮小後採納"]||0))||0;
    const reject=(c.counts&&c.counts["不採納"])||0;
    h+=floorBriefHTML("這層開每日決策會。今天採納 "+adopt+" 項、不採納 "+reject+" 項；完整列表在這裡，負責人桌上也有標示。");
    h+=keyCardsHTML([
      {v:dec.length,l:"今日決定",note:dec.length?"已掛到負責人桌":"會議後會出現"},
      {v:adopt,l:"採納",note:"會開始做"},
      {v:reject,l:"不採納",note:"先不做"},
    ]);
    h+=`<h4>${esc(c.title||"今日會議")}</h4><div class="muted">${esc(fmtAt(c.at))} · ${esc(c.attend||"")}</div>`;
    h+=`<h4>今日決定</h4>${decisionBoardHTML()}`;
    if(ver.length){
      h+=`<h4>最新裁決</h4><div class="plain-list">`+listTopHTML(ver,3,v=>{
        const line=plainDecisionSentence(v);
        const why=v.why?`<div class="muted why">${esc(v.why)}</div>`:"";
        return `<div class="vcard"><div class="ditem">${esc(line)}</div>${why}</div>`;
      })+`</div>`;
    }
    h+=detailFoldHTML("會議排行榜／立場／共同意見／grill",
      ((c.shortlist||[]).length?`<h4>會議排行榜</h4><ol>${c.shortlist.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`:"")+
      ((c.stances||[]).length?`<h4>各成員立場</h4><ul>${c.stances.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"")+
      ((c.common||[]).length?`<h4>共同意見</h4><ul>${c.common.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"")+
      ((c.grill||[]).length?`<h4>提案檢視摘要</h4><ul>${c.grill.map(g=>`<li><b>${esc(g.item)}</b>：${esc(g.verdict)} · 依據 ${esc(g.evidence)} · 風險 ${esc(g.risk)}</li>`).join("")}</ul>`:"")
    );
  } else h+=emptySoon("今天還沒有會議紀錄","每日會議後會寫進來");}
  if(id==="dev"){const v=D.dev,t=v.tests;
    const pass=t?`${t.suitesPass}/${t.suites}`:"—";
    h+=floorBriefHTML("這層負責寫程式與發版。目前版本 "+(v.version||"—")+"，測試組通過 "+pass+"。");
    h+=keyCardsHTML([
      {v:v.version||"—",l:"目前版本"},
      {v:pass,l:"測試組通過",note:t&&t.suitesPass===t.suites?"全部過了":"還有沒過的"},
      {v:t?`${t.itemsPass}/${t.items}`:"—",l:"測試項目"},
      {v:D.backlog.open,l:"待辦剩餘"},
    ]);
    h+=`<h4>發布管線</h4>${pipeHTML(v.pipeline)}`;
    h+=`<h4>今天修了什麼</h4>`+((v.changes||[]).length?`<ul class="plain-list">${listTopHTML(v.changes,3,x=>`<li>${esc(x)}</li>`)}</ul>`:emptySoon("今天還沒記變更","發版後會寫進來"));
    h+=detailFoldHTML("版本紀錄", `<table>${(v.releases||[]).map(r=>`<tr><td><b>${esc(r.ver)}</b></td><td class="muted">${esc(fmtAt(r.at))}</td><td>${esc(r.msg)}</td></tr>`).join("")}</table>`);
    h+=`<h4>待辦進度</h4>${progressHTML()}`+memberBtn("zhiya");
  }
  if(id==="trade"){h+=tradeAppHTML();}
  if(id==="art"){const a=D.art;if(a){
    h+=floorBriefHTML("這層做美術交件。今天交了 "+(a.todayCount||0)+" 張"+(a.integrated?"，已整合進遊戲":"，還在等整合")+"。");
    h+=keyCardsHTML([
      {v:a.todayCount||0,l:"今日交件",note:(a.todayCount||0)?"有新圖":"今天還沒交"},
      {v:a.baseCount||a.files||0,l:"最新批次"},
      {v:a.integrated?"已整合":"待整合",l:"整合狀態"},
    ]);
    h+=`<div class="spark-wrap" style="margin-top:10px">${artTrendSVG(a.trend)}<span class="muted">近 7 日交件量</span></div>`;
    h+=`<h4>最新交件：${esc(a.batch||"")} 批次</h4>`;
    const groups=a.groups||[];
    h+=(groups.length?`<ul class="plain-list">${listTopHTML(groups,3,g=>`<li><b>${esc(g.name)}</b>：${esc(g.desc)}</li>`)}</ul>`:emptySoon("還沒有分組說明","下次交件會寫進來"));
    h+=detailFoldHTML("已整合批次", `<div class="chips"><span class="chip">${esc((a.integratedBatches||[]).join("、")||"尚無")}</span></div><div class="muted">交件時間 ${esc(fmtAt(a.at))}</div>`);
    h+=memberBtn("art");
  } else h+=emptySoon("尚無美術交件","有新批次時會出現");}
  if(id==="num"){const n=D.numbers;if(n){const ser=n.series||[]; const st=n.stats||[]; const sug=n.suggestions||[];
    h+=floorBriefHTML("這層跑數值模擬與建議。建議 "+sug.length+" 條，已採納 "+(n.adopted||0)+"、未採納 "+(n.declined||0)+"。");
    h+=keyCardsHTML([
      {v:sug.length,l:"建議"},
      {v:n.adopted||0,l:"已採納",note:"會進遊戲"},
      {v:n.declined||0,l:"未採納"},
    ]);
    h+=`<h4>模擬曲線（${esc(n.date||"")}）</h4>${ser.length>=2?`<div class="spark-wrap">${sparkSVG(ser,"free")}<span class="muted">免費戰力</span>${sparkSVG(ser,"v10")}<span class="muted">V10 戰力</span></div>`:(st.length?"":emptySoon("今天尚無模擬資料","數值跑完會出現曲線"))}`;
    if(st.length) h+=`<div class="chips" style="margin-top:8px">${st.map(s=>`<span class="chip">${esc(s.label)} <b>${esc(s.value)}</b></span>`).join("")}</div>`;
    const hl=n.highlights||[];
    h+=`<h4>報告重點</h4>`+(hl.length?`<ul class="plain-list">${listTopHTML(hl,3,x=>`<li>${esc(x)}</li>`)}</ul>`:emptySoon("尚無報告重點","報告寫完會出現"));
    h+=`<h4>建議與採納</h4>`+(sug.length?`<div class="plain-list">${listTopHTML(sug,3,s=>`<div class="vcard"><b>${esc(s.title||s.id)}</b> <span class="chip ${s.state==="已採納"?"ok":s.state==="未採納"?"no":"mid"}">${esc(s.state)}</span>${detailFoldHTML("詳細代號", `<code class="id-muted">${esc(s.id||"")}</code>`)}</div>`)}</div>`:emptySoon("尚無建議","數值提出後會列在這裡"));
    h+=memberBtn("num");
  } else h+=emptySoon("尚無數值報告","每日模擬後會出現");}
  if(id==="qa"){const q=D.qa,b=D.backlog;
    const imp=(q?((q.important||0)+(q.openImportant||0)):0);
    const min=(q?((q.minor||0)+(q.openMinor||0)):0);
    h+=floorBriefHTML("這層盯品質燈號。重要 "+imp+"、次要 "+min+(q&&q.fatal?("、致命新 "+q.fatal):"")+"。");
    h+=keyCardsHTML([
      {v:imp,l:"重要",note:imp?"要先修":"沒有重要未修"},
      {v:min,l:"次要"},
      {v:q&&q.fatal||0,l:"致命新",note:(q&&q.fatal)?"立刻看":"沒有"},
    ]);
    h+=`<h4>今日燈號</h4>${q?lightHTML(q.light):emptySoon("尚無 QA 報告","巡檢後會亮燈")}`;
    h+=`<h4>待辦中未修的回報</h4><div>${sevHTML(b.qaOpen)}</div>`;
    const openItems=b.qaOpenItems||[];
    h+=(openItems.length?`<ul class="plain-list">${listTopHTML(openItems,3,x=>`<li><span class="sev ${x.sev==="🔴"?"s1":x.sev==="🟠"?"s2":"s3"}"><i></i></span>${esc(x.text)}</li>`)}</ul>`:emptySoon("沒有未修回報","有新 bug 會列在這裡"));
    if(q){
      h+=detailFoldHTML((q.title||"今日報告")+" 詳細", `<div class="muted">${esc(fmtAt(q.at))} · ${esc(noemo(q.tests||""))}</div><div style="margin-top:6px">${sevHTML(q.counts)}</div><ul>${(q.items||[]).map(x=>`<li><span class="sev ${x.sev==="🔴"?"s1":x.sev==="🟠"?"s2":"s3"}"><i></i><span class="id-muted">${esc(x.id)}</span></span>${esc(x.text)}</li>`).join("")}</ul>`);
    }
    h+=memberBtn("qa");
  }
  if(id==="eng"){const t=D.backlog.tiers||{};
    const weekN=(D.backlog.week||[]).filter(x=>x.owner==="工程"&&!x.done).length;
    const qN=(t.queueBy||{})["工程"]||0;
    const openQa=Object.values(D.backlog.qaOpen||{}).reduce((a,b)=>a+b,0);
    h+=floorBriefHTML("這層修 bug 與介面打磨。本週負責 "+weekN+" 項，排隊 "+qN+" 項，未修回報 "+openQa+"。");
    h+=keyCardsHTML([
      {v:weekN,l:"本週負責",note:weekN?"進行中":"本週沒事"},
      {v:qN,l:"排隊中"},
      {v:openQa,l:"未修回報",note:openQa?"先清這些":"已清完"},
    ]);
    h+=`<h4>發布管線</h4>${pipeHTML((D.dev||{}).pipeline)}`;
    h+=`<h4>本週負責</h4>${weekHTML("工程")}`;
    h+=detailFoldHTML("排隊中（工程）與工作方式", `${queueHTML("工程")}<h4>工作方式</h4><ul class="plain-list"><li>每天約 15:00–16:30 修 QA 回報、介面打磨，發布修補版熱修</li><li>在自己的修復分支工作，時段內才併回主線；動手前先登記「誰、何時、做什麼」，做完解除</li><li>每個修正都附回歸測試，存檔保持相容</li></ul>`);
    h+=memberBtn("eng");
  }
  if(id==="mz"){
    h+=floorBriefHTML("這層是夾層・公關／財會。左邊沈沐禾負責遊戲公關（商店上架、IG／脆小編，只起草不上傳）；右邊蒲小棠負責財會（用量與花費、模擬帳核對）。排程建立中。");
    h+=keyCardsHTML([
      {v:"沈沐禾",l:"青鋒公關",note:"只起草，不上傳"},
      {v:"蒲小棠",l:"青鋒財會",note:"用量／模擬帳"},
      {v:"建立中",l:"今日排程",note:"時間稍後補上"},
    ]);
    h+=`<h4>兩位同事</h4><div class="plain-list">
      <div class="vcard"><b>沈沐禾 · 青鋒公關</b><div class="muted">遊戲公關：商店上架文案、IG／脆貼文——只起草，不上傳；等你拍板。</div>${memberBtn("pr")}</div>
      <div class="vcard"><b>蒲小棠 · 青鋒財會</b><div class="muted">財會：核對用量與花費、對齊模擬帳；有異常會標在桌上。</div>${memberBtn("fin")}</div>
    </div>`;
    h+=`<h4>今日排程</h4><div class="muted">排程建立中——例行時間確定後會寫進來。</div>`;
  }
  if(id==="lobby"){
    const b=D.backlog||{}; const p=b.total?Math.round(b.done/b.total*100):0;
    h+=floorBriefHTML("這層是遊戲入口與進度總覽。目前版本 "+((D.game&&D.game.version)||"—")+"，待辦完成 "+p+"%。");
    h+=keyCardsHTML([
      {v:(D.game&&D.game.version)||"—",l:"遊戲版本"},
      {v:p+"%",l:"待辦完成",note:`還剩 ${b.open||0} 項`},
      {v:(D.schedule||[]).length,l:"今日排程段"},
    ]);
    h+=`<div class="play" style="margin-top:10px"><div class="ver">目前版本 <b>${esc(D.game.version)}</b><br>${esc(D.game.subtitle)}</div><a class="btn" target="_blank" rel="noopener" href="${esc(D.game.url)}">進入遊戲</a></div>`;
    h+=`<h4>待辦進度</h4>${progressHTML()}`;
    h+=`<h4>今日排程</h4>${timelineHTML()}`;
    h+=detailFoldHTML("上架路線圖（7 條）", roadmapHTML());
  }
  openSheet(h);document.querySelectorAll("#sheetbody [data-m]").forEach(b=>b.onclick=()=>openMember(b.dataset.m));bindUsageDetails($("#sheetbody"));bindStrategyFilters($("#sheetbody"));bindTradeApp($("#sheetbody"));
}
function openMember(id){const s=memberState(id),c=D.cards[id]||{},m=(D.office&&D.office.members[id])||{role:ROLES[id]};
  const desk=((typeof decisionsByFloor==="function"?decisionsByFloor():{})[SPOT[id]?SPOT[id].f:""]||[]).filter(x=>(x.mids||[]).includes(id));
  const deskHint=desk.length?`<div class="floor-brief" style="margin-top:10px">桌上決定：${esc(plainDecisionSentence(desk[0].d))}${desk.length>1?`（還有 ${desk.length-1} 項）`:""}</div>`:"";
  openSheet(`<div class="who"><img id="ava" class="ava" width="96" height="96" alt="${esc(NAMES[id])}" src="${avatarURL(id,true)}" data-id="${id}"><div><div class="nm">${esc(NAMES[id])}</div><div class="rl">${esc(m.role||"")}</div><div class="stl"><span class="dot ${s.cat}"></span>${CAT[s.cat]} · <span class="muted">${s.live?esc(agoText(s.updatedAt)):"依每日排程"}</span></div></div></div>
  <div class="thought">${esc(thoughtOf(id))}</div>
  ${deskHint}
  <div class="rows"><div class="r"><b>正在忙</b>${esc(noemo(s.full||s.text))}</div><div class="r"><b>剛完成</b>${esc(noemo(c.recent)||"—")}</div><div class="r"><b>下一步</b>${esc(noemo(nextStep(id))||"目前沒寫下一步，有排程時會出現")}</div></div>
  <div class="mbtn"><button id="poke">打招呼</button><button id="tofloor">看這層樓</button></div>`);
  const ava=$("#ava");
  $("#poke").onclick=()=>{ava.classList.remove("hop");void ava.offsetWidth;ava.classList.add("hop");react(id);};
  $("#tofloor").onclick=()=>{setView("room",SPOT[id].f);openFloor(SPOT[id].f);};}

// ---- 資料 ----

// ---- 開發歷程（永久紀錄；月檔用到才載入） ----
let HI=null, HM={}, histTab=false;
const WD="日一二三四五六";
async function hjson(u){const r=await fetch(u+"?t="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error(r.status);return r.json();}
function ensureMonth(m){if(!HM[m])HM[m]=hjson("history/"+m+".json").then(j=>{const hid=new Set(HI&&HI.hidden||[]),by={};(j.events||[]).forEach(e=>{if(hid.has(e.id))return;(by[e.at.slice(0,10)]=by[e.at.slice(0,10)]||[]).push(e);});return by;}).catch(e=>{delete HM[m];throw e;});return HM[m];}
function fillDay(det){const d=det.dataset.d,ol=det.querySelector("ol");ensureMonth(d.slice(0,7)).then(by=>{const L=(by[d]||[]).slice().sort((a,b)=>a.at<b.at?1:-1);
  ol.innerHTML=L.map(e=>`<li><time>${esc(e.at.slice(11,16))}</time><div><span class="k ${esc(e.kind)}">${esc(e.kind)}</span>${esc(noemo(e.text))}</div></li>`).join("")||'<li class="muted">這天沒有紀錄</li>';}).catch(()=>{ol.innerHTML='<li class="muted">暫時讀不到，稍後再點一次</li>';});}
function renderHist(){const el=$("#hist");if(!HI){el.innerHTML='<p class="hmeta">載入中…</p>';return;}
  const open=new Set([...el.querySelectorAll("details[open]")].map(x=>x.dataset.d));if(!el.querySelector("details")&&HI.days[0])open.add(HI.days[0].d);
  el.innerHTML=`<p class="hmeta">從 ${esc(HI.start)} 開工至今 · ${HI.days.length} 天 · 共 ${HI.total} 則（只增不刪）· 點日期展開</p>`+HI.days.map(x=>{const t=parseTP(x.d+" 12:00"),w=isNaN(t)?"":"週"+WD[new Date(t+8*3600e3).getUTCDay()];
    return `<details data-d="${esc(x.d)}"${open.has(x.d)?" open":""}><summary><div class="dh"><b>${esc(x.d.slice(5).replace("-","/"))}</b><span class="wd">${w}${x.d===todayStr()?" · 今天":""}</span><span class="n">${x.n} 則</span></div><div class="sum">${esc(x.sum||"")}</div></summary><ol class="feed"><li class="muted">載入中…</li></ol></details>`;}).join("");
  el.querySelectorAll("details").forEach(det=>{if(det.open)fillDay(det);det.addEventListener("toggle",()=>{if(det.open)fillDay(det);});});}
async function loadHist(){try{const j=await hjson("history/index.json");const changed=!HI||j.total!==HI.total||JSON.stringify(j.days[0])!==JSON.stringify(HI.days[0]);if(changed){if(HI&&j.months[0])delete HM[j.months[0].m];HI=j;renderHist();}}catch(e){if(!HI)$("#hist").innerHTML='<p class="hmeta">歷程暫時讀不到，稍後重試</p>';}}
function showTab(t){histTab=t==="hist";document.querySelectorAll(".tab").forEach(b=>{const on=b.dataset.tab===t;b.classList.toggle("on",on);b.setAttribute("aria-selected",on);});
  $("#feed").hidden=histTab;$("#nowline").hidden=histTab;$("#hist").hidden=!histTab;if(histTab){renderHist();loadHist();}}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{showTab(b.dataset.tab);history.replaceState(null,"",b.dataset.tab==="hist"?"#history":location.pathname+location.search);}));
if(location.hash==="#history")showTab("hist");
async function load(){try{const r=await fetch("data.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)return;D=await r.json();renderAll();if(histTab)loadHist();}catch(e){console.warn("資料暫時讀不到，稍後重試");}}
buildTower();tick();load().then(()=>requestAnimationFrame(loop));
setInterval(load,60000);setInterval(tick,30000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)load();});
})();
