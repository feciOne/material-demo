import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { LocationDataItem } from '../models/all-data.model';
import { DataService } from '../services/data.service';
import { BaseTableDataSource, FilterRuleItem } from './base-table-datasource';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
})
export class BaseTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<LocationDataItem>;
  dataSource: BaseTableDataSource;

  displayedColumns = ['name'];

  constructor(private dataService: DataService) {
    this.dataSource = new BaseTableDataSource(dataService);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter.emit(new FilterRuleItem(filterValue.trim().toLowerCase(), 'name'));

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
