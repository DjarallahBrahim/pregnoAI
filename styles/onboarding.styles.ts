import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { theme } from '@/styles/theme';

const { width } = Dimensions.get('window');

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    transform: [{ scale: 1.2 }],
    backgroundColor: '#FF8FB1',
  },
  progressDotCompleted: {
    backgroundColor: '#E5989B',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
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
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#E9ECEF',
  },
  datePicker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 50,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
  },
  dateButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#E9ECEF',
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: 'left',
  },
  moodContainer: {
    width: '100%',
    gap: 12,
  },
  moodButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#E9ECEF',
  },
  moodButtonSelected: {
    backgroundColor: '#FF8FB1',
    borderColor: '#FF8FB1',
  },
  moodButtonText: {
    fontSize: 16,
    color: '#6B6969',
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8FB1',
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
    color: '#FFFFFF'
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14
  },
  tooltipButton: {
    marginLeft: 8,
    padding: 4,
  },
  dueDateContainer: {
    width: '100%',
    gap: 20,
  },
  dueDateResult: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  dueDateLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  dueDateText: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  dueDateActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  dueDateButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: theme.colors.primary,
  },
  adjustButton: {
    backgroundColor: theme.colors.secondary,
  },
  dueDateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  adjustDateContainer: {
    width: '100%',
    marginTop: 12,
    alignItems: 'center',
  },
  manualDateInput: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: theme.colors.border,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  manualDateHint: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});