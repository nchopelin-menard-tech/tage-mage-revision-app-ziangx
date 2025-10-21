
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    age: '',
    currentSituation: 'student' as 'student' | 'professional' | 'other',
    currentStudies: '',
    currentSchool: '',
    targetSchool: '',
    otherInfo: '',
  });

  const handleRegister = async () => {
    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 16 || age > 100) {
      Alert.alert('Erreur', 'Veuillez entrer un âge valide');
      return;
    }

    setLoading(true);
    const { error } = await signUp(formData.email, formData.password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      age,
      currentSituation: formData.currentSituation,
      currentStudies: formData.currentStudies,
      currentSchool: formData.currentSchool,
      targetSchool: formData.targetSchool,
      otherInfo: formData.otherInfo,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Erreur d\'inscription', error.message);
    } else {
      Alert.alert(
        'Inscription réussie',
        'Votre compte a été créé. Vous allez maintenant passer un test de positionnement.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/placement-test') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <IconSymbol name="person.badge.plus.fill" size={50} color={colors.gold} />
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez Tage Mage Excellence</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Informations de connexion</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="votre.email@exemple.com"
              placeholderTextColor={colors.textTertiary}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe * (min. 8 caractères)</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textTertiary}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textTertiary}
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                placeholder="Jean"
                placeholderTextColor={colors.textTertiary}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                placeholder="Dupont"
                placeholderTextColor={colors.textTertiary}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Âge *</Text>
            <TextInput
              style={styles.input}
              placeholder="25"
              placeholderTextColor={colors.textTertiary}
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Situation actuelle *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.currentSituation}
                onValueChange={(value) => setFormData({ ...formData, currentSituation: value })}
                style={styles.picker}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="Étudiant" value="student" color={colors.text} />
                <Picker.Item label="Professionnel" value="professional" color={colors.text} />
                <Picker.Item label="Autre" value="other" color={colors.text} />
              </Picker>
            </View>
          </View>

          {formData.currentSituation === 'student' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Études actuelles</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Licence Économie"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.currentStudies}
                  onChangeText={(text) => setFormData({ ...formData, currentStudies: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>École actuelle</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Université Paris-Dauphine"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.currentSchool}
                  onChangeText={(text) => setFormData({ ...formData, currentSchool: text })}
                />
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>École visée *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: HEC, ESSEC, EDHEC..."
              placeholderTextColor={colors.textTertiary}
              value={formData.targetSchool}
              onChangeText={(text) => setFormData({ ...formData, targetSchool: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Informations complémentaires</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Parlez-nous de votre projet..."
              placeholderTextColor={colors.textTertiary}
              value={formData.otherInfo}
              onChangeText={(text) => setFormData({ ...formData, otherInfo: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <Pressable
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Retour à la connexion
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gold,
    marginTop: 24,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    ...commonStyles.label,
    marginBottom: 8,
  },
  input: {
    ...commonStyles.input,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: colors.text,
    backgroundColor: 'transparent',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: colors.gold,
  },
});
