import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, MapPin, DollarSign, Clock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function ClienteHomeScreen() {
  const router = useRouter();
  const { auth } = useAuth();
  const { budgetRequests, proposals } = useData();

  const userRequests = budgetRequests.filter(req => req.clientId === auth.user?.id);
  const userProposals = proposals.filter(prop => 
    userRequests.some(req => req.id === prop.requestId)
  );

  const pendingProposals = userProposals.filter(prop => prop.status === 'pendente');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return '#22c55e';
      case 'em_analise': return '#f59e0b';
      case 'concluido': return '#6366f1';
      case 'cancelado': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aberto': return 'Aberto';
      case 'em_analise': return 'Em Análise';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{auth.user?.name}</Text>
          </View>
          <Image
            source={{ uri: auth.user?.avatar || 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userRequests.length}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userProposals.length}</Text>
            <Text style={styles.statLabel}>Propostas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingProposals.length}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
        </View>

        {pendingProposals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Propostas Pendentes</Text>
            <Text style={styles.sectionSubtitle}>
              Você tem {pendingProposals.length} proposta{pendingProposals.length > 1 ? 's' : ''} aguardando resposta
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(cliente)/propostas')}
            >
              <Text style={styles.actionButtonText}>Ver Propostas</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.createRequestCard}
          onPress={() => router.push('/(cliente)/novo-pedido')}
        >
          <View style={styles.createRequestIcon}>
            <Plus color="#e50914" size={32} />
          </View>
          <View style={styles.createRequestContent}>
            <Text style={styles.createRequestTitle}>Criar Novo Pedido</Text>
            <Text style={styles.createRequestSubtitle}>
              Descreva seu evento e receba propostas de prestadores qualificados
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meus Pedidos Recentes</Text>
          {userRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Você ainda não fez nenhum pedido
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Comece criando seu primeiro pedido de orçamento
              </Text>
            </View>
          ) : (
            userRequests.slice(0, 3).map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestTitle}>{request.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                  </View>
                </View>
                
                <View style={styles.requestInfo}>
                  <View style={styles.requestInfoItem}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.requestInfoText}>
                      {new Date(request.eventDate).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <View style={styles.requestInfoItem}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.requestInfoText}>{request.location}</Text>
                  </View>
                  <View style={styles.requestInfoItem}>
                    <DollarSign size={16} color="#666" />
                    <Text style={styles.requestInfoText}>
                      R$ {request.budget.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.requestDescription} numberOfLines={2}>
                  {request.description}
                </Text>

                <View style={styles.requestFooter}>
                  <View style={styles.requestDate}>
                    <Clock size={14} color="#999" />
                    <Text style={styles.requestDateText}>
                      {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={styles.proposalCount}>
                    {userProposals.filter(p => p.requestId === request.id).length} proposta{userProposals.filter(p => p.requestId === request.id).length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  content: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#e50914',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#e50914',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  createRequestCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderStyle: 'dashed',
  },
  createRequestIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  createRequestContent: {
    flex: 1,
  },
  createRequestTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  createRequestSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  requestInfo: {
    marginBottom: 12,
    gap: 8,
  },
  requestInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requestInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  requestDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
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
  proposalCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#e50914',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});