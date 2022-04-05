import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '../models/all-data.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  locationData = new Subject<Location>();

  constructor(private httpClient: HttpClient) {}

  getLocationData(): void {
    this.httpClient
      .get<Location>('https://rickandmortyapi.com/api/location')
      .subscribe((data: Location) => {
        this.locationData.next(data);
      });
  }
}
