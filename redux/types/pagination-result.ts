export default interface PaginationResult<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}
