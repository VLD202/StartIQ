import { useEffect, useRef } from "react";

let _gsapReady = false;
let _gsapPromise = null;

export function loadGSAP() {
  if (_gsapReady) return Promise.resolve();
  if (_gsapPromise) return _gsapPromise;
  _gsapPromise = (async () => {
    if (!window.gsap) {
      await new Promise((r) => {
        const s = document.createElement("script");
        s.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
        s.onload = r;
        document.head.appendChild(s);
      });
    }
    if (!window.ScrollTrigger) {
      await new Promise((r) => {
        const s = document.createElement("script");
        s.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
        s.onload = r;
        document.head.appendChild(s);
      });
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
    _gsapReady = true;
  })();
  return _gsapPromise;
}

export function useGSAP(cb, deps = []) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    let cleanup = null;
    loadGSAP().then(() => {
      cleanup = ref.current(window.gsap, window.ScrollTrigger);
    });
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, deps);
}
