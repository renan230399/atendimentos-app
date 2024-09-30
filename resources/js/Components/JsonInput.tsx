import React, { useState, useEffect } from 'react';

interface FieldConfig<T> {
    key: keyof T;
    label: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'boolean';
}

interface JsonInputProps<T> {
    label: string;
    name: string;
    value: string; // O valor é passado como uma string JSON
    onChange: (name: string, value: T) => void; // Agora retorna o objeto completo, com categorias e seus arrays
    defaultFields: FieldConfig<T>[]; // Definição genérica de campos para todas as categorias
    defaultItem: T; // Objeto padrão para adicionar novos itens
}

const JsonInput = <T extends Record<string, any>>({
    label,
    name,
    value,
    onChange,
    defaultFields,
    defaultItem
}: JsonInputProps<T>) => {
    // Verifica se o valor é uma string JSON válida e a converte em um objeto
    const parseJson = (json: string): T => {
        try {
            const parsed = JSON.parse(json);
            return parsed ? parsed : {};
        } catch (error) {
            console.error('Erro ao parsear JSON:', error);
            return {} as T;
        }
    };

    const [jsonData, setJsonData] = useState<T>(parseJson(value));
    const [newCategory, setNewCategory] = useState(''); // Gerencia o estado da nova categoria

    useEffect(() => {
        setJsonData(parseJson(value));
    }, [value]);

    const handleFieldChange = (
        category: keyof T,
        index: number,
        field: keyof T[keyof T][number],
        newValue: any,
        type?: string
    ) => {
        const updatedCategory = [...(jsonData[category] as any[])];
        if (type === 'number') {
            newValue = Number(newValue);
        } else if (type === 'boolean') {
            newValue = newValue === 'true';
        }
        updatedCategory[index] = { ...updatedCategory[index], [field]: newValue };
        setJsonData((prevState) => ({ ...prevState, [category]: updatedCategory }));
        onChange(name, { ...jsonData, [category]: updatedCategory });
    };

    const handleAddField = (category: keyof T) => {
        const newItem = { ...defaultItem }; // Usa o item padrão passado via props
        const updatedCategory = [...(jsonData[category] || []), newItem];
        setJsonData((prevState) => ({ ...prevState, [category]: updatedCategory }));
        onChange(name, { ...jsonData, [category]: updatedCategory });
    };

    const handleRemoveField = (category: keyof T, index: number) => {
        const updatedCategory = [...(jsonData[category] as any[])];
        updatedCategory.splice(index, 1);
        setJsonData((prevState) => ({ ...prevState, [category]: updatedCategory }));
        onChange(name, { ...jsonData, [category]: updatedCategory });
    };

    const handleAddCategory = () => {
        if (newCategory && !jsonData[newCategory]) {
            setJsonData((prevState) => ({ ...prevState, [newCategory]: [] }));
            onChange(name, { ...jsonData, [newCategory]: [] });
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (category: keyof T) => {
        const updatedData = { ...jsonData };
        delete updatedData[category];
        setJsonData(updatedData);
        onChange(name, updatedData);
    };

    return (
        <div className="json-input-container p-4 border border-gray-300 rounded-md">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {/* Adicionar nova categoria */}
            <div className="flex items-center gap-2 my-2">
                <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nova categoria"
                />
                <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddCategory}
                >
                    Adicionar Categoria
                </button>
            </div>

            {Object.keys(jsonData).map((categoryKey) => {
                const category = categoryKey as keyof T;
                const categoryData = jsonData[category] as T[keyof T];

                return (
                    <div key={categoryKey} className="mt-4">
                        <div className="flex justify-between">
                            <h3 className="text-md font-bold">{categoryKey}</h3>
                            <button
                                type="button"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveCategory(category)}
                            >
                                Remover Categoria
                            </button>
                        </div>

                        {categoryData && (categoryData as any[]).length === 0 ? (
                            <p className="text-gray-500">Nenhum item adicionado ainda.</p>
                        ) : (
                            (categoryData as any[]).map((item, index) => (
                                <div key={index} className="flex items-center gap-2 my-2">
                                    {defaultFields.map((field) => {
                                        const fieldType = field.type || 'text'; // Define o tipo de campo, padrão para 'text'
                                        return (
                                            <div key={`${index}-${field.key}`} className="w-1/4">
                                                {fieldType === 'boolean' ? (
                                                    <label className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={(item[field.key] as unknown) as boolean}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    category,
                                                                    index,
                                                                    field.key as keyof T[keyof T][number],
                                                                    e.target.checked,
                                                                    'boolean'
                                                                )
                                                            }
                                                        />
                                                        <span>{field.label}</span>
                                                    </label>
                                                ) : (
                                                    <input
                                                        type={fieldType === 'number' ? 'number' : 'text'}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                        value={item[field.key] as any}
                                                        onChange={(e) =>
                                                            handleFieldChange(
                                                                category,
                                                                index,
                                                                field.key as keyof T[keyof T][number],
                                                                e.target.value,
                                                                fieldType
                                                            )
                                                        }
                                                        placeholder={field.placeholder || field.label}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveField(category, index)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))
                        )}

                        <button
                            type="button"
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => handleAddField(category)}
                        >
                            Adicionar Item em {categoryKey}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default JsonInput;
