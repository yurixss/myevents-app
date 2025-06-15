import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin, DollarSign, FileText, Tag } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const eventTypes = [
  'Casamento',
  'Aniversário',
  'Formatura',
  'Evento Corporativo',
  'Festa Infantil',
  'Chá de Bebê',
  'Outros'
];

export default function NovoPedidoScreen() {
  const router = useRouter();
  const { auth } = useAuth();
  const { createBudgetRequest } = useData();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    eventDate: '',
    location: '',
    budget: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.eventType || 
        !formData.eventDate || !formData.location || !formData.budget) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const budgetValue = parseFloat(formData.budget.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(budgetValue) || budgetValue <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor de orçamento válido');
      return;
    }

    setIsLoading(true);
    try {
      createBudgetRequest({
        clientId: auth.user!.id,
        clientName: auth.user!.name,
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        location: formData.location,
        budget: budgetValue,
        status: 'aberto'
      });

      Alert.alert(
        'Sucesso',
        'Seu pedido foi criado com sucesso! Você será notificado quando prestadores enviarem propostas.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    const numberValue = parseFloat(numbers) / 100;
    
    if (isNaN(numberValue)) return '';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numberValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Pedido</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título do Evento *</Text>
              <View style={styles.inputContainer}>
                <FileText color="#666" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Casamento dos Sonhos"
                  value={formData.title}
                  onChangeText={(text) => setFormData({...formData, title: text})}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Evento *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventTypeScroll}>
                <View style={styles.eventTypes}>
                  {eventTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.eventTypeButton,
                        formData.eventType === type && styles.eventTypeButtonActive
                      ]}
                      onPress={() => setFormData({...formData, eventType: type})}
                    >
                      <Text style={[
                        styles.eventTypeText,
                        formData.eventType === type && styles.eventTypeTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data do Evento *</Text>
              <View style={styles.inputContainer}>
                <Calendar color="#666" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/AAAA"
                  value={formData.eventDate}
                  onChangeText={(text) => {
                    // Format date as user types
                    let formatted = text.replace(/\D/g, '');
                    if (formatted.length >= 2) {
                      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
                    }
                    if (formatted.length >= 5) {
                      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
                    }
                    setFormData({...formData, eventDate: formatted});
                  }}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Local do Evento *</Text>
              <View style={styles.inputContainer}>
                <MapPin color="#666" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Cidade, Estado"
                  value={formData.location}
                  onChangeText={(text) => setFormData({...formData, location: text})}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Orçamento Estimado *</Text>
              <View style={styles.inputContainer}>
                <DollarSign color="#666" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="R$ 0,00"
                  value={formData.budget}
                  onChangeText={(text) => {
                    const formatted = formatCurrency(text);
                    setFormData({...formData, budget: formatted});
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição Detalhada *</Text>
              <View style={styles.textAreaContainer}>
                <Tag color="#666" size={20} />
                <TextInput
                  style={styles.textArea}
                  placeholder="Descreva seu evento em detalhes: número de convidados, estilo desejado, serviços necessários, preferências especiais, etc."
                  value={formData.description}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Criando Pedido...' : 'Criar Pedido'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
    color: '#333',
  },
  eventTypeScroll: {
    marginTop: 8,
  },
  eventTypes: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 24,
  },
  eventTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  eventTypeButtonActive: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  eventTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  eventTypeTextActive: {
    color: '#fff',
  },
  textAreaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 120,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
    color: '#333',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#e50914',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});