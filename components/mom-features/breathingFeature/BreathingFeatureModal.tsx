import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/hooks/useAuthStore';
import { supabase } from '@/lib/supabase';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { theme } from '@/styles/theme';


// Sample data with images and corresponding text
const data = [
  {
    id: '1',
    image: require('../../../assets/images/img1.png'),
    title: 'Relax',
    description: '30 respirations',
    duration: '2 min',
  },
  {
    id: '2',
    image: require('../../../assets/images/img2.png'),
    title: 'Focus',
    description: '50 respirations',
    duration: '3 min',
  },
  {
    id: '3',
    image: require('../../../assets/images/img3.png'),
    title: 'Meditate',
    description: '40 respirations',
    duration: '4 min',
  },
];

const CAROUSEL_WIDTH = Dimensions.get('window').width;
const CAROUSEL_HEIGHT = 300;
interface BreathingFeatureModalProps {
  isVisible: boolean;
  onClose: () => void;
}


export function BreathingFeatureModal({ isVisible, onClose }: BreathingFeatureModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { session } = useAuthStore();
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  const { t } = useLanguage();

  // Calculate current pregnancy month when component mounts
  useEffect(() => {
    const fetchPregnancyMonth = async () => {
      if (!session?.user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('pregnancy_profiles')
          .select('last_menstrual_period')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        if (!profile?.last_menstrual_period) return;

        const lmpDate = new Date(profile.last_menstrual_period);
        const today = new Date();
        const timeDiff = today.getTime() - lmpDate.getTime();
        const monthsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30.44)) + 1;
        
        // Ensure month is between 1 and 10
        const pregnancyMonth = Math.max(1, Math.min(10, monthsDiff));
        setCurrentMonth(pregnancyMonth);
      } catch (err) {
        console.error('Error calculating pregnancy month:', err);
      }
    };

    fetchPregnancyMonth();
  }, [session?.user]);


  const snapPoints = useMemo(() => ['80%'], []);



  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Modal visibility handler
  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, handlePresentModalPress]);

  const [selectedIndex, setSelectedIndex] = useState(0); // Track the selected index
  const carouselRef = useRef(null);

  // Handle flat list item press
  const handleItemPress = (index) => {
    setSelectedIndex(index);
    carouselRef.current?.scrollTo({ index });
  };
  // Render carousel item with animations
  const renderCarouselItem = ({ item, index, animationValue }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(animationValue.value, [-1, 0, 1], [0.85, 1, 0.85]);
      const translateY = interpolate(animationValue.value, [-1, 0, 1], [-20, 0, -20]);
      const opacity = interpolate(animationValue.value, [-1, 0, 1], [0.7, 1, 0.7]);

      return {
        transform: [{ scale }, { translateY }],
        opacity,
      };
    });

    return (
      <View style={styles.carouselItem}>
        <Animated.View style={[styles.carouselImageContainer, animatedStyle]}>
          <Image source={item.image} style={styles.image} />
         
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </Animated.View>
      </View>
    );
  };
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.modalBackground}
    >
      <View style={styles.container2}>
   {/* Carousel */}
      <Carousel
            ref={carouselRef}
            data={data}
            loop={false}
            width={CAROUSEL_WIDTH}
            height={CAROUSEL_HEIGHT}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 120,
            }}
            pagingEnabled
            snapEnabled
            defaultIndex={selectedIndex}
            onSnapToItem={(index) => setSelectedIndex(index)}
            renderItem={renderCarouselItem}
            scrollAnimationDuration={500}
        />

      {/* Horizontal FlatList */}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.flatListItem,
              selectedIndex === index && styles.selectedItem,
            ]}
            onPress={() => handleItemPress(index)}
          >
            <Text style={[styles.flatListItemText, selectedIndex === index && styles.selectedText]}>{item.duration}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Démarrer la séance</Text>
      </TouchableOpacity>
   
      
      </View>
    </BottomSheetModal>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  modalBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: '#E0E0E0',
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  container2: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImageContainer: {
    width: CAROUSEL_WIDTH * 0.8, // Slightly smaller than full width for parallax effect
    height: CAROUSEL_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 18,
  },
  flatListContent: {
    flexDirection: 'row',
    marginTop: 20,
  },
  flatListItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Selected item background color
  },
  flatListItemText: {
    color: theme.colors.text.secondary, // Green text color for selected item
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedText: {
    color: theme.colors.secondary, // Green text color for selected item
  },
  button: {
    marginTop: 30,
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'theme.colors.text.secondary', // Green text color for selected item
    fontSize: 18,
    fontWeight: 'bold',
  },
});