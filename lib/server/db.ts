import { CarpoolTrip, UserProfile, PassengerBooking } from '@/types/carpool';
import { INITIAL_TRIPS, currentUserProfile } from '@/lib/mockData';

// Global singleton in Node memory during server runtime
declare global {
  // eslint-disable-next-line no-var
  var __carpool_db_trips__: CarpoolTrip[] | undefined;
  // eslint-disable-next-line no-var
  var __carpool_db_users__: Map<string, UserProfile> | undefined;
}

if (!global.__carpool_db_trips__) {
  global.__carpool_db_trips__ = [...INITIAL_TRIPS];
}

if (!global.__carpool_db_users__) {
  global.__carpool_db_users__ = new Map<string, UserProfile>();
  global.__carpool_db_users__.set(currentUserProfile.id, currentUserProfile);
}

export const serverDb = {
  // Trips operations
  getTrips(options?: {
    type?: string;
    direction?: string;
    date?: string;
    keyword?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    let list = [...(global.__carpool_db_trips__ || [])];

    if (options?.status) {
      list = list.filter((t) => t.status === options.status);
    }

    if (options?.type && options.type !== 'all') {
      list = list.filter((t) => t.type === options.type);
    }

    if (options?.direction && options.direction !== 'all') {
      list = list.filter((t) => t.direction === options.direction);
    }

    if (options?.date) {
      list = list.filter((t) => t.departureDate === options.date);
    }

    if (options?.keyword) {
      const kw = options.keyword.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.origin.name.toLowerCase().includes(kw) ||
          t.destination.name.toLowerCase().includes(kw) ||
          t.publisher.name.toLowerCase().includes(kw) ||
          (t.routeHighway && t.routeHighway.toLowerCase().includes(kw)) ||
          (t.remark && t.remark.toLowerCase().includes(kw))
      );
    }

    // Sort by departureDate & departureTime ascending
    list.sort((a, b) => {
      const timeA = `${a.departureDate} ${a.departureTime}`;
      const timeB = `${b.departureDate} ${b.departureTime}`;
      return timeA.localeCompare(timeB);
    });

    const total = list.length;
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const paginated = list.slice((page - 1) * pageSize, page * pageSize);

    return {
      trips: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  getTripById(id: string): CarpoolTrip | null {
    const trip = global.__carpool_db_trips__?.find((t) => t.id === id);
    return trip || null;
  },

  createTrip(newTrip: CarpoolTrip): CarpoolTrip {
    if (!global.__carpool_db_trips__) {
      global.__carpool_db_trips__ = [];
    }
    // Prepend new trip
    global.__carpool_db_trips__.unshift(newTrip);
    return newTrip;
  },

  updateTrip(id: string, updates: Partial<CarpoolTrip>): CarpoolTrip | null {
    if (!global.__carpool_db_trips__) return null;
    const index = global.__carpool_db_trips__.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updated = {
      ...global.__carpool_db_trips__[index],
      ...updates,
    };
    global.__carpool_db_trips__[index] = updated;
    return updated;
  },

  deleteTrip(id: string): boolean {
    if (!global.__carpool_db_trips__) return false;
    const beforeCount = global.__carpool_db_trips__.length;
    global.__carpool_db_trips__ = global.__carpool_db_trips__.filter((t) => t.id !== id);
    return global.__carpool_db_trips__.length < beforeCount;
  },

  bookTrip(
    tripId: string,
    bookingData: Omit<PassengerBooking, 'id' | 'createdAt' | 'boardingCode' | 'status'>
  ): { trip: CarpoolTrip; booking: PassengerBooking } | null {
    const trip = this.getTripById(tripId);
    if (!trip) return null;

    if (trip.availableSeats < bookingData.seatsBooked) {
      throw new Error('剩余座位不足');
    }

    const boardingCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newBooking: PassengerBooking = {
      ...bookingData,
      id: 'bk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      status: 'confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      boardingCode,
    };

    const remaining = Math.max(0, trip.availableSeats - newBooking.seatsBooked);
    const updatedTrip = this.updateTrip(tripId, {
      availableSeats: remaining,
      status: remaining === 0 ? 'full' : trip.status,
      bookings: [...trip.bookings, newBooking],
    });

    if (!updatedTrip) return null;
    return { trip: updatedTrip, booking: newBooking };
  },

  // User operations
  getUser(id: string): UserProfile | null {
    return global.__carpool_db_users__?.get(id) || null;
  },

  saveUser(user: UserProfile): UserProfile {
    if (!global.__carpool_db_users__) {
      global.__carpool_db_users__ = new Map();
    }
    global.__carpool_db_users__.set(user.id, user);
    return user;
  },

  // Statistics calculation for the community dashboard
  getStats() {
    const allTrips = global.__carpool_db_trips__ || [];
    const activeTrips = allTrips.filter((t) => t.status === 'active' || t.status === 'full');
    const driverTrips = activeTrips.filter((t) => t.type === 'driver_offer');
    const passengerTrips = activeTrips.filter((t) => t.type === 'passenger_request');

    const totalSeatsOffered = driverTrips.reduce((acc, t) => acc + (t.totalSeats || 3), 0);
    const totalSeatsBooked = driverTrips.reduce(
      (acc, t) => acc + ((t.totalSeats || 3) - (t.availableSeats || 0)),
      0
    );

    // Approximate carbon reduction: 1.5kg CO2 per passenger carpool (35km trip)
    const co2SavedKg = Math.round(totalSeatsBooked * 1.5 * 10) / 10;

    return {
      totalTrips: allTrips.length,
      activeTrips: activeTrips.length,
      driverOffers: driverTrips.length,
      passengerRequests: passengerTrips.length,
      totalSeatsOffered,
      totalSeatsBooked,
      co2SavedKg,
      communityActiveUsers: 248,
    };
  },
};
