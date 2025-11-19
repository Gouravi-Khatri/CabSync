export enum Provider {
  UBER = 'Uber',
  RAPIDO = 'Rapido',
  NAMMA_YATRI = 'Namma Yatri'
}

export enum VehicleType {
  BIKE = 'Bike',
  AUTO = 'Auto',
  MINI = 'Mini',
  SEDAN = 'Sedan',
  SUV = 'SUV',
  PREMIER = 'Premier'
}

export interface RideOption {
  id: string;
  provider: Provider;
  type: VehicleType;
  price: number;
  eta: string; // Estimated time to arrival (pickup)
  tripDuration: string;
  rating?: number; // Driver rating mock
  surge?: boolean;
}

export interface TripDetails {
  distance: string;
  duration: string;
  origin: string;
  destination: string;
}

export interface SearchResult {
  details: TripDetails;
  options: RideOption[];
}
