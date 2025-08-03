"use client";

import Link from "next/link";
import "./MainPage.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <nav className="hero-nav">
          <Link href="/tournaments">Турниры</Link>
          <Link href="/rating">Рейтинг</Link>
          <Link href="/matches">Матчи</Link>
          <button className="login-btn">Войти</button>
        </nav>
        <div className="hero-content">
          <h1>Турниры по пирамиде</h1>
          <Link href="/tournaments" className="hero-btn">
            Турниры
          </Link>
        </div>
      </div>
    </section>
  );
}