import { notFound } from "next/navigation"; // 404 helper

import TournamentPage, { dynamic, revalidate } from "@/app/tournaments/[slug]/pageContent"; // tournament details page
import TournamentsPage from "@/app/tournaments/pageContent"; // tournaments list page
import { isLocale } from "@/app/i18n/config"; // locale guard

type PageProps = { // route props
  params: Promise<{ locale: string; slug: string }>; // locale and slug params
}; // end PageProps

export { dynamic, revalidate };

export default async function LocaleTournamentPage({ params }: PageProps) { // tournament or list page
  const { locale, slug } = await params; // unwrap params
  if (!isLocale(locale)) { // validate locale
    notFound(); // show 404 for invalid locale
  } // end locale guard
  const pageNumber = Number(slug); // parse numeric page
  if (Number.isFinite(pageNumber) && pageNumber >= 1) { // handle numeric page path
    return ( // render paginated tournaments list
      <TournamentsPage // list page content
        page={pageNumber} // current page
        pageSize={24} // page size for list
        locale={locale} // current locale
      /> // end TournamentsPage
    ); // end list render
  } // end numeric page guard
  return <TournamentPage params={Promise.resolve({ tournamentSlug: slug })} />; // render tournament details
} // end LocaleTournamentPage
