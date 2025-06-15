import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, DollarSign, User, Clock, Send, FileText } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function PedidosScreen() {
  const { auth } = useAuth();
  const { budgetRequests, createProposal } = useData();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [proposalModal, setProposalModal] = useState(false);
  const [proposalData, setProposalData] = useState({
    description: '',
    price: '',
    deliveryTime: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const openRequests = budgetRequests.filter(req => req.status === 'aberto');

  const handleSendProposal = async () => {
    if (!proposalData.description || !proposalData.price || !proposalData.deliveryTime) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const priceValue = parseFloat(proposalData.price.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }

    if (!selectedRequest) return;

    setIsLoading(true);
    try {
      const request = budgetRequests.find(req => req.id === selectedRequest);
      
      createProposal({
        requestId: selectedRequest,
        providerId: auth.user!.id,
        providerName: auth.user!.name,
        description: proposalData.description,
        price: priceValue,
        deliveryTime: proposalData.deliveryTime,
        status: 'pendente'
      });

      Alert.alert('Sucesso', 'Proposta enviada com sucesso!');
      setProposalModal(false);
      setProposalData({
        description: '',
        price: '',
        deliveryTime: ''
      });
      setSelectedRequest(null);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar proposta');
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

  const openProposalModal = (requestId: string) => {
    setSelectedRequest(requestId);
    setProposalModal(true);
  };

  if (openRequests.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pedidos Disponíveis</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhum pedido disponível</Text>
          <Text style={styles.emptyStateSubtext}>
            Novos pedidos aparecerão aqui quando clientes os criarem
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pedidos Disponíveis</Text>
        <Text style={styles.headerSubtitle}>
          {openRequests.length} pedido{openRequests.length > 1 ? 's' : ''} disponível{openRequests.length > 1 ? 'eis' : ''}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {openRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestTitle}>{request.title}</Text>
              <View style={styles.eventTypeBadge}>
                <Text style={styles.eventTypeText}>{request.eventType}</Text>
              </View>
            </View>

            <View style={styles.clientInfo}>
              <User size={16} color="#666" />
              <Text style={styles.clientName}>{request.clientName}</Text>
            </View>

            <Text style={styles.requestDescription}>{request.description}</Text>

            <View style={styles.requestDetails}>
              <View style={styles.detailItem}>
                <Calendar size={16} color="#6366f1" />
                <Text style={styles.detailText}>
                  {new Date(request.eventDate).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MapPin size={16} color="#6366f1" />
                <Text style={styles.detailText}>{request.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <DollarSign size={16} color="#22c55e" />
                <Text style={styles.detailText}>
                  até R$ {request.budget.toLocaleString('pt-BR')}
                </Text>
              </View>
            </View>

            <View style={styles.requestFooter}>
              <View style={styles.requestDate}>
                <Clock size={14} color="#999" />
                <Text style={styles.requestDateText}>
                  Publicado em {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.proposalButton}
                onPress={() => openProposalModal(request.id)}
              >
                <Send size={16} color="#fff" />
                <Text style={styles.proposalButtonText}>Enviar Proposta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={proposalModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setProposalModal(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enviar Proposta</Text>
            <TouchableOpacity onPress={handleSendProposal} disabled={isLoading}>
              <Text style={[styles.modalSubmit, isLoading && styles.modalSubmitDisabled]}>
                {isLoading ? 'Enviando...' : 'Enviar'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição da Proposta *</Text>
              <View style={styles.textAreaContainer}>
                <FileText size={20} color="#666" />
                <TextInput
                  style={styles.textArea}
                  placeholder="Descreva detalhadamente os serviços que você oferece, incluindo o que está incluído no preço..."
                  value={proposalData.description}
                  onChangeText={(text) => setProposalData({...proposalData, description: text})}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valor da Proposta *</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="R$ 0,00"
                  value={proposalData.price}
                  onChangeText={(text) => {
                    const formatted = formatCurrency(text);
                    setProposalData({...proposalData, price: formatted});
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prazo de Entrega *</Text>
              <View style={styles.inputContainer}>
                <Clock size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 2 meses de planejamento"
                  value={proposalData.deliveryTime}
                  onChangeText={(text) => setProposalData({...proposalData, deliveryTime: text})}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  eventTypeBadge: {
    backgroundColor: '#f0f2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  eventTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#667eea',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  requestDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  requestDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  requestDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requestDateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  proposalButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  proposalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCancel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  modalSubmit: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#667eea',
  },
  modalSubmitDisabled: {
    color: '#ccc',
  },
  modalContent: {
    flex: 1,
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
    backgroundColor: '#f8f9fa',
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
  textAreaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
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
});