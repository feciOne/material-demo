export interface Location {
  info: Info;
  results: LocationDataItem[];
}

export interface Info {
  count: number;
  pages: number;
  prev: string | null;
  next: string | null;
}

export interface LocationDataItem {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: Date;
}
