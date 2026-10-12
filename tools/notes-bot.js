// Note Rush QA: a robot that taps every note on time must 3-star every song on piano and guitar; a robot that is
// a little late (0.1 s) should still finish; a robot that never taps must lose. Run: node tools/notes-bot.js
const {boot}=require('../test/run.js');
const t=boot();t.setStrokes(t.botStrokes('#e65345').map(s=>({...s,points:s.points.map(p=>({...p}))})));
function play(si,li,inst,off){t.startModGame(t.NOTERUSH,{stage:si,level:li,inst});const g=t.game,S=g.s;for(let f=0;f<60*400&&!g.over;f++){if(off!=null)for(const n of S.notes)if(!n.hit&&!n.miss&&S.t>=n.t+off)t.nrHit(g,n.lane);g.mod.update(g,1/60);}const r={won:g.won,stars:t.gpStars('notes',si,li),acc:Math.round(S.hits/S.notes.length*100),n:S.notes.length,len:Math.round(S.song.length)};t.backToDrawing();return r;}
let bad=0;for(let si=0;si<3;si++)for(let li=0;li<5;li++){const name=t.NR_SONGS[si*5+li][0];t.gpProg('notes').stars={};const p=play(si,li,'piano',0),gq=play(si,li,'guitar',0),late=play(si,li,'piano',.1),none=play(si,li,'piano',null);const ok=p.won&&p.acc===100&&gq.won&&gq.acc===100&&late.won&&!none.won;if(!ok)bad++;console.log(`${ok?'✓':'✗'} ${name}: ${p.n} notes, ${p.len}s | on time ${p.acc}% | guitar ${gq.acc}% | late 0.1s ${late.won?late.acc+'%':'LOST'} | no taps ${none.won?'WON?!':'lost'}`);}
console.log(bad?bad+' songs with problems':'every song is playable');process.exit(0);
