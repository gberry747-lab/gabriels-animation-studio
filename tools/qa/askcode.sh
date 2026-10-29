#!/bin/zsh
# Code review of a snippet by a cheap OpenRouter model, with the child's name redacted. Usage: askcode.sh <file> "<question>"  [tier, default cheap]
f="$1"; q="$2"; t="${3:-cheap}"; tmp=$(mktemp /tmp/askcode.XXXXXX)
sed -e "s/Gabriel's/the kid's/g" -e "s/Gabriel/Kid/g" "$f" > "$tmp"
q2=$(print -r -- "$q" | sed -e "s/Gabriel's/the kid's/g" -e "s/Gabriel/Kid/g")
~/.local/bin/ask -t "$t" --max-tokens 9000 -f "$tmp" -s "You are a senior game QA engineer and kids' UX designer reviewing a single-file HTML5 canvas game for a 9-year-old boy. Be concrete: cite the exact code, say what breaks or confuses, and propose the smallest fix. Number your findings, most important first." "$q2"
rm -f "$tmp"
