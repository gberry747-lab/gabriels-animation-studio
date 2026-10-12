// Records the promo hook: drawing a stick figure with a real mouse, then moves, gear and morph.
import {spawn} from 'node:child_process';import fs from 'node:fs';
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});const prof='/tmp/promo-profile-'+process.pid;
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=9338','--user-data-dir='+prof,'--no-first-run','--hide-scrollbars','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));await sleep(2500);const tabs=await (await fetch('http://127.0.0.1:9338/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pend=new Map(),handlers=[];ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id);}else if(m.method)for(const h of handlers)h(m);};const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
const ev=async expr=>{const r=await send('Runtime.evaluate',{expression:expr,awaitPromise:true,returnByValue:true});return r.result.result&&r.result.result.value;};
await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1300,height:1000,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://localhost:8766/zz-seed-empty.html'});await sleep(2500);
await ev(`(()=>{document.querySelector('[data-tab=draw]').click();const b=[...document.querySelectorAll('.swatch')].find(b=>/Blue/.test(b.getAttribute('aria-label')));if(b)b.click();const w=document.querySelectorAll('.widths button');if(w.length)w[w.length-1].click();window.scrollTo(0,0);return 1})()`);await sleep(500);
const r=await ev(`(()=>{const b=document.getElementById('canvas').getBoundingClientRect();return [b.left,b.top,b.width,b.height]})()`);const [cl,ct,cw,ch]=r;const P=(x,y)=>({x:cl+x*cw/1280,y:ct+y*ch/720});
const frames=[];const marks={};let t0=0;handlers.push(m=>{if(m.method==='Page.screencastFrame'){frames.push({data:m.params.data,ts:m.params.metadata.timestamp});if(!t0)t0=m.params.metadata.timestamp;send('Page.screencastFrameAck',{sessionId:m.params.sessionId});}});
const mark=name=>{marks[name]=frames.length?frames[frames.length-1].ts-frames[0].ts:0;};
await send('Page.startScreencast',{format:'jpeg',quality:90,everyNthFrame:1});await sleep(600);
const mouse=async(type,x,y)=>{const p=P(x,y);await send('Input.dispatchMouseEvent',{type,x:p.x,y:p.y,button:'left',buttons:type==='mouseReleased'?0:1,clickCount:1,pointerType:'mouse'});};
async function stroke(pts,ms){await mouse('mousePressed',pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++){await mouse('mouseMoved',pts[i].x,pts[i].y);await sleep(ms/pts.length);}await mouse('mouseReleased',pts[pts.length-1].x,pts[pts.length-1].y);await sleep(120);}
const line=(a,b,c,d,n=14)=>Array.from({length:n+1},(_,i)=>({x:a+(c-a)*i/n,y:b+(d-b)*i/n}));
mark('drawStart');
const cx=640,hy=230,R=38;await stroke(Array.from({length:33},(_,i)=>({x:cx+Math.cos(-Math.PI/2+i/32*Math.PI*2)*R,y:hy+Math.sin(-Math.PI/2+i/32*Math.PI*2)*R})),650);
await stroke(line(cx,hy+R,cx,420),380);await stroke(line(cx,300,580,370),300);await stroke(line(cx,300,700,370),300);await stroke(line(cx,420,598,525),300);await stroke(line(cx,420,682,525),300);
await stroke([{x:cx-13,y:hy-8},{x:cx-12,y:hy-6}],60);await stroke([{x:cx+13,y:hy-8},{x:cx+14,y:hy-6}],60);await stroke(Array.from({length:9},(_,i)=>({x:cx-15+i*30/8,y:hy+10+Math.sin(i/8*Math.PI)*9})),220);
mark('drawEnd');await sleep(700);
await ev(`document.querySelector('[data-tab=moves]').click(),[...document.querySelectorAll('[data-move]')].find(b=>b.dataset.move==='Dance').click(),1`);mark('dance');await sleep(2300);
await ev(`document.querySelector('[data-tab=dress]').click(),1`);mark('gear');for(const [slot,key] of [['hat','crown'],['cape','red'],['top','super'],['weapon','sword']]){await ev(`document.querySelector('#outfit button[data-slot=${slot}][data-key=${key}]').click(),1`);await sleep(650);}
await ev(`document.getElementById('morph').click(),1`);mark('morph');await sleep(1800);
await ev(`document.querySelector('[data-tab=moves]').click(),[...document.querySelectorAll('[data-move]')].find(b=>b.dataset.move==='Fly').click(),1`);mark('fly');await sleep(2200);
await ev(`[...document.querySelectorAll('[data-move]')].find(b=>b.dataset.move==='Flip').click(),1`);mark('flip');await sleep(1800);mark('end');
await send('Page.stopScreencast');
const dir=OUT+'/hook';fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir);let list='';frames.forEach((f,i)=>{const fn=`f${String(i).padStart(5,'0')}.jpg`;fs.writeFileSync(dir+'/'+fn,Buffer.from(f.data,'base64'));const d=i<frames.length-1?frames[i+1].ts-f.ts:1/30;list+=`file '${fn}'\nduration ${Math.max(.001,d).toFixed(4)}\n`;});list+=`file 'f${String(frames.length-1).padStart(5,'0')}.jpg'\n`;fs.writeFileSync(dir+'/list.txt',list);
fs.writeFileSync(OUT+'/hook.json',JSON.stringify({rect:r.map(Math.round),marks,frames:frames.length},null,1));console.log(JSON.stringify({rect:r.map(Math.round),marks,frames:frames.length}));chrome.kill();setTimeout(()=>{try{fs.rmSync(prof,{recursive:true,force:true});}catch(e){}process.exit(0);},800);
