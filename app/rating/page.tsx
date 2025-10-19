// server component (по умолчанию)

import type { Metadata } from "next";
import { Suspense } from "react";

import { RatingView } from "../components/RatingView";

export const metadata: Metadata = {
  title: "Рейтинг игроков HoneyCup",
  description:
    "Рейтинг игроков HoneyCup: позиции, очки и динамика любительских теннисистов.",
  alternates: { canonical: "/rating" },
};

export default function RatingPage() {
  return (
    <Suspense fallback={null}>
      <RatingView />
    </Suspense>
  );
}
