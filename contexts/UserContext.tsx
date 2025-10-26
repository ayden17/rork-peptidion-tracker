import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { UserProfile, ProgressPhoto, BodyStats, Cycle, Peptide } from '@/constants/types';
import { PEPTIDES } from '@/constants/peptides';

const USER_KEY = '@peptidion_user';
const PHOTOS_KEY = '@peptidion_photos';
const STATS_KEY = '@peptidion_stats';
const CYCLES_KEY = '@peptidion_cycles';
const FAVORITES_KEY = '@peptidion_favorites';

const defaultUser: UserProfile = {
  id: '1',
  goals: [],
  experienceLevel: 'beginner',
  role: 'user',
  hasCompletedOnboarding: false,
  hasAcceptedDisclaimer: false,
  level: 1,
  experiencePoints: 0,
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [stats, setStats] = useState<BodyStats[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : defaultUser;
    },
  });

  const photosQuery = useQuery({
    queryKey: ['photos'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(PHOTOS_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STATS_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const cyclesQuery = useQuery({
    queryKey: ['cycles'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(CYCLES_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  useEffect(() => {
    if (userQuery.data) setUser(userQuery.data);
  }, [userQuery.data]);

  useEffect(() => {
    if (photosQuery.data) setPhotos(photosQuery.data);
  }, [photosQuery.data]);

  useEffect(() => {
    if (statsQuery.data) setStats(statsQuery.data);
  }, [statsQuery.data]);

  useEffect(() => {
    if (cyclesQuery.data) setCycles(cyclesQuery.data);
  }, [cyclesQuery.data]);

  useEffect(() => {
    if (favoritesQuery.data) setFavorites(favoritesQuery.data);
  }, [favoritesQuery.data]);

  const updateUserMutation = useMutation({
    mutationFn: async (updatedUser: UserProfile) => {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    },
    onSuccess: (data) => setUser(data),
  });

  const addPhotoMutation = useMutation({
    mutationFn: async (photo: ProgressPhoto) => {
      const updated = [photo, ...photos];
      await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => setPhotos(data),
  });

  const addStatsMutation = useMutation({
    mutationFn: async (stat: BodyStats) => {
      const updated = [stat, ...stats];
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => setStats(data),
  });

  const addCycleMutation = useMutation({
    mutationFn: async (cycle: Cycle) => {
      const updated = [cycle, ...cycles];
      await AsyncStorage.setItem(CYCLES_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => setCycles(data),
  });

  const updateCycleMutation = useMutation({
    mutationFn: async (cycle: Cycle) => {
      const updated = cycles.map(c => c.id === cycle.id ? cycle : c);
      await AsyncStorage.setItem(CYCLES_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => setCycles(data),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (peptideId: string) => {
      const updated = favorites.includes(peptideId)
        ? favorites.filter(id => id !== peptideId)
        : [...favorites, peptideId];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (data) => setFavorites(data),
  });

  const { mutate: mutateUser } = updateUserMutation;
  const { mutate: mutatePhoto } = addPhotoMutation;
  const { mutate: mutateStat } = addStatsMutation;
  const { mutate: mutateCycle } = addCycleMutation;
  const { mutate: mutateUpdateCycle } = updateCycleMutation;
  const { mutate: mutateFavorite } = toggleFavoriteMutation;

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    mutateUser({ ...user, ...updates });
  }, [user, mutateUser]);

  const addPhoto = useCallback((photo: ProgressPhoto) => {
    mutatePhoto(photo);
  }, [mutatePhoto]);

  const addStats = useCallback((stat: BodyStats) => {
    mutateStat(stat);
  }, [mutateStat]);

  const addCycle = useCallback((cycle: Cycle) => {
    mutateCycle(cycle);
  }, [mutateCycle]);

  const updateCycle = useCallback((cycle: Cycle) => {
    mutateUpdateCycle(cycle);
  }, [mutateUpdateCycle]);

  const toggleFavorite = useCallback((peptideId: string) => {
    mutateFavorite(peptideId);
  }, [mutateFavorite]);

  const getPeptideWithFavorite = useCallback((peptide: Peptide): Peptide => {
    return { ...peptide, isFavorite: favorites.includes(peptide.id) };
  }, [favorites]);

  const favoritePeptides = PEPTIDES.filter(p => favorites.includes(p.id)).map(getPeptideWithFavorite);
  const activeCycles = cycles.filter(c => c.isActive);

  return {
    user,
    photos,
    stats,
    cycles,
    favorites,
    updateUser,
    addPhoto,
    addStats,
    addCycle,
    updateCycle,
    toggleFavorite,
    getPeptideWithFavorite,
    favoritePeptides,
    activeCycles,
    isLoading: userQuery.isLoading || photosQuery.isLoading,
  };
});
