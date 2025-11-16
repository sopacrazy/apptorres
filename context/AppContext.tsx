
import React, { createContext, useReducer, useEffect, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AppState, Action, Material } from '../types';

const initialState: AppState = {
  clients: [],
  payments: [],
  materials: [],
  activations: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return { ...state, clients: state.clients.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload),
        payments: state.payments.filter(p => p.clientId !== action.payload),
        activations: state.activations.filter(a => a.clientId !== action.payload),
      };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'ADD_MATERIAL':
        return { ...state, materials: [...state.materials, action.payload] };
    case 'UPDATE_MATERIAL':
        return { ...state, materials: state.materials.map(m => m.id === action.payload.id ? action.payload : m) };
    case 'DELETE_MATERIAL': {
        const materialToDelete = state.materials.find(m => m.id === action.payload);
        if (materialToDelete?.isDefault) {
            alert('Não é possível excluir materiais padrão.');
            return state;
        }
        return { ...state, materials: state.materials.filter(m => m.id !== action.payload) };
    }
    case 'ADD_ACTIVATION':
      return { ...state, activations: [...state.activations, action.payload] };
    case 'ADJUST_STOCK':
      return {
        ...state,
        materials: state.materials.map(m =>
          m.id === action.payload.materialId
            ? { ...m, stock: m.stock - action.payload.quantity }
            : m
        ),
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedState, setSavedState] = useLocalStorage<AppState>('isp-manager-data', initialState);
  const [state, dispatch] = useReducer(appReducer, savedState);

  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

  useEffect(() => {
    const defaultMaterials: Omit<Material, 'id'>[] = [
      { name: 'Cabo Drop', unit: 'metros', costPerUnit: 1, stock: 10, isDefault: true },
      { name: 'Conector', unit: 'unidades', costPerUnit: 2, stock: 10, isDefault: true },
      { name: 'ONU', unit: 'unidades', costPerUnit: 150, stock: 10, isDefault: true },
      { name: 'Roteador', unit: 'unidades', costPerUnit: 100, stock: 10, isDefault: true },
      { name: 'ONT', unit: 'unidades', costPerUnit: 220, stock: 10, isDefault: true },
    ];

    const currentMaterials = state.materials || [];
    const materialsToAdd = defaultMaterials.filter(
      dm => !currentMaterials.some(m => m.name === dm.name)
    );

    if (materialsToAdd.length > 0) {
      materialsToAdd.forEach(m => {
        const id = `default-${m.name.toLowerCase().replace(/\s+/g, '-')}`;
        dispatch({ type: 'ADD_MATERIAL', payload: { ...m, id } });
      });
    }
  }, []); // Run only once to seed data

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);