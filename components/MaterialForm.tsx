
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Material } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';

interface MaterialFormProps {
    material: Material | null;
    onDone: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onDone }) => {
    const { dispatch } = useAppContext();
    const [name, setName] = useState('');
    const [unit, setUnit] = useState<'metros' | 'unidades'>('unidades');
    const [costPerUnit, setCostPerUnit] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (material) {
            setName(material.name);
            setUnit(material.unit);
            setCostPerUnit(material.costPerUnit.toString());
            setStock(material.stock.toString());
        } else {
            setName('');
            setUnit('unidades');
            setCostPerUnit('');
            setStock('');
        }
    }, [material]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !costPerUnit || !stock) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const materialData: Material = {
            id: material ? material.id : new Date().toISOString(),
            name,
            unit,
            costPerUnit: parseFloat(costPerUnit),
            stock: parseInt(stock, 10)
        };
        
        if (material) {
            dispatch({ type: 'UPDATE_MATERIAL', payload: materialData });
        } else {
            dispatch({ type: 'ADD_MATERIAL', payload: materialData });
        }
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome do Material" value={name} onChange={e => setName(e.target.value)} required />
            <div>
                <label className="block text-sm font-medium text-gray-700">Unidade</label>
                <select value={unit} onChange={e => setUnit(e.target.value as 'metros' | 'unidades')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white text-gray-900">
                    <option value="unidades">Unidades</option>
                    <option value="metros">Metros</option>
                </select>
            </div>
            <Input label="Custo por Unidade (R$)" type="number" step="0.01" value={costPerUnit} onChange={e => setCostPerUnit(e.target.value)} required />
            <Input label="Quantidade em Estoque" type="number" value={stock} onChange={e => setStock(e.target.value)} required />
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" onClick={onDone} variant="secondary">Cancelar</Button>
                <Button type="submit">{material ? 'Salvar Alterações' : 'Adicionar Material'}</Button>
            </div>
        </form>
    );
};

export default MaterialForm;