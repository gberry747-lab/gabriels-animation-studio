// Renders HTML cards to PNG. Usage: node cards.mjs <jobs.json>  ([{out,url,w,h}])
import {spawn} from 'node:child_process';import fs from 'node:fs';
const jobs=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const prof='/tmp/cards-profile-'+process.pid;
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=9337','--user-data-dir='+prof,'--no-first-run','--hide-scrollbars','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));await sleep(2500);const tabs=await (await fetch('http://127.0.0.1:9337/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pend=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id);}};const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
await send('Page.enable');for(const j of jobs){await send('Emulation.setDefaultBackgroundColorOverride',j.transparent?{color:{r:0,g:0,b:0,a:0}}:{});await send('Emulation.setDeviceMetricsOverride',{width:j.w,height:j.h,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:j.url});await sleep(900);const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(j.out,Buffer.from(r.result.data,'base64'));console.log('card',j.out.split('/').pop());}
chrome.kill();setTimeout(()=>{try{fs.rmSync(prof,{recursive:true,force:true});}catch(e){}process.exit(0);},800);
