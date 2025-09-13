// server component (по умолчанию)
import { TournamentsProvider } from "@/app/tournaments/TournamentsProvider";
import { TournamentsClient } from "@/app/tournaments/TournamentsClient";

export default function TournamentsPage() {
  return (
    <TournamentsProvider>
      <TournamentsClient clubId={null}/>
    </TournamentsProvider>
  );
}