"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/components/UserContext";

import "./GuestIntroSlider.css";

const STORAGE_KEY = "honeycup_guest_intro_slider_hidden";

type Slide = {
  title: string;
  description: string;
  src: string;
};

const SLIDES: Slide[] = [
  {
    title: "Регистрация",
    description: "Как быстро зарегистрироваться и войти в HoneyCup.",
    src: "/videos/registration.mp4",
  },
  {
    title: "Создание клуба",
    description: "Добавляем новый клуб и настраиваем его карточку.",
    src: "/videos/create club and trnmt.mp4",
  },
  {
    title: "Создание турнира",
    description: "Создаём новый турнир и выбираем нужный формат.",
    src: "/videos/create-tournament.mp4",
  },
  {
    title: "Добавление игроков",
    description: "Как пригласить и добавить участников в турнир.",
    src: "/videos/add-players.mp4",
  },
];

export function GuestIntroSlider() {
  const { user, loading } = useUser();
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [current, setCurrent] = useState(0);
  const [shouldSkip, setShouldSkip] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) === "1";
    setShouldSkip(stored);
    setDontShow(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (loading) return;
    if (user) return; // показываем только гостям
    if (shouldSkip) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [user, loading, shouldSkip]);

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

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  if (!visible) return null;

  const slide = SLIDES[current];

  return (
    <div className="guest-slider-overlay" role="dialog" aria-modal="true">
      <div className="guest-slider">
        <button
          type="button"
          className="guest-slider__close"
          onClick={close}
          aria-label="Закрыть подсказки"
        >
          ✖
        </button>

        <div className="guest-slider__media">
          <video key={slide.src} src={slide.src} controls playsInline preload="metadata" className="guest-slider__video" />
        </div>

        <div className="guest-slider__content">
          <h3 className="guest-slider__title">{slide.title}</h3>
          <p className="guest-slider__description">{slide.description}</p>

          <div className="guest-slider__bottom">
            <div className="guest-slider__controls">
              <button type="button" className="guest-slider__nav" onClick={goPrev} aria-label="Предыдущее видео">
                ←
              </button>
              <span className="guest-slider__counter">
                {current + 1} / {SLIDES.length}
              </span>
              <button type="button" className="guest-slider__nav" onClick={goNext} aria-label="Следующее видео">
                →
              </button>
            </div>

            <label className="guest-slider__checkbox">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={handleDontShowChange}
              />
              <span>Больше не показывать</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
