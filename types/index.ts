export interface User {
  id: string;
  email: string;
  name: string;
  type: 'cliente' | 'prestador';
  phone?: string;
  bio?: string;
  services?: string[];
  avatar?: string;
}

export interface BudgetRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  eventType: string;
  eventDate: string;
  location: string;
  budget: number;
  status: 'aberto' | 'em_analise' | 'concluido' | 'cancelado';
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  description: string;
  price: number;
  deliveryTime: string;
  status: 'pendente' | 'aceita' | 'rejeitada' | 'alteracao_solicitada';
  createdAt: string;
  updatedAt: string;
  clientFeedback?: string;
}

export interface AuthUser {
  user: User | null;
  isAuthenticated: boolean;
}