import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import { theme } from '@/styles/theme';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { BloodTestUploadModal } from './BloodTestUploadModal';

export function BloodTestFeature() {
  const { t } = useLanguage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to select image. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const pickDocument = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
      });

      if (result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking document:', error);
      alert('Failed to select document. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        activeOpacity={0.9}
        onPress={() => setIsModalVisible(true)}
      >
      <LinearGradient
        colors={['rgba(255, 143, 177, 0.1)', 'rgba(255, 143, 177, 0.2)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image
          source={require('../../assets/images/mom-features/blood.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('momFeatures.bloodTest.title')}</Text>
            <Text style={styles.subtitle}>{t('momFeatures.bloodTest.subtitle')}</Text>
          </View>
          
          <View style={styles.badge}>
            <Ionicons name="star" size={12} color="#FFFFFF" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>{t('momFeatures.bloodTest.badge')}</Text>
          </View>
        </View>
      </LinearGradient>
      </TouchableOpacity>
      
      <BloodTestUploadModal 
        isVisible={isModalVisible}
        onImagePick={pickImage}
        onDocumentPick={pickDocument}
        loading={loading}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 180,
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 80 },
        shadowOpacity: 0.8,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
        shadowColor: theme.colors.primary,
      },
    }),
  },
  gradient: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '50%',
    height: '50%',
    opacity: 0.6,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginTop: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    opacity: 0.8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeIcon: {
    marginTop: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});