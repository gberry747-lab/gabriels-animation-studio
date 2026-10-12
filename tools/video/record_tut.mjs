// Records the video tour: headless Chrome plays each new game with the robot players and we keep the screencast frames.
// Usage: node record.mjs <outDir>
import {spawn} from 'node:child_process';
import fs from 'node:fs';
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const prof=OUT+'/chrome-profile';fs.rmSync(prof,{recursive:true,force:true});
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=9336','--user-data-dir='+prof,'--no-first-run','--hide-scrollbars','--force-device-scale-factor=1','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));await sleep(2500);
const tabs=await (await fetch('http://127.0.0.1:9336/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pend=new Map(),handlers=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id);}else if(m.method)for(const h of handlers)h(m);};
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
const ev=async(expr)=>{const r=await send('Runtime.evaluate',{expression:expr,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0,600));return r.result.result.value;};
await send('Page.enable');await send('Runtime.enable');
const view=async(w,h)=>send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
// ---- the game ----
await view(1300,1000);await send('Page.navigate',{url:'http://localhost:8766/zz-seed.html'});await sleep(2500);
await ev(`(()=>{window.D={c:document.getElementById('canvas'),pt(x,y){const r=this.c.getBoundingClientRect();return{clientX:r.left+x*r.width/1280,clientY:r.top+y*r.height/720}},ev(type,x,y){this.c.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:5,pointerType:'touch',isPrimary:true,button:0,...this.pt(x,y)}))},sleep:ms=>new Promise(r=>setTimeout(r,ms)),async drag(pts,ms){this.ev('pointerdown',pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++){await this.sleep(ms/pts.length);this.ev('pointermove',pts[i].x,pts[i].y);}await this.sleep(60);const l=pts[pts.length-1];this.ev('pointerup',l.x,l.y);},async tap(x,y){this.ev('pointerdown',x,y);await this.sleep(70);this.ev('pointerup',x,y);}};return 1;})()`);
const KEYS=(process.argv[3]||'sling,defense,kart,gems,beat,path,pals,notes').split(',');const SEG=[];for(const k of KEYS){const len=await ev(`__t.TUTORIALS['${k}'].length`);SEG.push({name:'tut_'+k,dur:len+3,speed:1,go:`(()=>{__t.tutStart('${k}');return 1;})()`});}
const rect=[];
for(const seg of SEG){await ev(`__t.backToDrawing&&__t.backToDrawing(),1`);await sleep(300);
  const frames=[];const h=m=>{if(m.method==='Page.screencastFrame'){frames.push({data:m.params.data,ts:m.params.metadata.timestamp});send('Page.screencastFrameAck',{sessionId:m.params.sessionId});}};handlers.push(h);
  await send('Page.startScreencast',{format:'jpeg',quality:90,everyNthFrame:1});ev(seg.go).catch(e=>console.log('script error',seg.name,e.message));
  await sleep(seg.dur*1000);await send('Page.stopScreencast');handlers.splice(handlers.indexOf(h),1);
  const r=await ev(`(()=>{const b=document.getElementById('canvas').getBoundingClientRect();return [b.left,b.top,b.width,b.height].map(Math.round)})()`);
  const dir=OUT+'/'+seg.name;fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir);let list='';frames.forEach((f,i)=>{const fn=`f${String(i).padStart(5,'0')}.jpg`;fs.writeFileSync(dir+'/'+fn,Buffer.from(f.data,'base64'));const d=i<frames.length-1?frames[i+1].ts-f.ts:1/30;list+=`file '${fn}'\nduration ${Math.max(.001,d).toFixed(4)}\n`;});if(frames.length)list+=`file 'f${String(frames.length-1).padStart(5,'0')}.jpg'\n`;fs.writeFileSync(dir+'/list.txt',list);
  rect.push({name:seg.name,speed:seg.speed,rect:r,frames:frames.length,span:frames.length?frames[frames.length-1].ts-frames[0].ts:0});console.log(seg.name,frames.length,'frames over',(frames.length?frames[frames.length-1].ts-frames[0].ts:0).toFixed(1)+'s','canvas',r.join(','));}
fs.writeFileSync(OUT+'/segments.json',JSON.stringify(rect,null,1));chrome.kill();process.exit(0);
