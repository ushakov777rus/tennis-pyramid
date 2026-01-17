// server component (по умолчанию)

import { Suspense } from "react"; // suspense for client boundary
import { redirect } from "next/navigation"; // server redirect helper

import { TournamentsProvider } from "@/app/tournaments/TournamentsProvider"; // tournaments context
import { TournamentsClient } from "@/app/tournaments/TournamentsClient"; // tournaments list UI
import { TournamentsRepository } from "@/app/repositories/TournamentsRepository"; // tournaments data access
import { withLocalePath } from "@/app/i18n/routing"; // locale-aware routing
import { type Locale } from "@/app/i18n/config"; // locale type

type TournamentsPageProps = { // server props for page content
  page: number; // current page number
  pageSize: number; // items per page
  locale: Locale; // current locale
}; // end TournamentsPageProps

export default async function TournamentsPage({ page, pageSize, locale }: TournamentsPageProps) { // server-side list page
  const safePage = Math.max(1, page); // guard against invalid pages
  const { tournaments, total } = await TournamentsRepository.loadPagePlain(safePage, pageSize); // load page data as plain objects
  const totalPages = Math.max(1, Math.ceil(total / pageSize)); // compute total pages
  if (safePage > totalPages) { // redirect to last page when out of range
    redirect(withLocalePath(locale, `/tournaments/${totalPages}`)); // keep URL consistent with page count
  } // end out-of-range guard
  const stats = await TournamentsRepository.loadStats(tournaments.map((t) => t.id)); // load stats for current page
  return ( // render page
    <TournamentsProvider // provide tournaments context
      initialTournamentsPlain={tournaments} // hydrate list from server as plain objects
      initialStats={stats} // hydrate stats from server
      autoLoad={false} // avoid duplicate client loads
      page={safePage} // current page for refresh fallback
      pageSize={pageSize} // page size for refresh fallback
    >
      <Suspense fallback={null}> {/* suspense boundary */}
        <TournamentsClient // tournaments list view
          club={null} // no club filter
          pagination={{ // pagination config
            currentPage: safePage, // current page
            totalPages, // total pages
            basePath: "/tournaments", // base path for links
          }} // end pagination config
        /> {/* end TournamentsClient */}
      </Suspense> {/* end suspense */}
    </TournamentsProvider> // end provider
  ); // end render
} // end TournamentsPage
