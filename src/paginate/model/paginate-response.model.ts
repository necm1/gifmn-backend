/**
 * @class PaginateResponse<T>
 */
export class PaginateResponse<T> {
  data: T[];
  meta: {
    itemsPerPage: number
    totalItems: number
    currentPage: number
    totalPages: number
  };
  links: {
    first?: string
    previous?: string
    current: string
    next?: string
    last?: string
  };
}
