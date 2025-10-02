// server component (по умолчанию)

import { Suspense } from "react";

import { RatingView } from "../components/RatingView";

export default function RatingPage() {
  return (
    <Suspense fallback={null}>
      <RatingView />
    </Suspense>
  );
}
