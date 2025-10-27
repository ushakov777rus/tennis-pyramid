"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { AuthContainer } from "@/app/components/AuthContainer";
import { UserRole } from "@/app/models/Users";
import "./StatsFooter.css";
import { useUser } from "./UserContext";
import { useDictionary, useLanguage } from "./LanguageProvider";
import { withLocalePath } from "@/app/i18n/routing";

function useCountUp(target: number | null, duration = 1000) {
  const [displayValue, setDisplayValue] = useState<number | null>(
    target === null ? null : 0
  );
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(0);
  const toRef = useRef<number>(0);
  const latestValueRef = useRef<number>(target ?? 0);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    latestValueRef.current = displayValue ?? 0;
  }, [displayValue]);

  useEffect(() => {
    if (target == null) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      startRef.current = null;
      fromRef.current = 0;
      toRef.current = 0;
      latestValueRef.current = 0;
      setDisplayValue(null);
      return;
    }

    const startValue = latestValueRef.current;
    const endValue = target;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    startRef.current = null;
    fromRef.current = startValue;
    toRef.current = endValue;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      frameRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (startRef.current === null) {
        startRef.current = timestamp;
      }

      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const nextValue = Math.round(
        fromRef.current + (toRef.current - fromRef.current) * progress
      );

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        frameRef.current = null;
        startRef.current = null;
      }
    };

    setDisplayValue(startValue);
    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, duration]);

  return displayValue;
}

export function StatsFooter() {
  const [matchesCount, setMatchesCount] = useState<number | null>(null);
  const [playersCount, setPlayersCount] = useState<number | null>(null);
  const [tournamentsCount, setTournamentsCount] = useState<number | null>(null);
  const [clubsCount, setClubsCount] = useState<number | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const authRole = UserRole.Player;
  const { user } = useUser();
  const { locale } = useLanguage();
  const dictionary = useDictionary();

  const animatedMatchesCount = useCountUp(matchesCount);
  const animatedPlayersCount = useCountUp(playersCount);
  const animatedTournamentsCount = useCountUp(tournamentsCount);
  const animatedClubsCount = useCountUp(clubsCount);

  useEffect(() => {
    let alive = true;

    async function loadStats() {
      try {
        const [m, p, t, c] = await Promise.all([
          MatchRepository.countAll(),
          PlayersRepository.countAll(),
          TournamentsRepository.countAll(),
          ClubsRepository.countAll()
        ]);

        if (!alive) return;

        setMatchesCount(m ?? 0);
        setPlayersCount(p ?? 0);
        setTournamentsCount(t ?? 0);
        setClubsCount(c ?? 0);
      } catch (e) {
        console.error("Не удалось загрузить статистику для футера:", e);
        if (!alive) return;
        setMatchesCount(0);
        setPlayersCount(0);
        setTournamentsCount(0);
        setClubsCount(0);
      }
    }

    loadStats();
    return () => {
      alive = false;
    };
  }, []);

  const openLogin = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setIsAuthOpen(true);
  };

  return (
    <>
      <footer className="stats-footer">
        {/* Текст с кнопками */}
        {!user && (
        <div className="stats-footer__auth-text">
          <div className="stats-footer__auth-line">
            <button
              onClick={openLogin}
              className="stats-footer__auth-button"
            >
              {dictionary.statsFooter.loginPrefix}
            </button>
            <span>{dictionary.statsFooter.loginOr}</span>
            <button
              onClick={openRegister}
              className="stats-footer__auth-button"
            >
              {dictionary.statsFooter.registerPrefix}
            </button>
          </div>
          <div className="stats-footer__auth-line">
            <span>{dictionary.statsFooter.loginSuffix}</span>
          </div>
        </div>)}

        {/* Статистика */}
        <div className="stats-footer__stats">
          <Link href={withLocalePath(locale, "/clubs")} className="stats-footer__stat-item">
            <div className="stats-footer__stat-value">
              {animatedClubsCount ?? "…"}
            </div>
            <div className="stats-footer__stat-label">{dictionary.statsFooter.stats.clubs}</div>
          </Link>

          <Link href={withLocalePath(locale, "/tournaments")} className="stats-footer__stat-item">
            <div className="stats-footer__stat-value">
              {animatedTournamentsCount ?? "…"}
            </div>
            <div className="stats-footer__stat-label">{dictionary.statsFooter.stats.tournaments}</div>
          </Link>

          <Link href={withLocalePath(locale, "/rating")} className="stats-footer__stat-item">
            <div className="stats-footer__stat-value">
              {animatedPlayersCount ?? "…"}
            </div>
            <div className="stats-footer__stat-label">{dictionary.statsFooter.stats.players}</div>
          </Link>

          <Link href={withLocalePath(locale, "/matches")} className="stats-footer__stat-item">
            <div className="stats-footer__stat-value">
              {animatedMatchesCount ?? "…"}
            </div>
            <div className="stats-footer__stat-label">{dictionary.statsFooter.stats.matches}</div>
          </Link>
        </div>
      </footer>

      <AuthContainer
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        initialRole={authRole}
      />
    </>
  );
}
