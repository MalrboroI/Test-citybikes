export interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Company {
  name: string;
}

export interface Network {
  id: string;
  name: string;
  company: Company[];
  location: Location;
  stations?: Station[];
}

export interface Station {
  id: string;
  name: string;
  free_bikes: number;
  empty_slots: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface NetworkResponse {
  network: Network;
}

export interface NetworksResponse {
  networks: Network[];
}