import { StyleSheet, Dimensions } from 'react-native';
import { theme } from './theme.ts';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  mainImageContainer: {
    width: '100%',
    height: height * 0.45,
    marginTop: height * 0.05,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleWrapper: {
    width: '100%',
    maxWidth: 480,
    marginTop: -100,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  titleContainer: {
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: theme.colors.text.primary,
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresWrapper: {
    width: '100%',
    maxWidth: 480,
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 28,
    height: 28,
  },
  featureText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  actionsWrapper: {
    width: '100%',
    maxWidth: 480,
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  actions: {
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    shadowColor: '#FF8FB1',
    opacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  startJourneyButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  startJourneyButtonText: {
    color: theme.colors.text.light,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  terms: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
    lineHeight: 20,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

export const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gradient: {
    flex: 1,
    padding: 20,
  }
});