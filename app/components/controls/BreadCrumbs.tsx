// app/components/SimpleBreadcrumbs.tsx
"use client";

import "./BreadCrumbs.css";

import Link from "next/link";
import { usePathname, useParams, useSearchParams } from "next/navigation";
import { useUser } from "../UserContext";
import { UserRole } from "@/app/models/Users";

type SimpleBreadcrumbsProps = {
  clubName?: string;
  tournamentName?: string;
};

type Crumb = { href: string; label: string };

export function SimpleBreadcrumbs({ clubName, tournamentName }: SimpleBreadcrumbsProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const generateBreadcrumbs = (): Crumb[] => {
    const breadcrumbs: Crumb[] = [];

    // ---------- tadmin ----------
    if (pathname === "/tadmin") {
      const clubSlug = (params.slug as string) || "moi-klub";
      const label =
        clubName ??
        clubSlug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

      breadcrumbs.push({ href: `/tadmin`, label });
    }

    // ---------- Клубы ----------
    else if (pathname.includes("/clubs/")) {
      const clubSlug = params.slug as string;
      const label =
        clubName ??
        (clubSlug
          ? clubSlug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "Мой клуб");

      breadcrumbs.push({ href: `/clubs/${clubSlug}`, label });
    }

    // ---------- Турниры ----------
    else if (pathname.includes("/tournaments/")) {
      const tournamentSlug = params.slug as string;
      const label = tournamentName ?? tournamentSlug;

      if (clubName) {
        if ( user?.role == UserRole.TournamentAdmin ) {
          breadcrumbs.push({ href: "/tadmin?tab=tournaments", label: clubName });
        } else {
          breadcrumbs.push({ href: "/player?tab=tournaments", label: clubName });
        }
      }

      breadcrumbs.push({ href: "", label });

      console.log("breadcrumbs for tournamrnt", clubName, breadcrumbs);
    }

    // ---------- Общий случай ----------
    else {
      const segments = pathname.split("/").filter((s) => s !== "");
      segments.forEach((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label =
          segment.charAt(0).toUpperCase() +
          segment.slice(1).replace(/-/g, " ");
        breadcrumbs.push({ href, label });
      });
    }
/*
    switch (tab) {
      case "bracket":
        breadcrumbs.push({ href: "", label: "Сетка" });
        break;
      case "matches":
        breadcrumbs.push({ href: "", label: "Матчи" });
        break;
      case "participants":
        breadcrumbs.push({ href: "", label: "Участники" });
        break;
      case "tournaments":
        breadcrumbs.push({ href: "", label: "Турниры" });
        break;
      case "results":
        breadcrumbs.push({ href: "", label: "Результаты" });
        break;
      case "aboutt":
        breadcrumbs.push({ href: "", label: "О турнире" });
        break;
      case "aboutc":
        breadcrumbs.push({ href: "", label: "О клубе" });
        break;
      case "rating":
        breadcrumbs.push({ href: "", label: "Рейтинг" });
        break;
    }
*/
    return breadcrumbs;
  };

  const raw = generateBreadcrumbs();

  // --- Раскладка в 7 ячеек ---
  const slots: (Crumb | null)[] = new Array(5).fill(null);

  // последняя крошка должна быть в 4-й ячейке (index = 3)
  const lastIndex = raw.length - 1;
  const shift = 2 - lastIndex; // насколько сместить все крошки
  raw.forEach((crumb, i) => {
    const pos = i + shift;
    if (pos >= 0 && pos < 5) {
      slots[pos] = crumb;
    }
  });

  return (
    <nav aria-label="Хлебные крошки" className="breadcrumbs">
      <ol className="breadcrumbs-list">
        {slots.map((slot, index) => {
          if (!slot) {
            return (
              <li key={index} className="breadcrumbs-item breadcrumbs-item--empty" />
            );
          }
          const isLast = slot === raw[raw.length - 1];
          return (
            <li key={index} className="breadcrumbs-item">
              {isLast ? (
                <h1>{slot.label}</h1>
              ) : slot.href ? (
                <>
                  <Link href={slot.href} className="breadcrumbs-link">
                    {slot.label}
                  </Link>
                </>
              ) : (
                <>
                  <span className="breadcrumbs-text">{slot.label}</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}