"use strict";
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const noemo=s=>String(s||"").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}\uFE0F]/gu,"").trim();
const FLOORS=[
 {id:"director",no:"RF",name:"總監室",who:"偉翔 創辦人／總監",icon:"ic_director",room:"room_director",member:"weixiang"},
 {id:"council",no:"7F",name:"會議室",who:"每日 09:47 Top-5 會議（DRI／新點子實驗；10:45 建版）",icon:"ic_council",room:"room_council"},
 {id:"dev",no:"6F",name:"開發部",who:"智雅 主程式／整合",icon:"ic_dev",room:"room_dev",member:"zhiya"},
 {id:"art",no:"5F",name:"美術部",who:"青鋒美術",icon:"ic_art",room:"room_art",member:"art"},
 {id:"num",no:"4F",name:"數值部",who:"青鋒數值",icon:"ic_num",room:"room_num",member:"num"},
 {id:"qa",no:"3F",name:"品管部",who:"青鋒監管",icon:"ic_qa",room:"room_qa",member:"qa"},
 {id:"eng",no:"2F",name:"工程部",who:"青鋒工程 修復／介面打磨",icon:"ic_eng",room:"room_eng",member:"eng"},
 {id:"lobby",no:"1F",name:"一樓大廳",who:"遊戲入口 · 進度 · 路線圖",icon:"ic_lobby",room:"room_lobby"}];
// 座位（以樓層圖寬高比例）：view back=背對（面向電腦）
const SPOT={weixiang:{f:"director",x:.27,y:.80,floor:.88},zhiya:{f:"dev",x:.52,y:.76,floor:.80},art:{f:"art",x:.33,y:.73,floor:.82},num:{f:"num",x:.43,y:.79,floor:.84},qa:{f:"qa",x:.58,y:.81,floor:.86},eng:{f:"eng",x:.48,y:.76,floor:.86}};
const SEAT={weixiang:.29,zhiya:.37,art:.45,num:.53,qa:.61,eng:.69}; const TABLE_TOP=.535;
const NAMES={weixiang:"偉翔",zhiya:"智雅",art:"青鋒美術",num:"青鋒數值",qa:"青鋒監管",eng:"青鋒工程",council:"全員會議"};
const SHORT={weixiang:"偉翔",zhiya:"智雅",art:"美術",num:"數值",qa:"監管",eng:"工程"};
const LOOKS={eng:{hair:"#1c2326",skin:"#f0c9a2",outfit:"#2a7d86",trim:"#e2b65c",pants:"#25343a",style:"knot"}};
const ROLES={eng:"工程師（修復／QA／介面）"};
const DEFLOOK={hair:"#222",skin:"#f2c9a0",outfit:"#456",trim:"#d6a63a",pants:"#333",style:"knot"};
const CAT={work:"工作中",meet:"開會中",done:"完成",wait:"待命",you:"等你"};
const LIVEMAP={"工作中":"work","開會中":"meet","完成":"done","待命":"wait","等你":"you"};
let D=null, floorsEl={}, chars={}, thinking=null;

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
  {const mt=meetingNow();if(mt&&meeters().includes(id))return{cat:"meet",text:id==="zhiya"?"主持全員會議":"全員會議中",full:"全員會議：智雅主持，美術、數值、監管、工程帶提案，ChatGPT、Claude、Gemini 一起辯論"+(D.weixiangJoins?"；偉翔今天也給了意見":"")+"。",where:"meeting",live:true,since:mt.since};}
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
  if(id==="weixiang"){const n=(D.director&&D.director.needYou||[]).length;if(n&&cat!=="work")cat="you";text="試玩 "+D.game.version+"，"+n+" 件等你決定";full="新版 "+D.game.version+" 已上線，等你試玩回饋手感；上架路線圖有 "+n+" 件需要你本人決定或開通（細節在總監室）。";}
  let since=NaN; if(r.where==="meeting"){const d=tpNow();since=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),0,0)-8*3600e3+mm(o.meeting.from)*60000;}
  return{cat,text,full,where:r.where,live:false,since};
}
function floorState(f){
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
  const o=D.office,m=o&&o.members[id],min=nowMin();
  if(m){if(m.joinsMeeting&&min<mm(o.meeting.from))return o.meeting.from+" 開會："+(o.meeting.status.short||"");
    for(const s of m.slots)if(min<mm(s.from))return s.from+" "+(s.during.short||"");}
  if(!m){const sc=(D.schedule||[]).find(x=>x.who===id&&min<mm(x.from));if(sc)return sc.from+" "+sc.what;}
  return (D.cards[id]||{}).next||"";
}

// ---- 建樓 ----
function buildTower(){
  const t=$("#tower");t.innerHTML="";
  for(const f of FLOORS){
    const el=document.createElement("div");el.className="floor";el.tabIndex=0;el.setAttribute("role","button");el.setAttribute("aria-label",f.no+" "+f.name+"，打開細節");
    el.innerHTML=`<div class="room" style="background-image:url(assets/${f.room}.webp)"><canvas></canvas><div class="hits"></div>
      <div class="plate"><span class="no">${f.no}</span><img src="assets/${f.icon}.webp" alt="" width="30" height="30"><span><span class="nm">${f.name}</span><span class="who">${esc(f.who)}</span></span></div>
      <div class="bubble"><span class="dot"></span><b></b><span class="t"></span></div>
      ${f.id==="lobby"?'<div class="lobby-sign"><a class="btn play-link" target="_blank" rel="noopener" href="#">進入遊戲</a></div>':""}</div>`;
    el.addEventListener("click",e=>{if(e.target.closest(".hit,.btn"))return;openFloor(f.id);});
    el.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target===el)openFloor(f.id);});
    t.appendChild(el);
    floorsEl[f.id]={el,cv:el.querySelector("canvas"),hits:el.querySelector(".hits"),room:el.querySelector(".room"),f,visible:true};
  }
  const io=new IntersectionObserver(es=>{for(const e of es){for(const k in floorsEl)if(floorsEl[k].room===e.target)floorsEl[k].visible=e.isIntersecting;}},{rootMargin:"80px"});
  for(const k in floorsEl)io.observe(floorsEl[k].room);
  for(const id of Object.keys(SPOT)){
    const b=document.createElement("button");b.className="hit";b.setAttribute("aria-label",NAMES[id]+"：看他在做什麼");b.innerHTML=`<span class="tag">${SHORT[id]}</span>`;
    b.addEventListener("click",e=>{e.stopPropagation();react(id);openMember(id);});
    chars[id]={id,btn:b,x:SPOT[id].x,y:SPOT[id].y,floor:SPOT[id].f,pose:"type",view:"back",bounce:0,wave:0,stroll:null,lastStroll:performance.now()+Math.random()*8000};
  }
  resize();
}
function resize(){const dpr=Math.min(window.devicePixelRatio||1,2.5);for(const k in floorsEl){const c=floorsEl[k].cv,r=floorsEl[k].room;c.width=Math.round(r.clientWidth*dpr);c.height=Math.round(r.clientHeight*dpr);}}
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
  if(s.cat==="work"){c.x=sp.x;c.y=sp.y;c.pose="type";c.view="back";c.stroll=null;return;}
  // 閒置：偶爾散步
  if(!c.stroll&&now-c.lastStroll>9000+Math.random()*9000){const tx=.15+Math.random()*.7;c.stroll={t0:now,from:sp.x,to:tx,dur:Math.abs(tx-sp.x)*9000+600};}
  if(c.stroll){const e=(now-c.stroll.t0);const tot=c.stroll.dur*2+2500;
    if(e>tot){c.stroll=null;c.lastStroll=now;}
    else{let x;if(e<c.stroll.dur)x=c.stroll.from+(c.stroll.to-c.stroll.from)*e/c.stroll.dur;else if(e<c.stroll.dur+2500)x=c.stroll.to;else x=c.stroll.to+(c.stroll.from-c.stroll.to)*(e-c.stroll.dur-2500)/c.stroll.dur;
      c.x=x;c.y=sp.floor;c.pose=(e<c.stroll.dur||e>c.stroll.dur+2500)?"walk":"stand";c.view="front";return;}}
  c.x=sp.x;c.y=s.cat==="you"?sp.floor:sp.y;c.pose=s.cat==="you"?"stand":"sit";c.view=s.cat==="you"?"front":"back";
}
function lookOf(id){return(D&&D.office&&D.office.members[id]&&D.office.members[id].look)||LOOKS[id]||DEFLOOK;}
function drawWave(ctx,look,x,y,u,frame){ // 舉手揮動
  const up=frame%2;ctx.fillStyle="#140d0a";ctx.fillRect(x+4*u-2,y-15*u-up*u-2,1.75*u+4,4*u+4);ctx.fillStyle=look.outfit;ctx.fillRect(x+4*u,y-14*u-up*u,1.75*u,3*u);ctx.fillStyle=look.skin;ctx.fillRect(x+4*u,y-15*u-up*u,1.75*u,1*u);}
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
      ctx.save();if(c.clip){ctx.beginPath();ctx.rect(0,0,cv.width,c.clip*cv.height);ctx.clip();}
      if(c.x<1.02&&c.x>-.02){ctx.fillStyle="rgba(0,0,0,.35)";if(!c.clip){ctx.beginPath();ctx.ellipse(x,y+u*.3,5*u,1.4*u,0,0,7);ctx.fill();}
        oChibi(ctx,lookOf(c.id),x,y+b,u,c.view,c.pose,c.pose==="walk"?Math.floor(now/180):frame);
        if(c.wave>now&&c.view==="front")drawWave(ctx,lookOf(c.id),x-6*u,y+b,u,Math.floor(now/160));}
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
  (root||document).querySelectorAll(".ud-tog").forEach(btn=>{
    if(btn._ud) return; btn._ud=1;
    btn.onclick=e=>{
      e.stopPropagation();
      const id=btn.getAttribute("data-ud");
      const box=id&&document.getElementById(id);
      if(!box) return;
      const on=box.hasAttribute("hidden");
      if(on) box.removeAttribute("hidden"); else box.setAttribute("hidden","");
      btn.textContent=on?"收合明細":"看明細";
    };
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
function renderFloors(){for(const f of FLOORS){const F=floorsEl[f.id],s=floorState(f);const b=F.el.querySelector(".bubble");
  b.querySelector(".dot").className="dot "+s.cat;b.querySelector("b").textContent=s.label;b.querySelector(".t").textContent=noemo(s.text);
  if(f.id==="director"){const a=usageAlert();F.el.classList.toggle("usage-alert",a.level==="red");F.el.classList.toggle("usage-warn",a.level==="yellow");}}
  document.querySelectorAll(".play-link").forEach(a=>{a.href=D.game.url;a.textContent="進入遊戲 "+D.game.version;});}
function chipOf(s){
  if(s.chip)return s.chip;
  if(s.who==="council")return"會議";
  if(s.who==="zhiya")return /補跑/.test(s.what||"")?"智雅補跑":"智雅建版";
  return SHORT[s.who]||NAMES[s.who]||"排程";
}
function timelineHTML(){
  const S=6*60,E=17*60,span=E-S,pct=m=>((m-S)/span*100).toFixed(2)+"%";
  const min=nowMin();
  const items=(D.schedule||[]).map(s=>{
    const a=mm(s.from),b=Math.max(mm(s.to),a+1);
    const soft=!!s.soft||/補跑|若尚未|若進度/.test(s.what||"");
    return{...s,a,b,soft,chip:chipOf(s)};
  }).sort((x,y)=>x.a-y.a||x.b-y.b);
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
  const a=usageAlert(); const tod=usageToday(); const c=tod&&tod.real&&tod.real.council||{};
  const ub=a.level?`<span class="chip ${a.level==="red"?"no":"mid"}">${esc(a.short)}</span>`:`<span class="chip ok">例行正常</span>`;
  $("#board").innerHTML=`<div class="card"><h2><img src="assets/ic_lobby.webp" alt="">一樓大廳 · 遊戲入口</h2><div class="play"><div class="ver">目前版本 <b>${esc(D.game.version)}</b><br>${esc(D.game.subtitle)}</div><a class="btn" target="_blank" rel="noopener" href="${esc(D.game.url)}">進入遊戲</a></div></div>
  <div class="card" id="usage-card" style="cursor:pointer"><h2><img src="assets/ic_director.webp" alt="">總監室用量 · 每日估算</h2>
    <div class="chips">${ub}<span class="chip">會議呼叫 ${c.calls||0}<span class="tag-real">實</span></span><span class="chip">輸入 ${fmtN(c.inputTokens||0)}</span><span class="chip">美術圖 ${(tod&&tod.est&&tod.est.artImages)||0}<span class="tag-est">估</span></span></div>
    <div class="muted" style="margin-top:6px">點此或頂樓總監室看 7 天明細 · 非帳單餘額</div></div>
  <div class="card"><h2>待辦進度</h2>${progressHTML()}</div>
  <div class="card"><h2><img src="assets/ic_schedule.webp" alt="">今日排程</h2>${timelineHTML()}</div>
  <div class="card"><h2><img src="assets/ic_roadmap.webp" alt="">上架路線圖 · 7 條</h2>${roadmapHTML()}</div>`;
  const uc=$("#usage-card"); if(uc) uc.onclick=()=>openFloor("director");
}
function renderFeed(){$("#feed").innerHTML=D.feed.map(e=>`<li><time>${esc(fmtAt(e.at))}<small>${esc(e.at.slice(0,10)===todayStr()?"今天":"")}</small></time><div><span class="k ${esc(e.kind)}">${esc(e.kind)}</span>${esc(noemo(e.text))}</div></li>`).join("");
  const ws=Object.keys(SHORT).map(i=>[i,memberState(i)]).filter(x=>x[1].cat==="work"||x[1].cat==="meet");
  $("#nowline").textContent="台北 "+hm(tpNow())+" · "+(ws.length?ws.map(x=>SHORT[x[0]]+CAT[x[1].cat]).join("、"):"目前沒人在趕工");}
function renderAll(){if(!D)return;const U=D.updatedAt||D.builtAt;const LA=D.lastActivity||"";$("#updated").textContent="更新時間 "+U.slice(5).replace("-","/")+(LA?" · 最後進度 "+LA.slice(5).replace("-","/"):"")+(D.notice?" · "+D.notice:"");$("#foot-upd").textContent="資料更新時間 "+U+"（台北時間）";renderFloors();renderBoard();renderFeed();renderUsageBanner();}
function tick(){$("#clock").textContent=hm(tpNow());if(D){renderFloors();renderFeed();const tl=document.querySelector("#board .tl");if(tl)tl.parentNode.innerHTML='<h2><img src="assets/ic_schedule.webp" alt="">今日排程</h2>'+timelineHTML();}}

// ---- 細節面板 ----
function openSheet(html){$("#sheetbody").innerHTML=html;$("#sheet").hidden=false;$("#sheetbg").hidden=false;$("#sheet").scrollTop=0;$("#close").focus();}
function closeSheet(){$("#sheet").hidden=true;$("#sheetbg").hidden=true;}
$("#close").onclick=closeSheet;$("#sheetbg").onclick=closeSheet;document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet();});
function sevHTML(c){const L=[["🔴","s1","致命"],["🟠","s2","重要"],["🟡","s3","次要"]];return L.map(([k,cl,n])=>`<span class="sev ${cl}"><i></i>${n} ${typeof c[k]==="object"?c[k].new+" 新 / "+c[k].old+" 舊":c[k]}</span>`).join("");}
function memberBtn(id){return `<div class="mbtn"><button data-m="${id}">看 ${esc(NAMES[id])} 在想什麼</button></div>`;}
function head(f,extra){const s=floorState(f);return `<h3><img src="assets/${f.icon}.webp" alt="">${f.no} ${f.name}</h3><div class="muted"><span class="dot ${s.cat}"></span> ${esc(s.label)} · ${esc(noemo(s.text))}${extra||""}</div>`;}
function openFloor(id){const f=FLOORS.find(x=>x.id===id);let h=head(f);
  if(id==="director"){const d=D.director;h+=`<h4>等你決定／開通（${d.needYou.length}）</h4><ul>${d.needYou.map(x=>`<li><b>${esc(x.track)}</b>：${esc(x.what)}</li>`).join("")}</ul>
    ${D.backlog.tiers?`<h4>本週目標（${D.backlog.tiers.weekDone}/${D.backlog.tiers.week}，每週一會議挑選）</h4>${weekHTML()}
    <h4>排隊中（${D.backlog.tiers.queue} 項：工程 ${D.backlog.tiers.queueBy["工程"]}、智雅 ${D.backlog.tiers.queueBy["智雅"]}）</h4><div class="muted">新建議先排在這裡，週一會議再挑進本週。</div>${queueHTML(null,8)}
    <div class="tiers"><span class="chip">長期／上架前 ${D.backlog.tiers.long}</span><span class="chip">已關閉 ${D.backlog.tiers.closed}（重複或過時，附原因）</span></div>`:""}
    <h4>你的回饋處理狀況</h4><ul>${d.feedback.map(x=>`<li>${x.done?'<span class="chip ok">已處理</span>':'<span class="chip mid">處理中</span>'} ${esc(x.text)} <span class="muted">（${esc(x.from)}）</span></li>`).join("")}</ul>`+`<h4>用量與額度警示</h4>`+usagePanelHTML()+memberBtn("weixiang"); bindUsageDetails();}
  if(id==="council"){const c=D.council;if(c){h+=`<h4>${esc(c.title)}</h4><div class="muted">${esc(fmtAt(c.at))} · ${esc(c.attend)}</div><div class="chips" style="margin-top:8px">${Object.entries(c.counts).map(([k,v])=>`<span class="chip ${k==="採納"||k==="縮小後採納"?"ok":k==="不採納"?"no":"mid"}">${esc(k)} ${v}</span>`).join("")}</div>
    <h4>最新裁決</h4><table><tr><th>提案</th><th>結論</th><th>理由</th></tr>${c.verdicts.map(v=>`<tr><td>${esc(v.item)}</td><td>${esc(v.verdict)}</td><td>${esc(v.why)}</td></tr>`).join("")}</table>
    ${(c.shortlist||[]).length?`<h4>會議排行榜（第二輪投票）</h4><ol>${c.shortlist.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`:""}
    ${(c.stances||[]).length?`<h4>各成員立場</h4><ul>${c.stances.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
    ${c.common.length?`<h4>共同意見</h4><ul>${c.common.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
    ${c.grill.length?`<h4>提案檢視（grill）摘要</h4><table><tr><th>提案</th><th>有依據</th><th>付費牆風險</th><th>結論</th></tr>${c.grill.map(g=>`<tr><td>${esc(g.item)}</td><td>${esc(g.evidence)}</td><td>${esc(g.risk)}</td><td>${esc(g.verdict)}</td></tr>`).join("")}</table>`:""}`;}}
  if(id==="dev"){const v=D.dev,t=v.tests;h+=`<div class="big" style="margin-top:10px"><div><b>${esc(v.version)}</b><span>目前版本</span></div><div><b>${t?t.suitesPass+"/"+t.suites:"-"}</b><span>測試組通過</span></div><div><b>${t?t.itemsPass+"/"+t.items:"-"}</b><span>測試項目通過</span></div><div><b>${D.backlog.open}</b><span>待辦剩餘</span></div></div>
    <h4>今天修了什麼（${esc(v.version)}）</h4><ul>${v.changes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    <h4>版本紀錄</h4><table>${v.releases.map(r=>`<tr><td><b>${esc(r.ver)}</b></td><td class="muted">${esc(fmtAt(r.at))}</td><td>${esc(r.msg)}</td></tr>`).join("")}</table>
    <h4>待辦進度</h4>${progressHTML()}`+memberBtn("zhiya");}
  if(id==="art"){const a=D.art;if(a){h+=`<h4>最新交件：${esc(a.batch)} 批次</h4><div class="chips"><span class="chip ${a.integrated?"ok":"mid"}">${a.integrated?"已整合":"待整合"}</span><span class="chip">${a.files} 張圖</span><span class="chip">交件 ${esc(fmtAt(a.at))}</span><span class="chip">已整合批次 ${esc(a.integratedBatches.join("、"))}</span></div>
    <h4>內容</h4><ul>${a.groups.map(g=>`<li><b>${esc(g.name)}</b>：${esc(g.desc)}</li>`).join("")}</ul>
    <h4>縮圖</h4><div class="thumbs">${a.thumbs.map(t=>`<figure><img loading="lazy" src="${esc(t.src)}" alt="${esc(t.label)}"><figcaption>${esc(t.label)}</figcaption></figure>`).join("")}</div>`+memberBtn("art");}}
  if(id==="num"){const n=D.numbers;if(n){h+=`<div class="big" style="margin-top:10px"><div><b>${n.suggestions.length}</b><span>建議</span></div><div><b>${n.adopted}</b><span>已採納</span></div><div><b>${n.declined}</b><span>未採納</span></div></div>
    <h4>報告 ${esc(n.date)} 重點</h4><ul>${n.highlights.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    <h4>建議與採納</h4><table>${n.suggestions.map(s=>`<tr><td><b>${esc(s.id)}</b></td><td>${esc(s.title)}</td><td><span class="chip ${s.state==="已採納"?"ok":s.state==="未採納"?"no":"mid"}">${esc(s.state)}</span></td></tr>`).join("")}</table>`+memberBtn("num");}}
  if(id==="qa"){const q=D.qa,b=D.backlog;h+=`<h4>待辦中未修的回報</h4><div>${sevHTML(b.qaOpen)}</div><ul>${b.qaOpenItems.map(x=>`<li><span class="sev ${x.sev==="🔴"?"s1":x.sev==="🟠"?"s2":"s3"}"><i></i></span>${esc(x.text)}</li>`).join("")}</ul>`;
    if(q)h+=`<h4>${esc(q.title)}</h4><div class="muted">${esc(fmtAt(q.at))} · ${esc(noemo(q.tests))}</div><div style="margin-top:6px">${sevHTML(q.counts)}</div><ul>${q.items.map(x=>`<li><span class="sev ${x.sev==="🔴"?"s1":x.sev==="🟠"?"s2":"s3"}"><i></i>${esc(x.id)}</span>${esc(x.text)}</li>`).join("")}</ul>`;h+=memberBtn("qa");}
  if(id==="eng"){const t=D.backlog.tiers||{};h+=`<div class="big" style="margin-top:10px"><div><b>${(D.backlog.week||[]).filter(x=>x.owner==="工程"&&!x.done).length}</b><span>本週負責</span></div><div><b>${(t.queueBy||{})["工程"]||0}</b><span>排隊中</span></div><div><b>${Object.values(D.backlog.qaOpen).reduce((a,b)=>a+b,0)}</b><span>未修回報</span></div></div>
    <h4>本週負責</h4>${weekHTML("工程")}<h4>排隊中（工程）</h4>${queueHTML("工程")}
    <h4>工作方式</h4><ul><li>每天約 15:00–16:30 修 QA 回報、介面打磨，發布修補版熱修</li><li>在自己的修復分支工作，時段內才併回主線；動手前先登記「誰、何時、做什麼」，做完解除</li><li>每個修正都附回歸測試，存檔保持相容</li></ul>`+memberBtn("eng");}
  if(id==="lobby"){h+=`<div class="play" style="margin-top:10px"><div class="ver">目前版本 <b>${esc(D.game.version)}</b><br>${esc(D.game.subtitle)}</div><a class="btn" target="_blank" rel="noopener" href="${esc(D.game.url)}">進入遊戲</a></div>
    <h4>待辦進度</h4>${progressHTML()}<h4>今日排程</h4>${timelineHTML()}<h4>上架路線圖</h4>${roadmapHTML()}`;}
  openSheet(h);document.querySelectorAll("#sheetbody [data-m]").forEach(b=>b.onclick=()=>openMember(b.dataset.m));}
function openMember(id){const s=memberState(id),c=D.cards[id]||{},m=(D.office&&D.office.members[id])||{role:ROLES[id]};
  openSheet(`<div class="who"><canvas width="84" height="96" id="ava"></canvas><div><div class="nm">${esc(NAMES[id])}</div><div class="rl">${esc(m.role||"")}</div><div class="stl"><span class="dot ${s.cat}"></span>${CAT[s.cat]} · <span class="muted">${s.live?esc(agoText(s.updatedAt)):"依每日排程"}</span></div></div></div>
  <div class="thought">${esc(thoughtOf(id))}</div>
  <div class="rows"><div class="r"><b>正在忙</b>${esc(noemo(s.full||s.text))}</div><div class="r"><b>剛完成</b>${esc(noemo(c.recent)||"—")}</div><div class="r"><b>下一步</b>${esc(noemo(nextStep(id)))}</div></div>
  <div class="mbtn"><button id="poke">打招呼</button><button id="tofloor">看這層樓</button></div>`);
  const cv=$("#ava"),ctx=cv.getContext("2d");let fr=0;const draw=()=>{if(!document.body.contains(cv))return;ctx.clearRect(0,0,84,96);oChibi(ctx,lookOf(id),42,88,4.6,"front",fr%12<6?"stand":"stand",fr);fr++;};draw();const iv=setInterval(()=>{if(!document.body.contains(cv)){clearInterval(iv);return;}draw();},300);
  $("#poke").onclick=()=>{let k=0;const j=setInterval(()=>{ctx.clearRect(0,0,84,96);const y=88-Math.abs(Math.sin(k/3))*10;oChibi(ctx,lookOf(id),42,y,4.6,"front","stand",k);if(k%2){drawWave(ctx,lookOf(id),42-6*4.6,y,4.6,k);}if(++k>12)clearInterval(j);},80);react(id);};
  $("#tofloor").onclick=()=>openFloor(SPOT[id].f);}

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
