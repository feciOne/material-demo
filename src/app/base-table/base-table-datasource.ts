import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, tap } from 'rxjs/operators';
import { Observable, merge, Subscription } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { Location, LocationDataItem } from '../models/all-data.model';


export class FilterRuleItem {
  constructor(public term: string, public by: string) {}
}

@Injectable({providedIn: 'root'})
export class BaseTableDataSource extends DataSource<LocationDataItem> {
  data!: LocationDataItem[];
  filteredData: LocationDataItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  _searchTerm!: string;
  filter = new EventEmitter<FilterRuleItem>();
  subscription = new Subscription();

  constructor(private dataService: DataService) {
    super();

    this.subscription = dataService.locationData.subscribe((data: Location) => {
      this.data = data.results;
    });
  }

  connect(): Observable<LocationDataItem[]> {
    if (this.paginator && this.sort) {
      return merge(
        this.dataService.locationData,
        this.paginator.page,
        this.sort.sortChange,
        this.filter
      ).pipe(
        tap((data) => {
          let filteredDataBackup: LocationDataItem[] = [];

          if (data && data instanceof FilterRuleItem) {
            this._searchTerm = data.term;
          }

          if (this.filteredData.length > 0) {
            filteredDataBackup = [...this.filteredData];
          }

          this.filteredData =
            data instanceof FilterRuleItem
              ? this.data.filter((item: LocationDataItem) =>
                  item.name.toLowerCase().includes(this._searchTerm)
                )
              : [];

          if (this._searchTerm && this.filteredData.length === 0) {
            this.filteredData = [...filteredDataBackup];
          }
        }),
        map(() => {
          return this.getPagedData(
            this.getSortedData([
              ...(this._searchTerm ? this.filteredData : this.data),
            ])
          );
        }),
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPagedData(data: LocationDataItem[]): LocationDataItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;

      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: LocationDataItem[]): LocationDataItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';

      switch (this.sort?.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'type':
          return compare(a.type, b.type, isAsc);
        case 'dimension':
          return compare(a.dimension, b.dimension, isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
