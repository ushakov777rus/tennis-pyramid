"use client";

import Link from "next/link";
import { StatsFooter } from "./components/StatsFooter";

export default function HomePage() {
  return (
    <div className="page-container-no-padding" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <Link
        href="/freetournament"
        className="btn-base floating-cta"
        aria-label="Перейти к созданию быстрого турнира"
        style={{
          fontSize: '1.5rem',
          padding: '1rem 2rem',
          textDecoration: 'none'
        }}
      >
        Быстрый турнир
      </Link>

      <StatsFooter />
    </div>
  );
}