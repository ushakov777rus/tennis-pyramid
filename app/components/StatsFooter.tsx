"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { AuthContainer } from "@/app/components/AuthContainer";
import { UserRole } from "@/app/models/Users";
import "./StatsFooter.css";

export function StatsFooter() {
  const [matchesCount, setMatchesCount] = useState<number | null>(null);
  const [playersCount, setPlayersCount] = useState<number | null>(null);
  const [tournamentsCount, setTournamentsCount] = useState<number | null>(null);
  const [clubsCount, setClubsCount] = useState<number | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authRole, setAuthRole] = useState<UserRole.Player | UserRole.TournamentAdmin>(UserRole.Player);

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
        <div className="stats-footer__auth-text">
          <div className="stats-footer__auth-line">
            <button
              onClick={openLogin}
              className="stats-footer__auth-button"
            >
              Войдите
            </button>
            <span>{" или "}</span>
            <button
              onClick={openRegister}
              className="stats-footer__auth-button"
            >
              Зарегистрируйтесь
            </button>
          </div>
          <div className="stats-footer__auth-line">
            <span>для просмотра своих турниров</span>
          </div>
        </div>

        {/* Статистика */}
        <div className="stats-footer__stats">
          <Link href="/clubs" className="stats-footer__stat-item">
            <div className="stats-footer__stat-value">
              {clubsCount ?? "…"}
            </div>
            <div className="stats-footer__stat-label">Клубов</div>
          </Link>

          <Link href="/tournaments" className="stats-footer__stat-item">
            <div className="stats-footer__stat-value">
              {tournamentsCount ?? "…"}
            </div>
            <div className="stats-footer__stat-label">Турниров</div>
          </Link>

          <Link href="/rating" className="stats-footer__stat-item">
            <div className="stats-footer__stat-value">
              {playersCount ?? "…"}
            </div>
            <div className="stats-footer__stat-label">Участников</div>
          </Link>

          <Link href="/matches" className="stats-footer__stat-item">
            <div className="stats-footer__stat-value">
              {matchesCount ?? "…"}
            </div>
            <div className="stats-footer__stat-label">Матчей</div>
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