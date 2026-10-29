// Headless play harness for Gabriel's Animation Studio QA. Requires the game served over http (see serve.sh).
// Usage as a module:  const {launch}=require('/path/to/play.js'); const api=await launch({url,out}); await api.start('brawl'); ...
// CLI demo:           node play.js --url http://localhost:8766/index.html --game brawl --seconds 8 --out shots/brawl
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const SEED=JSON.parse(fs.readFileSync(path.join(__dirname,'seed.json'),'utf8'));
async function launch({url='http://localhost:8766/index.html',out='shots',viewport={width:1024,height:768},drawing=true}={}){
  fs.mkdirSync(out,{recursive:true});
  const browser=await chromium.launch({headless:true});
  const ctx=await browser.newContext({viewport,hasTouch:true});
  const page=await ctx.newPage();
  const logs=[],errors=[];
  page.on('console',m=>{logs.push(m.type()+': '+m.text());if(m.type()==='error')errors.push(m.text());});
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  await page.addInitScript(({seed,drawing})=>{try{if(drawing)localStorage.setItem('doodle-go-v1',JSON.stringify(seed));localStorage.setItem('gas-player-v1',JSON.stringify({name:'Tester',id:'qa-tester-1'}));localStorage.setItem('gas-tab-v1','games');}catch(e){}},{seed:SEED,drawing});
  await page.goto(url,{waitUntil:'load'});
  await page.waitForTimeout(700);
  await page.evaluate(()=>{document.querySelectorAll('.modal:not([hidden]) button').forEach(b=>{if(/skip/i.test(b.textContent))b.click();});});
  let n=0;
  const G=g=>g; // game coords are 1280x720
  const api={browser,page,logs,errors,
    shot:async(name)=>{const f=path.join(out,String(++n).padStart(2,'0')+'-'+(name||'shot')+'.png');await page.screenshot({path:f});return f;},
    // id = a data-game value (platform,dash,catch,flap,pop,dodge,bounce,goal) or a button id (vs2,vscpu,brawl,quest,house,plane,hoops,sling,defense,kart,gems,beat,path,pals,notes)
    start:async(id,{pickFirst=true}={})=>{
      await page.evaluate(id=>{const b=document.querySelector(`[data-game="${id}"]`)||document.getElementById(id);if(!b)throw new Error('no game button '+id);b.click();},id);
      await page.waitForTimeout(400);
      if(pickFirst)await page.evaluate(()=>{const m=document.getElementById('modal');if(m&&!m.hidden){const b=m.querySelector('.pal-play')||[...m.querySelectorAll('button')].find(b=>!b.disabled&&(b.classList.contains('world-card')||/\b(play|start|go|fight|easy|normal)\b/i.test(b.textContent)));if(b)b.click();}});
      await page.waitForTimeout(600);
      return api.state();
    },
    state:()=>page.evaluate(()=>({playing:document.body.classList.contains('playing'),title:(document.getElementById('gameTitle')||{}).textContent,modalOpen:!document.getElementById('modal').hidden,modalText:document.getElementById('modal').hidden?'':document.getElementById('modal').innerText.slice(0,400),pads:[...document.querySelectorAll('#gameBottom button')].filter(b=>!b.hidden&&b.offsetParent).map(b=>b.textContent.trim()),hearts:document.getElementById('hearts').textContent,score:document.getElementById('score').textContent,message:document.getElementById('gameMessage').textContent,result:document.getElementById('result').hidden?null:{title:document.getElementById('resultTitle').textContent,text:document.getElementById('resultText').textContent}})),
    canvasBox:()=>page.evaluate(()=>{const r=document.getElementById('canvas').getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height};}),
    // taps and drags in GAME coordinates (0-1280 x 0-720)
    tap:async(gx,gy)=>{const b=await api.canvasBox();await page.mouse.click(b.x+gx*b.w/1280,b.y+gy*b.h/720);},
    drag:async(gx1,gy1,gx2,gy2,ms=300,{holdMs=0}={})=>{const b=await api.canvasBox();const X=g=>b.x+g*b.w/1280,Y=g=>b.y+g*b.h/720;await page.mouse.move(X(gx1),Y(gy1));await page.mouse.down();const steps=Math.max(3,Math.round(ms/30));for(let i=1;i<=steps;i++){await page.mouse.move(X(gx1+(gx2-gx1)*i/steps),Y(gy1+(gy2-gy1)*i/steps));await page.waitForTimeout(ms/steps);}if(holdMs)await page.waitForTimeout(holdMs);await page.mouse.up();},
    // keyboard: legacy games ArrowLeft/ArrowRight/ArrowUp(Space)=jump; big games also KeyF=punch/fire(a) KeyG=kick(b) KeyH=block/shield(c) ArrowDown=down. 2-player: WASD+FGH vs arrows+JKL
    hold:async(key,ms)=>{await page.keyboard.down(key);await page.waitForTimeout(ms);await page.keyboard.up(key);},
    press:async(key)=>page.keyboard.press(key),
    // press an on-screen button by its text (e.g. 'Punch', 'Jump')
    pad:async(label,ms=120)=>{await page.evaluate(([l,ms])=>{const b=[...document.querySelectorAll('#gameBottom button')].find(b=>b.textContent.includes(l));if(!b)throw new Error('no pad '+l);const r=b.getBoundingClientRect();const o={bubbles:true,pointerId:5,clientX:r.left+r.width/2,clientY:r.top+r.height/2,isPrimary:true};b.dispatchEvent(new PointerEvent('pointerdown',o));setTimeout(()=>b.dispatchEvent(new PointerEvent('pointerup',o)),ms);},[label,ms]);await page.waitForTimeout(ms+30);},
    clickText:async(txt)=>{await page.evaluate(t=>{const b=[...document.querySelectorAll('button')].find(b=>!b.disabled&&b.offsetParent&&b.textContent.includes(t));if(!b)throw new Error('no button '+t);b.click();},txt);await page.waitForTimeout(300);},
    wait:ms=>page.waitForTimeout(ms),
    back:async()=>{await page.evaluate(()=>document.getElementById('back').click());await page.waitForTimeout(300);},
    closeModal:async()=>{await page.evaluate(()=>{const m=document.getElementById('modal');if(m&&!m.hidden){const b=[...m.querySelectorAll('button')].find(b=>b.getAttribute('aria-label')==='Close'||/^(✕|×|close)$/i.test(b.textContent.trim()));if(b)b.click();}});await page.waitForTimeout(200);},
    close:async()=>browser.close()};
  return api;
}
module.exports={launch};
if(require.main===module){(async()=>{const a=process.argv.slice(2);const get=(k,d)=>{const i=a.indexOf(k);return i>=0?a[i+1]:d;};const api=await launch({url:get('--url','http://localhost:8766/index.html'),out:get('--out','shots')});const game=get('--game');if(game){console.log(JSON.stringify(await api.start(game)));await api.shot('start');const secs=+get('--seconds',8);const keys=['ArrowRight','ArrowUp','KeyF','ArrowLeft','Space','KeyG'];const t0=Date.now();let i=0;while(Date.now()-t0<secs*1000){await api.hold(keys[i++%keys.length],250);if(i%6===0)await api.shot('play');}await api.shot('end');console.log(JSON.stringify(await api.state()));}else await api.shot('home');console.log('errors:',JSON.stringify(api.errors));await api.close();})().catch(e=>{console.error(e);process.exit(1);});}
