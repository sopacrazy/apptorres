
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Client, Activation, ActivationMaterial } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';

interface ClientFormProps {
    client: Client | null;
    onDone: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onDone }) => {
    const { state, dispatch } = useAppContext();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [installationDate, setInstallationDate] = useState('');
    const [monthlyFee, setMonthlyFee] = useState('');

    const [installationItems, setInstallationItems] = useState(new Map<string, { selected: boolean; quantity: number }>());

    const defaultMaterialNames = useMemo(() => ['Cabo Drop', 'Conector', 'ONU', 'Roteador', 'ONT'], []);
    
    const installationMaterialOptions = useMemo(() => 
        state.materials.filter(m => defaultMaterialNames.includes(m.name))
        .sort((a, b) => defaultMaterialNames.indexOf(a.name) - defaultMaterialNames.indexOf(b.name)),
        [state.materials, defaultMaterialNames]
    );

    const { ontId, onuId, roteadorId } = useMemo(() => {
        const ids: { ontId?: string; onuId?: string; roteadorId?: string } = {};
        for (const mat of installationMaterialOptions) {
            if (mat.name === 'ONT') ids.ontId = mat.id;
            if (mat.name === 'ONU') ids.onuId = mat.id;
            if (mat.name === 'Roteador') ids.roteadorId = mat.id;
        }
        return ids;
    }, [installationMaterialOptions]);

    useEffect(() => {
        if (client) {
            setName(client.name);
            setAddress(client.address);
            setPhone(client.phone);
            setInstallationDate(client.installationDate);
            setMonthlyFee(client.monthlyFee.toString());
        } else {
            setName('');
            setAddress('');
            setPhone('');
            setInstallationDate(new Date().toISOString().split('T')[0]);
            setMonthlyFee('');
        }
    }, [client]);

    useEffect(() => {
        if (!client && installationMaterialOptions.length > 0 && installationItems.size === 0) {
            const defaultItems = new Map();
            installationMaterialOptions.forEach(m => {
                let quantity = 1;
                if (m.name === 'Cabo Drop') quantity = 50;
                if (m.name === 'Conector') quantity = 2;
                
                const selected = ['Cabo Drop', 'Conector', 'ONU', 'Roteador'].includes(m.name);
                defaultItems.set(m.id, { selected, quantity });
            });
            setInstallationItems(defaultItems);
        }
    }, [client, installationMaterialOptions, installationItems]);

    const handleItemChange = (materialId: string, field: 'selected' | 'quantity', value: boolean | number) => {
        const newItems = new Map(installationItems);
        const item = newItems.get(materialId);
        if (item) {
            const updatedItem = { ...item, [field]: value };
            newItems.set(materialId, updatedItem);

            if (field === 'selected' && value === true) {
                if (materialId === ontId) {
                    if (onuId && newItems.has(onuId)) newItems.set(onuId, { ...newItems.get(onuId)!, selected: false });
                    if (roteadorId && newItems.has(roteadorId)) newItems.set(roteadorId, { ...newItems.get(roteadorId)!, selected: false });
                } else if (materialId === onuId || materialId === roteadorId) {
                    if (ontId && newItems.has(ontId)) newItems.set(ontId, { ...newItems.get(ontId)!, selected: false });
                }
            }
            setInstallationItems(newItems);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !address || !monthlyFee || !installationDate) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const newClientId = client ? client.id : new Date().toISOString();

        const clientData: Client = {
            id: newClientId,
            name,
            address,
            phone,
            installationDate,
            monthlyFee: parseFloat(monthlyFee)
        };

        if (client) {
            dispatch({ type: 'UPDATE_CLIENT', payload: clientData });
        } else {
            const materialsUsed: ActivationMaterial[] = [];
            let totalCost = 0;

            for (const [materialId, item] of installationItems.entries()) {
                if (item.selected && item.quantity > 0) {
                    const material = state.materials.find(m => m.id === materialId);
                    if (!material) continue;

                    if (material.stock < item.quantity) {
                        alert(`Estoque insuficiente para ${material.name}. Disponível: ${material.stock}, Necessário: ${item.quantity}.`);
                        return;
                    }
                    materialsUsed.push({ materialId, quantityUsed: item.quantity });
                    totalCost += material.costPerUnit * item.quantity;
                }
            }
            
            dispatch({ type: 'ADD_CLIENT', payload: clientData });

            if (materialsUsed.length > 0) {
                const activationData: Activation = {
                    id: `act-${newClientId}`,
                    clientId: newClientId,
                    date: installationDate,
                    materialsUsed,
                    totalCost
                };
                dispatch({ type: 'ADD_ACTIVATION', payload: activationData });

                materialsUsed.forEach(used => {
                    dispatch({ type: 'ADJUST_STOCK', payload: { materialId: used.materialId, quantity: used.quantityUsed } });
                });
            }
        }
        onDone();
    };

    const isOntSelected = ontId ? installationItems.get(ontId)?.selected : false;
    const isNormalComboSelected = (onuId ? installationItems.get(onuId)?.selected : false) || (roteadorId ? installationItems.get(roteadorId)?.selected : false);
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome Completo" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="Endereço" value={address} onChange={e => setAddress(e.target.value)} required />
            <Input label="Telefone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            <Input label="Data de Instalação" type="date" value={installationDate} onChange={e => setInstallationDate(e.target.value)} required />
            <Input label="Mensalidade" type="number" step="0.01" placeholder="0.00" value={monthlyFee} onChange={e => setMonthlyFee(e.target.value)} required prefix="R$" />
            
            {!client && installationMaterialOptions.length > 0 && (
                <div className="space-y-4 border-t pt-4 mt-4">
                    <h3 className="text-lg font-medium text-gray-900">Materiais de Instalação</h3>
                    <div className="space-y-3">
                        {installationMaterialOptions.map(material => {
                            const itemState = installationItems.get(material.id) || { selected: false, quantity: 0 };
                            let isDisabled = false;
                            if ((material.id === onuId || material.id === roteadorId) && isOntSelected) {
                                isDisabled = true;
                            }
                            if (material.id === ontId && isNormalComboSelected) {
                                isDisabled = true;
                            }

                            return (
                                <div key={material.id} className="flex items-center justify-between gap-4 p-2 rounded-md bg-gray-50">
                                    <div className="flex items-center flex-grow">
                                        <input
                                            type="checkbox"
                                            id={`mat-${material.id}`}
                                            checked={itemState.selected}
                                            disabled={isDisabled}
                                            onChange={(e) => handleItemChange(material.id, 'selected', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                                        />
                                        <label htmlFor={`mat-${material.id}`} className={`ml-3 block text-sm font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>{material.name}</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={itemState.quantity}
                                            onChange={(e) => handleItemChange(material.id, 'quantity', parseInt(e.target.value, 10) || 0)}
                                            className="w-20 text-right px-2 py-1 text-sm bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            disabled={!itemState.selected || isDisabled}
                                        />
                                        <span className="text-sm text-gray-500 w-16">{material.unit}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" onClick={onDone} variant="secondary">Cancelar</Button>
                <Button type="submit">{client ? 'Salvar Alterações' : 'Adicionar Cliente'}</Button>
            </div>
        </form>
    );
};

export default ClientForm;
