import { MatchesProvider } from "./MatchesProvider";
import { MatchesClient } from "./MatchesClient";

export default function MatchesPage() {
  return (
    <MatchesProvider>
      <MatchesClient />
    </MatchesProvider>
  );
}
