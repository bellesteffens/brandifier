export interface User {
  id: number;
  email: string;
  name: string;
  user_type: 'admin' | 'client';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface MarketingForm {
  id: number;
  user_id: number;
  nicho: string;
  objetivo: string;
  publico_alvo: string;
  frequencia_posts: number;
  tom_voz: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

export interface GeneratedPost {
  id: number;
  form_id: number;
  titulo: string;
  legenda: string;
  tipo_post: string;
  hashtags: string;
  created_at: string;
}

export interface Recommendations {
  id: number;
  form_id: number;
  melhores_horarios: string;
  tipo_conteudo_indicado: string;
  frequencia_ideal: string;
  melhor_cta: string;
  dica_estrategica: string;
  created_at: string;
}

export interface FormWithResults {
  form: MarketingForm;
  posts: GeneratedPost[];
  recommendations: Recommendations | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  [key: string]: any;
}