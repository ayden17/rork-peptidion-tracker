import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Key, Link as LinkIcon, Briefcase, Instagram, Twitter, Linkedin, Save } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [openAIApiKey, setOpenAIApiKey] = useState(user.openAIApiKey || '');
  const [calendlyLink, setCalendlyLink] = useState(user.calendlyLink || '');
  const [specialty, setSpecialty] = useState(user.specialty || '');
  const [bio, setBio] = useState(user.bio || '');
  const [hourlyRate, setHourlyRate] = useState(user.hourlyRate?.toString() || '');
  const [instagramHandle, setInstagramHandle] = useState(user.instagramHandle || '');
  const [twitterHandle, setTwitterHandle] = useState(user.twitterHandle || '');
  const [linkedinHandle, setLinkedinHandle] = useState(user.linkedinHandle || '');

  const handleSave = () => {
    updateUser({
      openAIApiKey,
      calendlyLink: calendlyLink || undefined,
      specialty: specialty || undefined,
      bio: bio || undefined,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      instagramHandle: instagramHandle || undefined,
      twitterHandle: twitterHandle || undefined,
      linkedinHandle: linkedinHandle || undefined,
    });
    Alert.alert('Success', 'Settings saved successfully');
    router.back();
  };

  const isProfessional = user.role === 'coach' || user.role === 'doctor';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Settings', headerBackTitle: 'Back' }} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Key size={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>OpenAI API Key</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Add your OpenAI API key to enable AI-powered photo analysis and peptide recommendations.
          </Text>
          <TextInput
            style={styles.input}
            value={openAIApiKey}
            onChangeText={setOpenAIApiKey}
            placeholder="sk-..."
            placeholderTextColor={Colors.light.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.helpText}>
            Get your API key from{' '}
            <Text style={styles.link}>platform.openai.com/api-keys</Text>
          </Text>
        </View>

        {isProfessional && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <LinkIcon size={20} color={Colors.light.primary} />
                <Text style={styles.sectionTitle}>Calendly Link</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Add your Calendly booking link so users can schedule appointments with you.
              </Text>
              <TextInput
                style={styles.input}
                value={calendlyLink}
                onChangeText={setCalendlyLink}
                placeholder="https://calendly.com/yourusername"
                placeholderTextColor={Colors.light.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Briefcase size={20} color={Colors.light.primary} />
                <Text style={styles.sectionTitle}>Professional Info</Text>
              </View>
              
              <Text style={styles.formLabel}>Specialty</Text>
              <TextInput
                style={styles.input}
                value={specialty}
                onChangeText={setSpecialty}
                placeholder="e.g., Muscle Gain & Performance"
                placeholderTextColor={Colors.light.textSecondary}
              />

              <Text style={styles.formLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell users about your expertise..."
                placeholderTextColor={Colors.light.textSecondary}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.formLabel}>Hourly Rate ($)</Text>
              <TextInput
                style={styles.input}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="150"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Social Media</Text>
              
              <View style={styles.socialInputContainer}>
                <Instagram size={20} color={Colors.light.primary} />
                <TextInput
                  style={styles.socialInput}
                  value={instagramHandle}
                  onChangeText={setInstagramHandle}
                  placeholder="Instagram handle (without @)"
                  placeholderTextColor={Colors.light.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.socialInputContainer}>
                <Twitter size={20} color={Colors.light.primary} />
                <TextInput
                  style={styles.socialInput}
                  value={twitterHandle}
                  onChangeText={setTwitterHandle}
                  placeholder="Twitter/X handle (without @)"
                  placeholderTextColor={Colors.light.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.socialInputContainer}>
                <Linkedin size={20} color={Colors.light.primary} />
                <TextInput
                  style={styles.socialInput}
                  value={linkedinHandle}
                  onChangeText={setLinkedinHandle}
                  placeholder="LinkedIn profile URL"
                  placeholderTextColor={Colors.light.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
              </View>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color={Colors.light.card} />
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    fontSize: 15,
    color: Colors.light.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 8,
    lineHeight: 16,
  },
  link: {
    color: Colors.light.primary,
    textDecorationLine: 'underline' as const,
  },
  socialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    gap: 12,
    marginBottom: 12,
  },
  socialInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
});
