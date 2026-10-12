// Monster Pals QA: for every pal and every mini-game, a careful robot should make friends,
// and a robot tapping at random should usually fail. Run: node tools/pals-bot.js
const {boot}=require('../test/run.js');
const t=boot();
function predict(S,dt){let x=S.px,d=S.dir;let left=dt*S.speed;while(left>0){const lim=d>0?1120-x:x-160,step=Math.min(left,lim);x+=d*step;left-=step;if(left>0)d=-d;}return x;}
function play(pal,mode,smart,seed){t.plProg().have={};t.plProg().have={};for(const h of t.PL_HABITATS)if(h.need)for(let i=0;i<h.need;i++)t.plProg().have[i]=1;
  const hab=t.PL_HABITATS.findIndex(h=>h.id===t.PL_PALS[pal].hab);t.startModGame(t.PALS,{habitat:hab,pal,mode,seed});const g=t.game,S=g.s;let r=seed*7+1;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647;};
  for(let f=0;f<60*90&&!g.over;f++){g.mod.update(g,1/60);if(S.phase!=='play'||f%6)continue;
    if(S.mode==='toss'&&!S.shots.some(s=>!s.done)){if(smart){const x=global.NAIVE?S.px:predict(S,.5);g.mod.pointer(g,'down',{x,y:440});}else if(rnd()<.2)g.mod.pointer(g,'down',{x:160+rnd()*960,y:200+rnd()*400});}
    else if(S.mode==='dance'&&S.sub==='input'){const want=smart?S.seq[S.inputs.length]:['left','up','right','spin'][Math.floor(rnd()*4)],b=t.plDanceButtons().find(b=>b.id===want);g.mod.pointer(g,'down',{x:b.x+5,y:b.y+5});}
    else if(S.mode==='peek'){if(smart){if(S.peekAt>=0&&S.peekT<S.peekLen-.2){const b=t.plBushes()[S.peekAt];g.mod.pointer(g,'down',{x:b.x,y:b.y-60});}}else if(rnd()<.15){const b=t.plBushes()[Math.floor(rnd()*4)];g.mod.pointer(g,'down',{x:b.x,y:b.y-60});}}}
  const won=g.over&&g.won;t.backToDrawing();return won;}
for(const [mode,naive] of [['toss',false],['toss',true],['dance',false],['peek',false]]){global.NAIVE=naive;let smart=0,rand=0,n=0;for(let pal=0;pal<25;pal++)for(let k=0;k<3;k++){n++;if(play(pal,mode,true,pal*13+k+1))smart++;if(play(pal,mode,false,pal*17+k+1))rand++;}console.log(`${mode}${naive?' (aiming at where the pal is now)':''}: careful robot made friends ${smart}/${n}, random tapping ${rand}/${n}`);}
process.exit(0);
