"use client";

import Link from "next/link";
import { StatsFooter } from "./components/StatsFooter";

export default function HomePage() {
  return (
    <div 
      className="page-container-no-padding" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100dvh', // Используем dvh вместо vh для мобильных устройств
        width: '100%',
        
      }}
    >
      <Link
        href="/freetournament"
        className="btn-base floating-cta"
        aria-label="Перейти к созданию быстрого турнира"
        style={{
          fontSize: '1.5rem',
          padding: '1rem 2rem',
          textDecoration: 'none',
          
          zIndex: 2
        }}
      >
        Быстрый турнир
      </Link>

      <StatsFooter />
    </div>
  );
}