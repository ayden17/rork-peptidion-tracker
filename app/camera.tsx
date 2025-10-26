import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { X, Camera as CameraIcon, FlipHorizontal, Check, HelpCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { ProgressPhoto } from '@/constants/types';

export default function CameraScreen() {
  const router = useRouter();
  const { addPhoto, user } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<'face' | 'front' | 'side' | 'back'>('front');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rating, setRating] = useState<ProgressPhoto['rating']>();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <CameraIcon size={64} color={Colors.light.textSecondary} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to capture progress photos
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          setCapturedUri(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedUri(result.assets[0].uri);
    }
  };

  const analyzePhoto = async () => {
    if (!capturedUri || !user.openAIApiKey) return;

    setIsAnalyzing(true);
    try {
      const base64Image = await fetch(capturedUri).then(r => r.blob()).then(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.openAIApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this ${photoType} photo and rate the following aspects on a scale of 1-10:
                  
1. Leanness (muscle definition and low body fat)
2. Debloatedness (minimal water retention, defined features)
3. Clear Skin (skin quality and clarity)
4. Jawline (facial structure definition)

Provide an overall rating (1-10) and a brief analysis (2-3 sentences).

Return your response in the following JSON format:
{
  "leanness": <number>,
  "debloatedness": <number>,
  "clearSkin": <number>,
  "jawline": <number>,
  "overall": <number>,
  "analysis": "<string>"
}`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisResult = JSON.parse(jsonMatch[0]);
          setRating(analysisResult);
        }
      }
    } catch (error) {
      console.error('Error analyzing photo:', error);
      alert('Failed to analyze photo. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const savePhoto = () => {
    if (!capturedUri) return;

    const photo: ProgressPhoto = {
      id: Date.now().toString(),
      uri: capturedUri,
      type: photoType,
      date: new Date().toISOString(),
      weight: weight ? parseFloat(weight) : undefined,
      notes: notes || undefined,
      rating,
    };

    addPhoto(photo);
    router.back();
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (capturedUri) {
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <img
            src={capturedUri}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </View>

        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCapturedUri(null)}
            >
              <X size={24} color={Colors.light.card} />
            </TouchableOpacity>
            <Text style={styles.title}>Review Photo</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.bottomSheet} contentContainerStyle={styles.bottomSheetContent}>
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Photo Type</Text>
              <View style={styles.photoTypeGrid}>
                {(['face', 'front', 'side', 'back'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeButton, photoType === type && styles.typeButtonActive]}
                    onPress={() => setPhotoType(type)}
                  >
                    <Text style={[styles.typeButtonText, photoType === type && styles.typeButtonTextActive]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {user.openAIApiKey ? (
                <TouchableOpacity
                  style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
                  onPress={analyzePhoto}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <ActivityIndicator color={Colors.light.card} />
                  ) : (
                    <Text style={styles.analyzeButtonText}>✨ Analyze with AI</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.apiKeyPrompt}
                  onPress={() => router.push('/profile' as any)}
                >
                  <HelpCircle size={20} color={Colors.light.primary} />
                  <Text style={styles.apiKeyPromptText}>Add OpenAI API key in settings to enable AI analysis</Text>
                </TouchableOpacity>
              )}

              {rating && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingTitle}>AI Analysis</Text>
                  <View style={styles.ratingGrid}>
                    <View style={styles.ratingItem}>
                      <Text style={styles.ratingLabel}>Leanness</Text>
                      <Text style={styles.ratingValue}>{rating.leanness}/10</Text>
                    </View>
                    <View style={styles.ratingItem}>
                      <Text style={styles.ratingLabel}>Debloated</Text>
                      <Text style={styles.ratingValue}>{rating.debloatedness}/10</Text>
                    </View>
                    <View style={styles.ratingItem}>
                      <Text style={styles.ratingLabel}>Clear Skin</Text>
                      <Text style={styles.ratingValue}>{rating.clearSkin}/10</Text>
                    </View>
                    <View style={styles.ratingItem}>
                      <Text style={styles.ratingLabel}>Jawline</Text>
                      <Text style={styles.ratingValue}>{rating.jawline}/10</Text>
                    </View>
                  </View>
                  <View style={styles.overallRating}>
                    <Text style={styles.overallLabel}>Overall Score</Text>
                    <Text style={styles.overallValue}>{rating.overall}/10</Text>
                  </View>
                  {rating.analysis && (
                    <Text style={styles.analysisText}>{rating.analysis}</Text>
                  )}
                </View>
              )}

              <Text style={styles.formLabel}>Weight (optional)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="180"
                keyboardType="numeric"
                placeholderTextColor={Colors.light.textSecondary}
              />

              <Text style={styles.formLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="How are you feeling?"
                multiline
                numberOfLines={3}
                placeholderTextColor={Colors.light.textSecondary}
              />

              <TouchableOpacity style={styles.saveButton} onPress={savePhoto}>
                <Check size={20} color={Colors.light.card} />
                <Text style={styles.saveButtonText}>Save Photo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <X size={24} color={Colors.light.card} />
            </TouchableOpacity>
            <Text style={styles.title}>Scan</Text>
            <TouchableOpacity style={styles.helpButton}>
              <HelpCircle size={24} color={Colors.light.card} />
            </TouchableOpacity>
          </View>

          <View style={styles.guideOverlay}>
            <View style={styles.cornerFrame}>
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
            <Text style={styles.guideText}>Center yourself in the frame</Text>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Text style={styles.galleryButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <FlipHorizontal size={24} color={Colors.light.card} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
  guideOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cornerFrame: {
    width: '80%',
    aspectRatio: 3 / 4,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.light.card,
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  guideText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.card,
    marginTop: 24,
    textAlign: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  galleryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.card,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '70%',
  },
  bottomSheetContent: {
    flexGrow: 1,
  },
  formContainer: {
    backgroundColor: Colors.light.card,
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
    marginTop: 16,
  },
  photoTypeGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  typeButtonTextActive: {
    color: Colors.light.card,
  },
  analyzeButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
  apiKeyPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.blue50,
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  apiKeyPromptText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.primary,
    lineHeight: 18,
  },
  ratingContainer: {
    backgroundColor: Colors.light.blue50,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  ratingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  ratingItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.light.card,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  overallRating: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  overallLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  overallValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  analysisText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
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
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.card,
  },
});
