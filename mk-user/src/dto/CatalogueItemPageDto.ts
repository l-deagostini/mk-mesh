import { CatalogueItemDto } from './CatalogueItemDto';
import { withPaging } from './PageDto';

export class CatalogueItemPageDto extends withPaging(CatalogueItemDto, {
  description: 'List of catalogue items in the page',
}) {}
