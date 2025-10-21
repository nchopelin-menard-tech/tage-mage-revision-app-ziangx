
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Dark theme with prestigious color scheme
export const colors = {
  // Dark theme colors
  background: '#000000', // Pure black
  backgroundSecondary: '#0A0A0A', // Very dark gray
  backgroundTertiary: '#1A1A1A', // Dark gray
  
  // Text colors
  text: '#FFFFFF', // White text
  textSecondary: '#B0B0B0', // Light gray
  textTertiary: '#808080', // Medium gray
  
  // Brand colors
  primary: '#1E3A8A', // Deep navy blue (HEC inspired)
  primaryLight: '#2563EB', // Lighter blue
  primaryDark: '#1E293B', // Darker blue
  
  secondary: '#C9A961', // Elegant gold
  secondaryLight: '#F3E5AB', // Light gold
  secondaryDark: '#B8860B', // Dark goldenrod
  
  // Accent colors
  accent: '#10B981', // Success green
  accentLight: '#34D399', // Light green
  
  error: '#DC2626', // Error red
  errorLight: '#EF4444', // Light red
  
  warning: '#F59E0B', // Warning orange
  warningLight: '#FBBF24', // Light orange
  
  // UI elements
  card: '#1A1A1A', // Dark card background
  cardHover: '#2A2A2A', // Card hover state
  border: '#333333', // Border color
  borderLight: '#404040', // Light border
  
  // Special
  gold: '#C9A961', // Elegant gold
  darkBlue: '#0F172A', // Very dark blue
  highlight: '#D97706', // Amber highlight
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.card,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  input: {
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    marginBottom: 12,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
});
