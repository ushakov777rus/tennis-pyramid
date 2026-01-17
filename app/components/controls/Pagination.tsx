"use client"; // client component

import { useRouter } from "next/navigation"; // router hook
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
  const router = useRouter(); // router instance
  const model = useMemo( // memoized pagination model
    () => new PaginationModel({ currentPage, totalPages, maxButtons: 5 }), // model config
    [currentPage, totalPages] // memo deps
  ); // end useMemo
  if (totalPages <= 1) { // hide when no pagination needed
    return null; // skip rendering
  } // end empty pagination guard
  const pages = model.getPagesWithLast(); // visible pages list with last page
  const buildHref = (page: number) => withLocalePath(locale, `${basePath}/${page}`); // page href helper
  const handleNavigate = (page: number) => { // navigation handler
    router.push(buildHref(page)); // navigate to page
  }; // end handleNavigate
  const endThreshold = 2; // show "to start" near the end
  const showToStart = totalPages > 1 && currentPage >= Math.max(1, totalPages - endThreshold); // end pages guard
  return ( // render pagination
    <nav className="pagination" aria-label={paginationText.ariaLabel}> {/* pagination nav */}
      {showToStart ? ( // show to-start button on last pages
        <button
          type="button" // button type
          className="btn-base pagination__control" // button styles
          onClick={() => handleNavigate(1)} // navigate to first page
        >
          {paginationText.toStart} {/* to start label */}
        </button> // end to-start button
      ) : null} {/* end to-start guard */}
      {model.hasPrev ? ( // previous page button
        <button
          type="button" // button type
          className="btn-base pagination__control" // button styles
          onClick={() => handleNavigate(model.prevPage)} // navigate to prev page
        >
          {paginationText.previous} {/* previous label */}
        </button> // end previous button
      ) : ( // disabled previous state
        <button
          type="button" // button type
          className="btn-base pagination__control is-disabled" // disabled styles
          disabled // disabled attribute
          aria-disabled="true" // aria disabled
        >
          {paginationText.previous} {/* previous label */}
        </button> // end disabled previous
      )} {/* end previous control */}

      <div className="pagination__pages"> {/* pages container */}
        {pages.map((page) => ( // render page buttons
          page === currentPage ? ( // current page
            <button
              key={page} // page key
              type="button" // button type
              className="btn-base pagination__page is-current" // current page style
              aria-current="page" // current page aria
              aria-label={paginationText.currentPageLabel.replace("{page}", String(page))} // current page aria label
              disabled // disable current page button
            >
              {page} {/* current page number */}
            </button> // end current page
          ) : ( // regular page button
            <button
              key={page} // page key
              type="button" // button type
              className="btn-base pagination__page" // page button style
              onClick={() => handleNavigate(page)} // navigate to page
              aria-label={paginationText.pageLabel.replace("{page}", String(page))} // page aria label
            >
              {page} {/* page number */}
            </button> // end page button
          ) // end page item
        ))} {/* end pages map */}
      </div> {/* end pages container */}

      {model.hasNext ? ( // next page button
        <button
          type="button" // button type
          className="btn-base pagination__control" // button styles
          onClick={() => handleNavigate(model.nextPage)} // navigate to next page
        >
          {paginationText.next} {/* next label */}
        </button> // end next button
      ) : ( // disabled next state
        <button
          type="button" // button type
          className="btn-base pagination__control is-disabled" // disabled styles
          disabled // disabled attribute
          aria-disabled="true" // aria disabled
        >
          {paginationText.next} {/* next label */}
        </button> // end disabled next
      )} {/* end next control */}

      <button
        type="button" // button type
        className="btn-base pagination__control" // button styles
        onClick={() => handleNavigate(model.lastPage)} // navigate to last page
        disabled={!model.hasNext} // disable when already on last page
        aria-disabled={!model.hasNext} // aria disabled state
      >
        {paginationText.toEnd} {/* to end label */}
      </button> {/* end to end button */}
    </nav> // end pagination
  ); // end render
} // end Pagination
