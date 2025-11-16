
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Client, Payment } from '../types';
import Input from './ui/Input';
import Button from './ui/Button';

interface PaymentFormProps {
    client: Client;
    onDone: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ client, onDone }) => {
    const { dispatch } = useAppContext();
    const today = new Date();
    
    const [amount, setAmount] = useState(client.monthlyFee.toString());
    const [date, setDate] = useState(today.toISOString().split('T')[0]);
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !date) {
            alert('Por favor, preencha o valor e a data.');
            return;
        }

        const paymentData: Payment = {
            id: new Date().toISOString(),
            clientId: client.id,
            amount: parseFloat(amount),
            date,
            month,
            year,
        };

        dispatch({ type: 'ADD_PAYMENT', payload: paymentData });
        alert(`Pagamento de R$ ${amount} registrado para ${client.name}!`);
        onDone();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Mês de Referência</label>
                 <div className="flex items-center space-x-2 mt-1">
                    <select value={month} onChange={e => setMonth(parseInt(e.target.value, 10))} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white text-gray-900">
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{new Date(0, m-1).toLocaleString('pt-BR', { month: 'long' })}</option>
                        ))}
                    </select>
                    <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value, 10))} className="block w-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900" />
                </div>
            </div>
            <Input label="Valor Pago (R$)" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
            <Input label="Data do Pagamento" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" onClick={onDone} variant="secondary">Cancelar</Button>
                <Button type="submit">Confirmar Pagamento</Button>
            </div>
        </form>
    );
};

export default PaymentForm;