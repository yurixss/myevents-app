import { User, BudgetRequest, Proposal } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'maria@email.com',
    name: 'Maria Silva',
    type: 'cliente',
    phone: '(11) 99999-1234',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    email: 'joao@eventos.com',
    name: 'João Santos',
    type: 'prestador',
    phone: '(11) 99999-5678',
    bio: 'Especialista em organização de eventos corporativos e sociais há mais de 8 anos. Oferecemos serviços completos de planejamento, decoração e coordenação.',
    services: ['Casamentos', 'Eventos Corporativos', 'Festas de Aniversário', 'Formaturas'],
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const mockBudgetRequests: BudgetRequest[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Maria Silva',
    title: 'Casamento dos Sonhos',
    description: 'Procuro um organizador para meu casamento com 150 convidados. Quero uma cerimônia ao ar livre seguida de festa com jantar. Estilo romântico com cores suaves.',
    eventType: 'Casamento',
    eventDate: '2024-08-15',
    location: 'São Paulo, SP',
    budget: 25000,
    status: 'aberto',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    clientId: '1',
    clientName: 'Maria Silva',
    title: 'Festa de Aniversário 30 Anos',
    description: 'Quero comemorar meus 30 anos com uma festa especial para 80 pessoas. Tema vintage, com música ao vivo e buffet completo.',
    eventType: 'Aniversário',
    eventDate: '2024-06-20',
    location: 'São Paulo, SP',
    budget: 8000,
    status: 'em_analise',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z'
  }
];

export const mockProposals: Proposal[] = [
  {
    id: '1',
    requestId: '1',
    providerId: '2',
    providerName: 'João Santos',
    description: 'Proposta completa para casamento incluindo: planejamento completo, decoração floral, coordenação do dia, buffet premium para 150 pessoas, som e iluminação profissional, fotógrafo e videomaker.',
    price: 22000,
    deliveryTime: '6 meses de planejamento',
    status: 'pendente',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z'
  },
  {
    id: '2',
    requestId: '2',
    providerId: '2',
    providerName: 'João Santos',
    description: 'Festa de aniversário vintage com decoração temática, DJ especializado em músicas antigas, buffet completo e coordenação do evento.',
    price: 7500,
    deliveryTime: '2 meses de planejamento',
    status: 'aceita',
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  }
];