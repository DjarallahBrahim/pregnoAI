import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    marginTop: -height * 0.05,
    height: height * 0.7,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(229, 152, 155, 0.1)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  activeToggleText: {
    color: theme.colors.primary,
  },
   box: {
   
  },
});