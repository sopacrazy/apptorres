
export interface Material {
  id: string;
  name: string;
  unit: 'metros' | 'unidades';
  costPerUnit: number;
  stock: number;
  isDefault?: boolean;
}

export interface ActivationMaterial {
  materialId: string;
  quantityUsed: number;
}

export interface Activation {
  id: string;
  clientId: string;
  date: string;
  materialsUsed: ActivationMaterial[];
  totalCost: number;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  month: number;
  year: number;
}

export interface Client {
  id:string;
  name: string;
  address: string;
  phone: string;
  installationDate: string;
  monthlyFee: number;
}

export interface AppState {
  clients: Client[];
  payments: Payment[];
  materials: Material[];
  activations: Activation[];
}

export type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'ADD_MATERIAL'; payload: Material }
  | { type: 'UPDATE_MATERIAL'; payload: Material }
  | { type: 'DELETE_MATERIAL'; payload: string }
  | { type: 'ADD_ACTIVATION'; payload: Activation }
  | { type: 'ADJUST_STOCK'; payload: { materialId: string; quantity: number } };

export type Page = 'dashboard' | 'clients' | 'materials' | 'reports';