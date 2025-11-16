
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Client } from '../types';
import Card from './ui/Card';
import Modal from './ui/Modal';
import ClientForm from './ClientForm';
import PaymentForm from './PaymentForm';
import { PlusIcon, UserCircleIcon, PencilIcon, TrashIcon, PhoneIcon, CurrencyDollarIcon } from './ui/Icons';

const ClientList: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const openFormModal = (client: Client | null = null) => {
        setSelectedClient(client);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedClient(null);
    };

    const openPaymentModal = (client: Client) => {
        setSelectedClient(client);
        setIsPaymentModalOpen(true);
    }

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedClient(null);
    }
    
    const handleDelete = (clientId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente? Todos os pagamentos e registros de ativação associados também serão removidos.')) {
            dispatch({ type: 'DELETE_CLIENT', payload: clientId });
        }
    };

    const filteredClients = useMemo(() => 
        state.clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.address.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name)),
        [state.clients, searchTerm]
    );

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar cliente por nome ou endereço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            {filteredClients.length === 0 && searchTerm === '' ? (
                <Card>
                    <div className="text-center text-gray-500">
                        <p>Nenhum cliente cadastrado.</p>
                        <p>Clique no botão '+' para adicionar o primeiro cliente.</p>
                    </div>
                </Card>
            ) : filteredClients.length === 0 && searchTerm !== '' ? (
                 <Card>
                    <div className="text-center text-gray-500">
                        <p>Nenhum cliente encontrado com o termo "{searchTerm}".</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredClients.map(client => (
                        <Card key={client.id}>
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <div className="flex items-center mb-2">
                                        <UserCircleIcon className="h-6 w-6 text-primary mr-2"/>
                                        <h3 className="font-bold text-lg">{client.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">{client.address}</p>
                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                        <PhoneIcon className="h-4 w-4 mr-1"/> {client.phone || 'Não informado'}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-1 ml-2">
                                    <button onClick={() => openPaymentModal(client)} className="p-2 text-green-600 hover:text-green-800" title="Registrar Pagamento">
                                        <CurrencyDollarIcon className="h-6 w-6"/>
                                    </button>
                                    <button onClick={() => openFormModal(client)} className="p-2 text-blue-600 hover:text-blue-800" title="Editar Cliente">
                                        <PencilIcon className="h-5 w-5"/>
                                    </button>
                                    <button onClick={() => handleDelete(client.id)} className="p-2 text-red-600 hover:text-red-800" title="Excluir Cliente">
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            <button
                onClick={() => openFormModal()}
                className="fixed bottom-20 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary z-20"
                aria-label="Adicionar Cliente"
            >
                <PlusIcon className="h-6 w-6" />
            </button>
            <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={selectedClient ? 'Editar Cliente' : 'Adicionar Cliente'}>
                <ClientForm client={selectedClient} onDone={closeFormModal} />
            </Modal>
            {selectedClient && (
                 <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} title={`Pagamento para ${selectedClient.name}`}>
                    <PaymentForm client={selectedClient} onDone={closePaymentModal} />
                </Modal>
            )}
        </div>
    );
};

export default ClientList;