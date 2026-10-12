// Backyard Defense QA: a simple robot player tries every level. Each level should be winnable by a sensible player,
// and nobody should win by doing nothing. Run: node tools/defense-bot.js [skill 0-1, default 1]
const {boot}=require('../test/run.js');
const t=boot();t.setStrokes(t.botStrokes('#e65345').map(s=>({...s,points:s.points.map(p=>({...p}))})));
const skill=process.argv[2]!=null?+process.argv[2]:1,think=skill>=1?.25:1.5; // a slower robot thinks less often
function sim(si,li,cleared,bot){t.dfProg().stars={};for(let k=0;k<cleared;k++)t.dfProg().stars[Math.floor(k/6)+'-'+(k%6)]=1;t.startModGame(t.DEFENSE,{scene:si,level:li});const g=t.game,S=g.s;let next=0;
  for(let f=0;f<60*400&&!g.over;f++){g.mod.update(g,1/60);if(bot&&S.t>=next){next=S.t+think;act(S,g);}}
  const r={won:g.over&&g.won,hearts:S.hearts,time:Math.round(S.t),guards:S.guards.length};t.backToDrawing();return r;}
function act(S,g){const has=id=>S.avail.some(d=>d.id===id),can=id=>{const d=t.DF_GUARDS.find(x=>x.id===id);return has(id)&&S.energy>=d.cost&&!(S.cool[id]>0);},at=(c,l)=>S.guards.find(q=>q.col===c&&q.lane===l);
  const threat=[0,0,0,0,0];for(const m of S.mons)threat[m.lane]+=m.hp*(m.x<700?2:1);
  const pals=S.guards.filter(q=>q.id==='power').length,busy=(c,l)=>S.mons.some(m=>m.lane===l&&Math.abs(m.x-(t.DF_X0+c*t.DF_CW+61))<90);
  if(pals<4&&can('power')){for(const l of [2,1,3,0,4])if(!at(0,l)&&!busy(0,l)){t.dfPlace(g,'power',0,l);return;}}
  const shooters=l=>S.guards.filter(q=>q.lane===l&&q.def.shot).length;
  // First make sure every lane has a cheap archer, like a sensible player would.
  for(const l of [2,1,3,0,4])if(!shooters(l)){if(can('archer'))for(const c of [1,2])if(!at(c,l)&&!busy(c,l)){t.dfPlace(g,'archer',c,l);return;}if(S.mons.length&&S.energy<100)return;}
  const lanes=[0,1,2,3,4].sort((a,b)=>(threat[b]-shooters(b)*150)-(threat[a]-shooters(a)*150));
  for(const l of lanes){const need=1+Math.floor(threat[l]/300);if(shooters(l)>=need&&threat[l]<600)continue;
    if(threat[l]>350&&!S.guards.some(q=>q.lane===l&&(q.id==='shield'))&&can('shield')&&!at(5,l)){t.dfPlace(g,'shield',5,l);return;}
    if(S.mons.some(m=>m.lane===l&&m.def.hp>=500)&&can('knight')){for(const c of [4,3])if(!at(c,l)&&!busy(c,l)){t.dfPlace(g,'knight',c,l);return;}}
    for(const id of ['blaster','frost','hammer','archer'])if(can(id)){const cols=id==='hammer'?[4,3]:[1,2,3,4];for(const c of cols)if(!at(c,l)&&!busy(c,l)){t.dfPlace(g,id,c,l);return;}}
    if(shooters(l)<need)return;}
  if(S.energy>350&&can('archer'))for(const l of [2,1,3,0,4])for(const c of [1,2,3])if(!at(c,l)){t.dfPlace(g,'archer',c,l);return;}}
let wins=0,idleWins=0,rows=[];
for(let si=0;si<t.DF_SCENES.length;si++)for(let li=0;li<t.DF_LEVELS;li++){const cleared=si*6+li,r=sim(si,li,cleared,true),idle=sim(si,li,cleared,false);if(r.won)wins++;if(idle.won)idleWins++;
  rows.push(`${t.DF_SCENES[si].name} ${li+1}: ${r.won?'WON ♥'+r.hearts:'LOST'} in ${r.time}s with ${r.guards} guards | do-nothing: ${idle.won?'WON (too easy!)':'lost at '+idle.time+'s'}`);}
console.log(rows.join('\n'));console.log(`robot (skill ${skill}) won ${wins}/30; do-nothing won ${idleWins}/30`);process.exit(0);
