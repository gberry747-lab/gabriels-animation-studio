import {spawn} from 'node:child_process';import fs from 'node:fs';
const OUT=process.argv[2],prof=OUT+'/chrome-profile2';fs.rmSync(prof,{recursive:true,force:true});
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=9335','--user-data-dir='+prof,'--no-first-run','--hide-scrollbars','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));await sleep(2500);const tabs=await (await fetch('http://127.0.0.1:9335/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pend=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id);}};const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
await send('Emulation.setDeviceMetricsOverride',{width:1300,height:1000,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://localhost:8766/zz-seed.html'});await sleep(2500);
await send('Runtime.evaluate',{expression:"__t.closeModal();document.getElementById('bigGames').scrollIntoView({block:'center'})"});await sleep(800);
const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(OUT+'/menu.png',Buffer.from(r.result.data,'base64'));chrome.kill();process.exit(0);
