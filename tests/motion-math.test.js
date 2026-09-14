import test from 'node:test';
import assert from 'node:assert/strict';
import {frameAlpha,normalizedVelocity,galleryHeight} from '../src/components/motion-math.js';
test('equal wall-clock pointer convergence and scroll velocity at 60/120Hz',()=>{
  const simulate=hz=>{let cursor=0,velocity=0;const dt=60/hz;
    for(let i=0;i<hz;i++){cursor+=(100-cursor)*frameAlpha(.16,dt);velocity=normalizedVelocity(velocity,10*dt,dt);}
    return {cursor,velocity};};
  const a=simulate(60),b=simulate(120);
  assert.ok(Math.abs(a.cursor-b.cursor)<1e-10);
  assert.ok(Math.abs(a.velocity-b.velocity)<1e-10);
});
test('horizontal pin distance follows overflow, including short tracks',()=>{
  assert.equal(galleryHeight(3200,1200,800),2800);
  assert.equal(galleryHeight(800,1200,800),800);
});
