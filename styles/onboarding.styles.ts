import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from './theme';

const { width } = Dimensions.get('window');

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gradients.primary[1],
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
    transform: [{ scale: 1.2 }],
  },
  progressDotCompleted: {
    backgroundColor: theme.colors.secondary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  datePicker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 50,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
  },
  dateButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dateButtonText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: 'left',
  },
  moodContainer: {
    width: '100%',
    gap: 12,
  },
  moodButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  moodButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  moodButtonText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});