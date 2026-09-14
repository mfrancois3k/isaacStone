import { startSiteMotion } from "./site-motion";
import React from "react";
import { StoneCraftSection, projects } from './ProjectExperience';
import "./design-page.css";
const ASSETS = {
  img13: "/assets/design/img13.png",
  img30: "/assets/design/img30.png",
  img40: "/assets/design/img40.png",
  img41: "/assets/design/img41.png",
  img42: "/assets/design/img42.png",
  img43: "/assets/design/img43.png",
  img44: "/assets/design/img44.png",
  img5: "/assets/design/img5.jpg",
  img0: "/assets/design/img0.jpg",
  img2: "/assets/design/img2.jpg",
  img1: "/assets/design/img1.jpg",
  img32: "/assets/design/img32.png",
  img14: "/assets/design/img14.jpg",
  vid3: "/assets/design/vid3.jpg",
  vid5: "/assets/design/vid5.jpg",
  img31: "/assets/design/img31.png",
  vid4: "/assets/design/vid4.jpg",
  img4: "/assets/design/img4.jpg",
  vid1: "/assets/design/vid1.jpg",
  img3: "/assets/design/img3.jpg",
  vid6: "/assets/design/vid6.jpg",
  vid2: "/assets/design/vid2.jpg",
  vid7: "/assets/design/vid7.jpg",
  img8: "/assets/design/img8.jpg",
  img17: "/assets/design/img17.jpg",
  img19: "/assets/design/img19.jpg",
  img9: "/assets/design/img9.jpg",
  vid0: "/assets/design/vid0.jpg",
  img16: "/assets/design/img16.jpg",
  img11: "/assets/design/img11.jpg",
  img15: "/assets/design/img15.jpg",
  img12: "/assets/design/img12.jpg",
  img25: "/assets/design/img25.jpg",
  img23: "/assets/design/img23.jpg",
  img33: "/assets/design/img33.png",
  img24: "/assets/design/img24.jpg",
  img7: "/assets/design/img7.jpg",
  img22: "/assets/design/img22.jpg",
  img20: "/assets/design/img20.jpg",
  img10: "/assets/design/img10.jpg",
  img18: "/assets/design/img18.jpg",
  img21: "/assets/design/img21.jpg",
  img6: "/assets/design/img6.jpg",
};

const QUESTIONS = [
  "What room or space are you looking to update?",
  "Roughly how many square feet is it?",
  "Do you have a material in mind — tile, marble, granite, or not sure yet?",
  "When would you like the work done?",
  "Which town or ZIP code is the project in?",
  "What name should the team use?",
  "What phone number should the team call?",
  "What email should receive your confirmation?",
];
const FIELDS = [
  "room",
  "size",
  "material",
  "timeline",
  "town",
  "name",
  "phone",
  "contact",
];
const FRAMES = [
  {
    k: "TRAVERTINE · FLOOR TO CEILING",
    t: "Fireplace wall & polished floor",
    s: "LIVING ROOM",
  },
  {
    k: "CALACATTA MARBLE · KITCHEN",
    t: "Waterfall island & range wall",
    s: "KITCHEN",
  },
  {
    k: "BOOKMATCHED MARBLE · BATHROOM",
    t: "Slab shower & floating vanity",
    s: "BATHROOM",
  },
  {
    k: "QUARTZITE & SLATE · EXTERIOR",
    t: "Patio pavers & stepped entry",
    s: "PATIO",
  },
  {
    k: "MATERIALS · SLATE & MOSAIC",
    t: "Samples we bring to the visit",
    s: "SAMPLES",
  },
];
const LOADER_LINES = [
  "TILES TAILORED TO YOUR HOME — BESPOKE STONEWORK",
  "LOADING COMPLETED PROJECT PHOTOGRAPHY (@jafettile____com)…",
  "BRENTWOOD · NASSAU · SUFFOLK · NYC · THE HAMPTONS",
  "TWENTY-FIVE YEARS OF TILE, GRANITE AND MARBLE",
  "TILES TAILORED TO YOUR HOME — ISAAC STONE AND TILE LLC VERIFIED",
];
// proactive agent prompts, keyed by the section the visitor is reading
const HINTS = {
  reels: {
    tag: "JOB SITE",
    text: "These are live from the Instagram account: real cuts and sets, posted the day they happened.",
  },
