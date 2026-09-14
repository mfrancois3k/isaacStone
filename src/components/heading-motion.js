import {gsap} from 'gsap';
import {SplitText} from 'gsap/SplitText';
gsap.registerPlugin(SplitText);

/** Mask actual visual lines, and reflow them when the font or viewport changes. */
export function startHeadingMotion(headings) {
  const records=new Map();
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
    if(!isIntersecting)return;
    target.dataset.headingEntered='1';records.get(target)?.tween?.play();observer.unobserve(target);
  }),{threshold:.15,rootMargin:'0px 0px -8% 0px'});
  headings.forEach(el=>{
    const record={split:null,tween:null};records.set(el,record);
    record.split=SplitText.create(el,{type:'lines',mask:'lines',autoSplit:true,linesClass:'isaac-heading-line',onSplit(self){
      const entered=el.dataset.headingEntered==='1';
      const tween=gsap.fromTo(self.lines,{yPercent:110},{yPercent:0,duration:1.05,stagger:.09,ease:'power4.out',paused:true});
      record.tween=tween;
      if(entered)tween.progress(1);
      return tween;
    }});
    observer.observe(el);
  });
  return()=>{observer.disconnect();records.forEach(r=>r.split?.revert());};
}
