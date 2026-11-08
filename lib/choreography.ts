// @ts-nocheck
/*
 * The choreography engine: one fixed canvas of ~1,500 particles that re-forms at each act
 * (dancer → stage plan → falling pages → contents stack → bookshelf → bow) as you scroll.
 * Hand-tuned Canvas 2D math, ported from the original vanilla-JS prototype, so it is left untyped.
 * It reads layout from the DOM (#fig, #plan, #toc, .book[data-i][data-slot][data-color], #bow)
 * and never writes React state, so the React tree stays in charge of content.
 */
export function startChoreography(): () => void {
let stopped=false, raf=0;
const cleanups=[];
const bookEls=()=>[...document.querySelectorAll('.book')].sort((a,b)=>Number(a.dataset.i)-Number(b.dataset.i));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);
const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
const lerp = (a,b,t) => a+(b-a)*t;
const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const rnd = (a,b) => a+Math.random()*(b-a);
const gauss = () => (Math.random()+Math.random()+Math.random()-1.5)/1.5;

/* ================= poses (0 head,1 neck,2 lS,3 rS,4 lE,5 rE,6 lW,7 rW,8 lH,9 rH,10 lK,11 rK,12 lA,13 rA) ================= */
const POSES = {
  arabesque:[[.46,.12],[.47,.19],[.43,.215],[.52,.21],[.36,.165],[.60,.19],[.28,.10],[.69,.20],[.455,.42],[.505,.42],[.46,.62],[.64,.405],[.465,.86],[.83,.35]],
  fifth:    [[.50,.13],[.50,.20],[.46,.225],[.54,.225],[.42,.13],[.58,.13],[.48,.05],[.52,.05],[.47,.44],[.53,.44],[.49,.645],[.51,.645],[.50,.86],[.515,.86]],
  passe:    [[.50,.13],[.50,.20],[.455,.225],[.545,.225],[.38,.255],[.62,.255],[.31,.29],[.69,.29],[.47,.44],[.53,.44],[.485,.645],[.64,.54],[.495,.86],[.505,.63]],
  bow:      [[.515,.185],[.50,.245],[.46,.265],[.54,.265],[.395,.34],[.605,.34],[.335,.42],[.665,.42],[.47,.47],[.53,.47],[.455,.665],[.565,.645],[.46,.865],[.66,.80]]
};
const SEQ = ['arabesque','fifth','passe'];
const CHAINS = [[6,4,2,1,3,5,7],[12,10,8],[13,11,9],[1,'m'],[8,9],[0,1]];
const CHAIN_W = [0.25,0.14,0.14,0.13,0.03,0.04];
function cr(p0,p1,p2,p3,t){const t2=t*t,t3=t2*t;return .5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);}
function chainPoint(pts,t){ // Catmull–Rom through points
  const n=pts.length-1, s=Math.min(n-1e-6,t*n), i=Math.floor(s), f=s-i;
  const P=k=>pts[Math.max(0,Math.min(n,k))];
  return [cr(P(i-1)[0],P(i)[0],P(i+1)[0],P(i+2)[0],f), cr(P(i-1)[1],P(i)[1],P(i+1)[1],P(i+2)[1],f)];
}
function poseAt(ms){
  if (reduce) return {pts:POSES.arabesque, name:'arabesque'};
  const seg=3.4, tt=(ms/1000)%(seg*SEQ.length), i=Math.floor(tt/seg), f=tt-i*seg;
  const a=POSES[SEQ[i]], b=POSES[SEQ[(i+1)%SEQ.length]], t=f<2.1?0:ease((f-2.1)/1.3);
  return {pts:a.map((p,k)=>[lerp(p[0],b[k][0],t),lerp(p[1],b[k][1],t)]), name:t<.5?SEQ[i]:SEQ[(i+1)%SEQ.length]};
}

/* ================= stage plan geometry (normalised to the .plan box, audience at the bottom) ================= */
const SEG=[]; // [x1,y1,x2,y2,dashed]
const L=(a,b,c,d,dash=0)=>SEG.push([a,b,c,d,dash]);
L(.08,.07,.92,.07); L(.08,.07,.08,.76); L(.92,.07,.92,.76);           // back wall + side walls
L(0,.76,.08,.76); L(.92,.76,1,.76);                                   // proscenium
for(let k=0;k<16;k++){const a=k/16,b=(k+1)/16,q=t=>[lerp(.08,.92,t), .76+ .14*Math.sin(Math.PI*t)];const A=q(a),B=q(b);L(A[0],A[1],B[0],B[1]);} // apron
L(.36,.07,.36,.76,1); L(.64,.07,.64,.76,1); L(.08,.30,.92,.30,1); L(.08,.53,.92,.53,1); // area grid
L(.08,.76,.92,.76,1);                                                  // plaster line
[.2,.38,.56].forEach(y=>{L(.015,y,.08,y);L(.92,y,.985,y);});           // wing legs
L(.47,.415,.53,.415); L(.5,.385,.5,.445);                              // centre mark
const segLen=SEG.map(s=>Math.hypot(s[2]-s[0],s[3]-s[1])), totLen=segLen.reduce((a,b)=>a+b,0);
function stagePoint(){
  let r=Math.random()*totLen,i=0; while(r>segLen[i]){r-=segLen[i];i++;}
  const s=SEG[i]; let t=r/segLen[i];
  if(s[4]){ const k=Math.floor(t*14); t=(k+ (t*14-k)*0.5)/14; }
  return [lerp(s[0],s[2],t)+gauss()*.002, lerp(s[1],s[3],t)+gauss()*.002];
}

/* ================= particles ================= */
const cv=$('#fx'), ctx=cv.getContext('2d');
let W=0,H=0;
function fit(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);}
addEventListener('resize',fit); fit();
cleanups.push(()=>removeEventListener('resize',fit));
const N = innerWidth<700 ? 950 : 1500;
const COLS=['58,40,62','176,96,122','168,131,74'];
const P=[];
for(let i=0;i<N;i++){
  const r=Math.random(); let zone, acc=0;
  // dancer zones: chains, skirt, head
  if(r<0.74){ let q=r/0.74; zone='c'; let ci=0; for(;ci<CHAIN_W.length;ci++){acc+=CHAIN_W[ci]/0.73; if(q<acc)break;} P.push({zone,ci:Math.min(ci,5)}); }
  else if(r<0.93) P.push({zone:'skirt'}); else P.push({zone:'head'});
  const p=P[i];
  Object.assign(p,{t:Math.random(),o:gauss(),a:Math.random()*6.283,u:Math.random()*2-1,v:Math.sqrt(Math.random()),
    hue: Math.random()<.7?0:(Math.random()<.6?1:2), r:rnd(.7,1.9), dir:Math.random()*6.283, sp:rnd(.35,1),
    st:stagePoint(), pg:i%14, per:Math.random(), inner:Math.random()<.25, iu:Math.random(), iv:Math.random(), bk:i, dx:0,dy:0, x:0,y:0});
}

function dancerTarget(p,pts,box,ms){
  const S=box.s, X=v=>box.x+v*S, Y=v=>box.y+v*S;
  const mid=[(pts[8][0]+pts[9][0])/2,(pts[8][1]+pts[9][1])/2];
  if(p.zone==='head'){
    const bun = p.a<1.2; const c = bun ? [pts[0][0]-.012, pts[0][1]-.035] : pts[0]; const rr = bun?.014:.026;
    const d=Math.sqrt(Math.abs(p.o))*rr; return [X(c[0]+Math.cos(p.a*5)*d), Y(c[1]+Math.sin(p.a*5)*d*1.1)];
  }
  if(p.zone==='skirt'){
    const nx=pts[1][0]-mid[0], ny=pts[1][1]-mid[1], nl=Math.hypot(nx,ny)||1, dn=[-nx/nl,-ny/nl], ac=[-dn[1],dn[0]];
    const v=p.v, hw=lerp(.04,.125,v)*(1+Math.sin(p.u*9+ms*.002)*.04*v), len=.125;
    const ruff = v>.92 ? Math.sin(p.u*28)*.008 : 0;
    const off=p.u*hw, dd=-.015+v*len+ruff;
    return [X(mid[0]+dn[0]*dd+ac[0]*off), Y(mid[1]+dn[1]*dd+ac[1]*off)];
  }
  const ch=CHAINS[p.ci].map(k=>k==='m'?mid:pts[k]);
  const q=chainPoint(ch,p.t), q2=chainPoint(ch,Math.min(1,p.t+.01));
  const tx=q2[0]-q[0], ty=q2[1]-q[1], tl=Math.hypot(tx,ty)||1;
  const thick = p.ci===3 ? .022 : (p.ci===1||p.ci===2) ? .009*(1.3-p.t*.6) : .006;
  const off=p.o*thick + Math.sin(ms*.0018+p.a)*.0015;
  return [X(q[0]-ty/tl*off), Y(q[1]+tx/tl*off)];
}
function boxOf(el){const r=el.getBoundingClientRect(), s=Math.min(r.width,r.height);return {x:r.left+(r.width-s)/2,y:r.top+(r.height-s)/2,s};}

/* falling sheets */
const SHEETS=Array.from({length:14},(_,i)=>({x0:(i+.5)/14+rnd(-.03,.03),sp:rnd(.05,.11),ph:Math.random(),sz:rnd(.8,1.25),sw:rnd(.4,1),spin:rnd(.5,1.4),i}));
let sheetT=[];
// final resting place of each sheet on the contents stack; the last to arrive lies flat on top
const LAND=SHEETS.map((_,i)=>{ const rank=(i*5)%14; const top=rank===13, second=rank===12, third=rank===11;
  return {d:rank/13, deg: top?0: second?-2.5: third?2: ((i*37)%9-4)*.9, ox: top?0: second?6: third?-8: ((i*53)%13-6)*1.6, oy: top?0: second?8: third?12: ((i*29)%11-5)*1.6}; });
function mkSheet(x,y,rot,flip,w,h,extra){ const c=Math.cos(rot), sn=Math.sin(rot);
  return {w,h,flip,...extra,map:(lx,ly)=>{lx*=flip;return [x+lx*c-ly*sn, y+lx*sn+ly*c];}}; }
function computeSheets(sec, gather, r){
  const base=Math.min(W,1200)/1200, w0=Math.max(34,64*base);
  sheetT=SHEETS.map((s,i)=>{
    const fall=(s.ph + sec*s.sp)%1; let y=-H*.15 + fall*H*1.3, x=s.x0*W + Math.sin(sec*.7*s.sw+s.i)*W*.03;
    let rot=Math.sin(sec*.55+s.i*1.7)*.7, flip=Math.cos(sec*s.spin+s.i)*.85+(Math.cos(sec*s.spin+s.i)>=0?.15:-.15);
    let w=w0*s.sz, h=w*1.3, ei=0;
    if(gather>0 && r){
      const L=LAND[i]; ei=ease(clamp((gather - L.d*.55)/.45));
      const tx=r.left+r.width/2+L.ox, ty=r.top+r.height/2+L.oy;
      x=lerp(x,tx,ei); y=lerp(y,ty,ei) - Math.sin(Math.PI*ei)*H*.14;
      rot=lerp(rot,L.deg*Math.PI/180,ei) + Math.sin(Math.PI*ei)*.9*(i%2?1:-1);
      flip=lerp(flip,1,ei); w=lerp(w,r.width,ei); h=lerp(h,r.height,ei);
    }
    return mkSheet(x,y,rot,flip,w,h,{ei,d:LAND[i].d});
  });
}
function rectPerimeter(per,w,h){const Lp=2*(w+h);let d=per*Lp;if(d<w)return[d,0];d-=w;if(d<h)return[w,d];d-=h;if(d<w)return[w-d,h];d-=w;return[0,h-d];}
function onSheet(p,s,inner=p.inner){
  let lx,ly; if(inner){lx=(p.iu-.5)*s.w*.8; ly=(p.iv-.5)*s.h*.8;} else {const q=rectPerimeter(p.per,s.w,s.h); lx=q[0]-s.w/2; ly=q[1]-s.h/2;}
  return s.map(lx,ly);
}
function sheetTarget(p){ return onSheet(p, sheetT[p.pg % sheetT.length]); }
/* contents page: particles stay on the edges of the stacked sheets */
function tocTarget(p,r){
  const L=LAND[p.pg%14]; return onSheet(p, mkSheet(r.left+r.width/2+L.ox, r.top+r.height/2+L.oy, L.deg*Math.PI/180, 1, r.width, r.height), false);
}

/* ================= scroll → act value s (0 dancer, 1 stage, 2 pages, 3 shelf, 4 bow) ================= */
const secToc=$('#contents'), secExp=$('#experience'), secInt=$('#interlude'), secLib=$('#library'), secCur=$('#curtain');
function actValue(){
  const t=(el,start,span)=>clamp((H*start - el.getBoundingClientRect().top)/(H*span));
  return t(secExp,.92,.75) + t(secInt,.85,.55) + t(secToc,.95,.8) + t(secLib,.75,.5) + t(secCur,.95,.55);
}

/* mouse repel */
let mx=-999,my=-999;
const onMove=e=>{mx=e.clientX;my=e.clientY;}, onLeave=()=>{mx=my=-999;};
addEventListener('pointermove',onMove); document.documentElement.addEventListener('pointerleave',onLeave);
cleanups.push(()=>{removeEventListener('pointermove',onMove); document.documentElement.removeEventListener('pointerleave',onLeave);});

let bookRects=[]; const ALPHA=[.82,.78,.55,.8,.85,.82];
const FOIL=['250,240,218','236,208,150','214,183,120'];
let hudTick=0;
function frame(ms){
  const sec=reduce?3:ms/1000, s=actValue();
  const k=Math.min(4,Math.floor(s)), f=s-k, e=reduce?Math.round(f):ease(f);
  ctx.clearRect(0,0,W,H);
  const need=n=>k===n||k+1===n;
  const hero = need(0)?{...poseAt(ms),box:boxOf($('#fig'))}:null;
  const bow  = need(5)?{pts:POSES.bow,box:boxOf($('#bow'))}:null;
  const plan = need(1)?$('#plan').getBoundingClientRect():null;
  const toc = need(3)?$('#toc').getBoundingClientRect():null;
  if(need(2)) computeSheets(sec, k===2?e:0, toc);
  $('#toc').style.opacity = s>=3 ? 1 : clamp((s-2.86)/.12);
  const books=bookEls(), NB=books.length;
  if(need(4)) bookRects=books.map(el=>el.getBoundingClientRect());
  const tgt=(n,p)=>{
    if(n===0) return dancerTarget(p,hero.pts,hero.box,ms);
    if(n===1) return [plan.left+p.st[0]*plan.width, plan.top+p.st[1]*plan.height];
    if(n===2) return sheetTarget(p);
    if(n===3) return k===2 ? sheetTarget(p) : tocTarget(p,toc);
    if(n===4){ const r=bookRects[p.bk%Math.max(1,NB)]; if(!r) return [W/2,H]; if(p.a<3.6) return [r.left+r.width*(.12+p.iu*.76), r.top+r.height*(.04+p.iv*.92)]; const q=rectPerimeter(p.per,r.width,r.height); return [r.left+q[0], r.top+q[1]]; }
    return dancerTarget(p,bow.pts,bow.box,ms);
  };
  // paper sheets under the particles (drawn in arrival order so later sheets land on top)
  if(need(2)){
    const a = s<2 ? clamp((s-1.55)*2.2) : clamp((3-s)/.12);
    if(a>0.01){
      const order=[...sheetT].sort((x,y)=>x.d-y.d);
      for(const sh of order){
        const c=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([u,v])=>sh.map(u*sh.w,v*sh.h));
        ctx.save(); ctx.shadowColor=`rgba(70,45,30,${.16*a})`; ctx.shadowBlur=10+sh.ei*18; ctx.shadowOffsetY=5+sh.ei*8;
        ctx.fillStyle=`rgba(255,252,246,${a})`; ctx.beginPath(); c.forEach((q,j)=>j?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])); ctx.closePath(); ctx.fill(); ctx.restore();
        ctx.strokeStyle=`rgba(58,40,62,${.18*a})`; ctx.lineWidth=1; ctx.beginPath();
        const rows = sh.ei>.5 ? 12 : 5;
        for(let r=0;r<rows;r++){ const y=(-.32+r*(.64/(rows-1)))*sh.h, a1=sh.map(-.32*sh.w,y), a2=sh.map((r===rows-1?.05:.32)*sh.w,y); ctx.moveTo(a1[0],a1[1]); ctx.lineTo(a2[0],a2[1]); }
        ctx.stroke();
      }
    }
  }
  // contents → library: the stack peels apart and each sheet tumbles down into a book slot
  const peel = k===3 && f>0.02;
  if(k===3){
    $('#toc').style.opacity = 1-clamp((f-.02)/.12);
    const ba2=clamp((s-3.78)/.2);
    const items=books.map((el,j)=>{ const slot=Number(el.dataset.slot), d=slot/Math.max(1,NB-1)*.45;
      const ei=ease(clamp((f-d)/.55)); return {j,ei,slot,L:LAND[j]}; }).sort((a,b)=>(a.ei>=1)-(b.ei>=1)||b.slot-a.slot);
    for(const it of items){
      const r=bookRects[it.j]; if(!r||!toc) continue;
      const L=it.L, ei=it.ei;
      const sx=toc.left+toc.width/2+L.ox, sy=toc.top+toc.height/2+L.oy;
      const x=lerp(sx,r.left+r.width/2,ei)+Math.sin(ei*Math.PI*2.2+it.j)*W*.06*(1-ei);
      const y=lerp(sy,r.top+r.height/2,ei)-Math.sin(Math.PI*ei)*H*.08;
      const rot=lerp(L.deg*Math.PI/180,0,ei)+Math.sin(ei*Math.PI*3+it.j)*.9*(1-ei)*Math.min(1,ei*4);
      const flip=Math.cos(ei*Math.PI*2*(it.j%2?1:-1))*(1-ei)+ei;
      const w=lerp(toc.width,r.width,ei), h=lerp(toc.height,r.height,ei);
      const sh=mkSheet(x,y,rot,flip<0?Math.min(-.12,flip):Math.max(.12,flip),w,h);
      const hex=books[it.j].dataset.color||'#5b3a52', rr=parseInt(hex.slice(1,3),16), gg=parseInt(hex.slice(3,5),16), bb=parseInt(hex.slice(5,7),16);
      const m=clamp((ei-.55)/.4), a=1-ba2;
      if(a<=0.01) continue;
      const c=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([u,v])=>sh.map(u*w,v*h));
      ctx.save(); ctx.shadowColor=`rgba(70,45,30,${.22*a})`; ctx.shadowBlur=18; ctx.shadowOffsetY=10;
      ctx.fillStyle=`rgba(${lerp(255,rr,m)|0},${lerp(252,gg,m)|0},${lerp(246,bb,m)|0},${a})`;
      ctx.beginPath(); c.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])); ctx.closePath(); ctx.fill(); ctx.restore();
      if(m<.6){ ctx.strokeStyle=`rgba(58,40,62,${.16*a*(1-m/.6)})`; ctx.lineWidth=1; ctx.beginPath();
        for(let q=0;q<10;q++){ const yy=(-.34+q*.075)*h, a1=sh.map(-.34*w,yy), a2=sh.map((q===9?.0:.34)*w,yy); ctx.moveTo(a1[0],a1[1]); ctx.lineTo(a2[0],a2[1]); } ctx.stroke(); }
    }
  }
  const foil = (s>3.5 && s<4.55); cv.style.zIndex = (foil||peel) ? 2 : 0;
  const alpha=lerp(ALPHA[k],ALPHA[k+1],e), burstAmp=(reduce||k===2||k===3)?0:Math.sin(Math.PI*e)*Math.min(W,H)*.32;
  for(const p of P){
    const A=tgt(k,p), B=e>0?tgt(k+1,p):A;
    let x,y;
    if(k===3){ // page-shaped confetti raining down onto the shelf, staggered per particle
      const ep=ease(clamp((f-p.iu*.4)/.6)), fl=Math.sin(Math.PI*ep);
      x=lerp(A[0],B[0],ep)+Math.sin(ms*.003+p.a*5)*28*fl; y=lerp(A[1],B[1],ep)-fl*H*.06;
      if(fl>.02 && x>-5 && y>-5 && x<W+5 && y<H+5){
        const rt=p.a+ms*.004*p.sp, sz=2.2+p.r*1.6, sq=Math.cos(ms*.005*p.sp+p.a);
        ctx.save(); ctx.translate(x,y); ctx.rotate(rt); ctx.scale(Math.max(.2,Math.abs(sq)),1);
        ctx.fillStyle = ep>.6 ? `rgba(${FOIL[p.hue]},.9)` : `rgba(255,252,246,.95)`; ctx.fillRect(-sz/2,-sz*.65,sz,sz*1.3);
        ctx.strokeStyle=`rgba(58,40,62,${.35*(1-ep)})`; ctx.lineWidth=.6; ctx.strokeRect(-sz/2,-sz*.65,sz,sz*1.3);
        ctx.restore(); continue;
      }
    } else { x=lerp(A[0],B[0],e)+Math.cos(p.dir)*burstAmp*p.sp; y=lerp(A[1],B[1],e)+Math.sin(p.dir)*burstAmp*p.sp; }
    const ddx=x+p.dx-mx, ddy=y+p.dy-my, d2=ddx*ddx+ddy*ddy;
    if(d2<8100 && !reduce){const d=Math.sqrt(d2)||1,fz=(90-d)/90*3;p.dx+=ddx/d*fz;p.dy+=ddy/d*fz;}
    p.dx*=.9; p.dy*=.9; x+=p.dx; y+=p.dy;
    if(x<-5||y<-5||x>W+5||y>H+5) continue;
    if(foil){ const tw=reduce?1:.55+.45*Math.sin(ms*.004+p.a*7); ctx.fillStyle=`rgba(${FOIL[p.hue]},${alpha*tw})`; ctx.fillRect(x,y,p.r*1.6,p.r*1.6); }
    else { ctx.fillStyle=`rgba(${COLS[p.hue]},${alpha})`; ctx.fillRect(x,y,p.r,p.r); }
  }
  // faint keypoints: the "tracked" layer
  const kp=(pose,a)=>{ if(a<=0.01)return; const {box,pts}=pose, X=q=>[box.x+q[0]*box.s, box.y+q[1]*box.s];
    ctx.strokeStyle=`rgba(176,96,122,${.28*a})`; ctx.lineWidth=.8; ctx.beginPath();
    [[1,2],[1,3],[2,4],[4,6],[3,5],[5,7],[8,10],[10,12],[9,11],[11,13],[2,8],[3,9],[8,9]].forEach(([i,j])=>{const A=X(pts[i]),B=X(pts[j]);ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);}); ctx.stroke();
    pts.forEach((q,i)=>{ if(!i)return; const [x,y]=X(q); ctx.fillStyle=`rgba(176,96,122,${.8*a})`; ctx.beginPath(); ctx.arc(x,y,2.2,0,7); ctx.fill(); });
  };
  if(hero){ kp(hero, clamp(1-s*3)); if(++hudTick%12===0) $('#hud').innerHTML=`pose · ${hero.name}<br>confidence 0.9${(ms/900|0)%4+5}`; }
  if(bow) kp(bow, clamp((s-4.75)*4));
  // books fade in as their outlines fill
  const ba=clamp((s-3.78)/.2); if(ba!==lastBA){ lastBA=ba; books.forEach(el=>el.style.opacity=String(ba)); const be=$('#bookend'); if(be) be.style.opacity=String(ba); }
  if(!reduce && !stopped) raf=requestAnimationFrame(frame);
}
let lastBA=-1;

raf=requestAnimationFrame(frame);
if(reduce){ const kick=()=>requestAnimationFrame(frame); addEventListener('scroll',kick,{passive:true}); addEventListener('resize',kick); cleanups.push(()=>{removeEventListener('scroll',kick); removeEventListener('resize',kick);}); }
return ()=>{ stopped=true; cancelAnimationFrame(raf); cleanups.forEach(f=>f()); };
}
