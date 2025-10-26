import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import { Search, Heart, BookOpen, CheckCircle2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PEPTIDES } from '@/constants/peptides';
import { useUser } from '@/contexts/UserContext';
import { PeptideCategory } from '@/constants/types';

const CATEGORIES: { id: PeptideCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'growth', label: 'Growth' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'fat_loss', label: 'Fat Loss' },
  { id: 'longevity', label: 'Longevity' },
  { id: 'cognitive', label: 'Cognitive' },
  { id: 'skin', label: 'Skin' },
];

export default function LearnScreen() {
  const router = useRouter();
  const { getPeptideWithFavorite, toggleFavorite } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PeptideCategory | 'all'>('all');

  const filteredPeptides = useMemo(() => {
    let filtered = PEPTIDES;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.map(getPeptideWithFavorite);
  }, [searchQuery, selectedCategory, getPeptideWithFavorite]);

  const completedCount = 2;
  const totalCount = filteredPeptides.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Learn</Text>
          <Text style={styles.headerSubtitle}>Master peptide knowledge</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View style={styles.progressIcon}>
            <BookOpen size={20} color={Colors.light.primary} />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={styles.progressCount}>{completedCount} of {totalCount} lessons</Text>
          </View>
          <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
        </View>
        <View style={styles.progressBarOuter}>
          <View style={[styles.progressBarInner, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search peptides..."
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
        style={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryChip, selectedCategory === category.id && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === category.id && styles.categoryChipTextActive]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredPeptides.map((peptide, index) => {
          const isCompleted = index < 2;
          const isLocked = false;
          
          return (
            <TouchableOpacity
              key={peptide.id}
              style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
              onPress={() => !isLocked && router.push(`/peptide/${peptide.id}` as any)}
              disabled={isLocked}
            >
              <View style={styles.lessonNumber}>
                {isCompleted ? (
                  <CheckCircle2 size={24} color={Colors.light.success} fill={Colors.light.success} />
                ) : (
                  <View style={styles.lessonNumberCircle}>
                    <Text style={styles.lessonNumberText}>{index + 1}</Text>
                  </View>
                )}
              </View>

              <View style={styles.lessonContent}>
                <View style={styles.lessonHeader}>
                  <Text style={styles.lessonName}>{peptide.name}</Text>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(peptide.id);
                    }}
                  >
                    <Heart
                      size={18}
                      color={peptide.isFavorite ? Colors.light.danger : Colors.light.textSecondary}
                      fill={peptide.isFavorite ? Colors.light.danger : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.lessonDescription} numberOfLines={2}>
                  {peptide.shortDescription}
                </Text>

                <View style={styles.lessonFooter}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{peptide.category}</Text>
                  </View>
                  <View style={styles.lessonMeta}>
                    <Text style={styles.lessonMetaText}>• {peptide.cycleLength}</Text>
                  </View>
                </View>
              </View>

              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>Completed</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {filteredPeptides.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No peptides found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            Educational use only. Not medical advice. Always consult a healthcare professional.
          </Text>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.card,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  progressCard: {
    backgroundColor: Colors.light.primary,
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderRadius: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  progressCount: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  progressBarOuter: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
  },
  categoriesContainer: {
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 6,
    paddingBottom: 32,
  },
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
  },
  lessonCardLocked: {
    opacity: 0.5,
  },
  lessonNumber: {
    marginRight: 12,
  },
  lessonNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.blue50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  lessonContent: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lessonName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
  lessonDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  lessonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: Colors.light.blue50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    textTransform: 'capitalize' as const,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonMetaText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  disclaimerContainer: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
