import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { followVoiceLevel, getMarbleVisual } from "./marble-motion";

type State = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "paused";
const frames = ["idle", "listening", "thinking", "speaking", "paused"] as const;

export function MarbleSphere({state,getAudioLevel,onActivate,label,disabled}: {
  state: State; getAudioLevel?: (output:boolean)=>number;
  onActivate:()=>void; label:string; disabled?:boolean;
}) {
  const stage=useRef<HTMLDivElement>(null);
  const magnetic=useRef<HTMLSpanElement>(null);
  const sculpture=useRef<HTMLSpanElement>(null);
  const glow=useRef<HTMLSpanElement>(null);
  const halo=useRef<HTMLSpanElement>(null);
  const signals=useRef<Array<HTMLSpanElement | null>>([]);
  const latest=useRef({state,getAudioLevel});
  latest.current={state,getAudioLevel};
  useEffect(()=>{
    const root=stage.current!, orb=sculpture.current!, attract=magnetic.current!;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const fine=matchMedia('(hover:hover) and (pointer:fine)');
    const xTo=gsap.quickTo(attract,'x',{duration:.45,ease:'power3.out'});
    const yTo=gsap.quickTo(attract,'y',{duration:.45,ease:'power3.out'});
    const rotateTo=gsap.quickTo(attract,'rotation',{duration:.45,ease:'power3.out'});
    let level=0,last=0,raf=0;
    const reset=()=>{if(reduced.matches)return;xTo(0);yTo(0);rotateTo(0);};
    const move=(event:PointerEvent)=>{
      if(reduced.matches||!fine.matches)return;
      const r=root.getBoundingClientRect();
      const x=(event.clientX-r.left-r.width/2)/(r.width/2);
      const y=(event.clientY-r.top-r.height/2)/(r.height/2);
      xTo(Math.max(-12,Math.min(12,x*12)));yTo(Math.max(-8,Math.min(8,y*8)));rotateTo(x*3);
    };
    const tick=(time:number)=>{
      const {state,getAudioLevel}=latest.current;
      const active=state==='speaking'||state==='listening';
      const sample=active ? (getAudioLevel?.(state==='speaking')||0) : 0;
      level=followVoiceLevel(level,sample,last?time-last:16);last=time;
      const visual=getMarbleVisual(state,level);
      orb.style.transform=`translate3d(0,${visual.lift}px,0) scale(${visual.scale}) rotateX(${visual.tiltX}deg) rotateY(${visual.tiltY}deg)`;
      if(glow.current){glow.current.style.opacity=String(visual.glow);glow.current.style.transform=`translate3d(0,0,0) scale(${1+visual.energy*.34})`;}
      if(halo.current){halo.current.style.opacity=String(visual.halo);halo.current.style.transform=`translate3d(0,0,0) scale(${.88+visual.energy*.34})`;}
      signals.current.forEach((ring,index)=>{
        if(!ring)return;
        const depth=-12-index*6;
        ring.style.opacity=String(visual.energy*(.28-index*.065));
        ring.style.transform=`translate3d(0,0,${depth}px) rotate(${index===1?28:index===2?-24:0}deg) scale(${.78+visual.energy*(.34+index*.07)})`;
      });
      root.style.setProperty('--marble-energy',visual.energy.toFixed(3));
      root.dataset.audioLevel=level.toFixed(3);
      raf=requestAnimationFrame(tick);
    };
    const sync=()=>{
      cancelAnimationFrame(raf);last=0;
      if(reduced.matches||document.hidden){
        level=0;gsap.killTweensOf(attract);gsap.set(attract,{clearProps:'transform'});
        orb.style.transform='none';root.style.setProperty('--marble-energy','0');signals.current.forEach(ring=>{if(ring){ring.style.opacity='0';ring.style.transform='none';}});if(glow.current)glow.current.style.opacity='0';if(halo.current)halo.current.style.opacity='0';
      } else raf=requestAnimationFrame(tick);
    };
    root.addEventListener('pointermove',move);root.addEventListener('pointerleave',reset);
    reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
    return()=>{cancelAnimationFrame(raf);gsap.killTweensOf(attract);root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',reset);reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
  },[]);
  const active=state==='connecting'?'thinking':state;
  return <div ref={stage} className="marble-stage marble-interactive" data-state={active}>
    <span className="marble-shadow" aria-hidden="true"/>
    <button className="marble-hit" onClick={onActivate} aria-label={label} title={label} disabled={disabled}>
      <span ref={magnetic} className="marble-magnetic">
        <span className="marble-float">
          <span ref={glow} className="marble-audio-glow"/>
          <span ref={halo} className="marble-audio-halo"/>
          <span className="marble-signal" aria-hidden="true">{[0,1,2].map(index=><i key={index} ref={element=>{signals.current[index]=element;}}/>)}</span>
          <span ref={sculpture} className="marble-sculpture">
            {frames.map(frame=><img key={frame} src={`/assets/wamy/${frame}.png`} alt="" width={1254} height={1254} style={{opacity:frame===active?1:0}}/>)}
          </span>
        </span>
      </span>
    </button>
  </div>;
}
