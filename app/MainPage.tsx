"use client";

import { useState } from "react";

import { LoginModal } from "@/app/login/LoginModal";
import { GuestOnly, LoggedIn} from "@/app/components/RoleGuard"
import { UserBadge } from "@/app/components/UserBadge"

import "./MainPage.css";

export default function HeroSection() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <section className="hero">
      <div className="hero-overlay">
        <nav className="hero-nav">
          <a href="/tournaments">Турниры</a>
          <a href="/rating">Рейтинг</a>
          <a href="/matches">Матчи</a>
          <UserBadge></UserBadge>
        </nav>
        <div className="hero-content">
          <h1>Турниры по пирамиде</h1>
          <a href="/tournaments" className="hero-btn">
            Турниры
          </a>
        </div>
      </div>

      {/* модалка */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </section>
  );
}