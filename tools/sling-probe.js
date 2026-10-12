// Slingshot Siege level QA: every level must stand still on its own (no monster dies, nothing falls) before the player shoots.
// Run: node tools/sling-probe.js
const {boot,step}=require('../test/run.js');
const t=boot();
t.setStrokes(t.botStrokes('#e65345').map(s=>({...s,points:s.points.map(p=>({...p}))})));
let bad=0;const rows=[];
for(let wi=0;wi<t.SL_WORLDS.length;wi++)for(let li=0;li<t.SL_LEVELS;li++){
  if(!t.startModGame(t.SLING,{world:wi,level:li})){console.log('start failed',wi,li);bad++;continue;}
  const S=t.game.s,start=S.blocks.map(b=>({x:b.position.x,y:b.position.y}));
  step(300);
  const dead=S.mons.filter(b=>b.sl.dead).length,broken=S.blocks.filter(b=>b.sl.dead).length;
  let move=0;S.blocks.forEach((b,i)=>{if(!b.sl.dead)move=Math.max(move,Math.hypot(b.position.x-start[i].x,b.position.y-start[i].y));});
  const ok=!dead&&!broken&&move<6&&!t.game.over;if(!ok)bad++;
  rows.push(`${t.SL_WORLDS[wi].name} ${li+1}: ${S.mons.length} monsters, ${S.blocks.length} blocks, ${S.shots} heroes, moved ${move.toFixed(1)}px${dead?' DEAD '+dead:''}${broken?' BROKEN '+broken:''}${ok?'':'  <-- FAIL'}`);
  t.backToDrawing();
}
console.log(rows.join('\n'));console.log(bad?bad+' unstable levels':'all levels stable');process.exit(bad?1:0);
