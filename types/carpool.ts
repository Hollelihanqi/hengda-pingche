export type TripType = 'driver_offer' | 'passenger_request'; // 车找人 vs 人找车

export type TripDirection = 'into_city' | 'out_city' | 'metro_transfer' | 'custom';

export type TripStatus = 'active' | 'full' | 'in_progress' | 'completed' | 'cancelled';

export interface LocationPoint {
  name: string;
  detail?: string;
  zone: string; // 恒大文旅城 / 高新区 / 经开区 / 雁塔曲江 / 地铁接驳
  lat?: number;
  lng?: number;
}

export interface Waypoint {
  id: string;
  name: string;
  estimatedTime?: string;
  isPickupAllowed?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  phone: string;
  isVerifiedOwner: boolean;
  communityPhase: string; // 如：文旅城一期 / 二期 / 三期 / 公馆 / 商业街
  roomNumber?: string;
  creditScore: number; // 98/100
  completedTripsCount: number;
  identityTag?: string; // 认证业主 / 高新上班族 / 经开IT人
}

export interface CarInfo {
  brandModel: string; // 如：特斯拉 Model Y / 比亚迪 汉EV / 理想 L7 / 极氪 001
  color: string;
  plateMasked: string; // 如：陕A·8***6
  energyType: 'ev' | 'hybrid' | 'fuel';
}

export interface PassengerBooking {
  id: string;
  tripId: string;
  passengerId: string;
  passengerName: string;
  passengerAvatar: string;
  passengerPhone: string;
  communityPhase: string;
  seatsBooked: number;
  pickupPoint: string;
  dropoffPoint: string;
  notes?: string;
  status: 'confirmed' | 'cancelled' | 'checked_in';
  createdAt: string;
  boardingCode: string; // 6位数字乘车核验码
}

export interface CarpoolTrip {
  id: string;
  type: TripType;
  direction: TripDirection;
  publisher: UserProfile;
  origin: LocationPoint;
  destination: LocationPoint;
  waypoints: Waypoint[];
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  isRecurring: boolean; // 是否工作日固定发车
  recurringDays?: string[]; // ['周一', '周二', '周三', '周四', '周五']
  totalSeats: number;
  availableSeats: number;
  price?: number; // 拼车分摊费用（元/位）
  carInfo?: CarInfo;
  preferences: string[]; // ['准时发车', '禁烟', '走正阳快速路', '后排宽松', '轻声交流', '可放行李']
  routeHighway: string; // 如：正阳大道 ➔ 绕城高速 ➔ 唐延路
  estimatedMinutes: number;
  estimatedDistanceKm: number;
  remark?: string;
  status: TripStatus;
  createdAt: string;
  bookings: PassengerBooking[];
  viewCount?: number;
}

export interface FilterOptions {
  type: 'all' | 'driver_offer' | 'passenger_request';
  direction: 'all' | 'into_city' | 'out_city' | 'metro_transfer';
  destinationArea: string; // 'all' | '高新区' | '经开区' | '曲江新区' | '地铁站' | '钟楼小寨'
  date: string; // 'today' | 'tomorrow' | 'all'
  timeSlot: 'all' | 'morning_peak' | 'evening_peak' | 'daytime' | 'night';
  searchKeyword: string;
}
