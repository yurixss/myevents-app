import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, Clock, User, MessageSquare, Check, X, Edit } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function PropostasScreen() {
  const { auth } = useAuth();
  const { budgetRequests, proposals, updateProposal } = useData();
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  const userRequests = budgetRequests.filter(req => req.clientId === auth.user?.id);
  const userProposals = proposals.filter(prop => 
    userRequests.some(req => req.id === prop.requestId)
  );

  const getRequestTitle = (requestId: string) => {
    const request = budgetRequests.find(req => req.id === requestId);
    return request?.title || 'Pedido não encontrado';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return '#f59e0b';
      case 'aceita': return '#22c55e';
      case 'rejeitada': return '#ef4444';
      case 'alteracao_solicitada': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceita': return 'Aceita';
      case 'rejeitada': return 'Rejeitada';
      case 'alteracao_solicitada': return 'Alteração Solicitada';
      default: return status;
    }
  };

  const handleAcceptProposal = (proposalId: string) => {
    Alert.alert(
      'Aceitar Proposta',
      'Tem certeza que deseja aceitar esta proposta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          onPress: () => {
            updateProposal(proposalId, { status: 'aceita' });
            Alert.alert('Sucesso', 'Proposta aceita! O prestador será notificado.');
          }
        }
      ]
    );
  };

  const handleRejectProposal = (proposalId: string) => {
    Alert.alert(
      'Rejeitar Proposta',
      'Tem certeza que deseja rejeitar esta proposta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: () => {
            updateProposal(proposalId, { status: 'rejeitada' });
            Alert.alert('Proposta rejeitada');
          }
        }
      ]
    );
  };

  const handleRequestChanges = (proposalId: string) => {
    setSelectedProposal(proposalId);
    setFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('Erro', 'Por favor, descreva as alterações desejadas');
      return;
    }

    if (selectedProposal) {
      updateProposal(selectedProposal, { 
        status: 'alteracao_solicitada',
        clientFeedback: feedback
      });
      Alert.alert('Sucesso', 'Solicitação de alteração enviada ao prestador');
    }

    setFeedbackModal(false);
    setFeedback('');
    setSelectedProposal(null);
  };

  if (userProposals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Propostas</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhuma proposta recebida</Text>
          <Text style={styles.emptyStateSubtext}>
            Quando prestadores enviarem propostas para seus pedidos, elas aparecerão aqui
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Propostas</Text>
        <Text style={styles.headerSubtitle}>
          {userProposals.length} proposta{userProposals.length > 1 ? 's' : ''} recebida{userProposals.length > 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {userProposals.map((proposal) => (
          <View key={proposal.id} style={styles.proposalCard}>
            <View style={styles.proposalHeader}>
              <View style={styles.proposalInfo}>
                <Text style={styles.requestTitle}>{getRequestTitle(proposal.requestId)}</Text>
                <View style={styles.providerInfo}>
                  <User size={16} color="#666" />
                  <Text style={styles.providerName}>{proposal.providerName}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(proposal.status) }]}>
                <Text style={styles.statusText}>{getStatusText(proposal.status)}</Text>
              </View>
            </View>

            <Text style={styles.proposalDescription}>{proposal.description}</Text>

            <View style={styles.proposalDetails}>
              <View style={styles.detailItem}>
                <DollarSign size={16} color="#22c55e" />
                <Text style={styles.detailText}>
                  R$ {proposal.price.toLocaleString('pt-BR')}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={16} color="#6366f1" />
                <Text style={styles.detailText}>{proposal.deliveryTime}</Text>
              </View>
            </View>

            {proposal.clientFeedback && (
              <View style={styles.feedbackSection}>
                <Text style={styles.feedbackTitle}>Alterações solicitadas:</Text>
                <Text style={styles.feedbackText}>{proposal.clientFeedback}</Text>
              </View>
            )}

            {proposal.status === 'pendente' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptProposal(proposal.id)}
                >
                  <Check size={20} color="#fff" />
                  <Text style={styles.acceptButtonText}>Aceitar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.changesButton}
                  onPress={() => handleRequestChanges(proposal.id)}
                >
                  <Edit size={20} color="#6366f1" />
                  <Text style={styles.changesButtonText}>Solicitar Alterações</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleRejectProposal(proposal.id)}
                >
                  <X size={20} color="#ef4444" />
                  <Text style={styles.rejectButtonText}>Rejeitar</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.proposalFooter}>
              <Text style={styles.proposalDate}>
                Recebida em {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={feedbackModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setFeedbackModal(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Solicitar Alterações</Text>
            <TouchableOpacity onPress={submitFeedback}>
              <Text style={styles.modalSubmit}>Enviar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Descreva as alterações desejadas:</Text>
            <View style={styles.feedbackInputContainer}>
              <MessageSquare size={20} color="#666" />
              <Text style={styles.feedbackInput}
                placeholder="Ex: Gostaria de alterar a decoração para um estilo mais moderno e reduzir o número de mesas..."
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>
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
  proposalCard: {
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
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  proposalInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  proposalDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  proposalDetails: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  feedbackSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366f1',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 16,
  },
  acceptButton: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  acceptButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  changesButton: {
    backgroundColor: '#f0f2ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  changesButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6366f1',
  },
  rejectButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  rejectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
  proposalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  proposalDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
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
    color: '#e50914',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  feedbackInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 120,
  },
  feedbackInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
    color: '#333',
    textAlignVertical: 'top',
  },
});