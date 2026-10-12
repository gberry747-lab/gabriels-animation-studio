// Slingshot Siege solver: proves each level can be beaten with plain heroes (no powers) by trying a grid of shots
// and greedily keeping the shot that knocks out the most monsters. Slow: run one world per process.
// Run: node tools/sling-solve.js <world 0-4>    (prints one line per level)
const {boot}=require('../test/run.js');
const t=boot();
t.setStrokes(t.botStrokes('#e65345').map(s=>({...s,points:s.points.map(p=>({...p}))})));
const wi=+process.argv[2]||0,ANG=[],POW=[.42,.52,.62,.72,.82,.92,1];for(let a=8;a<=76;a+=4)ANG.push(a*Math.PI/180);
function play(li,shots){t.startModGame(t.SLING,{world:wi,level:li});const g=t.game;for(const [a,p] of shots){if(g.over)break;const l=p*150;if(!t.slLaunch(g,Math.cos(a)*l*t.SL_VK,-Math.sin(a)*l*t.SL_VK))break;let f=0;while(!g.over&&g.s.phase!=='aim'&&f++<1200)g.mod.update(g,1/60);}let f=0;while(!g.over&&g.s.mons.every(b=>b.sl.dead)&&f++<200)g.mod.update(g,1/60);return{alive:g.s.mons.filter(b=>!b.sl.dead).length,won:g.over&&g.won,total:g.s.mons.length,shots:g.s.shots};}
for(let li=0;li<t.SL_LEVELS;li++){const chosen=[];let st=play(li,[]);const max=st.shots;
  while(!st.won&&chosen.length<max){let best=null;for(const a of ANG)for(const p of POW){const r=play(li,chosen.concat([[a,p]]));if(!best||r.alive<best.r.alive||(r.won&&!best.r.won))best={a,p,r};if(r.won)break;}if(best.r.won||best.r.alive<st.alive||!best){}chosen.push([best.a,best.p]);st=best.r;if(st.won)break;}
  console.log(`world ${wi} level ${li+1}: ${st.won?'BEATEN with '+chosen.length+' of '+max+' heroes':'NOT beaten, '+st.alive+' of '+st.total+' monsters left after '+max+' heroes'} | shots ${chosen.map(([a,p])=>Math.round(a*180/Math.PI)+'°/'+Math.round(p*100)+'%').join(' ')}`);
  t.backToDrawing();}
process.exit(0);
