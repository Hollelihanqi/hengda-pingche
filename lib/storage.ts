'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { CarpoolTrip, UserProfile, PassengerBooking } from '@/types/carpool';
import { INITIAL_TRIPS, currentUserProfile } from './mockData';

const TRIPS_STORAGE_KEY = 'hd_carpool_trips_v1';
const USER_STORAGE_KEY = 'hd_carpool_user_v1';

let currentTrips: CarpoolTrip[] = INITIAL_TRIPS;
let currentUserState: UserProfile = currentUserProfile;
let isInitialized = false;

const listeners = new Set<() => void>();

function initStoreIfNeeded() {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;
  try {
    const savedTrips = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (savedTrips) {
      currentTrips = JSON.parse(savedTrips);
    }
  } catch (e) {
    console.error('Failed to load trips from storage:', e);
  }
  try {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      currentUserState = JSON.parse(savedUser);
    }
  } catch (e) {
    console.error('Failed to load user from storage:', e);
  }
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  initStoreIfNeeded();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function saveTripsToStorage(trips: CarpoolTrip[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error('Failed to save trips:', e);
  }
}

export function saveUserToStorage(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user:', e);
  }
}

// Custom hook to manage app carpool state across components
export function useCarpoolStore() {
  const trips = useSyncExternalStore(
    subscribe,
    () => {
      initStoreIfNeeded();
      return currentTrips;
    },
    () => INITIAL_TRIPS
  );

  const currentUser = useSyncExternalStore(
    subscribe,
    () => {
      initStoreIfNeeded();
      return currentUserState;
    },
    () => currentUserProfile
  );

  const addTrip = useCallback((newTrip: CarpoolTrip) => {
    currentTrips = [newTrip, ...currentTrips];
    saveTripsToStorage(currentTrips);
    emitChange();
  }, []);

  const cancelTrip = useCallback((tripId: string) => {
    currentTrips = currentTrips.map((t) => (t.id === tripId ? { ...t, status: 'cancelled' as const } : t));
    saveTripsToStorage(currentTrips);
    emitChange();
  }, []);

  const bookSeat = useCallback((tripId: string, bookingData: Omit<PassengerBooking, 'id' | 'createdAt' | 'boardingCode' | 'status'>) => {
    const boardingCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newBooking: PassengerBooking = {
      ...bookingData,
      id: 'bk_' + Date.now(),
      status: 'confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      boardingCode,
    };

    currentTrips = currentTrips.map((trip) => {
      if (trip.id === tripId) {
        const remaining = Math.max(0, trip.availableSeats - newBooking.seatsBooked);
        return {
          ...trip,
          availableSeats: remaining,
          status: (remaining === 0 ? 'full' : trip.status) as any,
          bookings: [...trip.bookings, newBooking],
        };
      }
      return trip;
    });

    saveTripsToStorage(currentTrips);
    emitChange();
    return newBooking;
  }, []);

  const cancelBooking = useCallback((tripId: string, bookingId: string) => {
    currentTrips = currentTrips.map((trip) => {
      if (trip.id === tripId) {
        const targetBooking = trip.bookings.find((b) => b.id === bookingId);
        const seatsToRestore = targetBooking ? targetBooking.seatsBooked : 1;
        const newBookings = trip.bookings.filter((b) => b.id !== bookingId);
        const newAvailable = Math.min(trip.totalSeats, trip.availableSeats + seatsToRestore);
        return {
          ...trip,
          availableSeats: newAvailable,
          status: (trip.status === 'full' ? 'active' : trip.status) as any,
          bookings: newBookings,
        };
      }
      return trip;
    });

    saveTripsToStorage(currentTrips);
    emitChange();
  }, []);

  const updateUser = useCallback((updated: Partial<UserProfile>) => {
    currentUserState = { ...currentUserState, ...updated };
    saveUserToStorage(currentUserState);
    emitChange();
  }, []);

  const resetToSampleData = useCallback(() => {
    currentTrips = INITIAL_TRIPS;
    currentUserState = currentUserProfile;
    saveTripsToStorage(INITIAL_TRIPS);
    saveUserToStorage(currentUserProfile);
    emitChange();
  }, []);

  return {
    trips,
    currentUser,
    addTrip,
    cancelTrip,
    bookSeat,
    cancelBooking,
    updateUser,
    resetToSampleData,
  };
}

