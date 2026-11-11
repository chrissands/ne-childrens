#!/bin/bash
# usage: render.sh <page.html> <shot-name> [width]   -- injects out/<page> into a childrens.nebraska.gov-origin tab and screenshots it
cd /workspace/ne-childrens
T=${TAB:-672346445}
W=${3:-1280}
playwright-cli goto "https://childrens.nebraska.gov/robots.txt${QS}" --tab=$T >/dev/null 2>&1
node -e "
const fs=require('fs');const h=fs.readFileSync('out/$1','utf8');
fs.writeFileSync('/tmp/inject.js','document.open();document.write('+JSON.stringify(h)+');document.close();\"ok\"');"
playwright-cli eval "$(cat /tmp/inject.js)" --tab=$T 2>&1 | tail -1
sleep ${WAIT:-9}
playwright-cli eval "JSON.stringify({blocks:[...document.querySelectorAll('[data-block-name]')].map(b=>b.dataset.blockName+':'+b.dataset.blockStatus), body:document.body.className, h:document.body.scrollHeight})" --tab=$T 2>&1 | tail -1
playwright-cli screenshot --tab=$T --full-page --max-width=$W --filename=/workspace/ne-childrens/shots/$2.png 2>&1 | tail -1
