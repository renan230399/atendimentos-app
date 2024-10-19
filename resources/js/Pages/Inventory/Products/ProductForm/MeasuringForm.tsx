import React from 'react';
import { ProductFormData } from '../../interfaces'; // Ajuste o caminho conforme necessário

interface MeasuringFormProps {
    formData: {
        measuring_unit: 'unidade' | 'peso' | 'volume' | null;
        quantities_per_unit: number | null;
        measuring_unit_of_unit: string | null;
    };
    setFormData: (field: keyof ProductFormData, value: any) => void;
    validationErrors: Record<string, string>; // Adicionando a prop para receber os erros
}

const MeasuringForm: React.FC<MeasuringFormProps> = ({ formData, setFormData, validationErrors }) => {
    const unitOptions = {
        unidade: ['unidades', 'peças', 'itens'],
        peso: ['kg', 'g', 'mg', 'ton'],
        volume: ['L', 'ml', 'cm³', 'm³'],
    };

    const currentUnitOptions = formData.measuring_unit ? unitOptions[formData.measuring_unit] : [];

    return (
        <div className="flex flex-wrap gap-4">
            {/* Campo de Unidade de Medida */}
            <div className="w-[30%]">
                <label className="block text-gray-700 font-medium">Unidade de Medida</label>
                <select
                    value={formData.measuring_unit || ''}
                    onChange={(e) => setFormData('measuring_unit', e.target.value as 'unidade' | 'peso' | 'volume' | null)}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${validationErrors.measuring_unit ? 'border-red-500' : ''}`}
                    required
                >
                    <option value="">Selecione a unidade</option>
                    <option value="unidade">Unidade</option>
                    <option value="peso">Peso</option>
                    <option value="volume">Volume</option>
                </select>
                {validationErrors.measuring_unit && <div className="text-red-500 text-sm mt-1">{validationErrors.measuring_unit}</div>}
            </div>

            {/* Campo de Quantidades por Unidade */}
            <div className="w-[30%]">
                <label className="block text-gray-700 font-medium">Quantidade por Unidade</label>
                <input
                    type="number"
                    value={formData.quantities_per_unit || ''}
                    onChange={(e) => setFormData('quantities_per_unit', Number(e.target.value))}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${validationErrors.quantities_per_unit ? 'border-red-500' : ''}`}
                    required
                />
                {validationErrors.quantities_per_unit && <div className="text-red-500 text-sm mt-1">{validationErrors.quantities_per_unit}</div>}
            </div>

            {/* Campo de Unidade de Medida da Unidade */}
            <div className="w-[30%]">
                <label className="block text-gray-700 font-medium">Unidade de Medida</label>
                <select
                    value={formData.measuring_unit_of_unit || ''}
                    onChange={(e) => setFormData('measuring_unit_of_unit', e.target.value)}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${validationErrors.measuring_unit_of_unit ? 'border-red-500' : ''}`}
                    disabled={!formData.measuring_unit}
                >
                    <option value="">Selecione a unidade</option>
                    {currentUnitOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                {validationErrors.measuring_unit_of_unit && <div className="text-red-500 text-sm mt-1">{validationErrors.measuring_unit_of_unit}</div>}
            </div>
        </div>
    );
};

export default MeasuringForm;
