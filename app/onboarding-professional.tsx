import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Dna, DollarSign, Link as LinkIcon } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';

const TOTAL_STEPS = 4;

export default function ProfessionalOnboardingScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [calendlyLink, setCalendlyLink] = useState('');
  const [progressAnimated] = useState(new Animated.Value(0));

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      Animated.timing(progressAnimated, {
        toValue: step / TOTAL_STEPS,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      Animated.timing(progressAnimated, {
        toValue: (step - 2) / TOTAL_STEPS,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleComplete = () => {
    updateUser({
      hasCompletedOnboarding: true,
      hasAcceptedDisclaimer: true,
      name: name || undefined,
      specialty: specialty || undefined,
      bio: bio || undefined,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      calendlyLink: calendlyLink || undefined,
    });
    router.replace('/(tabs)');
  };

  const renderWelcome = () => (
    <View style={styles.stepContent}>
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <Dna size={64} color={Colors.light.primary} strokeWidth={1.5} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to Peptidion</Text>
        <Text style={styles.subtitle}>
          {user.role === 'coach' ? 'Connect with clients and help them achieve their fitness goals.' : 'Provide expert medical guidance on peptide therapy.'}
        </Text>
        <Text style={[styles.subtitle, { marginTop: 16 }]}>
          This app is for educational purposes only. Always follow medical guidelines and regulations in your jurisdiction.
        </Text>
      </View>
    </View>
  );

  const renderProfileInfo = () => (
    <View style={styles.stepContent}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Professional Profile</Text>
          <Text style={styles.subtitleSmall}>Help clients find you</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Dr. Jane Smith"
            placeholderTextColor={Colors.light.textSecondary}
          />

          <Text style={styles.formLabel}>Specialty *</Text>
          <TextInput
            style={styles.input}
            value={specialty}
            onChangeText={setSpecialty}
            placeholder="e.g., Anti-Aging & Longevity, Muscle Gain & Performance"
            placeholderTextColor={Colors.light.textSecondary}
          />

          <Text style={styles.formLabel}>Bio *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell potential clients about your expertise, experience, and approach..."
            placeholderTextColor={Colors.light.textSecondary}
            multiline
            numberOfLines={5}
          />
        </View>
      </ScrollView>
    </View>
  );

  const renderPricing = () => (
    <View style={styles.stepContent}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Set Your Rate</Text>
        <Text style={styles.subtitleSmall}>You can update this later</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.iconInputContainer}>
          <DollarSign size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.iconInput}
            value={hourlyRate}
            onChangeText={setHourlyRate}
            placeholder="150"
            placeholderTextColor={Colors.light.textSecondary}
            keyboardType="numeric"
          />
          <Text style={styles.inputSuffix}>/hour</Text>
        </View>
        <Text style={styles.helpText}>
          Set a competitive hourly rate based on your experience and specialty
        </Text>
      </View>
    </View>
  );

  const renderBooking = () => (
    <View style={styles.stepContent}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Booking Link</Text>
        <Text style={styles.subtitleSmall}>Connect your Calendly for appointments</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.iconInputContainer}>
          <LinkIcon size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.iconInput}
            value={calendlyLink}
            onChangeText={setCalendlyLink}
            placeholder="https://calendly.com/yourusername"
            placeholderTextColor={Colors.light.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>
        <Text style={styles.helpText}>
          Add your Calendly link so clients can easily book appointments with you. Don&apos;t have one? Create one at calendly.com
        </Text>
      </View>
    </View>
  );

  const canContinue = () => {
    if (step === 2 && (!name || !specialty || !bio)) return false;
    return true;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        {step > 1 && (
          <TouchableOpacity onPress={prevStep} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>
        )}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnimated.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {step === 1 && renderWelcome()}
        {step === 2 && renderProfileInfo()}
        {step === 3 && renderPricing()}
        {step === 4 && renderBooking()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !canContinue() && styles.buttonDisabled]}
          onPress={step === TOTAL_STEPS ? handleComplete : nextStep}
          disabled={!canContinue()}
        >
          <Text style={styles.buttonText}>{step === TOTAL_STEPS ? 'Complete Setup' : 'Continue'}</Text>
        </TouchableOpacity>
        {step > 1 && step < TOTAL_STEPS && (
          <TouchableOpacity style={styles.skipButton} onPress={nextStep}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  stepContent: {
    flex: 1,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.blue50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.light.text,
    lineHeight: 34,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  subtitleSmall: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    gap: 4,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  iconInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    gap: 8,
  },
  iconInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  inputSuffix: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  helpText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
