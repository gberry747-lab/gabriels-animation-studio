// Beat Run QA: a robot that jumps exactly on every marked beat (holding for boxes and gaps) must finish
// every song with all 3 hearts; a robot that never jumps must lose. Run: node tools/beat-bot.js
const {boot}=require('../test/run.js');
const t=boot();t.setStrokes(t.botStrokes('#e65345').map(s=>({...s,points:s.points.map(p=>({...p}))})));
function play(si,li,mode){t.startModGame(t.BEATRUN,{stage:si,level:li});const g=t.game,S=g.s;let next=0,holdUntil=-1;const beats=S.song.beats;
  for(let f=0;f<60*400&&!g.over;f++){if(mode==='perfect'){while(next<beats.length&&beats[next]==='.')next++;if(next<beats.length&&S.beatPos>=next){g.mod.pointer(g,'down',{x:0,y:0});holdUntil=beats[next]==='s'?S.beatPos+.05:S.beatPos+.4;next++;}if(holdUntil>=0&&S.beatPos>=holdUntil){g.mod.pointer(g,'up',{x:0,y:0});holdUntil=-1;}}
    g.mod.update(g,1/60);}
  const r={won:g.over&&g.won,hearts:S.hearts,perfect:S.perfect};t.backToDrawing();return r;}
let ok=0,idleWins=0;for(let si=0;si<t.BR_STAGES.length;si++)for(let li=0;li<t.BR_LEVELS;li++){const p=play(si,li,'perfect'),n=play(si,li,'none');if(p.won&&p.hearts===3)ok++;if(n.won)idleWins++;const song=t.brSong(si,li);console.log(`${t.BR_STAGES[si].name} ${li+1} (${song.bpm} bpm, ${song.beats.filter(k=>k!=='.').length} jumps): robot ${p.won?'finished ♥'+p.hearts:'LOST'} ${p.perfect} perfect | no jumping: ${n.won?'FINISHED (bad)':'lost'}`);}
console.log(`perfect robot 3-hearted ${ok}/18; no-jump robot finished ${idleWins}/18`);process.exit(0);
