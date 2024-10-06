export class PageDto<T> {
  currentPage: number;
  totalPages: number;
  length: number;
  data: T[];
}
