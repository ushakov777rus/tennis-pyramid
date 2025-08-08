"use client";

import { useState } from "react";

import { LoginModal } from "@/app/login/LoginModal";
import { useRouter } from "next/navigation";

import { NavigationBar } from "@/app/components/NavigationBar";



import "./MainPage.css";
import "./globals.css"


export default function HomePage() {
  const router = useRouter();

  return (
    <div className="page-container">
      <NavigationBar />

      <h1 className="page-title">Теннисные турниры</h1>

      <main className="main">
        

        <section className="section">
          <h2 className="section-title">Идущие турниры</h2>
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div className="card card-250px" key={i}>
                <div className="card-icon">🏆</div>
                <div className="card-date">MM/DD 00:00</div>
                <button className="card-btn card-btn-act">Подробнее</button>
              </div>
            ))}
            <div className="card card-80px card-all" onClick={() => router.push("/tournaments")}>
              Все
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Ближайшие матчи</h2>
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div className="card card-250px" key={i}>
                <div className="card-icon">🎾 + 🎾</div>
                <div className="card-date">MM/DD 00:00</div>
                <button className="card-btn card-btn-act">Подробнее</button>
              </div>
            ))}
            <div className="card card-80px card-all" onClick={() => router.push("/matches")}>
              Все
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Топ игроков</h2>
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div className="card card-250px" key={i}>
                <div className="card-avatar">🏅</div>
                <div className="card-name">Player Nickname</div>
                <button className="card-btn card-btn-act">Подробнее</button>
              </div>
            ))}
            <div className="card card-80px card-all" onClick={() => router.push("/rating")}>
              Все
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}