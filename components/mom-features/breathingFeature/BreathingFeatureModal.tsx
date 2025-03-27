import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Platform
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { theme } from '@/styles/theme';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

const CAROUSEL_WIDTH = Dimensions.get('window').width;
const CAROUSEL_HEIGHT = 300;
const windowWidth = Dimensions.get('window').width;

// Define fixed item dimensions and margins for the top list
const ITEM_WIDTH = 120; // fixed width for each item
const ITEM_MARGIN_HORIZONTAL = 8; // same as in style
const EFFECTIVE_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN_HORIZONTAL * 2; // total space per item

const carouselData = [
  {
    id: '1',
    image: require('../../../assets/images/img1.png'),
    title: 'Relax',
    description: '30 respirations',
    pageUrl: '/breathing'
  },
  {
    id: '2',
    image: require('../../../assets/images/img2.png'),
    title: 'Focus',
    description: '50 respirations',
    pageUrl: '/circleAnimation'
  },
  {
    id: '3',
    image: require('../../../assets/images/img3.png'),
    title: 'Focus',
    description: '50 respirations',
    pageUrl: '/flowersAnimation'
  },
];

const topListData = [
  { id: '1', label: 'Débuter', in_duration: 3, out_duration: 5 },
  { id: '2', label: 'Équilibrer', in_duration: 3, out_duration: 5 },
  { id: '3', label: 'Renforcer', in_duration: 3, out_duration: 5 },
  { id: '4', label: 'Étendre', in_duration: 3, out_duration: 5 },
  { id: '5', label: 'Optimiser', in_duration: 3, out_duration: 5 },
];

const bottomListData = [
  { id: '3', label: '3' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
  { id: '6', label: '6' },
  { id: '7', label: '7' },
];

interface BreathingFeatureModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function BreathingFeatureModal({ isVisible, onClose }: BreathingFeatureModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const flatListRefTop = useRef<FlatList>(null);
  const flatListRefBottom = useRef<FlatList>(null);
  const carouselRef = useRef(null);
  const { t } = useLanguage();

  const [topSelectedIndex, setTopSelectedIndex] = useState<number>(0);
  const [bottomSelectedIndex, setBottomSelectedIndex] = useState<number>(0);
  const [carouselSelectedIndex, setCarouselSelectedIndex] = useState<number>(0);

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

  useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, handlePresentModalPress]);

  const scrollToTopIndex = (index: number) => {
    flatListRefTop.current?.scrollToOffset({
      offset: (windowWidth / 2 - ITEM_WIDTH / 2) + index * EFFECTIVE_ITEM_WIDTH,
      animated: true,
    });
  };

  const scrollToBottomIndex = (index: number) => {
    flatListRefBottom.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleTopItemPress = (index: number) => {
    setTopSelectedIndex(index);
    scrollToTopIndex(index);
  };

  const handleBottomItemPress = (index: number) => {
    setBottomSelectedIndex(index);
    scrollToBottomIndex(index);
  };

  const handleCarouselItemPress = (item) => {
    onClose();
    router.push(item.pageUrl);
  };

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
      <TouchableOpacity 
        style={styles.carouselItem} 
        onPress={() => handleCarouselItemPress(item)}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.carouselImageContainer, animatedStyle]}>
          <Image source={item.image} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handleButtonPress = () => {
    const selectedTop = topListData[topSelectedIndex];
    const selectedCarousel = carouselData[carouselSelectedIndex];
    const selectedBottom = bottomListData[bottomSelectedIndex];

    const result = {
      in_duration: selectedTop.in_duration,
      out_duration: selectedTop.out_duration,
      bottom_label: selectedBottom.label,
      pageUrl: selectedCarousel.pageUrl,
    };

    console.log('User Choice:', result);
  };

  // Render blur effect on both left and right sides
  const renderBlurEffect = () => (
    <>
      <View style={[styles.blurContainer, styles.leftBlur]}>
        <BlurView style={styles.blurView} tint="extraLight" intensity={5} />
      </View>
      <View style={[styles.blurContainer, styles.rightBlur]}>
        <BlurView style={styles.blurView} tint="extraLight" intensity={5} />
      </View>
    </>
  );

  // Center initial selections on mount
  useEffect(() => {
    scrollToTopIndex(topSelectedIndex);
    scrollToBottomIndex(bottomSelectedIndex);
  }, []);

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
      <View style={styles.container}>
        {renderBlurEffect()}
        <View style={styles.headerContainer}>
          <Text style={styles.hedearText}>
            {t('momFeatures.kickCounter.reset')}
          </Text>
        </View>
        {/* Top Horizontal FlatList */}
        <FlatList
          ref={flatListRefTop}
          data={topListData}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.topFlatListContent,
            { paddingHorizontal: windowWidth / 2 - ITEM_WIDTH / 2 },
          ]}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.flatListItem, { width: ITEM_WIDTH, marginHorizontal: ITEM_MARGIN_HORIZONTAL }]}
              onPress={() => handleTopItemPress(index)}
            >
              <Text
                style={[
                  styles.topLabel,
                  topSelectedIndex === index && { color: theme.colors.primary },
                ]}
              >
                {item.label}
              </Text>
              <Text style={styles.subText}>Inspiration: {item.in_duration} sec</Text>
              <Text style={styles.subText}>Expiration: {item.out_duration} sec</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          // Adjusted getItemLayout to account for side padding and margins
          getItemLayout={(_data, index) => ({
            length: EFFECTIVE_ITEM_WIDTH,
            offset: (windowWidth / 2 - ITEM_WIDTH / 2) + index * EFFECTIVE_ITEM_WIDTH,
            index,
          })}
        />

        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            data={carouselData}
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
            defaultIndex={0}
            onSnapToItem={(index) => setCarouselSelectedIndex(index)}
            renderItem={renderCarouselItem}
            scrollAnimationDuration={500}
          />
        </View>

        {/* Bottom Horizontal FlatList */}
        <FlatList
          ref={flatListRefBottom}
          data={bottomListData}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.bottomFlatListContent,
            { paddingHorizontal: windowWidth / 2 - ITEM_WIDTH / 2 },
          ]}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item.id}
              style={styles.flatListItem}
              onPress={() => handleBottomItemPress(index)}
            >
              <Text
                style={[
                  styles.bottomLabel,
                  bottomSelectedIndex === index && { color: theme.colors.primary },
                ]}
              >
                {item.label} min
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          getItemLayout={(_data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
        />

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>commencer la scéance</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: theme.colors.gradients.primary[1],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  hedearText: {
    color: theme.colors.text.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  flatListItem: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  topFlatListContent: {
    paddingVertical: 10,
  },
  topLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.secondary,
  },
  subText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  carouselContainer: {
    marginVertical: 10,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
        shadowColor: theme.colors.primary,
      },
    }),
  },
  carouselImageContainer: {
    width: CAROUSEL_WIDTH * 0.8,
    height: CAROUSEL_HEIGHT,
    borderRadius: theme.borderRadius.lg,
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
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  title: {
    color: theme.colors.text.light,
    fontSize: 22,
    fontWeight: 'bold',
  },
  description: {
    color: theme.colors.text.light,
    fontSize: 16,
  },
  bottomFlatListContent: {
    paddingVertical: 10,
  },
  bottomLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: theme.colors.text.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '15%',
    zIndex: 1,
  },
  leftBlur: {
    left: 0,
  },
  rightBlur: {
    right: 0,
  },
  blurView: {
    flex: 1,
  },
});

export default BreathingFeatureModal;
