import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, Clock, Award, ChevronRight, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { COACHES } from '@/constants/coaches';
import { Coach } from '@/constants/types';
import { useUser } from '@/contexts/UserContext';

export default function AppointmentsScreen() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'doctor' | 'coach'>('all');

  const filteredCoaches = COACHES.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || coach.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (user.role === 'coach' || user.role === 'doctor') {
    return <CoachDashboard />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <Text style={styles.headerSubtitle}>Connect with experts</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.light.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search coaches or doctors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.light.textSecondary}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterChips}>
          <TouchableOpacity
            style={[styles.filterChip, selectedRole === 'all' && styles.filterChipActive]}
            onPress={() => setSelectedRole('all')}
          >
            <Text style={[styles.filterChipText, selectedRole === 'all' && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedRole === 'doctor' && styles.filterChipActive]}
            onPress={() => setSelectedRole('doctor')}
          >
            <Text style={[styles.filterChipText, selectedRole === 'doctor' && styles.filterChipTextActive]}>
              Doctors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedRole === 'coach' && styles.filterChipActive]}
            onPress={() => setSelectedRole('coach')}
          >
            <Text style={[styles.filterChipText, selectedRole === 'coach' && styles.filterChipTextActive]}>
              Coaches
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function CoachCard({ coach }: { coach: Coach }) {
  const handleBooking = async () => {
    if (coach.calendlyLink) {
      const supported = await Linking.canOpenURL(coach.calendlyLink);
      if (supported) {
        await Linking.openURL(coach.calendlyLink);
      } else {
        console.error('Cannot open URL:', coach.calendlyLink);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.coachCard} onPress={handleBooking}>
      <Image
        source={{ uri: coach.avatar }}
        style={styles.coachAvatar}
      />
      <View style={styles.coachInfo}>
        <View style={styles.coachHeader}>
          <Text style={styles.coachName}>{coach.name}</Text>
          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>{coach.role}</Text>
          </View>
        </View>
        <Text style={styles.coachSpecialty}>{coach.specialty}</Text>
        <View style={styles.coachMeta}>
          <View style={styles.metaItem}>
            <Star size={14} color={Colors.light.accent} fill={Colors.light.accent} />
            <Text style={styles.metaText}>{coach.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Award size={14} color={Colors.light.primary} />
            <Text style={styles.metaText}>{coach.experience}yr exp</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color={Colors.light.success} />
            <Text style={styles.metaText}>${coach.hourlyRate}/hr</Text>
          </View>
        </View>
      </View>
      <ChevronRight size={20} color={Colors.light.textLight} />
    </TouchableOpacity>
  );
}

function CoachDashboard() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { backgroundColor: Colors.light.success }]}>
        <View>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Coach Dashboard</Text>
          <Text style={[styles.headerSubtitle, { color: 'rgba(255, 255, 255, 0.8)' }]}>
            Manage your appointments
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.dashboardStatsRow}>
          <View style={[styles.dashboardStatCard, { backgroundColor: Colors.light.blue50 }]}>
            <Text style={styles.dashboardStatValue}>12</Text>
            <Text style={styles.dashboardStatLabel}>This Week</Text>
          </View>
          <View style={[styles.dashboardStatCard, { backgroundColor: '#FFF4ED' }]}>
            <Text style={styles.dashboardStatValue}>4</Text>
            <Text style={styles.dashboardStatLabel}>Today</Text>
          </View>
          <View style={[styles.dashboardStatCard, { backgroundColor: '#F0FDF4' }]}>
            <Text style={styles.dashboardStatValue}>98%</Text>
            <Text style={styles.dashboardStatLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No appointments scheduled yet</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent activity</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
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
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterChips: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
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
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  coachAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: Colors.light.cardSecondary,
  },
  coachInfo: {
    flex: 1,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  coachName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  roleTag: {
    backgroundColor: Colors.light.blue50,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    textTransform: 'uppercase' as const,
  },
  coachSpecialty: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  coachMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500' as const,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  dashboardStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dashboardStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  dashboardStatValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  dashboardStatLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
