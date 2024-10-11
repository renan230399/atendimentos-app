import React from 'react';

interface MeasuringFormProps {
    formData: {
        measuring_unit: 'unidade' | 'peso' | 'volume' | null;
        quantities_per_unit: number | null;
        measuring_unit_of_unit: string | null;
    };
    setFormData: (field: string, value: any) => void;
}

const MeasuringForm: React.FC<MeasuringFormProps> = ({ formData, setFormData }) => {
    // Define as opções para cada tipo de unidade de medida
    const unitOptions = {
        unidade: ['unidades', 'peças', 'itens'],
        peso: ['kg', 'g', 'mg', 'ton'],
        volume: ['L', 'ml', 'cm³', 'm³'],
    };

    // Obtém as opções com base no valor selecionado no primeiro select
    const currentUnitOptions = formData.measuring_unit ? unitOptions[formData.measuring_unit] : [];

    return (
        <div className="flex flex-wrap gap-4">
            {/* Campo de Unidade de Medida */}
            <div className="w-[30%]">
                <label className="block text-gray-700 font-medium">Unidade de Medida</label>
                <select
                    value={formData.measuring_unit || ''}
                    onChange={(e) => setFormData('measuring_unit', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                >
                    <option value="">Selecione a unidade</option>
                    <option value="unidade">Unidade</option>
                    <option value="peso">Peso</option>
                    <option value="volume">Volume</option>
                </select>
            </div>

            {/* Campo de Quantidades por Unidade */}
            <div className="w-[30%]">
                <label className="block text-gray-700 font-medium">Quantidade por Unidade</label>
                <input
                    type="number"
                    value={formData.quantities_per_unit || ''}
                    onChange={(e) => setFormData('quantities_per_unit', Number(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                />
            </div>

            {/* Campo de Unidade de Medida da Unidade (Dinâmico) */}
            <div className="w-[30%]">
                <label className="block text-gray-700 font-medium">Unidade de Medida</label>
                <select
                    value={formData.measuring_unit_of_unit || ''}
                    onChange={(e) => setFormData('measuring_unit_of_unit', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    disabled={!formData.measuring_unit} // Desabilita se não houver uma unidade selecionada
                >
                    <option value="">Selecione a unidade</option>
                    {currentUnitOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MeasuringForm;
