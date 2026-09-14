import { gsap } from 'gsap';

// Paused GSAP timelines are scrubbed by the site's shared scroll scheduler.
// Sticky bottom pinning lets tall panels finish scrolling before they recede.
export function createServiceMotion(panels) {
  const context = gsap.context(() => {});
  let timelines;
  const previous = [];
  context.add(() => {
    timelines = panels.map(panel => {
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(panel,
        { scale: 1, rotationX: 0, y: 0, opacity: 1, transformPerspective: 1400 },
        { scale: .7, rotationX: -9, y: -24, opacity: .5, duration: .9, ease: 'none' })
        .to(panel, { opacity: 0, duration: .1, ease: 'none' });
      const shade = panel.querySelector('[data-shade]');
      if (shade) timeline.fromTo(shade, { opacity: 0 }, { opacity: .4, duration: 1, ease: 'none' }, 0);
      return timeline;
    });
  });
  return {
    update(index, progress) {
      if (previous[index] === progress) return;
      previous[index] = progress; timelines[index].progress(progress);
    },
    destroy() { context.revert(); },
  };
}
