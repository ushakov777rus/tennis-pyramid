"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MatchRepository } from "@/app/repositories/MatchRepository";
import { PlayersRepository } from "@/app/repositories/PlayersRepository";
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository";
import { ClubsRepository } from "@/app/repositories/ClubsRepository";
import { AuthContainer } from "@/app/components/AuthContainer";
import { UserRole } from "@/app/models/Users";

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
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--background, #0f0f0f)',
        borderTop: '1px solid var(--bracket-border, rgb(63 77 36 / 30%))',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 1000
      }}>
        {/* Текст с кнопками */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          opacity: 0.9,
          marginBottom: '8px'
        }}>
        <button
            onClick={openLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#A6FF00',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Войдите
          </button>
          <span style={{ marginRight: '8px' }}> или </span>
          <button
            onClick={openRegister}
            style={{
              background: 'none',
              border: 'none',
              color: '#A6FF00',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Зарегистрируйтесь
          </button>
          <span style={{ margin: '0 8px' }}>для просмотра своих турниров</span>

        </div>

        {/* Статистика */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <Link href="/clubs" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#A6FF00' }}>
                {clubsCount ?? "…"}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Клубов</div>
            </div>
          </Link>

          <Link href="/tournaments" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#A6FF00' }}>
                {tournamentsCount ?? "…"}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Турниров</div>
            </div>
          </Link>

          <Link href="/rating" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#A6FF00' }}>
                {playersCount ?? "…"}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Участников</div>
            </div>
          </Link>

          <Link href="/matches" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#A6FF00' }}>
                {matchesCount ?? "…"}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Матчей</div>
            </div>
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