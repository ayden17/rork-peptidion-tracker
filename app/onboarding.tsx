import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Dna, CheckCircle2, X, BookText, Flame, Moon, Zap, Brain, Sparkles, Calendar, Target, TrendingUp, Activity, Users, CheckCircle } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { UserGoal, ExperienceLevel } from '@/constants/types';
import Colors from '@/constants/colors';

const GOALS: { id: UserGoal; label: string; icon: typeof Activity }[] = [
  { id: 'muscle_gain', label: 'Build Lean Muscle', icon: Activity },
  { id: 'fat_loss', label: 'Burn Fat / Recomposition', icon: Flame },
  { id: 'recovery', label: 'Improve Recovery / Sleep', icon: Moon },
  { id: 'energy', label: 'Increase Energy / Focus', icon: Zap },
  { id: 'cognitive', label: 'Cognitive Enhancement / Longevity', icon: Brain },
  { id: 'skin', label: 'Skin / Hair / Anti-Aging', icon: Sparkles },
];

const TOTAL_STEPS = 7;

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateUser } = useUser();
  const [step, setStep] = useState<number>(1);
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);
  const [hasUsedPeptides, setHasUsedPeptides] = useState<'yes' | 'no' | 'researched'>('no');
  const [expectedResults, setExpectedResults] = useState<'1-3' | '3-6' | 'long-term'>('3-6');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('beginner');
  const [wantsTracking, setWantsTracking] = useState<boolean>(false);
  const [wantsCoaching, setWantsCoaching] = useState<boolean>(false);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [progressAnimated] = useState(new Animated.Value(0));

  const toggleGoal = (goal: UserGoal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else if (selectedGoals.length < 3) {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

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
      goals: selectedGoals,
      experienceLevel,
      role: 'user',
      level: 1,
      experiencePoints: 0,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
      activityLevel,
      hasUsedPeptidesBefore: hasUsedPeptides,
      expectedResults,
      wantsTracking,
      wantsCoaching,
      gender,
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
          Before we begin, please note: this app is for educational purposes only and not medical advice.
        </Text>
      </View>
    </View>
  );

  const renderPeptideExperience = () => (
    <View style={styles.stepContent}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Have you ever used peptides before?</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionItem, hasUsedPeptides === 'yes' && styles.optionItemSelected]}
          onPress={() => setHasUsedPeptides('yes')}
        >
          <View style={styles.optionContent}>
            <CheckCircle2 size={20} color={hasUsedPeptides === 'yes' ? Colors.light.card : Colors.light.success} />
            <Text style={[styles.optionLabel, hasUsedPeptides === 'yes' && styles.optionLabelSelected]}>
              Yes
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionItem, hasUsedPeptides === 'no' && styles.optionItemSelected]}
          onPress={() => setHasUsedPeptides('no')}
        >
          <View style={styles.optionContent}>
            <X size={20} color={hasUsedPeptides === 'no' ? Colors.light.card : Colors.light.danger} />
            <Text style={[styles.optionLabel, hasUsedPeptides === 'no' && styles.optionLabelSelected]}>
              No, I&apos;m new
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionItem, hasUsedPeptides === 'researched' && styles.optionItemSelected]}
          onPress={() => setHasUsedPeptides('researched')}
        >
          <View style={styles.optionContent}>
            <BookText size={20} color={hasUsedPeptides === 'researched' ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, hasUsedPeptides === 'researched' && styles.optionLabelSelected]}>
              I&apos;ve researched them but never tried
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGoals = () => (
    <View style={styles.stepContent}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>What are your top goals right now?</Text>
        <Text style={styles.subtitleSmall}>Select up to 3</Text>
      </View>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[styles.optionItem, selectedGoals.includes(goal.id) && styles.optionItemSelected]}
              onPress={() => toggleGoal(goal.id)}
              disabled={!selectedGoals.includes(goal.id) && selectedGoals.length >= 3}
            >
              <View style={styles.optionContent}>
                <goal.icon size={20} color={selectedGoals.includes(goal.id) ? Colors.light.card : Colors.light.primary} />
                <Text style={[styles.optionLabel, selectedGoals.includes(goal.id) && styles.optionLabelSelected]}>
                  {goal.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.textContainer}>
        <Text style={styles.title}>How soon are you hoping to see noticeable results?</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionItem, expectedResults === '1-3' && styles.optionItemSelected]}
          onPress={() => setExpectedResults('1-3')}
        >
          <View style={styles.optionContent}>
            <Target size={20} color={expectedResults === '1-3' ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, expectedResults === '1-3' && styles.optionLabelSelected]}>
              1–3 months
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionItem, expectedResults === '3-6' && styles.optionItemSelected]}
          onPress={() => setExpectedResults('3-6')}
        >
          <View style={styles.optionContent}>
            <Calendar size={20} color={expectedResults === '3-6' ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, expectedResults === '3-6' && styles.optionLabelSelected]}>
              3–6 months
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionItem, expectedResults === 'long-term' && styles.optionItemSelected]}
          onPress={() => setExpectedResults('long-term')}
        >
          <View style={styles.optionContent}>
            <TrendingUp size={20} color={expectedResults === 'long-term' ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, expectedResults === 'long-term' && styles.optionLabelSelected]}>
              Long-term optimization
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBaseline = () => (
    <View style={styles.stepContent}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Let&apos;s set your current baseline</Text>
          <Text style={styles.subtitleSmall}>You can update this anytime</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Gender</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionItemSmall, gender === 'male' && styles.optionItemSelected]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.optionLabelSmall, gender === 'male' && styles.optionLabelSelected]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionItemSmall, gender === 'female' && styles.optionItemSelected]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.optionLabelSmall, gender === 'female' && styles.optionLabelSelected]}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionItemSmall, gender === 'other' && styles.optionItemSelected]}
              onPress={() => setGender('other')}
            >
              <Text style={[styles.optionLabelSmall, gender === 'other' && styles.optionLabelSelected]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Weight (lbs/kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="180"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.textSecondary}
          />

          <Text style={styles.formLabel}>Height (inches)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            placeholder="70"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.textSecondary}
          />

          <Text style={styles.formLabel}>Estimated body fat %</Text>
          <TextInput
            style={styles.input}
            value={bodyFat}
            onChangeText={setBodyFat}
            placeholder="15"
            keyboardType="numeric"
            placeholderTextColor={Colors.light.textSecondary}
          />

          <Text style={styles.formLabel}>Activity Level</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionItemSmall, activityLevel === 'sedentary' && styles.optionItemSelected]}
              onPress={() => setActivityLevel('sedentary')}
            >
              <Text style={[styles.optionLabelSmall, activityLevel === 'sedentary' && styles.optionLabelSelected]}>
                Sedentary
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionItemSmall, activityLevel === 'moderate' && styles.optionItemSelected]}
              onPress={() => setActivityLevel('moderate')}
            >
              <Text style={[styles.optionLabelSmall, activityLevel === 'moderate' && styles.optionLabelSelected]}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionItemSmall, activityLevel === 'athlete' && styles.optionItemSelected]}
              onPress={() => setActivityLevel('athlete')}
            >
              <Text style={[styles.optionLabelSmall, activityLevel === 'athlete' && styles.optionLabelSelected]}>
                Athlete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderExperience = () => (
    <View style={styles.stepContent}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>How familiar are you with peptide use or hormone optimization?</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionItem, experienceLevel === 'beginner' && styles.optionItemSelected]}
          onPress={() => setExperienceLevel('beginner')}
        >
          <View style={styles.optionContent}>
            <BookText size={20} color={experienceLevel === 'beginner' ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, experienceLevel === 'beginner' && styles.optionLabelSelected]}>
              Beginner — I need education first
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionItem, experienceLevel === 'intermediate' && styles.optionItemSelected]}
          onPress={() => setExperienceLevel('intermediate')}
        >
          <View style={styles.optionContent}>
            <Target size={20} color={experienceLevel === 'intermediate' ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, experienceLevel === 'intermediate' && styles.optionLabelSelected]}>
              Intermediate — I&apos;ve read up or done mild use
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionItem, experienceLevel === 'advanced' && styles.optionItemSelected]}
          onPress={() => setExperienceLevel('advanced')}
        >
          <View style={styles.optionContent}>
            <TrendingUp size={20} color={experienceLevel === 'advanced' ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, experienceLevel === 'advanced' && styles.optionLabelSelected]}>
              Advanced — I track cycles and results
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Would you like the app to help you track peptide usage cycles?</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionItem, wantsTracking && styles.optionItemSelected]}
          onPress={() => setWantsTracking(true)}
        >
          <View style={styles.optionContent}>
            <CheckCircle size={20} color={wantsTracking ? Colors.light.card : Colors.light.success} />
            <Text style={[styles.optionLabel, wantsTracking && styles.optionLabelSelected]}>
              Yes, track & remind me
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionItem, !wantsTracking && styles.optionItemSelected]}
          onPress={() => setWantsTracking(false)}
        >
          <View style={styles.optionContent}>
            <BookText size={20} color={!wantsTracking ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, !wantsTracking && styles.optionLabelSelected]}>
              Just want to learn for now
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonalization = () => (
    <View style={styles.stepContent}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Do you want personalized peptide learning paths based on your goals?</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={nextStep}
        >
          <View style={styles.optionContent}>
            <Sparkles size={20} color={Colors.light.primary} />
            <Text style={styles.optionLabel}>
              Yes, create a custom plan
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={nextStep}
        >
          <View style={styles.optionContent}>
            <Target size={20} color={Colors.light.primary} />
            <Text style={styles.optionLabel}>
              No, I&apos;ll explore on my own
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Would you like access to external coaches or medical professionals?</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionItem, wantsCoaching && styles.optionItemSelected]}
          onPress={() => setWantsCoaching(true)}
        >
          <View style={styles.optionContent}>
            <Users size={20} color={wantsCoaching ? Colors.light.card : Colors.light.primary} />
            <Text style={[styles.optionLabel, wantsCoaching && styles.optionLabelSelected]}>
              Yes, show available experts
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionItem, !wantsCoaching && styles.optionItemSelected]}
          onPress={() => setWantsCoaching(false)}
        >
          <View style={styles.optionContent}>
            <Calendar size={20} color={!wantsCoaching ? Colors.light.card : Colors.light.textSecondary} />
            <Text style={[styles.optionLabel, !wantsCoaching && styles.optionLabelSelected]}>
              Maybe later
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComplete = () => (
    <View style={styles.stepContent}>
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <CheckCircle2 size={64} color={Colors.light.success} strokeWidth={1.5} />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>You&apos;re all set!</Text>
        <Text style={styles.subtitle}>
          We&apos;ll customize your dashboard based on your selections. Let&apos;s start your peptide journey!
        </Text>
      </View>
    </View>
  );

  const canContinue = () => {
    if (step === 2 && selectedGoals.length === 0) return false;
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
        {step === 2 && renderPeptideExperience()}
        {step === 3 && renderGoals()}
        {step === 4 && renderBaseline()}
        {step === 5 && renderExperience()}
        {step === 6 && renderPersonalization()}
        {step === 7 && renderComplete()}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !canContinue() && styles.buttonDisabled]}
          onPress={step === TOTAL_STEPS ? handleComplete : nextStep}
          disabled={!canContinue()}
        >
          <Text style={styles.buttonText}>{step === TOTAL_STEPS ? 'Get Started' : 'Continue'}</Text>
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
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionItemSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  optionLabelSelected: {
    color: '#FFFFFF',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  optionItemSmall: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  optionLabelSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
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
});
