import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { BloodTestAnalysisView } from './BloodTestAnalysisView';
import { analyzeBloodTest } from '@/lib/bloodTestAnalysis';
import { useAuthStore } from '@/hooks/useAuthStore';

interface BloodTestUploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onImagePick: () => Promise<void>;
  onDocumentPick: () => Promise<void>;
  loading: boolean;
}

export function BloodTestUploadModal({ 
  isVisible, 
  onClose, 
  onImagePick, 
  onDocumentPick,
  loading 
}: BloodTestUploadModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { session } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { t } = useLanguage();
  
  // Variables
  const snapPoints = useMemo(() => ['80%'], []);

  // Callbacks
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

  const handleUpload = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Choose Image', 'Choose PDF'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await handleImageSelection();
          } else if (buttonIndex === 2) {
            await handleDocumentSelection();
          }
        }
      );
    } else {
      Alert.alert(
        'Choose Upload Type',
        'Select the type of file you want to upload',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Image', onPress: () => handleImageSelection() },
          { text: 'PDF', onPress: () => handleDocumentSelection() },
        ]
      );
    }
  };

  const handleImageSelection = async () => {
    try {
      setError(null);
      const result = await onImagePick();
      if (result) {
        setSelectedFile(result);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDocumentSelection = async () => {
    try {
      setError(null);
      const result = await onDocumentPick();
      if (result) {
        setSelectedFile(result);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !session?.user) return;
    
    try {
      setAnalyzing(true);
      setError(null);
      const analysisResult = await analyzeBloodTest(selectedFile, session.user.id);
      setAnalysis(analysisResult);
      setShowAnalysis(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setShowAnalysis(false);
    setAnalysis(null);
    setError(null);
    setSelectedFile(null);
  };

  React.useEffect(() => {
    if (isVisible) {
      handlePresentModalPress();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, handlePresentModalPress]);

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
      {showAnalysis ? 
        <BloodTestAnalysisView
          analysis={analysis}
          error={error}
          onNewAnalysis={handleNewAnalysis}
        /> 
      : 
        <View style={styles.contentContainer}>
          <View style={styles.mainContent}>
          {!selectedFile ? (
            <TouchableOpacity 
              style={styles.uploadArea}
              onPress={handleUpload}
              disabled={loading}
            >
              <View style={styles.uploadIcon}>
                <Ionicons name="cloud-upload-outline" size={40} color={theme.colors.primary} />
              </View>
              {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : (
                <View style={styles.uploadContent}>
                  <Text style={styles.uploadText}>{t('momFeatures.bloodTest.upload.title')}</Text>
                  <Text style={styles.supportedFormats}>{t('momFeatures.bloodTest.upload.supportedFormats')}</Text>
                  {error && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.confirmationContainer}>
              <View style={styles.fileSelectedContainer}>
                <Ionicons name="document-text" size={24} color={theme.colors.primary} />
                <Text style={styles.fileSelectedText}>{t('momFeatures.bloodTest.upload.fileSelected')}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.analyzeButton}
                onPress={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="analytics" size={20} color="#FFFFFF" />
                    <Text style={styles.analyzeButtonText}>{t('momFeatures.bloodTest.upload.analyzeButton')}</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.changeFileButton}
                onPress={handleUpload}
                disabled={analyzing}
              >
                <Text style={styles.changeFileText}>{t('momFeatures.bloodTest.upload.changeFile')}</Text>
              </TouchableOpacity>
            </View>
          )}
          </View>
          
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: '#FF7DA0' }]}>
              <Ionicons name="image-outline" size={16} color='white' />
              <Text style={styles.tagText}>{t('momFeatures.bloodTest.upload.tips.image')}</Text>
            </View>
            
            <View style={[styles.tag, { backgroundColor: '#E5F6FF' }]}>
              <Ionicons name="document-text-outline" size={16} color="#0099FF" />
              <Text style={[styles.tagText, { color: '#0099FF' }]}>
                {t('momFeatures.bloodTest.upload.tips.document')}
              </Text>
            </View>
            
            <View style={[styles.tag, { backgroundColor: '#F0FFE5' }]}>
              <Ionicons name="text-outline" size={16} color="#4CAF50" />
              <Text style={[styles.tagText, { color: '#4CAF50' }]}>
                {t('momFeatures.bloodTest.upload.tips.text')}
              </Text>
            </View>
          </View>
        </View>
      }
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
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
  uploadArea: {
    height: 200,
    backgroundColor: 'rgba(255, 143, 177, 0.1)',
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 143, 177, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  supportedFormats: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  uploadContent: {
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  tagsContainer: {
    gap: 12,
     marginBottom: 30,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    color: 'white',
    flex: 1,
  },
  confirmationContainer: {
    backgroundColor: 'rgba(255, 143, 177, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  fileSelectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  fileSelectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  changeFileButton: {
    padding: 8,
  },
  changeFileText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textDecorationLine: 'underline',
  },
});

export { BloodTestUploadModal }