
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UsersIcon, CurrencyDollarIcon, ExclamationTriangleIcon, ArchiveBoxIcon } from './ui/Icons';
import Card from './ui/Card';

const Dashboard: React.FC = () => {
    const { state } = useAppContext();
    const { clients, payments, materials } = state;

    const totalClients = clients.length;

    const thisMonth = new Date().getMonth() + 1;
    const thisYear = new Date().getFullYear();

    const revenueThisMonth = payments
        .filter(p => p.month === thisMonth && p.year === thisYear)
        .reduce((sum, p) => sum + p.amount, 0);

    const clientsWithPaymentsThisMonth = new Set(
        payments.filter(p => p.month === thisMonth && p.year === thisYear).map(p => p.clientId)
    );

    const overdueClients = clients.filter(c => !clientsWithPaymentsThisMonth.has(c.id)).length;
    
    const lowStockItems = materials.filter(m => m.stock < 10).length;


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
                <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-primary mr-4" />
                    <div>
                        <div className="text-gray-500">Total de Clientes</div>
                        <div className="text-2xl font-bold">{totalClients}</div>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center">
                    <CurrencyDollarIcon className="h-8 w-8 text-success mr-4" />
                    <div>
                        <div className="text-gray-500">Receita do Mês</div>
                        <div className="text-2xl font-bold">R$ {revenueThisMonth.toFixed(2)}</div>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-8 w-8 text-error mr-4" />
                    <div>
                        <div className="text-gray-500">Clientes Inadimplentes</div>
                        <div className="text-2xl font-bold">{overdueClients}</div>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="flex items-center">
                    <ArchiveBoxIcon className="h-8 w-8 text-warning mr-4" />
                    <div>
                        <div className="text-gray-500">Itens com Estoque Baixo</div>
                        <div className="text-2xl font-bold">{lowStockItems}</div>
                    </div>
                </div>
            </Card>

            <div className="sm:col-span-2 mt-4">
                 <Card>
                    <h2 className="text-lg font-bold mb-2">Boas-vindas ao Gestor TorresApp</h2>
                    <p className="text-gray-600">
                        Use o menu de navegação abaixo para gerenciar seus clientes, controlar o estoque de materiais e visualizar relatórios importantes para o seu negócio.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
