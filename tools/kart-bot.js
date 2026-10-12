// Hero Kart QA: a robot drives every road with no upgrades and with every upgrade maxed.
// Without upgrades the first road should give a star (300 m) but not open the next road on its own;
// fully upgraded it should open every road. Run: node tools/kart-bot.js
const {boot,byId}=require('../test/run.js');
const t=boot();t.setStrokes(t.botStrokes('#e65345').map(s=>({...s,points:s.points.map(p=>({...p}))})));
const press=(a,on)=>on?t.inputDown('p1',a,'bot'):t.inputUp('p1',a,'bot');
function drive(si,lvl){const p=t.ktProg();for(const u of t.KT_UP)p.up[u.id]=lvl;t.startModGame(t.KART,{stage:si});const g=t.game,S=g.s;let f=0;
  while(!g.over&&f++<60*600){const a=S.car.ch.angle,air=!(S.car.wl.position.y+30>=t.ktGround(S.st,S.car.wl.position.x))&&!(S.car.wr.position.y+30>=t.ktGround(S.st,S.car.wr.position.x));
    const cx=S.car.ch.position.x,slope=Math.atan2(t.ktGround(S.st,cx+30)-t.ktGround(S.st,cx-30),60),rel=a-slope;let gas=true,brake=false;if(!air&&rel<-.45)gas=false;if(air){gas=a>.15;brake=a<-.35;}press('right',gas);press('left',brake);g.mod.update(g,1/60);}
  press('right',false);press('left',false);const r={why:/flipped/.test(byId.get('resultTitle').textContent)?'flip':/battery/.test(byId.get('resultTitle').textContent)?'battery':'stuck',m:Math.floor(S.dist),coins:S.got,t:Math.round(g.time)};t.backToDrawing();return r;}
for(let si=0;si<t.KT_STAGES.length;si++){const a=drive(si,0),b=drive(si,3),c=drive(si,5);console.log(`${t.KT_STAGES[si].name}: no upgrades ${a.m} m ${a.why} (${a.coins} coins) | level 3 ${b.m} m ${b.why} | maxed ${c.m} m ${c.why} (${c.coins} coins)`);}
process.exit(0);
