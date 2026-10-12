// Gem Quest QA: a greedy robot plays every level several times (different random boards).
// It tries every legal swap on a copy of the board and keeps the one that helps the goal most.
// Run: node tools/gems-bot.js [games per level, default 8]
const {boot}=require('../test/run.js');
const t=boot();t.setStrokes(t.botStrokes('#e65345').map(s=>({...s,points:s.points.map(p=>({...p}))})));
const N=+process.argv[2]||8;
function value(S0,S){return (S0.iceLeft-S.iceLeft)*120+(S.collected-S0.collected)*(S.L.goal.type==='collect'?90:0)+(S.score-S0.score)*(S.L.goal.type==='score'?1:.2)+(S.made-S0.made)*40;}
function play(wi,li,seed){t.startModGame(t.GEMS,{world:wi,level:li,seed});const g=t.game,S=g.s;let guard=0;
  while(!g.over&&guard++<200){if(S.power>=t.GQ_BLAST){t.gqBlast(g,true);continue;}const moves=t.gqMoves(S);let best=null,bv=-1;for(const [a,b] of moves){const C=t.gqClone(S),fake={s:C,over:false,shake:0};t.gqTrySwap(fake,a,b,'sim');const v=value(S,C);if(v>bv){bv=v;best=[a,b];}}
    if(!best)break;t.gqTrySwap(g,best[0],best[1],true);}
  const r={won:g.over&&g.won,left:S.moves};t.backToDrawing();return r;}
let total=0,rows=[];for(let wi=0;wi<t.GQ_WORLDS.length;wi++)for(let li=0;li<t.GQ_LEVELS;li++){let w=0,left=0;for(let k=0;k<N;k++){const r=play(wi,li,1000+k*7919);if(r.won){w++;left+=r.left;}}total+=w;const L=t.gqLevel(wi,li);rows.push(`${t.GQ_WORLDS[wi].name} ${li+1} (${L.goal.type} ${L.goal.n}, ${L.moves} moves): won ${w}/${N}${w?', avg '+(left/w).toFixed(1)+' moves left':''}`);}
console.log(rows.join('\n'));console.log('robot won '+total+'/'+(N*30));process.exit(0);
