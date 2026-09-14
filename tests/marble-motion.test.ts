import test from 'node:test';
import assert from 'node:assert/strict';
import {followVoiceLevel,getMarbleVisual} from '../src/components/marble-motion.ts';
test('voice motion attacks syllables quickly and releases to rest without overshoot',()=>{
 let level=0;
 for(let i=0;i<6;i++)level=followVoiceLevel(level,.8,16);
 assert.ok(level>.65 && level<.8);
 const peak=level;
 level=followVoiceLevel(level,0,16);
 assert.ok(level>peak*.8 && level<peak);
 for(let i=0;i<120;i++)level=followVoiceLevel(level,0,16);
 assert.ok(level<.001);
 assert.equal(followVoiceLevel(0,NaN,16),0);
 assert.equal(followVoiceLevel(0,-1,16),0);
 assert.ok(followVoiceLevel(.9,100,16)<=1);
});
test('each Wamy state has a distinct visual response and voice energy only moves listening or speaking',()=>{
  const idle=getMarbleVisual('idle',.9);
  const listening=getMarbleVisual('listening',.6);
  const speaking=getMarbleVisual('speaking',.6);
  const thinking=getMarbleVisual('thinking',.9);
  const paused=getMarbleVisual('paused',.9);
  assert.equal(idle.energy,0);
  assert.ok(listening.energy>.6 && listening.scale>1 && listening.halo>0);
  assert.ok(speaking.energy>listening.energy && speaking.lift<listening.lift);
  assert.equal(thinking.level,0);
  assert.equal(paused.energy,0);
});
