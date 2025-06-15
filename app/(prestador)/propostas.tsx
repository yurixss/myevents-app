import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, Clock, User, MessageSquare } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function MinhasPropostasScreen() {
  const { auth } = useAuth();
  const { budgetRequests, proposals } = useData();

  const myProposals = proposals.filter(prop => prop.providerId === auth.user?.id);

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

  if (myProposals.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Minhas Propostas</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Nenhuma proposta enviada</Text>
          <Text style={styles.emptyStateSubtext}>
            Suas propostas enviadas aparecerão aqui
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Propostas</Text>
        <Text style={styles.headerSubtitle}>
          {myProposals.length} proposta{myProposals.length > 1 ? 's' : ''} enviada{myProposals.length > 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {myProposals.map((proposal) => (
          <View key={proposal.id} style={styles.proposalCard}>
            <View style={styles.proposalHeader}>
              <View style={styles.proposalInfo}>
                <Text style={styles.requestTitle}>{getRequestTitle(proposal.requestId)}</Text>
                <View style={styles.clientInfo}>
                  <User size={16} color="#666" />
                  <Text style={styles.clientName}>
                    {budgetRequests.find(req => req.id === proposal.requestId)?.clientName}
                  </Text>
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
                <View style={styles.feedbackHeader}>
                  <MessageSquare size={16} color="#6366f1" />
                  <Text style={styles.feedbackTitle}>Feedback do cliente:</Text>
                </View>
                <Text style={styles.feedbackText}>{proposal.clientFeedback}</Text>
              </View>
            )}

            <View style={styles.proposalFooter}>
              <Text style={styles.proposalDate}>
                Enviada em {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
              </Text>
              {proposal.status === 'aceita' && (
                <Text style={styles.acceptedText}>✅ Proposta aceita!</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
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
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clientName: {
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
    backgroundColor: '#f0f2ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366f1',
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
  proposalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  proposalDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  acceptedText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#22c55e',
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
});