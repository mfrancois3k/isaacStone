import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./project-experience.css";

export const projects = [
  { title: "Dual carved marble sinks", image: "img9.jpg", material: "Marble", scope: "Carved sinks & matching backsplash", description: "Two carved marble sinks and their matching backsplash bring the material into one continuous composition. Explore the full photograph to see the relationship between the basins, edges and wall surface." },
  { title: "The marble alcove", image: "img7.jpg", material: "Marble", scope: "Alcove installation", description: "A closer look at marble within an alcove: the surrounding planes, natural variation and finished edges become part of the architecture." },
  { title: "L-shaped granite countertop", image: "img6.jpg", material: "Granite", scope: "Countertop installation", description: "The L-shaped countertop follows the room’s working surfaces. This photograph shows the granite work in progress and its relationship to the surrounding surfaces." },
  { title: "Underpinning between NYC row houses", image: "img10.jpg", material: "Additional work", scope: "Underpinning", description: "A job-site view of underpinning between row houses. Part of the broader construction work represented in our project archive." },
  { title: "Rooftop-level concrete formwork", image: "img11.jpg", material: "Additional work", scope: "Concrete formwork", description: "A view of concrete formwork at rooftop level, documenting the construction process before the finished surfaces are in place." },
  { title: "Excavation, wider angle", image: "img12.jpg", material: "Additional work", scope: "Excavation", description: "A wider view of excavation work from the project archive, showing the site and the work in progress." },
];

const ease = "cubic-bezier(.16,1,.3,1)";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function StoneCraftSection() {
  return <section className="stone-craft" data-craft-section aria-labelledby="stone-craft-heading">
    <div className="stone-craft-sticky">
      <div className="stone-craft-photo"><img data-craft-image src="/assets/design/img9.jpg" alt="Dual carved marble sinks with a matching marble backsplash" loading="lazy" decoding="async" /></div>
      <div className="stone-craft-shade" />
      <div className="stone-craft-copy">
        <p className="project-eyebrow">THE MATERIAL, UP CLOSE</p>
        <h2 id="stone-craft-heading">Every vein.<br />Every edge.<br /><em>One composition.</em></h2>
        <p>From the smallest detail to the finished space.</p>
      </div>
      <div className="stone-craft-detail" data-craft-detail aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="stone-craft-caption"><span>CARVED MARBLE · SINKS & BACKSPLASH</span><span>DETAIL → WHOLE</span><div><i data-craft-rule /></div></div>
    </div>
  </section>;
}

export function ProjectExperience() {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const source = useRef<HTMLElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const animations = useRef<Animation[]>([]);
  const closing = useRef(false);
  const previousOverflow = useRef("");
  const stopAnimations = () => { animations.current.forEach(animation => animation.cancel()); animations.current = []; };

  const finish = () => {
    stopAnimations();
    dialog.current?.close();
    document.body.style.overflow = previousOverflow.current;
    closing.current = false;
    setIndex(null);
    opener.current?.focus({ preventScroll: true });
  };

  const close = () => {
    if (closing.current || !dialog.current?.open) return;
    closing.current = true;
    if (reduced()) { finish(); return; }
    // Read the interrupted image position before cancelling its entrance.
    const current = photo.current?.getBoundingClientRect();
    const opacity = getComputedStyle(dialog.current).opacity;
    stopAnimations();
    const base = photo.current?.getBoundingClientRect();
    const destination = source.current?.querySelector("img")?.getBoundingClientRect();
    if (photo.current && current && base && destination && base.width && destination.width && destination.bottom > 0 && destination.top < innerHeight) {
      const frame = (rect: DOMRect) => `translate(${rect.left - base.left}px,${rect.top - base.top}px) scale(${rect.width / base.width},${rect.height / base.height})`;
      animations.current.push(photo.current.animate([{ transform: frame(current) }, { transform: frame(destination) }], { duration: 250, easing: ease, fill: "forwards" }));
    }
    const animation = dialog.current.animate([{ opacity }, { opacity: 0 }], { duration: 250, easing: ease, fill: "forwards" });
    animations.current.push(animation);
    animation.finished.then(finish).catch(() => {});
  };

  useEffect(() => {
    const modal = dialog.current;
    const openProject = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number; source?: HTMLElement }>).detail;
      if (!detail || !Number.isInteger(detail.index) || !projects[detail.index] || dialog.current?.open) return;
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      source.current = detail.source?.closest("figure") ?? detail.source ?? null;
      setIndex(detail.index);
    };
    window.addEventListener("open-project", openProject);
    return () => { window.removeEventListener("open-project", openProject); stopAnimations(); if (modal?.open) document.body.style.overflow = previousOverflow.current; };
  }, []);

  useLayoutEffect(() => {
    const modal = dialog.current;
    if (index === null || !modal || modal.open) return;
    const from = source.current?.querySelector("img")?.getBoundingClientRect();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.showModal();
    if (reduced()) return;
    const to = photo.current?.getBoundingClientRect();
    animations.current.push(modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: ease }));
    if (photo.current && from && to && to.width && from.width) {
      animations.current.push(photo.current.animate([
        { transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(${from.width / to.width},${from.height / to.height})` },
        { transform: "translate(0,0) scale(1,1)" },
      ], { duration: 280, easing: ease }));
    }
  }, [index]);

  const project = projects[index ?? 0];
  return <dialog ref={dialog} className="project-dialog" aria-labelledby="project-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    {index !== null && <article className="project-sheet">
      <div className="project-top"><span className="project-eyebrow">SELECTED WORK · {String(index + 1).padStart(2, "0")} / 06</span><button type="button" className="project-close" onClick={close} autoFocus aria-label="Close project">Close <span aria-hidden="true">×</span></button></div>
      <div className="project-layout">
        <div className="project-photo"><img key={project.image} ref={photo} src={`/assets/design/${project.image}`} alt={project.title} /></div>
        <div className="project-copy"><p className="project-eyebrow">{project.material}</p><h2 id="project-title">{project.title}</h2><p>{project.description}</p><dl><div><dt>Material / category</dt><dd>{project.material}</dd></div><div><dt>Shown here</dt><dd>{project.scope}</dd></div></dl><a className="project-estimate" href="#contact" onClick={event => { event.preventDefault(); finish(); const contact = document.getElementById("contact"); contact?.scrollIntoView({ behavior: "instant", block: "start" }); contact?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }); }}>Plan a project like this <span aria-hidden="true">↗</span></a></div>
      </div>
      <nav className="project-navigation" aria-label="Browse projects"><button type="button" disabled={index === 0} onClick={() => { stopAnimations(); source.current = null; setIndex(index - 1); }}>← Previous</button><span aria-live="polite">{index + 1} of {projects.length}</span><button type="button" disabled={index === projects.length - 1} onClick={() => { stopAnimations(); source.current = null; setIndex(index + 1); }}>Next →</button></nav>
    </article>}
  </dialog>;
}
