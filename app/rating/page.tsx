// server component (по умолчанию)

import { Suspense } from "react";

import { PlayerListView } from "./PlayerListView";

export default function RatingPage() {
  return (
    <Suspense fallback={null}>
      <PlayerListView clubId={null} />
    </Suspense>
  );
}
