import { Component } from '@angular/core';
import { BaseTableComponent } from '../base-table/base-table.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent extends BaseTableComponent {
  constructor(dataService: DataService) {
    super(dataService);

    super.displayedColumns = ['id', 'name', 'type', 'dimension'];
  }
}
