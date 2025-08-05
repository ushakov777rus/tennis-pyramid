"use client";

import { useState } from "react";

import { LoginModal } from "@/app/login/LoginModal";

import { NavigationBar } from "@/app/components/NavigationBar";

import "./MainPage.css";
import "./globals.css"


export default function HeroSection() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="base-container">
      <NavigationBar />
      <section className="hero">        
        <div className="hero-overlay">
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
    </div>
  );
}