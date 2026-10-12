#!/bin/zsh
# Builds Gabriel's tour video from the recorded segments, title cards and music.
set -e
V=${0:A:h}; O=$V/out; T=$O/tour; mkdir -p $T; cd $O
FONT="/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf"
enc=(-c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30)
card() { ffmpeg -loglevel error -y -loop 1 -t $3 -i $1 -vf "scale=1280:720,fade=t=in:st=0:d=0.4,fade=t=out:st=$(printf %.2f $(( $3 - 0.4 ))):d=0.4" $enc $T/$2.mp4; }
seg() { # name speed title subtitle
  local name=$1 sp=$2; local d=$(python3 -c "import json;s=[x for x in json.load(open('segments.json')) if x['name']=='$name'][0];print(round(s['span']/s['speed'],2))")
  python3 $V/banner.py $T/b_$name.png 1280 720 top "$3" "$4"
  ffmpeg -loglevel error -y -f concat -safe 0 -i $name/list.txt -i $T/b_$name.png -filter_complex "[0]crop=1184:663:58:77,scale=1280:720,setpts=(PTS-STARTPTS)/$sp,fps=30,format=yuv420p[v];[v][1]overlay=0:0,fade=t=in:st=0:d=0.35,fade=t=out:st=$(printf %.2f $(( d - 0.35 ))):d=0.35" -t $d $enc $T/$name.mp4
}
card card_intro.png 00_intro 3.5
seg sling 1 'Slingshot Siege' 'Fling your hero at monster towers!'
seg defense 1.8 'Backyard Defense' 'Your hero guards the clubhouse from slimes'
seg kart 1 'Hero Kart' 'Tap the speed button to go 2x, even 3x!'
seg gems 1.2 'Gem Quest' 'Match stones, then tap your hero for a Hero Blast'
seg beat 1 'Beat Run' 'Jump on the beat. Hold for a big jump!'
seg path 1 'Draw Path' 'Draw a ramp to rescue a lost puppy'
seg pals 1.25 'Monster Pals' 'Make friends with 25 slime pals'
seg notes 1 'Note Rush' 'Play piano or guitar. It gets FASTER every round!'
seg halloween 1 'Halloween: Pumpkin Smash' 'A new game for every holiday!'
seg christmas 1 'Christmas: Sleigh Ride' 'Deliver presents over the snowy hills'
seg newyear 1 "New Year's: Countdown Party" 'Jump to the beat until midnight'
ffmpeg -loglevel error -y -i menu.png -vf "crop=1280:720:10:140" menu_crop.png
python3 $V/banner.py $T/b_menu.png 1280 720 bottom 'Find them in Games, under Big adventures'
ffmpeg -loglevel error -y -loop 1 -t 3.5 -i menu_crop.png -i $T/b_menu.png -filter_complex "[0][1]overlay=0:0,fade=t=in:st=0:d=0.4,fade=t=out:st=3.10:d=0.4" $enc $T/08_menu.mp4
card card_outro.png 09_outro 4
printf "file '%s'\n" $T/00_intro.mp4 $T/sling.mp4 $T/defense.mp4 $T/kart.mp4 $T/gems.mp4 $T/beat.mp4 $T/path.mp4 $T/pals.mp4 $T/notes.mp4 $T/halloween.mp4 $T/christmas.mp4 $T/newyear.mp4 $T/08_menu.mp4 $T/09_outro.mp4 > $T/list.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i $T/list.txt -vf "settb=AVTB,setpts=N/30/TB,fps=30" $enc $T/video.mp4
LEN=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $T/video.mp4)
python3 $V/music.py $T/music.wav $LEN 112 7 tour
ffmpeg -loglevel error -y -i $T/video.mp4 -i $T/music.wav -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart $T/tour_final.mp4
echo "tour: $(ffprobe -v error -show_entries format=duration -of csv=p=0 $T/tour_final.mp4)s"
