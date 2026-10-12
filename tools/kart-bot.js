// Hero Kart QA: a robot drives every road with no upgrades and with every upgrade maxed.
// Each road ends at a 2500 m finish line. A plain kart should get 2 stars; a couple of upgrades should reach the finish. Run: node tools/kart-bot.js
const {boot,byId}=require('../test/run.js');
const t=boot();t.setStrokes(t.botStrokes('#e65345').map(s=>({...s,points:s.points.map(p=>({...p}))})));
const press=(a,on)=>on?t.inputDown('p1',a,'bot'):t.inputUp('p1',a,'bot');
function drive(si,lvl){const p=t.ktProg();for(const u of t.KT_UP)p.up[u.id]=lvl;t.startModGame(t.KART,{stage:si});const g=t.game,S=g.s;let f=0;
  while(!g.over&&f++<60*600){const a=S.car.ch.angle,air=!(S.car.wl.position.y+30>=t.ktGround(S.st,S.car.wl.position.x))&&!(S.car.wr.position.y+30>=t.ktGround(S.st,S.car.wr.position.x));
    const cx=S.car.ch.position.x,slope=Math.atan2(t.ktGround(S.st,cx+30)-t.ktGround(S.st,cx-30),60),rel=a-slope;let gas=true,brake=false;if(!air&&rel<-.45)gas=false;if(air){gas=a>.15;brake=a<-.35;}press('right',gas);press('left',brake);g.mod.update(g,1/60);}
  press('right',false);press('left',false);const r={why:/complete/.test(byId.get('resultTitle').textContent)?'FINISHED':/flipped/.test(byId.get('resultTitle').textContent)?'flip':/battery/.test(byId.get('resultTitle').textContent)?'battery':'stuck',m:Math.floor(S.dist),coins:S.got,t:Math.round(g.time)};t.backToDrawing();return r;}
for(let si=0;si<t.KT_STAGES.length;si++){const r=[0,1,2,3,5].map(l=>drive(si,l));console.log(`${t.KT_STAGES[si].name}: `+r.map((x,l)=>`L${[0,1,2,3,5][l]} ${x.m}m ${x.why} ${x.t}s ${x.coins}c`).join(' | '));}
process.exit(0);
