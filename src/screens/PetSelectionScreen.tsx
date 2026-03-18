import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  Alert,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, FontSize, Corners, Shadows } from '../constants/theme';
import { AnimatedButton } from '../components/AnimatedButton';
import { HayvanTuru } from '../types';
import { usePetContext } from '../context/PetContext';
import { scale, verticalScale } from '../utils/responsive';

const PET_TYPES: { type: HayvanTuru; name: string; emoji: string; baby: string; adult: string; color: string; bg: string }[] = [
  { 
    type: 'kedi', 
    name: 'Kedi', 
    emoji: '🐱', 
    baby: '🐱', 
    adult: '😺', 
    color: '#FF6B6B',
    bg: '#FFF0F0'
  },
  { 
    type: 'kopek', 
    name: 'Köpek', 
    emoji: '🐕', 
    baby: '🐕', 
    adult: '🐕', 
    color: '#4ECDC4',
    bg: '#F0FFFE'
  },
  { 
    type: 'tavsan', 
    name: 'Tavşan', 
    emoji: '🐰', 
    baby: '🐰', 
    adult: '🐰', 
    color: '#A78BFA',
    bg: '#F5F0FF'
  },
  { 
    type: 'ejderha', 
    name: 'Kuş',
    emoji: '🐦', 
    baby: '🐦‍⬛', 
    adult: '🐦‍⬛', 
    color: '#F59E0B',
    bg: '#FFFBF0'
  }
];

export const PetSelectionScreen = () => {
  const navigation = useNavigation();
  const { createNewPetData } = usePetContext();
  const [selectedType, setSelectedType] = useState<HayvanTuru>('kedi');
  const [petName, setPetName] = useState('');
  const [selectedPet, setSelectedPet] = useState(PET_TYPES[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    float.start();
    return () => float.stop();
  }, []);

  const handlePetSelect = (pet: typeof PET_TYPES[0]) => {
    setIsAnimating(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => setIsAnimating(false));
    setSelectedType(pet.type);
    setSelectedPet(pet);
  };

  const handleStart = () => {
    if (!petName.trim()) {
      Alert.alert('İsim Gerekli', 'Lütfen evcil hayvanınıza bir isim verin!');
      return;
    }
    createNewPetData(petName, selectedType);
    navigation.navigate('AnaTab' as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF4FF" />
      <SafeAreaView style={styles.safe}>
        <ScrollView 
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Başlık */}
          <View style={styles.header}>
            <View style={styles.sparkleRow}>
              <Text style={styles.sparkle}>✨</Text>
              <Text style={styles.sparkle}>🌟</Text>
              <Text style={styles.sparkle}>✨</Text>
            </View>
            <Text style={styles.title}>Hoş Geldin!</Text>
            <Text style={styles.subtitle}>Macera arkadaşını seç ve ona bir isim ver 🐾</Text>
          </View>

          {/* Pet Seçimi */}
          <View style={styles.selectionContainer}>
            <Text style={styles.sectionTitle}>Hayvan Türü Seç</Text>
            <View style={styles.petGrid}>
              {PET_TYPES.map((pet) => (
                <TouchableOpacity
                  key={pet.type}
                  style={[
                    styles.petCard,
                    { borderColor: selectedType === pet.type ? pet.color : '#E5E7EB', backgroundColor: selectedType === pet.type ? pet.bg : '#FFFFFF' }
                  ]}
                  onPress={() => handlePetSelect(pet)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.petEmojiCircle, { backgroundColor: pet.color + '22', borderColor: pet.color + '55', borderWidth: selectedType === pet.type ? 2 : 0 }]}>
                    <Text style={styles.petEmoji}>
                      {pet.adult}
                    </Text>
                  </View>
                  <Text style={[styles.petName, { color: selectedType === pet.type ? pet.color : '#6B7280' }]}>{pet.name}</Text>
                  {selectedType === pet.type && (
                    <View style={[styles.checkMark, { backgroundColor: pet.color }]}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Önizleme */}
          <View style={styles.previewContainer}>
            <View style={[styles.previewCard, { borderColor: selectedPet.color + '66', backgroundColor: selectedPet.bg }]}>
              <Animated.Text style={[styles.previewEmoji, { transform: [{ translateY: floatAnim }, { scale: scaleAnim }] }]}>
                {selectedPet.adult}
              </Animated.Text>
              <Text style={[styles.previewName, { color: selectedPet.color }]}>{petName || '...'}</Text>
              <View style={[styles.previewBadge, { backgroundColor: selectedPet.color }]}>
                <Text style={styles.previewBadgeText}>Yeni Dost 🌟</Text>
              </View>
            </View>
          </View>

          {/* İsim Girişi */}
          <View style={styles.nameContainer}>
            <Text style={styles.sectionTitle}>Dostuna İsim Ver</Text>
            <TextInput
              style={[styles.nameInput, { borderColor: selectedPet.color + '88' }]}
              placeholder="Minik Patı, Puf, Lale..."
              value={petName}
              onChangeText={setPetName}
              maxLength={20}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Başlat Butonu */}
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Macera Başlat!"
              onPress={handleStart}
              variant="gradient"
              icon="🚀"
              size="large"
              glowEffect
            />
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF4FF',
  },
  safe: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(28),
    paddingTop: verticalScale(10),
  },
  sparkleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  sparkle: {
    fontSize: 20,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '900',
    color: '#2D1B69',
    marginBottom: Spacing.xs,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: '#7C5C9E',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
  selectionContainer: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: '#2D1B69',
    marginBottom: Spacing.md,
    letterSpacing: 0.2,
  },
  petGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  petCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: Corners.lg,
    ...Shadows.soft,
    position: 'relative',
  },
  petEmojiCircle: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  petEmoji: {
    fontSize: scale(26),
  },
  petName: {
    fontSize: 10,
    fontWeight: '700',
  },
  checkMark: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  previewCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    borderWidth: 2,
    borderRadius: Corners.xl,
    ...Shadows.premium,
    position: 'relative',
  },
  previewEmoji: {
    fontSize: scale(75),
    marginBottom: Spacing.sm,
  },
  previewName: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  previewBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Corners.round,
  },
  previewBadgeText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  nameContainer: {
    marginBottom: verticalScale(28),
  },
  nameInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: Corners.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: '#2D1B69',
    fontWeight: '600',
    ...Shadows.soft,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  bottomSpacer: {
    height: verticalScale(80),
  },
});

export default PetSelectionScreen;
