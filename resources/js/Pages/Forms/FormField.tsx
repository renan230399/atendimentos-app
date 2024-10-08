import InputError from '@/Components/InputError';
import DraggableBodySelector from '@/Components/DraggableBodySelector'; // Importa o componente de seleção do corpo

const FormField = ({ field, data = {}, handleChange = null, errors = {} }) => {
    if (!field || !field.type || !field.label) return null;

    const fieldValue = data ? data[field.id] : ''; // Verifica se há dados
    const errorMessage = errors ? errors[field.id] : ''; // Verifica se há erros
    const hasHandleChange = typeof handleChange === 'function'; // Verifica se a função de mudança foi passada

    switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
            return (
                <div className={`${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        value={fieldValue || ''} // Renderiza o valor ou vazio
                        onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined} // Executa apenas se handleChange estiver presente
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        required={field.required}
                        readOnly={!hasHandleChange} // Definir como somente leitura quando não houver handleChange
                    />
                    {errorMessage && <InputError message={errorMessage} />} {/* Renderiza erro apenas se presente */}
                </div>
            );
        case 'textarea':
            return (
                <div className={`${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    <textarea
                        id={field.id}
                        name={field.id}
                        value={fieldValue || ''}
                        onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        required={field.required}
                        readOnly={!hasHandleChange}
                    />
                    {errorMessage && <InputError message={errorMessage} />}
                </div>
            );
        case 'select':
            return (
                <div className={`${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    <select
                        id={field.id}
                        name={field.id}
                        value={fieldValue || ''}
                        onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        required={field.required}
                        disabled={!hasHandleChange} // Desabilita o select se não for edição
                    >
         
                    {(field.options ?? []).map((option, index) => (
                            <option key={option} value={option}>
                            {option}
                            </option>
                    ))}
                    </select>
                    {errorMessage && <InputError message={errorMessage} />}
                </div>
            );
        case 'radio':
            return (
                <div className={`${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    {(field.options ?? []).map((option, index) => (
                        <div key={option}>
                            <label className="inline-flex items-center">
                                <input
                                    id={field.id}
                                    type="radio"
                                    name={field.id}
                                    value={option}
                                    checked={fieldValue === option}
                                    onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined}
                                    className="form-radio"
                                    disabled={!hasHandleChange}
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                            <hr />
                        </div>
                    ))}
                    {errorMessage && <InputError message={errorMessage} />}
                </div>
            );
        case 'checkbox_group':
            return (
                <div className={`${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    {(field.options ?? []).map((option, index) => (
                        <div key={option}>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name={`${field.id}[${option}]`}
                                    value={option}
                                    checked={data[field.id]?.includes(option) || false}
                                    onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined}
                                    className="form-checkbox"
                                    disabled={!hasHandleChange}
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                            <hr />
                        </div>
                    ))}
                    {errorMessage && <InputError message={errorMessage} />}
                </div>
            );
        case 'checkbox':
            return (
                <div className={`${field.class}`}>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name={field.id}
                            checked={fieldValue || false}
                            onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined}
                            className="form-checkbox"
                            disabled={!hasHandleChange}
                        />
                        <span className="ml-2">{field.label}</span>
                    </label>
                    {errorMessage && <InputError message={errorMessage} />}
                </div>
            );
        case 'file':
            return (
                <div className={`${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    <input
                        id={field.id}
                        type="file"
                        name={field.id}
                        onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        disabled={!hasHandleChange}
                    />
                    {errorMessage && <InputError message={errorMessage} />}
                </div>
            );
        case 'multi_select':
            return (
                <div className={`${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    <select
                        name={field.id}
                        multiple
                        value={fieldValue || []}
                        onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        disabled={!hasHandleChange}
                    >
                    {(field.options ?? []).map((option, index) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {errorMessage && <InputError message={errorMessage} />}
                </div>
            );
            case 'select_with_optgroup':
                return (
                    <div className={`${field.class}`}>
                        <label className="block text-gray-700">{field.label}</label>
                        <select
                            id={field.id}
                            name={field.id}
                            value={data[field.id] || ''}
                            onChange={hasHandleChange ? (e) => handleChange(e, field) : undefined}
                            className="w-full border-gray-300 rounded-lg shadow-sm"
                            required={field.required}
                            disabled={!hasHandleChange} // Desabilita o select se não for edição
                        >
                            {(Array.isArray(field.options) ? field.options : []).map((group, index) => (
                                <optgroup key={index} label={group.label}>
                                    {group.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        {errorMessage && <InputError message={errorMessage} />}
                    </div>
                );
            
            

        case 'body_selector':
            return (
                <div className={`${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    <DraggableBodySelector
                        imageSrc={field.photo_select}
                        label="Selecione a área do corpo"
                        onPositionChange={hasHandleChange ? handleChange : undefined}
                        id={field.id}
                        disabled={!hasHandleChange}
                    />
                    {errorMessage && <InputError message={errorMessage} />}
                </div>
            );
        default:
            return null;
    }
};

export default FormField;
