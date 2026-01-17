"use client"; // client component

import Link from "next/link"; // next link
import { useMemo } from "react"; // react hook

import { useDictionary, useLanguage } from "@/app/components/LanguageProvider"; // dictionary and locale
import { withLocalePath } from "@/app/i18n/routing"; // locale-aware routing
import { PaginationModel } from "@/app/components/controls/PaginationModel"; // pagination model

import "./Pagination.css"; // pagination styles

type PaginationProps = { // pagination props
  currentPage: number; // current page number
  totalPages: number; // total pages count
  basePath: string; // base path for links
}; // end PaginationProps

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) { // pagination UI
  const { locale } = useLanguage(); // current locale
  const { tournaments: tournamentsText } = useDictionary(); // dictionary access
  const paginationText = tournamentsText.pagination; // pagination labels
  const model = useMemo( // memoized pagination model
    () => new PaginationModel({ currentPage, totalPages, maxButtons: 5 }), // model config
    [currentPage, totalPages] // memo deps
  ); // end useMemo
  if (totalPages <= 1) { // hide when no pagination needed
    return null; // skip rendering
  } // end empty pagination guard
  const pages = model.getPages(); // visible pages list
  const buildHref = (page: number) => withLocalePath(locale, `${basePath}/${page}`); // page href helper
  return ( // render pagination
    <nav className="pagination" aria-label={paginationText.ariaLabel}> {/* pagination nav */}
      {model.hasPrev ? ( // previous page link
        <Link className="pagination__control" href={buildHref(model.prevPage)}> {/* previous link */}
          {paginationText.previous} {/* previous label */}
        </Link> // end previous link
      ) : ( // disabled previous state
        <span className="pagination__control is-disabled" aria-disabled="true"> {/* disabled previous */}
          {paginationText.previous} {/* previous label */}
        </span> // end disabled previous
      )} {/* end previous control */}

      <div className="pagination__pages"> {/* pages container */}
        {pages.map((page) => ( // render page links
          page === currentPage ? ( // current page
            <span
              key={page} // page key
              className="pagination__page is-current" // current page style
              aria-current="page" // current page aria
              aria-label={paginationText.currentPageLabel.replace("{page}", String(page))} // current page aria label
            >
              {page} {/* current page number */}
            </span> // end current page
          ) : ( // regular page link
            <Link
              key={page} // page key
              className="pagination__page" // page link style
              href={buildHref(page)} // page link href
              aria-label={paginationText.pageLabel.replace("{page}", String(page))} // page aria label
            >
              {page} {/* page number */}
            </Link> // end page link
          ) // end page item
        ))} {/* end pages map */}
      </div> {/* end pages container */}

      {model.hasNext ? ( // next page link
        <Link className="pagination__control" href={buildHref(model.nextPage)}> {/* next link */}
          {paginationText.next} {/* next label */}
        </Link> // end next link
      ) : ( // disabled next state
        <span className="pagination__control is-disabled" aria-disabled="true"> {/* disabled next */}
          {paginationText.next} {/* next label */}
        </span> // end disabled next
      )} {/* end next control */}
    </nav> // end pagination
  ); // end render
} // end Pagination
