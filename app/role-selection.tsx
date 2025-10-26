import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Stethoscope, Users, Dna } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/constants/types';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { updateUser } = useUser();
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const handleContinue = () => {
    updateUser({ role: selectedRole });
    if (selectedRole === 'user') {
      router.replace('/onboarding');
    } else {
      router.replace('/onboarding-professional' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Dna size={48} color={Colors.light.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Welcome to Peptidion</Text>
          <Text style={styles.subtitle}>Choose how you&apos;d like to use the app</Text>
        </View>

        <View style={styles.rolesContainer}>
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'user' && styles.roleCardSelected]}
            onPress={() => setSelectedRole('user')}
          >
            <View style={[styles.roleIcon, selectedRole === 'user' && styles.roleIconSelected]}>
              <User size={32} color={selectedRole === 'user' ? Colors.light.card : Colors.light.primary} />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'user' && styles.roleTitleSelected]}>
              I&apos;m a User
            </Text>
            <Text style={[styles.roleDescription, selectedRole === 'user' && styles.roleDescriptionSelected]}>
              Learn about peptides, track progress, and connect with experts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'coach' && styles.roleCardSelected]}
            onPress={() => setSelectedRole('coach')}
          >
            <View style={[styles.roleIcon, selectedRole === 'coach' && styles.roleIconSelected]}>
              <Users size={32} color={selectedRole === 'coach' ? Colors.light.card : Colors.light.primary} />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'coach' && styles.roleTitleSelected]}>
              I&apos;m a Coach
            </Text>
            <Text style={[styles.roleDescription, selectedRole === 'coach' && styles.roleDescriptionSelected]}>
              Help clients achieve their fitness and wellness goals
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'doctor' && styles.roleCardSelected]}
            onPress={() => setSelectedRole('doctor')}
          >
            <View style={[styles.roleIcon, selectedRole === 'doctor' && styles.roleIconSelected]}>
              <Stethoscope size={32} color={selectedRole === 'doctor' ? Colors.light.card : Colors.light.primary} />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'doctor' && styles.roleTitleSelected]}>
              I&apos;m a Doctor
            </Text>
            <Text style={[styles.roleDescription, selectedRole === 'doctor' && styles.roleDescriptionSelected]}>
              Provide medical guidance and peptide therapy consultations
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.blue50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  roleCardSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.blue50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleIconSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  roleTitleSelected: {
    color: '#FFFFFF',
  },
  roleDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  roleDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
