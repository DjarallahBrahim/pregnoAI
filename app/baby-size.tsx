import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet,SafeAreaView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from "react-native-reanimated";
const defaultDataWith6Colors = [
	"#B0604D",
	"#899F9C",
	"#B3C680",
	"#5C6265",
	"#F5D399",
	"#F1F1F1",
];
const weekRanges = [
  'week-1-3', '4-6', '7-9', '10-12', '13-15', '16-18', '19-21', '22-24', '25-27', '28-30', '31-33', '34-36', '37-41'
];

const BabySizeScreen = () => {
  const [selectedWeek, setSelectedWeek] = useState(weekRanges[0]);

  const handleWeekSelect = (week: string) => {
    setSelectedWeek(week);
  };

const getImageSource = (week: string) => {
  return { uri: `../assets/images/weeks/week-${week}.png` };
};
const progress = useSharedValue<number>(0);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={weekRanges}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.weekText,
              item === selectedWeek && styles.selectedWeekText,
            ]}
            onPress={() => handleWeekSelect(item)}
          >
            {item}
          </Text>
        )}
      />
      <Text style={styles.weekLabel}>{selectedWeek}</Text>
      <Carousel
				autoPlayInterval={2000}
				data={defaultDataWith6Colors}
				height={258}
				loop={true}
				pagingEnabled={true}
				snapEnabled={true}
				width={100}
				style={{
					width: 100,
				}}
				mode="parallax"
				modeConfig={{
					parallaxScrollingScale: 0.9,
					parallaxScrollingOffset: 50,
				}}
				onProgressChange={progress}
				renderItem={() => <Image source={require('../assets/images/weeks/week-1-3.png')} style={styles.carouselImage} />}
			/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekText: {
    color: 'blue',
    marginHorizontal: 10,
  },
  selectedWeekText: {
    fontWeight: 'bold',
  },
  weekLabel: {
    color: 'blue',
    fontSize: 20,
    marginTop: 20,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
});

export default BabySizeScreen;
