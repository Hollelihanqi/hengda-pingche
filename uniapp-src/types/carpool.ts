/**
 * 恒大文旅城邻里拼车 TypeScript 类型定义
 */
export type UserRole = 'driver' | 'passenger';
export type TripType = 'driver_offer' | 'passenger_request';

export interface OwnerProfile {
  id: string;
  name: string;
  phone: string;
  communityPhase: '恒大文旅城·1期' | '恒大文旅城·2期' | '恒大文旅城·3期' | '恒大文旅城·4期';
  buildingUnit: string;
  isVerifiedOwner: boolean;
  avatar: string;
  creditScore: number;
  carModel?: string;
  carPlate?: string;
  tags?: string[];
}

export interface TripLocation {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface BookingRecord {
  id: string;
  tripId: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  seatsBooked: number;
  boardingCode: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  tripTime?: string;
  origin?: string;
  destination?: string;
}

export interface CarpoolTrip {
  id: string;
  type: TripType;
  publisher: OwnerProfile;
  departureDate: string;
  departureTime: string;
  origin: TripLocation;
  destination: TripLocation;
  routeHighway: string;
  availableSeats: number;
  totalSeats: number;
  preferences: string[];
  carModel?: string;
  carPlate?: string;
  note: string;
  bookings: BookingRecord[];
  isRecurringWorkday?: boolean;
}
