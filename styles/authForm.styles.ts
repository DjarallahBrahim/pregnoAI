import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const authFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  form: {
    width: '100%',
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.background.gray,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.light,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.background.gray,
    borderRadius: 12,
    backgroundColor: theme.colors.background.light,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  eyeIcon: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
  },
  unchecked: {
    borderColor: theme.colors.background.gray,
  },
  checkboxLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  forgotPassword: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: theme.colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  mt2: {
    marginTop: 8,
  },
});