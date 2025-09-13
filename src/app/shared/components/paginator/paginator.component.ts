import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '../../../material/material.module';
import { PaginatorIntlCustom } from '../../services/pagination-intl.custom';


@Component({
  selector: 'app-paginator',
  imports: [MaterialModule],
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorIntlCustom}],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() length = 50;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions = [5, 10, 25];
  
  @Output() pageEvent: EventEmitter<any> = new EventEmitter();

  handlePageEvent(e: PageEvent) {
    this.pageEvent.emit(e);  
  }
}
