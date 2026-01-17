export type PaginationConfig = { // pagination config shape
  currentPage: number; // current page number
  totalPages: number; // total pages count
  maxButtons: number; // max buttons to display
}; // end PaginationConfig

export class PaginationModel { // pagination calculation model
  private currentPage: number; // current page value
  private totalPages: number; // total pages value
  private maxButtons: number; // max buttons value

  constructor(config: PaginationConfig) { // model constructor
    this.currentPage = config.currentPage; // store current page
    this.totalPages = config.totalPages; // store total pages
    this.maxButtons = config.maxButtons; // store max buttons
  } // end constructor

  get hasPrev(): boolean { // previous page availability
    return this.currentPage > 1; // true when previous page exists
  } // end hasPrev

  get hasNext(): boolean { // next page availability
    return this.currentPage < this.totalPages; // true when next page exists
  } // end hasNext

  get prevPage(): number { // previous page number
    return Math.max(1, this.currentPage - 1); // clamp to first page
  } // end prevPage

  get nextPage(): number { // next page number
    return Math.min(this.totalPages, this.currentPage + 1); // clamp to last page
  } // end nextPage

  getPages(): number[] { // compute visible pages
    const total = Math.max(1, this.totalPages); // normalize total pages
    const maxButtons = Math.max(1, this.maxButtons); // normalize buttons count
    const half = Math.floor(maxButtons / 2); // buttons per side
    let start = Math.max(1, this.currentPage - half); // start page
    let end = Math.min(total, start + maxButtons - 1); // end page
    start = Math.max(1, end - maxButtons + 1); // rebalance start for short ranges
    const pages: number[] = []; // pages accumulator
    for (let page = start; page <= end; page += 1) { // iterate through range
      pages.push(page); // add page number
    } // end range loop
    return pages; // return pages list
  } // end getPages
} // end PaginationModel
