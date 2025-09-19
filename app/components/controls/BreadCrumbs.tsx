// app/components/SimpleBreadcrumbs.tsx
"use client";

import "./BreadCrumbs.css";

import Link from "next/link";
import { usePathname, useParams, useSearchParams } from "next/navigation";
import { useUser } from "../UserContext";

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

  function humanize(slug?: string, fallback = "—"): string {
  if (!slug) return fallback;
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const generateBreadcrumbs = (): Crumb[] => {
  const breadcrumbs: Crumb[] = [];

  const segments = pathname.split("/").filter(Boolean); // ["admin","clubs","klub-myacheva","turnir-myaeva", ...]
  const isAdmin = segments[0] === "admin";
  const isClubs = segments[1] === "clubs";

  // из useParams(): { slug: string; tournamentSlug?: string }
  const clubSlug = (params as any)?.slug as string | undefined;
  const tournamentSlug = (params as any)?.tournamentSlug as string | undefined;

  // ----- /admin/clubs -----
  if (isClubs) {

    // ----- /admin/clubs/[slug] -----
    if (clubSlug) {
      if (clubSlug != "undefined") {
        const clubLabel = humanize(clubSlug, clubName ?? "Клуб");
        breadcrumbs.push({ href: isAdmin ? `/admin/clubs/${clubSlug}?tab=tournaments` : `/player/clubs/${clubSlug}?tab=tournaments`, label: clubName ?? clubLabel });
      } else {
        breadcrumbs.push({ href: `/tournaments`, label: "Турниры" });
      }
    

      // ----- /admin/clubs/[slug]/[tournamentSlug] -----
      if (tournamentSlug) {
        const tLabel = humanize(tournamentSlug, tournamentName ?? "Турнир");
        // последняя крошка — без ссылки (href:"")
        breadcrumbs.push({ href: "", label: tournamentName ?? tLabel });
      }
    }

    return breadcrumbs;
  }

  // ----- fallback (если понадобится для публичных путей) -----
  // Здесь можно оставить прежнюю логику public / player веток, если нужно.
  // Пока просто вернём то, что уже собрали.
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