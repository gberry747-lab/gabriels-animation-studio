// Draw Path level generator. For each level it tries random layouts and keeps the first one where:
//  - doing nothing loses, and (after the first two levels) one straight line from the hero to the basket also loses,
//  - a solver CAN win by drawing a line with one or two bends (so every level is beatable),
//  - the 3 gems sit along a winning path (so 3 stars are possible) and the ink allows ~1.5x that path.
// The winning line is saved as L.sol: the game shows it as a hint after 3 failed tries, and the tests redraw it wobbly by hand.
// Writes the levels into index.html (DP_DATA). Run: node tools/path-gen.js
const fs=require('fs'),path=require('path');const {boot}=require('../test/run.js');const t=boot();
const W=1280,H=720;
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let x=a;x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return((x^(x>>>14))>>>0)/4294967296;};}
const R=(r,a,b)=>a+r()*(b-a),overlap=(a,b,pad=0)=>a[0]-pad<b[0]+b[2]&&a[0]+a[2]+pad>b[0]&&a[1]-pad<b[1]+b[3]&&a[1]+a[3]+pad>b[1];
function layout(wi,li,r){const L={s:[Math.round(R(r,100,250)),Math.round(R(r,90,230))],g:[Math.round(R(r,900,1170)),Math.round(R(r,420,610))],walls:[],spikes:[],bounce:[],nodraw:[],gems:[],ink:0};
  const keep=[[L.s[0]-60,L.s[1]-60,120,130],[L.g[0]-80,L.g[1]-80,160,140]],free=b=>!keep.some(k=>overlap(b,k,20))&&![...L.walls,...L.nodraw].some(k=>overlap(b,k,40));
  const nObs=li<2?0:li<5?1:2;
  for(let k=0;k<nObs;k++){for(let tries=0;tries<30;tries++){const x=Math.round(R(r,380,820));let box;
    if(wi===0){const h=Math.round(R(r,140,300));box=[x,H-h,Math.round(R(r,40,70)),h];if(free(box)){L.walls.push(box);break;}}
    else if(wi===1){if(r()<.6){const top=Math.round(R(r,300,520)),w=Math.round(R(r,50,90));box=[x,top,w,H-top];if(free(box)){L.walls.push(box);L.spikes.push([x,top,w]);break;}}else{const h=Math.round(R(r,120,300));box=[x,0,Math.round(R(r,50,90)),h];if(free(box)){L.walls.push(box);break;}}}
    else{box=[x,Math.round(R(r,150,450)),Math.round(R(r,110,200)),Math.round(R(r,90,180))];if(free(box)){L.nodraw.push(box);if(li>=5&&r()<.5){const sp=[box[0],box[1]+box[3]+60,box[2]];L.spikes.push(sp);L.walls.push([sp[0],sp[1],sp[2],18]);}break;}}}}
  return L;}
function crossesZone(L,pts){for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/8);for(let k=0;k<=n;k++){const x=a.x+(b.x-a.x)*k/n,y=a.y+(b.y-a.y)*k/n;if(t.dpInZone(L,x,y))return true;}}return false;}
function solve(L){const A={x:L.s[0]-40,y:L.s[1]+t.DP_R+24},B={x:L.g[0]-72,y:L.g[1]-16},cands=[[A,B]];
  for(let x=300;x<=1050;x+=75)for(let y=120;y<=660;y+=45)cands.push([A,{x,y},B]);
  for(let x1=280;x1<=700;x1+=105)for(let y1=160;y1<=640;y1+=80)for(let x2=x1+120;x2<=1050;x2+=105)for(let y2=y1;y2<=660;y2+=80)cands.push([A,{x:x1,y:y1},{x:x2,y:y2},B]);
  const ok=cands.filter(c=>!crossesZone(L,c)).map(c=>({c,len:t.dpInkLen([c])})).sort((a,b)=>a.len-b.len);
  for(const {c,len} of ok){const sm=t.dpSmooth(resample(c,14));const r=t.dpSimulate(L,[sm],true);if(r.status!=='won')continue;let robust=0;for(let k=0;k<5;k++)if(t.dpSimulate(L,[t.dpSmooth(resample(c,14,6,rng(len*7+k)))]).status==='won')robust++;if(robust>=4)return{c:sm,len,path:r.path};}return null;}
// Points every `step` px along a polyline, optionally wobbled like a finger-drawn line.
function resample(c,step,wob=0,r=null){const out=[];for(let i=1;i<c.length;i++){const a=c[i-1],b=c[i],n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/step));for(let k=(i===1?0:1);k<=n;k++){const mid=k&&k<n&&wob;out.push({x:a.x+(b.x-a.x)*k/n+(mid?(r()-.5)*2*wob:0),y:a.y+(b.y-a.y)*k/n+(mid?(r()-.5)*2*wob:0)});}}return out;}
const out=[];let report=[];
for(let wi=0;wi<3;wi++)for(let li=0;li<8;li++){let found=null;
  for(let at=0;at<400&&!found;at++){const r=rng(1000+wi*977+li*131+at*7919),L=layout(wi,li,r);
    if(t.dpSimulate(L,[]).status==='won')continue;
    const A={x:L.s[0]-40,y:L.s[1]+t.DP_R+24},B={x:L.g[0]-72,y:L.g[1]-16};if(li>=2&&!crossesZone(L,[A,B])&&t.dpSimulate(L,[[A,B]]).status==='won')continue;
    const sol=solve(L);if(!sol)continue;
    const P=sol.path,gems=[];for(const f of [.3,.55,.78]){const p=P[Math.floor(P.length*f)],q=P[Math.min(P.length-1,Math.floor(P.length*f)+3)],dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy)||1,off=-(8+li*2);gems.push([Math.round(p.x-dy/l*off),Math.round(p.y+dx/l*off)]);}
    L.gems=gems;L.ink=Math.round(sol.len*(li<3?1.8:li<6?1.55:1.4)+60);
    sol.c=sol.c.map(p=>({x:Math.round(p.x),y:Math.round(p.y)}));const check=t.dpSimulate(L,[sol.c]);if(check.status!=='won'||check.gems<3)continue;let g3=0;for(let k=0;k<5;k++){const rr=t.dpSimulate(L,[t.dpSmooth(resample(sol.c,14,5,rng(li*31+k)))]);if(rr.status==='won'&&rr.gems===3)g3++;}if(g3<3)continue;
    L.sol=sol.c.map(p=>[Math.round(p.x),Math.round(p.y)]);L.ink=Math.max(L.ink,Math.round(t.dpInkLen([sol.c])*1.35+60));found={L,at,len:Math.round(sol.len),bends:0};}
  if(!found){console.log('FAILED to make world',wi,'level',li);process.exit(1);}
  out.push(found.L);report.push(`${t.DP_WORLDS[wi].name} ${li+1}: layout #${found.at}, solver path ${found.len}px ink ${found.L.ink}, ${found.L.walls.length} walls, ${found.L.spikes.length} spikes, ${found.L.nodraw.length} no-ink zones`);}
// Seasonal Draw Path sets (same rules, different seeds and obstacle styles).
const SEASON_SETS=[{id:'thanksgiving',style:[0,0,0,1,0,1,1,1],levels:8,salt:50000}],seasonOut={};
for(const set of SEASON_SETS){seasonOut[set.id]=[];for(let li=0;li<set.levels;li++){let found=null;for(let at=0;at<400&&!found;at++){const r=rng(set.salt+li*131+at*7919),L=layout(set.style[li],Math.min(7,li+1),r);if(t.dpSimulate(L,[]).status==='won')continue;const A={x:L.s[0]-40,y:L.s[1]+t.DP_R+24},B={x:L.g[0]-72,y:L.g[1]-16};if(li>=2&&!crossesZone(L,[A,B])&&t.dpSimulate(L,[[A,B]]).status==='won')continue;const sol=solve(L);if(!sol)continue;const P=sol.path,gems=[];for(const f of [.3,.55,.78]){const p=P[Math.floor(P.length*f)],q=P[Math.min(P.length-1,Math.floor(P.length*f)+3)],dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy)||1,off=-(8+li*2);gems.push([Math.round(p.x-dy/l*off),Math.round(p.y+dx/l*off)]);}L.gems=gems;L.ink=Math.round(sol.len*(li<3?1.8:1.55)+60);sol.c=sol.c.map(p=>({x:Math.round(p.x),y:Math.round(p.y)}));const check=t.dpSimulate(L,[sol.c]);if(check.status!=='won'||check.gems<3)continue;let g3=0;for(let k=0;k<5;k++){const rr=t.dpSimulate(L,[t.dpSmooth(resample(sol.c,14,5,rng(li*31+k+set.salt)))]);if(rr.status==='won'&&rr.gems===3)g3++;}if(g3<3)continue;L.sol=sol.c.map(p=>[p.x,p.y]);L.ink=Math.max(L.ink,Math.round(t.dpInkLen([sol.c])*1.35+60));found=L;}if(!found){console.log('FAILED season',set.id,li);process.exit(1);}seasonOut[set.id].push(found);report.push(`${set.id} ${li+1}: ink ${found.ink}, ${found.walls.length} walls, ${found.spikes.length} spikes`);}}
const file=path.join(__dirname,'..','index.html');let src=fs.readFileSync(file,'utf8');src=src.replace(/const DP_DATA=\/\*DP_DATA\*\/\[[^\n]*?\];/,'const DP_DATA=/*DP_DATA*/'+JSON.stringify(out)+';');src=src.replace(/const DP_SEASON=\/\*DP_SEASON\*\/\{[^\n]*?\};/,'const DP_SEASON=/*DP_SEASON*/'+JSON.stringify(seasonOut)+';');fs.writeFileSync(file,src);
console.log(report.join('\n'));console.log('wrote '+out.length+' levels into index.html');process.exit(0);
