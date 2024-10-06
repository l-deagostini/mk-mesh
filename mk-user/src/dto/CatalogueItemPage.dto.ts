import { CatalogueItemDto } from './CatalogueItem.dto';
import { withPaging } from './Page.dto';

export class CatalogueItemPageDto extends withPaging(CatalogueItemDto, {
  description: 'List of catalogue items in the page',
}) {}
