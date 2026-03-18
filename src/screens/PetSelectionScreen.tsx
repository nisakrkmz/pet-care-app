import React, { useState } from 'react';
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

const PET_TYPES: { type: HayvanTuru; name: string; emoji: string; color: string; baby: string; adult: string }[] = [
  { 
    type: 'kedi', 
    name: 'Kedi', 
    emoji: '🐱', 
    baby: '🐱', 
    adult: '😺', 
    color: '#FF6B6B' 
  },
  { 
    type: 'kopek', 
    name: 'Köpek', 
    emoji: '🐕', 
    baby: '🐕', 
    adult: '🐕', 
    color: '#4ECDC4' 
  },
  { 
    type: 'tavsan', 
    name: 'Tavşan', 
    emoji: '🐰', 
    baby: '🐰', 
    adult: '🐰', 
    color: '#95E1D3' 
  },
  { 
    type: 'ejderha', 
    name: 'Kuş', 
    emoji: '🐦', 
    baby: '🐤', 
    adult: '🐦', 
    color: '#9B59B6' 
  }
];

export const PetSelectionScreen = () => {
  const navigation = useNavigation();
  const { createNewPetData } = usePetContext();
  const [selectedType, setSelectedType] = useState<HayvanTuru>('kedi');
  const [petName, setPetName] = useState('');
  const [selectedPet, setSelectedPet] = useState(PET_TYPES[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePetSelect = (pet: typeof PET_TYPES[0]) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedType(pet.type);
      setSelectedPet(pet);
      setIsAnimating(false);
    }, 200);
  };

  const handleStart = () => {
    if (!petName.trim()) {
      Alert.alert('Hata', 'Lütfen evcil hayvanınıza bir isim verin!');
      return;
    }
    
    // Pet data'sını kaydet ve ana ekrana git
    createNewPetData(petName, selectedType);
    navigation.navigate('AnaTab' as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFE0EC' }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.safe}>
        <ScrollView 
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Başlık */}
          <View style={styles.header}>
            <Text style={styles.title}>🐾 Dostunu Seç</Text>
            <Text style={styles.subtitle}>Yeni macera arkadaşın için türünü seç ve isim ver</Text>
          </View>

          {/* Pet Seçimi */}
          <View style={styles.selectionContainer}>
            <Text style={styles.sectionTitle}>Hayvan Türü</Text>
            <View style={styles.petGrid}>
              {PET_TYPES.map((pet) => (
                <TouchableOpacity
                  key={pet.type}
                  style={[
                    styles.petCard,
                    selectedType === pet.type && styles.selectedPetCard,
                    { borderColor: pet.color }
                  ]}
                  onPress={() => handlePetSelect(pet)}
                  activeOpacity={0.8}
                >
                  <View style={styles.petEmojiContainer}>
                    <Animated.Text style={[styles.petEmoji, isAnimating && styles.animatingEmoji]}>
                      {selectedType === pet.type ? pet.adult : pet.baby}
                    </Animated.Text>
                  </View>
                  <Text style={styles.petName}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* İsim Girişi */}
          <View style={styles.nameContainer}>
            <Text style={styles.sectionTitle}>Hayvanın İsmi</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Minik Patı, Puf, Lale..."
              value={petName}
              onChangeText={setPetName}
              maxLength={20}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {/* Seçilen Pet Önizlemi */}
          <View style={styles.previewContainer}>
            <Text style={styles.sectionTitle}>Önizleme</Text>
            <View style={[styles.previewCard, { borderColor: selectedPet.color }]}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewEmoji}>{selectedPet.adult}</Text>
              </View>
              <Text style={styles.previewName}>{petName || '...'}</Text>
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>Yeni</Text>
              </View>
            </View>
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
    marginBottom: verticalScale(30),
    paddingTop: verticalScale(20),
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  selectionContainer: {
    marginBottom: verticalScale(30),
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  petGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  petCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    backgroundColor: Colors.glass.white,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Corners.lg,
    ...Shadows.medium,
  },
  selectedPetCard: {
    backgroundColor: Colors.primary + '10',
    transform: [{ scale: 1.05 }],
  },
  petEmojiContainer: {
    marginBottom: Spacing.sm,
  },
  petEmoji: {
    fontSize: scale(40),
    marginBottom: Spacing.sm,
  },
  animatingEmoji: {
    transform: [{ scale: 1.2 }],
  },
  petName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  nameContainer: {
    marginBottom: verticalScale(30),
  },
  nameInput: {
    backgroundColor: Colors.glass.white,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: Corners.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    ...Shadows.soft,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  previewCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.glass.white,
    borderWidth: 3,
    borderRadius: Corners.xl,
    ...Shadows.premium,
    position: 'relative',
  },
  previewAvatar: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  previewEmoji: {
    fontSize: scale(50),
  },
  previewName: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  previewBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Corners.round,
  },
  previewBadgeText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  bottomSpacer: {
    height: verticalScale(100),
  },
});

export default PetSelectionScreen;
