// app/components/SimpleBreadcrumbs.tsx
"use client";

import "./BreadCrumbs.css";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useDictionary, useLocale } from "@/app/components/LanguageProvider";
import { stripLocaleFromPath, withLocalePath } from "@/app/i18n/routing";

type SimpleBreadcrumbsProps = {
  clubName?: string;
  tournamentName?: string;
};

type Crumb = { href: string; label: string };

export function SimpleBreadcrumbs({ clubName, tournamentName }: SimpleBreadcrumbsProps) {
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const { breadcrumbs } = useDictionary();

  const fallbackClub = breadcrumbs.clubFallback;
  const fallbackTournament = breadcrumbs.tournamentFallback;

  const { path } = stripLocaleFromPath(pathname);
  const segments = path.split("/").filter(Boolean);

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
  const isAdmin = segments[0] === "admin";
  const isPlayer = segments[0] === "player";
  const isClubs = (isAdmin || isPlayer) && segments[1] === "clubs";

  // из useParams(): { slug: string; tournamentSlug?: string }
  const clubSlug = (params as any)?.slug as string | undefined;
  const tournamentSlug = (params as any)?.tournamentSlug as string | undefined;

  // ----- /admin/clubs -----
  if (isClubs) {

    // ----- /admin/clubs/[slug] -----
    if (clubSlug) {
      if (clubSlug != "undefined") {
        const clubLabel = humanize(clubSlug, clubName ?? fallbackClub);
        const basePath = isAdmin ? `/admin/clubs/${clubSlug}` : `/player/clubs/${clubSlug}`;
        const href = `${withLocalePath(locale, basePath)}?tab=tournaments`;
        breadcrumbs.push({ href, label: clubName ?? clubLabel });
      } else {
        breadcrumbs.push({ href: withLocalePath(locale, "/tournaments"), label: breadcrumbs.tournaments });
      }
    

      // ----- /admin/clubs/[slug]/[tournamentSlug] -----
      if (tournamentSlug) {
        const tLabel = humanize(tournamentSlug, tournamentName ?? fallbackTournament);
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
    <nav aria-label={breadcrumbs.ariaLabel} className="breadcrumbs">
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
