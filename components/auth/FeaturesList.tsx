import React from 'react';
import { View, Text, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { styles } from '@/styles/main';
import { useLanguage } from '@/contexts/LanguageContext';

export function FeaturesList() {
  const { t } = useLanguage();

  const features = [
    { icon: require('../../assets/images/icon1.png'), text: t('features.dueDate') },
    { icon: require('../../assets/images/icon2.png'), text: t('features.timeline') },
    { icon: require('../../assets/images/icon3.png'), text: t('features.appointment') },
  ];

  return (
      <View style={styles.features}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Image
                source={feature.icon}
                style={styles.featureIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.featureText}>{feature.text}</Text>
        </View>
      ))}
    </View>
  );
}