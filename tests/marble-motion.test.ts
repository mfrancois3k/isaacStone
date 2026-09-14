import test from 'node:test';
import assert from 'node:assert/strict';
import {followVoiceLevel} from '../src/components/marble-motion.ts';
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
