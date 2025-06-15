import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Send, TrendingUp, Calendar, DollarSign } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function PrestadorHomeScreen() {
  const router = useRouter();
  const { auth } = useAuth();
  const { budgetRequests, proposals } = useData();

  const myProposals = proposals.filter(prop => prop.providerId === auth.user?.id);
  const acceptedProposals = myProposals.filter(prop => prop.status === 'aceita');
  const pendingProposals = myProposals.filter(prop => prop.status === 'pendente');
  const openRequests = budgetRequests.filter(req => req.status === 'aberto');

  const totalEarnings = acceptedProposals.reduce((sum, prop) => sum + prop.price, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{auth.user?.name}</Text>
          </View>
          <Image
            source={{ uri: auth.user?.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#22c55e" />
            <Text style={styles.statNumber}>{acceptedProposals.length}</Text>
            <Text style={styles.statLabel}>Propostas Aceitas</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{pendingProposals.length}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statCard}>
            <DollarSign size={24} color="#667eea" />
            <Text style={styles.statNumber}>
              R$ {(totalEarnings / 1000).toFixed(0)}k
            </Text>
            <Text style={styles.statLabel}>Faturamento</Text>
          </View>
        </View>

        {openRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Novos Pedidos</Text>
            <Text style={styles.sectionSubtitle}>
              {openRequests.length} pedido{openRequests.length > 1 ? 's' : ''} disponível{openRequests.length > 1 ? 'eis' : ''}
            </Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(prestador)/pedidos')}
            >
              <Search size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Ver Pedidos</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/(prestador)/pedidos')}
        >
          <View style={styles.quickActionIcon}>
            <Search color="#667eea" size={32} />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Buscar Novos Pedidos</Text>
            <Text style={styles.quickActionSubtitle}>
              Encontre clientes que precisam dos seus serviços
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/(prestador)/propostas')}
        >
          <View style={styles.quickActionIcon}>
            <Send color="#667eea" size={32} />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Gerenciar Propostas</Text>
            <Text style={styles.quickActionSubtitle}>
              Acompanhe o status das suas propostas enviadas
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          {myProposals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhuma atividade ainda
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Comece enviando propostas para pedidos disponíveis
              </Text>
            </View>
          ) : (
            myProposals.slice(0, 3).map((proposal) => {
              const request = budgetRequests.find(req => req.id === proposal.requestId);
              return (
                <View key={proposal.id} style={styles.activityCard}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>
                      {request?.title || 'Pedido não encontrado'}
                    </Text>
                    <View style={[
                      styles.activityStatus,
                      { backgroundColor: getStatusColor(proposal.status) }
                    ]}>
                      <Text style={styles.activityStatusText}>
                        {getStatusText(proposal.status)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.activityClient}>Cliente: {proposal.clientName || request?.clientName}</Text>
                  <Text style={styles.activityPrice}>
                    R$ {proposal.price.toLocaleString('pt-BR')}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    textAlign: 'center',
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
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  quickActionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  activityClient: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  activityPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#22c55e',
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