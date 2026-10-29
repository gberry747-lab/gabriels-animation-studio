#!/usr/bin/env python3
"""Send screenshots + a question to an OpenRouter vision model. Usage: askvision.py -p "What is confusing here?" shot1.png shot2.png
The prompt is redacted (no child's name) before sending. Never send home-screen screenshots (they show the app title); in-game screens only."""
import sys,json,base64,urllib.request,re,os,argparse
ap=argparse.ArgumentParser();ap.add_argument('images',nargs='+');ap.add_argument('-p','--prompt',required=True);ap.add_argument('-m','--model',default='qwen/qwen3-vl-235b-a22b-instruct');ap.add_argument('--max-tokens',type=int,default=1500)
a=ap.parse_args();key=open(os.path.expanduser('~/.config/openrouter/key')).read().strip()
prompt=re.sub(r"Gabriel(?:'s)?","the kid's",a.prompt)
content=[{'type':'text','text':prompt}]
for im in a.images:content.append({'type':'image_url','image_url':{'url':'data:image/png;base64,'+base64.b64encode(open(im,'rb').read()).decode()}})
req=urllib.request.Request('https://openrouter.ai/api/v1/chat/completions',data=json.dumps({'model':a.model,'messages':[{'role':'user','content':content}],'max_tokens':a.max_tokens}).encode(),headers={'Authorization':'Bearer '+key,'Content-Type':'application/json'})
r=json.load(urllib.request.urlopen(req,timeout=240));print(r['choices'][0]['message']['content'])
