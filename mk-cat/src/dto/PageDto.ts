export class PageDto<T> {
  current: number;
  total: number;
  count: number;
  data: T[];
}
