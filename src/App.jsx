import { useState } from "react";

// ─── INITIAL DATA STORE ───────────────────────────────────────────────────────
const INIT_MODULES = [
  {id:1,tier:1,title:"Module 1",emoji:"🌌",stars:3,locked:false,domains:["Space","Astronomy"],status:"published"},
  {id:2,tier:1,title:"Module 2",emoji:"🦋",stars:1,locked:false,domains:["Biology","Animals"],status:"published"},
  {id:3,tier:2,title:"Module 3",emoji:"⚗️",stars:0,locked:false,domains:["Chemistry","Physics"],status:"published"},
  {id:4,tier:2,title:"Module 4",emoji:"🌿",stars:0,locked:true,domains:["Earth Science","Weather"],status:"published"},
  {id:5,tier:3,title:"Module 5",emoji:"🦕",stars:0,locked:true,domains:["Dinosaurs","Fossils"],status:"draft"},
  {id:6,tier:3,title:"Module 6",emoji:"⚡",stars:0,locked:true,domains:["Physics","Technology"],status:"draft"},
  {id:7,tier:4,title:"Module 7",emoji:"🌊",stars:0,locked:true,domains:["Ocean Science","Biology"],status:"draft"},
  {id:8,tier:4,title:"Module 8",emoji:"🤖",stars:0,locked:true,domains:["Technology","Robotics"],status:"draft"},
];
const INIT_SHORTS = [
  {id:1,title:"Why is Space Dark?",domain:"Space & Astronomy",duration:"0:42",module:1,star:1,status:"published"},
  {id:2,title:"How do Butterflies Taste?",domain:"Animals",duration:"0:38",module:2,star:1,status:"published"},
  {id:3,title:"What is Electricity?",domain:"Physics",duration:"0:45",module:3,star:1,status:"published"},
  {id:4,title:"How Black Holes Form",domain:"Space & Astronomy",duration:"0:55",module:1,star:2,status:"published"},
  {id:5,title:"The Water Cycle",domain:"Earth Science",duration:"0:40",module:4,star:1,status:"draft"},
];
const INIT_USERS = [
  {id:1,username:"CosmicNebula42",rank:"Science Cadet",xp:1540,streak:9,modules:2,status:"active",joined:"2026-01-10"},
  {id:2,username:"AtomSmasher99",rank:"Spark Explorer",xp:3200,streak:14,modules:5,status:"active",joined:"2026-01-08"},
  {id:3,username:"BioRanger77",rank:"Science Cadet",xp:980,streak:2,modules:1,status:"active",joined:"2026-02-01"},
  {id:4,username:"QuantumKid55",rank:"Atom Scout",xp:4750,streak:21,modules:7,status:"suspended",joined:"2025-12-15"},
  {id:5,username:"StarDuster11",rank:"Science Cadet",xp:200,streak:0,modules:0,status:"active",joined:"2026-03-01"},
];
const DOMAINS = ["Space & Astronomy","Biology","Chemistry","Physics","Earth Science","Weather","Human Body","Animals","Quantum Physics","Technology & Robotics","Ocean Science","Dinosaurs & Fossils"];
const TIER_COLORS = {1:"#667eea",2:"#e17055",3:"#00b894",4:"#fd79a8"};
const CANVAS_W = 320;
const NODE_STEP = 110;

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({color,children}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:700}}>{children}</span>
);
const Btn = ({onClick,color="#667eea",children,outline,style={}}) => (
  <button onClick={onClick} style={{background:outline?"transparent":color,color:outline?color:"white",border:`2px solid ${color}`,borderRadius:10,padding:"8px 14px",fontWeight:700,fontSize:12,cursor:"pointer",...style}}>{children}</button>
);
const Input = ({value,onChange,placeholder,style={}}) => (
  <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{border:"1.5px solid #e0e0e0",borderRadius:10,padding:"10px 12px",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box",...style}}/>
);
const Select = ({value,onChange,options,style={}}) => (
  <select value={value} onChange={e=>onChange(e.target.value)}
    style={{border:"1.5px solid #e0e0e0",borderRadius:10,padding:"10px 12px",fontSize:13,outline:"none",width:"100%",boxSizing:"border-box",background:"white",...style}}>
    {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
  </select>
);

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [user,setUser]=useState(""), [pass,setPass]=useState(""), [err,setErr]=useState("");
  const handle = () => {
    if(user==="admin" && pass==="admin123") return onLogin("admin");
    if(user.length>=3) return onLogin("user");
    setErr("Enter a valid username (min 3 chars) or admin credentials.");
  };
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(160deg,#667eea22,#e1705522)"}}>
      <div style={{fontSize:56,marginBottom:8}}>🔬</div>
      <div style={{fontWeight:800,fontSize:26,background:"linear-gradient(90deg,#667eea,#e17055)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>Little Genius</div>
      <div style={{color:"#aaa",fontSize:13,marginBottom:32}}>Science Learning for Kids 5–9</div>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:12}}>
        <Input value={user} onChange={setUser} placeholder="Username"/>
        <Input value={pass} onChange={setPass} placeholder="Password (optional)"/>
        {err && <div style={{color:"#e17055",fontSize:12,textAlign:"center"}}>{err}</div>}
        <button onClick={handle} style={{background:"linear-gradient(90deg,#667eea,#764ba2)",color:"white",border:"none",borderRadius:14,padding:14,fontWeight:700,fontSize:16,cursor:"pointer",marginTop:4}}>
          Let's Go! 🚀
        </button>
      </div>
      <div style={{marginTop:24,padding:12,background:"white",borderRadius:12,fontSize:12,color:"#aaa",textAlign:"center",width:"100%",boxSizing:"border-box"}}>
        Admin access: <b style={{color:"#667eea"}}>admin / admin123</b>
      </div>
    </div>
  );
}

// ─── USER APP ─────────────────────────────────────────────────────────────────
function StarRow({count,max=3}) {
  return <div style={{display:"flex",gap:3,justifyContent:"center"}}>{Array.from({length:max}).map((_,i)=><span key={i} style={{fontSize:13}}>{i<count?"⭐":"☆"}</span>)}</div>;
}
function ModuleModal({mod,onClose}) {
  const [tab,setTab]=useState("overview");
  if(!mod) return null;
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"flex-end",zIndex:100}} onClick={onClose}>
      <div style={{background:"white",borderRadius:"24px 24px 0 0",width:"100%",padding:20,maxHeight:"75%",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"#ddd",borderRadius:2,margin:"0 auto 16px"}}/>
        <div style={{fontWeight:700,fontSize:18,marginBottom:4}}>{mod.emoji} {mod.title}</div>
        <StarRow count={mod.stars}/>
        <div style={{display:"flex",gap:8,margin:"14px 0"}}>
          {["overview","stars","xp"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px 0",border:"none",borderRadius:10,background:tab===t?"#667eea":"#f0f0f0",color:tab===t?"white":"#555",fontWeight:600,fontSize:12,cursor:"pointer"}}>
              {t==="xp"?"XP & Rewards":t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        {tab==="overview" && <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {["📹 Short video (30–60s)","🧠 5-Question Quiz","📹 Short video #2","🧠 5-Question Quiz","📹 Short video #3","🧠 8-Question Quiz + ⚔️ Science Battle"].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",background:i<(mod.stars*2)?"#f0fff4":"#fafafa",borderRadius:10,border:"1.5px solid "+(i<(mod.stars*2)?"#00b894":"#eee"),fontSize:13}}>
              <span>{i<(mod.stars*2)?"✅":"⭕"}</span><span>{s}</span>
            </div>
          ))}
        </div>}
        {tab==="stars" && <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["⭐ Star 1","Watch Short + 5-Question Quiz"],["⭐ Star 2","Watch Short + 5-Question Quiz"],["⭐ Star 3","Watch Short + 8-Question Quiz + Science Battle"]].map(([star,desc],i)=>(
            <div key={star} style={{background:i<mod.stars?"#fff9e6":"#fafafa",border:"1.5px solid "+(i<mod.stars?"#FFD700":"#eee"),borderRadius:12,padding:12}}>
              <div style={{fontWeight:700,color:i<mod.stars?"#f9ca24":"#aaa"}}>{star} {i<mod.stars?"✅":""}</div>
              <div style={{fontSize:13,color:"#636e72",marginTop:4}}>{desc}</div>
            </div>
          ))}
        </div>}
        {tab==="xp" && <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["Watch a Short","+ 10 XP"],["Pass Quiz (Stars 1–2)","+ 15 XP"],["Pass Quiz (Star 3)","+ 25 XP"],["Science Battle","+ 25 XP"],["Perfect Score","+ 10 XP"],["Daily Login","+ 5 XP/day"]].map(([a,x])=>(
            <div key={a} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"#f8f8f8",borderRadius:10,fontSize:13}}>
              <span>{a}</span><span style={{fontWeight:700,color:"#00b894"}}>{x}</span>
            </div>
          ))}
        </div>}
        <button onClick={onClose} style={{marginTop:16,width:"100%",padding:14,background:"linear-gradient(90deg,#667eea,#764ba2)",color:"white",border:"none",borderRadius:14,fontWeight:700,fontSize:15,cursor:"pointer"}}>
          {mod.stars===0?"Start Module 🚀":mod.stars===3?"Review 📖":"Continue ▶"}
        </button>
      </div>
    </div>
  );
}
function PathTab({modules,onModuleSelect}) {
  const totalH = modules.length*NODE_STEP+120;
  const pts = modules.map((m,i)=>({x:(m.x??((i%2===0?35:65)))/100*(CANVAS_W-80)+20, y:i*NODE_STEP+70}));
  const makePath = (pts) => pts.reduce((d,p,i)=>{
    if(i===0) return `M${p.x},${p.y}`;
    const prev=pts[i-1], cx=(prev.x+p.x)/2;
    return d+` C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  },"");
  const donePts = pts.slice(0, Math.max(1, modules.filter(m=>m.stars>0).length+1));
  const nodeX = [35,65,45,25,55,75,50,30];
  const realPts = modules.map((m,i)=>({x:nodeX[i%nodeX.length]/100*(CANVAS_W-80)+20, y:i*NODE_STEP+70}));
  const donePts2 = realPts.slice(0, Math.max(1, modules.filter(m=>m.stars>0).length+1));
  return (
    <div style={{flex:1,overflowY:"auto",background:"#f0f4ff"}}>
      <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",margin:12,borderRadius:16,padding:"12px 16px",color:"white",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:11,opacity:.8}}>Rank</div><div style={{fontWeight:700,fontSize:14}}>🎖️ Science Cadet</div></div>
        <div><div style={{fontSize:11,opacity:.8}}>XP</div><div style={{fontWeight:700,fontSize:18}}>1,540</div></div>
        <div><div style={{fontSize:11,opacity:.8}}>🔥 Streak</div><div style={{fontWeight:700,fontSize:18}}>9</div></div>
      </div>
      <div style={{position:"relative",width:"100%"}}>
        <svg width="100%" viewBox={`0 0 ${CANVAS_W} ${totalH}`} style={{display:"block"}}>
          {[...new Set(modules.map(m=>m.tier))].map(t=>{
            const si=modules.findIndex(m=>m.tier===t), ei=modules.map(m=>m.tier).lastIndexOf(t);
            return <rect key={t} x={0} y={si*NODE_STEP+20} width={CANVAS_W} height={(ei-si)*NODE_STEP+100} fill={(TIER_COLORS[t]||"#aaa")+"11"} rx={12}/>;
          })}
          {[...new Set(modules.map(m=>m.tier))].map(t=>{
            const si=modules.findIndex(m=>m.tier===t);
            return <text key={t} x={CANVAS_W/2} y={si*NODE_STEP+34} textAnchor="middle" fontSize={10} fontWeight="700" fill={TIER_COLORS[t]||"#aaa"} letterSpacing={1}>— TIER {t} —</text>;
          })}
          <path d={makePath(realPts)} fill="none" stroke="#dde3f0" strokeWidth={14} strokeLinecap="round"/>
          <path d={makePath(donePts2)} fill="none" stroke="#A29BFE" strokeWidth={14} strokeLinecap="round"/>
          <path d={makePath(donePts2)} fill="none" stroke="white" strokeWidth={4} strokeLinecap="round" strokeDasharray="8 14" opacity={0.5}/>
          {modules.map((mod,i)=>{
            const x=realPts[i].x, y=realPts[i].y;
            const cs=["#FF6B6B","#FF9F43","#48DBFB","#1DD1A1","#A29BFE","#FD79A8","#FDCB6E","#6C5CE7"];
            const bg=mod.locked?"#b2bec3":cs[i%cs.length];
            const isActive=!mod.locked&&mod.stars<3;
            return (
              <g key={mod.id} onClick={()=>!mod.locked&&onModuleSelect(mod)} style={{cursor:mod.locked?"not-allowed":"pointer"}}>
                {isActive&&<circle cx={x} cy={y} r={38} fill={bg} opacity={0.15}/>}
                <circle cx={x} cy={y+4} r={28} fill="#00000022"/>
                <circle cx={x} cy={y} r={28} fill={bg} stroke="white" strokeWidth={3}/>
                <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize={mod.locked?18:20}>{mod.locked?"🔒":mod.stars===3?"✅":mod.emoji}</text>
                {[0,1,2].map(s=><text key={s} x={x-12+s*12} y={y+42} textAnchor="middle" fontSize={11} opacity={mod.locked?.4:1}>{s<mod.stars?"⭐":"☆"}</text>)}
                <text x={x} y={y+58} textAnchor="middle" fontSize={10} fontWeight="600" fill="#636e72">{mod.title}</text>
                {isActive&&<circle cx={x} cy={y} r={30} fill="none" stroke={bg} strokeWidth={2} opacity={0.5} strokeDasharray="4 4"/>}
              </g>
            );
          })}
        </svg>
        <div style={{textAlign:"center",paddingBottom:20,color:"#aaa",fontSize:13}}>🔒 Keep going to unlock more!</div>
      </div>
    </div>
  );
}
function UserApp({modules,shorts,onLogout}) {
  const [tab,setTab]=useState("path");
  const [selMod,setSelMod]=useState(null);
  const [voted,setVoted]=useState(null);
  const TABS=[{id:"path",icon:"🗺️",label:"Path"},{id:"shorts",icon:"▶️",label:"Shorts"},{id:"battle",icon:"⚔️",label:"Battle"},{id:"ranks",icon:"🏅",label:"Ranks"},{id:"profile",icon:"👤",label:"Me"}];
  const pubModules = modules.filter(m=>m.status==="published");
  const pubShorts = shorts.filter(s=>s.status==="published");
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      <div style={{background:"white",padding:"12px 16px 10px",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div style={{fontWeight:800,fontSize:18,background:"linear-gradient(90deg,#667eea,#e17055)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🔬 Little Genius</div>
        <div style={{display:"flex",gap:6}}>
          <span style={{background:"#fff9e6",border:"1.5px solid #FFD700",borderRadius:20,padding:"3px 8px",fontWeight:700,color:"#f9ca24",fontSize:12}}>⭐ 1,540</span>
          <span style={{background:"#fff5f0",border:"1.5px solid #e17055",borderRadius:20,padding:"3px 8px",fontWeight:700,color:"#e17055",fontSize:12}}>🔥 9</span>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {tab==="path"&&<PathTab modules={pubModules} onModuleSelect={setSelMod}/>}
        {tab==="shorts"&&(
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontWeight:700,fontSize:16}}>⚡ Science Shorts</div>
            {pubShorts.map(s=>(
              <div key={s.id} style={{background:"linear-gradient(135deg,#2d3436,#636e72)",borderRadius:16,padding:16,color:"white"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <Badge color="#A29BFE">{s.domain}</Badge>
                  <Badge color="#FFD700">+10 XP</Badge>
                </div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>{s.title}</div>
                <div style={{background:"rgba(255,255,255,.15)",height:6,borderRadius:3}}><div style={{width:"40%",height:6,background:"#1DD1A1",borderRadius:3}}/></div>
                <div style={{fontSize:11,opacity:.6,marginTop:4}}>{s.duration}</div>
              </div>
            ))}
          </div>
        )}
        {tab==="battle"&&(
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontWeight:700,fontSize:16}}>⚔️ Science Battle</div>
            <div style={{background:"linear-gradient(135deg,#e17055,#d63031)",borderRadius:16,padding:16,color:"white",textAlign:"center"}}>
              <div style={{fontSize:12,opacity:.8}}>MODULE 3 — STAR 3</div>
              <div style={{fontWeight:700,fontSize:16,marginTop:4}}>"Is a virus alive or not alive?"</div>
            </div>
            {!voted?<div style={{display:"flex",gap:10}}>
              {["🦠 ALIVE","💀 NOT ALIVE"].map(v=>(
                <button key={v} onClick={()=>setVoted(v)} style={{flex:1,padding:"18px 8px",border:"2px solid #e17055",borderRadius:14,background:"white",fontWeight:700,fontSize:13,cursor:"pointer",color:"#e17055"}}>{v}</button>
              ))}
            </div>:<div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{background:"#00b894",borderRadius:12,padding:12,color:"white",fontWeight:700,textAlign:"center"}}>✅ Voted: {voted}</div>
              {[["🦠 ALIVE","Viruses evolve and adapt.","#A29BFE"],["💀 NOT ALIVE","Can't survive without a host.","#fd79a8"]].map(([s,t,c])=>(
                <div key={s} style={{background:c+"22",border:`1.5px solid ${c}`,borderRadius:12,padding:12}}>
                  <div style={{fontWeight:700,fontSize:12,color:c}}>{s}</div>
                  <div style={{fontSize:13,marginTop:4}}>{t}</div>
                </div>
              ))}
              <div style={{background:"#00b89422",borderRadius:12,padding:12,textAlign:"center",fontWeight:700,color:"#00b894"}}>+25 XP earned! 🎉</div>
            </div>}
          </div>
        )}
        {tab==="ranks"&&(
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontWeight:700,fontSize:16}}>🏅 Rank Ladder</div>
            {["Science Cadet","Spark Explorer","Atom Scout","Bio Ranger","Geo Pioneer","Quantum Apprentice","Stellar Knight","Nova Commander","Spark Admiral","Supreme Spark Commander"].map((r,i)=>(
              <div key={r} style={{display:"flex",alignItems:"center",gap:12,background:i===0?"#667eea11":"#fafafa",border:`1.5px solid ${i===0?"#667eea":"#eee"}`,borderRadius:12,padding:"10px 14px"}}>
                <div style={{width:32,height:32,borderRadius:16,background:i===0?"#667eea":i<1?"#00b894":"#dfe6e9",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:i===0||i<1?"white":"#aaa",fontSize:12}}>{i<1?"✓":i+1}</div>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:i===0?"#667eea":"#2d3436"}}>{r}</div><div style={{fontSize:11,color:"#aaa"}}>Modules {i*2+1}–{i*2+2}</div></div>
                {i===0&&<span style={{fontSize:11,background:"#667eea",color:"white",borderRadius:10,padding:"2px 8px"}}>YOU</span>}
              </div>
            ))}
          </div>
        )}
        {tab==="profile"&&(
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:"linear-gradient(135deg,#667eea,#764ba2)",borderRadius:20,padding:20,color:"white",textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:8}}>🧑‍🚀</div>
              <div style={{fontWeight:700,fontSize:18}}>CosmicNebula42</div>
              <div style={{fontSize:12,opacity:.8}}>Science Cadet</div>
              <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:12}}>
                {[["1,540","XP"],["9","🔥"],["2","Medals"]].map(([v,l])=>(
                  <div key={l}><div style={{fontWeight:700,fontSize:20}}>{v}</div><div style={{fontSize:11,opacity:.8}}>{l}</div></div>
                ))}
              </div>
            </div>
            <button onClick={onLogout} style={{background:"#ff7675",color:"white",border:"none",borderRadius:12,padding:12,fontWeight:700,cursor:"pointer"}}>Log Out</button>
          </div>
        )}
      </div>
      <div style={{background:"white",borderTop:"1px solid #eee",display:"flex",flexShrink:0}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 0",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:tab===t.id?"#667eea":"#aaa"}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:tab===t.id?700:400}}>{t.label}</span>
            {tab===t.id&&<div style={{width:4,height:4,background:"#667eea",borderRadius:2}}/>}
          </button>
        ))}
      </div>
      {selMod&&<ModuleModal mod={selMod} onClose={()=>setSelMod(null)}/>}
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function StatCard({icon,label,value,color}) {
  return (
    <div style={{background:"white",borderRadius:14,padding:"14px 16px",border:`1.5px solid ${color}33`,flex:1,minWidth:0}}>
      <div style={{fontSize:22}}>{icon}</div>
      <div style={{fontWeight:800,fontSize:22,color,marginTop:4}}>{value}</div>
      <div style={{fontSize:11,color:"#aaa",marginTop:2}}>{label}</div>
    </div>
  );
}

function AdminModules({modules,setModules}) {
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({});
  const [showForm,setShowForm]=useState(false);
  const openEdit = (mod) => { setForm({...mod}); setEditing(mod.id); setShowForm(true); };
  const openNew = () => { setForm({id:Date.now(),tier:1,title:"",emoji:"🔬",domains:[],stars:0,locked:true,status:"draft"}); setEditing(null); setShowForm(true); };
  const save = () => {
    if(!form.title.trim()) return;
    if(editing) setModules(ms=>ms.map(m=>m.id===editing?{...form}:m));
    else setModules(ms=>[...ms,{...form}]);
    setShowForm(false);
  };
  const del = (id) => { if(confirm("Delete this module?")) setModules(ms=>ms.filter(m=>m.id!==id)); };
  const toggle = (id,field) => setModules(ms=>ms.map(m=>m.id===id?{...m,[field]:!m[field]}:m));
  const setStatus = (id,val) => setModules(ms=>ms.map(m=>m.id===id?{...m,status:val}:m));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontWeight:700,fontSize:16,color:"#2d3436"}}>📦 Modules ({modules.length})</div>
        <Btn onClick={openNew} color="#667eea">+ New Module</Btn>
      </div>

      {showForm&&(
        <div style={{background:"white",border:"1.5px solid #667eea",borderRadius:16,padding:16,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontWeight:700,color:"#667eea"}}>{editing?"Edit Module":"New Module"}</div>
          <div style={{display:"flex",gap:8}}>
            <Input value={form.emoji||""} onChange={v=>setForm(f=>({...f,emoji:v}))} placeholder="Emoji" style={{width:60}}/>
            <Input value={form.title||""} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Module title"/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Select value={form.tier||1} onChange={v=>setForm(f=>({...f,tier:Number(v)}))} options={[1,2,3,4,5,6,7,8,9,10].map(n=>({value:n,label:`Tier ${n}`}))} style={{flex:1}}/>
            <Select value={form.status||"draft"} onChange={v=>setForm(f=>({...f,status:v}))} options={["draft","published"].map(s=>({value:s,label:s.charAt(0).toUpperCase()+s.slice(1)}))} style={{flex:1}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}>
              <input type="checkbox" checked={!!form.locked} onChange={e=>setForm(f=>({...f,locked:e.target.checked}))}/>Locked
            </label>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={save} color="#667eea">Save</Btn>
            <Btn onClick={()=>setShowForm(false)} color="#aaa" outline>Cancel</Btn>
          </div>
        </div>
      )}

      {modules.map(mod=>(
        <div key={mod.id} style={{background:"white",borderRadius:14,padding:"12px 14px",border:"1.5px solid #eee",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:12,background:(TIER_COLORS[mod.tier]||"#aaa")+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{mod.emoji}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:13,color:"#2d3436"}}>{mod.title}</div>
            <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
              <Badge color={TIER_COLORS[mod.tier]||"#aaa"}>Tier {mod.tier}</Badge>
              <Badge color={mod.status==="published"?"#00b894":"#636e72"}>{mod.status}</Badge>
              {mod.locked&&<Badge color="#e17055">🔒 Locked</Badge>}
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <button onClick={()=>toggle(mod.id,"locked")} title={mod.locked?"Unlock":"Lock"} style={{background:"#f0f0f0",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13}}>{mod.locked?"🔓":"🔒"}</button>
            <button onClick={()=>setStatus(mod.id,mod.status==="published"?"draft":"published")} title="Toggle publish" style={{background:"#f0f0f0",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13}}>{mod.status==="published"?"📤":"📢"}</button>
            <button onClick={()=>openEdit(mod)} style={{background:"#667eea22",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13}}>✏️</button>
            <button onClick={()=>del(mod.id)} style={{background:"#ff716522",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13}}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminShorts({shorts,setShorts,modules}) {
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({});
  const [showForm,setShowForm]=useState(false);
  const openEdit = s => { setForm({...s}); setEditing(s.id); setShowForm(true); };
  const openNew = () => { setForm({id:Date.now(),title:"",domain:DOMAINS[0],duration:"0:30",module:1,star:1,status:"draft"}); setEditing(null); setShowForm(true); };
  const save = () => {
    if(!form.title.trim()) return;
    if(editing) setShorts(ss=>ss.map(s=>s.id===editing?{...form}:s));
    else setShorts(ss=>[...ss,{...form}]);
    setShowForm(false);
  };
  const del = id => { if(confirm("Delete this Short?")) setShorts(ss=>ss.filter(s=>s.id!==id)); };
  const setStatus = (id,val) => setShorts(ss=>ss.map(s=>s.id===id?{...s,status:val}:s));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontWeight:700,fontSize:16,color:"#2d3436"}}>▶️ Shorts ({shorts.length})</div>
        <Btn onClick={openNew} color="#e17055">+ New Short</Btn>
      </div>
      {showForm&&(
        <div style={{background:"white",border:"1.5px solid #e17055",borderRadius:16,padding:16,display:"flex",flexDirection:"column",gap:10}}>
          <div style={{fontWeight:700,color:"#e17055"}}>{editing?"Edit Short":"New Short"}</div>
          <Input value={form.title||""} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="Short title"/>
          <Select value={form.domain||DOMAINS[0]} onChange={v=>setForm(f=>({...f,domain:v}))} options={DOMAINS}/>
          <div style={{display:"flex",gap:8}}>
            <Select value={form.module||1} onChange={v=>setForm(f=>({...f,module:Number(v)}))} options={modules.map(m=>({value:m.id,label:m.title}))} style={{flex:1}}/>
            <Select value={form.star||1} onChange={v=>setForm(f=>({...f,star:Number(v)}))} options={[{value:1,label:"⭐ Star 1"},{value:2,label:"⭐ Star 2"},{value:3,label:"⭐ Star 3"}]} style={{flex:1}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Input value={form.duration||""} onChange={v=>setForm(f=>({...f,duration:v}))} placeholder="Duration e.g. 0:45" style={{flex:1}}/>
            <Select value={form.status||"draft"} onChange={v=>setForm(f=>({...f,status:v}))} options={["draft","published"].map(s=>({value:s,label:s.charAt(0).toUpperCase()+s.slice(1)}))} style={{flex:1}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={save} color="#e17055">Save</Btn>
            <Btn onClick={()=>setShowForm(false)} color="#aaa" outline>Cancel</Btn>
          </div>
        </div>
      )}
      {shorts.map(s=>(
        <div key={s.id} style={{background:"white",borderRadius:14,padding:"12px 14px",border:"1.5px solid #eee",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:12,background:"#636e7222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>▶️</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:13,color:"#2d3436",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
            <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
              <Badge color="#A29BFE">{s.domain}</Badge>
              <Badge color={s.status==="published"?"#00b894":"#636e72"}>{s.status}</Badge>
              <Badge color="#636e72">{s.duration}</Badge>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <button onClick={()=>setStatus(s.id,s.status==="published"?"draft":"published")} style={{background:"#f0f0f0",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13}}>{s.status==="published"?"📤":"📢"}</button>
            <button onClick={()=>openEdit(s)} style={{background:"#e1705522",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13}}>✏️</button>
            <button onClick={()=>del(s.id)} style={{background:"#ff716522",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13}}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminUsers({users,setUsers}) {
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const setStatus = (id,val) => setUsers(us=>us.map(u=>u.id===id?{...u,status:val}:u));
  const filtered = users.filter(u=>(filter==="all"||u.status===filter)&&(u.username.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{fontWeight:700,fontSize:16,color:"#2d3436"}}>👥 Users ({users.length})</div>
      <div style={{display:"flex",gap:8}}>
        <Input value={search} onChange={setSearch} placeholder="Search username…" style={{flex:1}}/>
        <Select value={filter} onChange={setFilter} options={[{value:"all",label:"All"},{value:"active",label:"Active"},{value:"suspended",label:"Suspended"}]} style={{width:120}}/>
      </div>
      {filtered.map(u=>(
        <div key={u.id} style={{background:"white",borderRadius:14,padding:"12px 14px",border:"1.5px solid #eee"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:40,height:40,borderRadius:20,background:"linear-gradient(135deg,#667eea,#764ba2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"white",fontWeight:700,flexShrink:0}}>
              {u.username[0].toUpperCase()}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:13,color:"#2d3436"}}>{u.username}</div>
              <div style={{fontSize:11,color:"#aaa"}}>{u.rank} · Joined {u.joined}</div>
            </div>
            <Badge color={u.status==="active"?"#00b894":"#e17055"}>{u.status}</Badge>
          </div>
          <div style={{display:"flex",gap:10,marginTop:10,padding:"8px 0",borderTop:"1px solid #f0f0f0"}}>
            {[["⭐ XP",u.xp],["🔥 Streak",u.streak],["📦 Modules",u.modules]].map(([l,v])=>(
              <div key={l} style={{flex:1,textAlign:"center"}}>
                <div style={{fontWeight:700,fontSize:15,color:"#2d3436"}}>{v}</div>
                <div style={{fontSize:10,color:"#aaa"}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            {u.status==="active"
              ?<Btn onClick={()=>setStatus(u.id,"suspended")} color="#e17055" outline style={{flex:1,fontSize:11}}>🚫 Suspend</Btn>
              :<Btn onClick={()=>setStatus(u.id,"active")} color="#00b894" outline style={{flex:1,fontSize:11}}>✅ Restore</Btn>
            }
            <Btn onClick={()=>alert("Reset XP: "+u.username)} color="#636e72" outline style={{flex:1,fontSize:11}}>🔄 Reset XP</Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPanel({modules,setModules,shorts,setShorts,users,setUsers,onLogout}) {
  const [tab,setTab]=useState("dashboard");
  const TABS=[{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"modules",icon:"📦",label:"Modules"},{id:"shorts",icon:"▶️",label:"Shorts"},{id:"users",icon:"👥",label:"Users"}];
  const pubM=modules.filter(m=>m.status==="published").length;
  const pubS=shorts.filter(s=>s.status==="published").length;
  const activeU=users.filter(u=>u.status==="active").length;
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#f7f8fc"}}>
      {/* Admin Header */}
      <div style={{background:"linear-gradient(90deg,#2d3436,#636e72)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div>
          <div style={{color:"white",fontWeight:800,fontSize:16}}>🛠️ Admin Panel</div>
          <div style={{color:"#aaa",fontSize:11}}>Little Genius CMS</div>
        </div>
        <button onClick={onLogout} style={{background:"#ff7675",color:"white",border:"none",borderRadius:10,padding:"6px 12px",fontWeight:700,fontSize:12,cursor:"pointer"}}>Logout</button>
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:14}}>
        {tab==="dashboard"&&(
          <>
            <div style={{fontWeight:700,fontSize:16,color:"#2d3436"}}>📊 Overview</div>
            <div style={{display:"flex",gap:10}}>
              <StatCard icon="📦" label="Published Modules" value={pubM} color="#667eea"/>
              <StatCard icon="▶️" label="Published Shorts" value={pubS} color="#e17055"/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <StatCard icon="👥" label="Active Users" value={activeU} color="#00b894"/>
              <StatCard icon="🚫" label="Suspended" value={users.length-activeU} color="#fd79a8"/>
            </div>
            <div style={{background:"white",borderRadius:14,padding:16,border:"1.5px solid #eee"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:"#2d3436"}}>📈 Content Health</div>
              {[["Modules","published",modules,pubM,"#667eea"],["Shorts","published",shorts,pubS,"#e17055"]].map(([name,label,arr,pub,c])=>(
                <div key={name} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                    <span style={{color:"#636e72"}}>{name}</span>
                    <span style={{fontWeight:700,color:c}}>{pub}/{arr.length} {label}</span>
                  </div>
                  <div style={{background:"#f0f0f0",borderRadius:6,height:8}}>
                    <div style={{width:`${(pub/Math.max(arr.length,1))*100}%`,height:8,background:c,borderRadius:6,transition:"width .3s"}}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"white",borderRadius:14,padding:16,border:"1.5px solid #eee"}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:"#2d3436"}}>⚡ Quick Actions</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[["📦 Go to Modules","modules","#667eea"],["▶️ Go to Shorts","shorts","#e17055"],["👥 Manage Users","users","#00b894"]].map(([l,t,c])=>(
                  <Btn key={t} onClick={()=>setTab(t)} color={c} style={{textAlign:"left"}}>{l}</Btn>
                ))}
              </div>
            </div>
          </>
        )}
        {tab==="modules"&&<AdminModules modules={modules} setModules={setModules}/>}
        {tab==="shorts"&&<AdminShorts shorts={shorts} setShorts={setShorts} modules={modules}/>}
        {tab==="users"&&<AdminUsers users={users} setUsers={setUsers}/>}
      </div>

      {/* Bottom Nav */}
      <div style={{background:"white",borderTop:"1px solid #eee",display:"flex",flexShrink:0}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 0",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:tab===t.id?"#2d3436":"#aaa"}}>
            <span style={{fontSize:18}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:tab===t.id?700:400}}>{t.label}</span>
            {tab===t.id&&<div style={{width:4,height:4,background:"#2d3436",borderRadius:2}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [role,setRole]=useState(null);
  const [modules,setModules]=useState(INIT_MODULES);
  const [shorts,setShorts]=useState(INIT_SHORTS);
  const [users,setUsers]=useState(INIT_USERS);

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",height:"100vh",display:"flex",flexDirection:"column",maxWidth:390,margin:"0 auto",position:"relative",overflow:"hidden",boxShadow:"0 0 40px rgba(0,0,0,.15)"}}>
      {!role && <LoginScreen onLogin={setRole}/>}
      {role==="user" && <UserApp modules={modules} shorts={shorts} onLogout={()=>setRole(null)}/>}
      {role==="admin" && <AdminPanel modules={modules} setModules={setModules} shorts={shorts} setShorts={setShorts} users={users} setUsers={setUsers} onLogout={()=>setRole(null)}/>}
    </div>
  );
}
