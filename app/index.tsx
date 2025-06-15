import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Users, Award } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (auth.user?.type === 'cliente') {
        router.replace('/(cliente)');
      } else {
        router.replace('/(prestador)');
      }
    }
  }, [auth.isAuthenticated, auth.user?.type]);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <Text style={styles.title}>MyEvents</Text>
          <Text style={styles.subtitle}>
            Conectando clientes e prestadores de serviços para eventos inesquecíveis
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Calendar color="#fff" size={32} />
            <Text style={styles.featureText}>Organize eventos perfeitos</Text>
          </View>
          <View style={styles.feature}>
            <Users color="#fff" size={32} />
            <Text style={styles.featureText}>Conecte-se com profissionais</Text>
          </View>
          <View style={styles.feature}>
            <Award color="#fff" size={32} />
            <Text style={styles.featureText}>Qualidade garantida</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.registerOptions}>
            <Text style={styles.registerText}>Não tem conta? Cadastre-se como:</Text>
            <View style={styles.registerButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/cadastro-cliente')}
              >
                <Text style={styles.secondaryButtonText}>Cliente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/cadastro-prestador')}
              >
                <Text style={styles.secondaryButtonText}>Prestador</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
  },
  features: {
    gap: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    flex: 1,
  },
  actions: {
    gap: 24,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#667eea',
  },
  registerOptions: {
    alignItems: 'center',
    gap: 16,
  },
  registerText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  registerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
});