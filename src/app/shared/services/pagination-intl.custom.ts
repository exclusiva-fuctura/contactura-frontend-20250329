import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Subject} from 'rxjs';

@Injectable()
export class PaginatorIntlCustom implements MatPaginatorIntl {
  changes = new Subject<void>();

  // Internationalization
  firstPageLabel = `primeira página`;
  itemsPerPageLabel = `Items por página:`;
  lastPageLabel = `última página`;

  nextPageLabel = `próxima página`;
  previousPageLabel = `página anterior`;

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  }
}