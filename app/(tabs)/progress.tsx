import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Camera as CameraIcon } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';

export default function ProgressScreen() {
  const router = useRouter();
  const { photos, stats } = useUser();
  const [selectedPhotoType, setSelectedPhotoType] = useState<'all' | 'face' | 'front' | 'side' | 'back'>('all');

  const filteredPhotos = selectedPhotoType === 'all'
    ? photos
    : photos.filter(p => p.type === selectedPhotoType);

  const photoTypes = [
    { id: 'all' as const, label: 'All' },
    { id: 'face' as const, label: 'Face' },
    { id: 'front' as const, label: 'Front' },
    { id: 'side' as const, label: 'Side' },
    { id: 'back' as const, label: 'Back' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/camera' as any)}
        >
          <Plus size={20} color={Colors.light.card} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScroll}
        style={styles.filtersContainer}
      >
        {photoTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.filterChip, selectedPhotoType === type.id && styles.filterChipActive]}
            onPress={() => setSelectedPhotoType(type.id)}
          >
            <Text style={[styles.filterChipText, selectedPhotoType === type.id && styles.filterChipTextActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {photos.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <CameraIcon size={48} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.emptyStateTitle}>No Progress Photos Yet</Text>
            <Text style={styles.emptyStateText}>
              Start tracking your journey by taking your first progress photo
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/camera' as any)}
            >
              <Plus size={20} color={Colors.light.card} />
              <Text style={styles.primaryButtonText}>Add First Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {photos.length > 0 && (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{photos.length}</Text>
                <Text style={styles.statLabel}>Total Photos</Text>
              </View>
              {stats.length > 0 && stats[0].weight && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats[0].weight} lbs</Text>
                    <Text style={styles.statLabel}>Latest Weight</Text>
                  </View>
                </>
              )}
            </View>

            <Text style={styles.sectionTitle}>
              {filteredPhotos.length} {selectedPhotoType === 'all' ? 'Photos' : `${selectedPhotoType} Photos`}
            </Text>

            <View style={styles.photoGrid}>
              {filteredPhotos.map((photo) => (
                <View key={photo.id} style={styles.photoCard}>
                  <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                  <View style={styles.photoOverlay}>
                    <View style={styles.photoType}>
                      <Text style={styles.photoTypeText}>{photo.type}</Text>
                    </View>
                  </View>
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoDate}>
                      {new Date(photo.date).toLocaleDateString()}
                    </Text>
                    {photo.weight && (
                      <Text style={styles.photoWeight}>{photo.weight} lbs</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  filterChipTextActive: {
    color: Colors.light.card,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoCard: {
    width: '48%',
    aspectRatio: 3 / 4,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
  },
  photoType: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.overlay,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoTypeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.card,
    textTransform: 'capitalize' as const,
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.overlay,
    padding: 12,
  },
  photoDate: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
  photoWeight: {
    fontSize: 12,
    color: Colors.light.card,
    marginTop: 2,
  },
});
