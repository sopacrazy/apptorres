
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Material } from '../types';
import Card from './ui/Card';
import Modal from './ui/Modal';
import MaterialForm from './MaterialForm';
import { PlusIcon, PencilIcon, TrashIcon } from './ui/Icons';

const MaterialList: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

    const openModal = (material: Material | null = null) => {
        setEditingMaterial(material);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMaterial(null);
    };

    const handleDelete = (materialId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este material?')) {
            dispatch({ type: 'DELETE_MATERIAL', payload: materialId });
        }
    };

    return (
        <div>
             {state.materials.length === 0 ? (
                <Card>
                    <div className="text-center text-gray-500">
                        <p>Nenhum material cadastrado.</p>
                        <p>Clique no botão '+' para adicionar o primeiro item ao estoque.</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {state.materials.map(material => (
                        <Card key={material.id}>
                           <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{material.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        Estoque: <span className={`font-semibold ${material.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{material.stock} {material.unit}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Custo: R$ {material.costPerUnit.toFixed(2)} / {material.unit === 'metros' ? 'metro' : 'unid.'}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => openModal(material)} className="p-2 text-blue-600 hover:text-blue-800">
                                        <PencilIcon className="h-5 w-5"/>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(material.id)} 
                                        className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        disabled={material.isDefault}
                                        title={material.isDefault ? "Não é possível excluir materiais padrão" : "Excluir Material"}
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                           </div>
                        </Card>
                    ))}
                </div>
            )}
            <button
                onClick={() => openModal()}
                className="fixed bottom-20 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary z-20"
                aria-label="Adicionar Material"
            >
                <PlusIcon className="h-6 w-6" />
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingMaterial ? 'Editar Material' : 'Adicionar Material'}>
                <MaterialForm material={editingMaterial} onDone={closeModal} />
            </Modal>
        </div>
    );
};

export default MaterialList;