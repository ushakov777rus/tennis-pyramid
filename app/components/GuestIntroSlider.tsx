"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/components/UserContext";
import { useDictionary } from "./LanguageProvider";
import { stripLocaleFromPath } from "@/app/i18n/routing";

import "./GuestIntroSlider.css";

const STORAGE_KEY = "honeycup_guest_intro_slider_hidden";

type Slide = {
  title: string;
  description: string;
  src: string;
};

const VIDEO_SOURCES = ["/videos/create club and trnmt.mp4"];

export function GuestIntroSlider() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const dictionary = useDictionary();
  const { path: normalizedPath } = stripLocaleFromPath(pathname ?? "/");
  const slides = useMemo<Slide[]>(() => {
    const base = dictionary.guestIntroSlider.slides.slice(0, VIDEO_SOURCES.length);
    if (!base.length) return [];
    return base.map((slide, index) => ({
      ...slide,
      src: VIDEO_SOURCES[index],
    }));
  }, [dictionary]);
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [current, setCurrent] = useState(0);
  const [shouldSkip, setShouldSkip] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (normalizedPath !== "/about") return;
    const stored = localStorage.getItem(STORAGE_KEY) === "1";
    setShouldSkip(stored);
    setDontShow(stored);
  }, [normalizedPath]);

  useEffect(() => {
    if (normalizedPath === "/about") return;
    setVisible(false);
  }, [normalizedPath]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading) return;
    if (normalizedPath !== "/about") return;
    if (user) return; // показываем только гостям
    if (shouldSkip) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [user, loading, shouldSkip, pathname]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const close = () => {
    setVisible(false);
    if (dontShow) {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "1");
      }
    }
  };

  const handleDontShowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setDontShow(checked);
    if (checked && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
      setShouldSkip(true);
    } else if (!checked && typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      setShouldSkip(false);
    }
  };

  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[current] ?? slides[0];

  useEffect(() => {
    if (!visible) return;
    const node = videoRef.current;
    if (!node) return;

    const playSafely = () => {
      const promise = node.play();
      if (promise && typeof promise.then === "function") {
        promise.catch(() => {
          node.muted = true;
          node.play().catch(() => {});
        });
      }
    };

    if (!node.paused) {
      node.pause();
    }
    node.currentTime = 0;
    node.load();

    if (node.readyState >= 2) {
      playSafely();
    } else {
      const handleLoaded = () => {
        playSafely();
        node.removeEventListener("loadeddata", handleLoaded);
      };
      node.addEventListener("loadeddata", handleLoaded);
      return () => node.removeEventListener("loadeddata", handleLoaded);
    }
  }, [visible, slide.src]);

  if (!visible || slides.length === 0 || !slide) return null;

  return (
    <div className="guest-slider-overlay" role="dialog" aria-modal="true">
      <div className="guest-slider">
        <button
          type="button"
          className="guest-slider__close"
          onClick={close}
          aria-label={dictionary.guestIntroSlider.close}
        >
          ✖
        </button>

        <div className="guest-slider__media">
          <video
            key={slide.src}
            src={slide.src}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            ref={videoRef}
            className="guest-slider__video"
          >
            <source src={slide.src} type="video/mp4" />
            {dictionary.guestIntroSlider.unsupported}
          </video>
        </div>

        <div className="guest-slider__content">
          <h3 className="guest-slider__title">{slide.title}</h3>
          <p className="guest-slider__description">{slide.description}</p>

          <div className="guest-slider__bottom">
            <div className="guest-slider__controls">
              <button type="button" className="guest-slider__nav" onClick={goPrev} aria-label={dictionary.guestIntroSlider.previous}>
                ←
              </button>
              <span className="guest-slider__counter">
                {current + 1} / {slides.length}
              </span>
              <button type="button" className="guest-slider__nav" onClick={goNext} aria-label={dictionary.guestIntroSlider.next}>
                →
              </button>
            </div>

            <label className="guest-slider__checkbox">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={handleDontShowChange}
              />
              <span>{dictionary.guestIntroSlider.dontShow}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
