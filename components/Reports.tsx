
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from './ui/Card';
import { UserCircleIcon, PhoneIcon, ExclamationTriangleIcon } from './ui/Icons';

const Reports: React.FC = () => {
    const { state } = useAppContext();
    const { clients, payments } = state;

    const overdueClients = useMemo(() => {
        const thisMonth = new Date().getMonth() + 1;
        const thisYear = new Date().getFullYear();

        const clientsWithPaymentsThisMonth = new Set(
            payments
                .filter(p => p.month === thisMonth && p.year === thisYear)
                .map(p => p.clientId)
        );

        return clients.filter(c => !clientsWithPaymentsThisMonth.has(c.id));
    }, [clients, payments]);

    return (
        <div>
            <Card>
                <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-error mr-2" />
                    <h2 className="text-xl font-bold">Clientes Inadimplentes (Mês Atual)</h2>
                </div>
                {overdueClients.length === 0 ? (
                    <p className="text-gray-600">Nenhum cliente inadimplente este mês. Bom trabalho!</p>
                ) : (
                    <div className="space-y-3">
                        {overdueClients.map(client => (
                            <div key={client.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center mb-1">
                                    <UserCircleIcon className="h-5 w-5 text-neutral mr-2"/>
                                    <h3 className="font-semibold">{client.name}</h3>
                                </div>
                                <p className="text-sm text-gray-700 ml-7">{client.address}</p>
                                <p className="text-sm text-gray-700 flex items-center mt-1 ml-7">
                                    <PhoneIcon className="h-4 w-4 mr-1"/> {client.phone || 'Não informado'}
                                </p>
                                <p className="text-sm text-red-600 font-semibold mt-1 ml-7">
                                    Mensalidade: R$ {client.monthlyFee.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Reports;
