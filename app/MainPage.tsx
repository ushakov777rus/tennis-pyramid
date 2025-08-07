"use client";

import { useState } from "react";

import { LoginModal } from "@/app/login/LoginModal";

import { NavigationBar } from "@/app/components/NavigationBar";

import "./MainPage.css";
import "./globals.css"


export default function HomePage() {
  return (
    <div className="home-container">
      <NavigationBar />

      <main className="main">
        <h1 className="main-title">Теннисные турниры</h1>

        <section className="section">
          <h2 className="section-title">Идущие турниры</h2>
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div className="card" key={i}>
                <div className="card-icon">🏆</div>
                <div className="card-date">MM/DD 00:00</div>
                <button className="card-btn">Подробнее</button>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Ближайшие матчи</h2>
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div className="card" key={i}>
                <div className="card-icon">🎾 + 🎾</div>
                <div className="card-date">MM/DD 00:00</div>
                <button className="card-btn">Подробнее</button>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Топ игроков</h2>
          <div className="card-grid">
            {[1, 2, 3].map((i) => (
              <div className="card" key={i}>
                <div className="card-avatar">🏅</div>
                <div className="card-name">Player Nickname</div>
                <button className="card-btn">Подробнее</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}