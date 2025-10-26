import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Plus, CheckCircle, AlertCircle, Info } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PEPTIDES } from '@/constants/peptides';
import { useUser } from '@/contexts/UserContext';

export default function PeptideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getPeptideWithFavorite, toggleFavorite, addCycle } = useUser();


  const peptide = PEPTIDES.find(p => p.id === id);

  if (!peptide) {
    return (
      <View style={styles.container}>
        <Text>Peptide not found</Text>
      </View>
    );
  }

  const peptideWithFavorite = getPeptideWithFavorite(peptide);

  const handleStartCycle = () => {
    const cycle = {
      id: Date.now().toString(),
      peptideId: peptide.id,
      peptideName: peptide.name,
      startDate: new Date().toISOString(),
      dosage: peptide.dosageExample,
      frequency: 'Daily',
      isActive: true,
    };
    addCycle(cycle);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: peptide.name,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => toggleFavorite(peptide.id)}
              style={styles.headerButton}
            >
              <Heart
                size={22}
                color={peptideWithFavorite.isFavorite ? Colors.light.danger : Colors.light.text}
                fill={peptideWithFavorite.isFavorite ? Colors.light.danger : 'none'}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{peptide.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{peptide.category}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.description}>{peptide.fullDescription}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle size={20} color={Colors.light.success} />
              <Text style={styles.sectionTitle}>Benefits</Text>
            </View>
            <View style={styles.card}>
              {peptide.benefits.map((benefit, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.listBullet} />
                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertCircle size={20} color={Colors.light.warning} />
              <Text style={styles.sectionTitle}>Risks & Side Effects</Text>
            </View>
            <View style={[styles.card, styles.warningCard]}>
              {peptide.risks.map((risk, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.listBullet, styles.warningBullet]} />
                  <Text style={styles.listText}>{risk}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Dosage & Cycle Information</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Typical Dosage</Text>
                <Text style={styles.infoValue}>{peptide.dosageExample}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cycle Length</Text>
                <Text style={styles.infoValue}>{peptide.cycleLength}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Experience Level</Text>
                <Text style={styles.infoValue}>
                  {peptide.experienceLevel.map(level => 
                    level.charAt(0).toUpperCase() + level.slice(1)
                  ).join(', ')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.disclaimerContainer}>
            <AlertCircle size={16} color={Colors.light.warning} />
            <Text style={styles.disclaimerText}>
              This information is for educational purposes only. Not FDA approved. Consult a healthcare professional before use.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartCycle}
          >
            <Plus size={20} color={Colors.light.card} />
            <Text style={styles.primaryButtonText}>Start Cycle</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerButton: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textTransform: 'capitalize' as const,
  },
  card: {
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  listBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.success,
    marginTop: 8,
    marginRight: 12,
  },
  warningBullet: {
    backgroundColor: Colors.light.warning,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
  },
  warningCard: {
    borderWidth: 1,
    borderColor: Colors.light.warning,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.warning,
    marginTop: 24,
    gap: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.card,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
});
