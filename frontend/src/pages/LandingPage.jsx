import { useRef } from "react";
import { useGSAP } from "../utils/gsap";
import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import MarqueeTicker from "../components/landing/MarqueeTicker";
import OrbitalSection from "../components/landing/OrbitalSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import IdeaInputSection from "../components/landing/IdeaInputSection";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage({ onStart }) {
  const navRef = useRef(null);
  const heroEyeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroActRef = useRef(null);
  const orbitalRef = useRef(null);
  const featRef = useRef(null);
  const testRef = useRef(null);
  const inputRef = useRef(null);

  useGSAP((gsap, ST) => {
    ST.create({
      trigger: ".hero",
      start: "bottom top",
      onEnter: () => navRef.current?.classList.add("scrolled"),
      onLeaveBack: () => navRef.current?.classList.remove("scrolled"),
    });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      heroEyeRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      0.1,
    );
    tl.fromTo(
      heroTitleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      0.3,
    );
    tl.fromTo(
      heroSubRef.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      0.55,
    );
    tl.fromTo(
      heroActRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0.7,
    );

    if (orbitalRef.current) {
      const el = orbitalRef.current;
      gsap.fromTo(
        el.querySelectorAll(".sect-title, .sect-sub"),
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 78%" },
        },
      );
      ST.create({
        trigger: el,
        start: "top 80%",
        onEnter: () => el.classList.add("in-view"),
      });
    }

    if (featRef.current) {
      gsap.fromTo(
        featRef.current.querySelectorAll(".feat-card"),
        { opacity: 0, y: 50, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: featRef.current, start: "top 85%" },
        },
      );
    }

    if (testRef.current) {
      gsap.fromTo(
        testRef.current.querySelectorAll(".test-card"),
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: { trigger: testRef.current, start: "top 82%" },
        },
      );
    }

    if (inputRef.current) {
      gsap.fromTo(
        inputRef.current.querySelector(".input-box"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: inputRef.current, start: "top 80%" },
        },
      );
    }

    return () => ST.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="landing-wrap">
      <LandingNavbar navRef={navRef} />
      <HeroSection
        heroEyeRef={heroEyeRef}
        heroTitleRef={heroTitleRef}
        heroSubRef={heroSubRef}
        heroActRef={heroActRef}
      />
      <MarqueeTicker />
      <OrbitalSection orbitalRef={orbitalRef} />
      <FeaturesSection featRef={featRef} />
      <TestimonialsSection testRef={testRef} />
      <IdeaInputSection inputRef={inputRef} onStart={onStart} />
      <LandingFooter />
    </div>
  );
}
