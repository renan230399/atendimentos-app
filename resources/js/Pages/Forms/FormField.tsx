import InputError from '@/Components/InputError';
import DraggableBodySelector from '@/Components/DraggableBodySelector'; // Importa o componente de seleção do corpo

const FormField = ({ field, data, handleChange, errors }) => {
    if (!field || !field.type || !field.label) return null;

    switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
            return (
                <div className="mb-4">
                    <label className="block text-gray-700">{field.label}</label>
                    <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        value={data[field.id] || ''}
                        onChange={(e) => handleChange(e, field)}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        required={field.required}
                    />
                    <InputError message={errors[field.id]} />
                </div>
            );
        case 'textarea':
            return (
                <div className="mb-4">
                    <label className="block text-gray-700">{field.label}</label>
                    <textarea
                        id={field.id}
                        name={field.id}
                        value={data[field.id] || ''}
                        onChange={(e) => handleChange(e, field)}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        required={field.required}
                    />
                    <InputError message={errors[field.id]} />
                </div>
            );
        case 'select':
            return (
                <div className="mb-4">
                    <label className="block text-gray-700">{field.label}</label>
                    <select
                        id={field.id}
                        name={field.id}
                        value={data[field.id] || ''}
                        onChange={(e) => handleChange(e, field)}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                        required={field.required}
                    >
                        {field.options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors[field.id]} />
                </div>
            );
        case 'radio':
            return (
                <div className="mb-4 text-left">
                    <label className="block text-gray-700">{field.label}</label>
                    {field.options.map((option) => (
                        <div key={option}>
                            <label className="inline-flex items-center">
                                <input
                                    id={field.id}
                                    type="radio"
                                    name={field.id}
                                    value={option}
                                    checked={data[field.id] === option}
                                    onChange={(e) => handleChange(e, field)}
                                    className="form-radio"
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                            <hr />
                        </div>
                    ))}
                    <InputError message={errors[field.id]} />
                </div>
            );
        case 'checkbox_group':
            return (
                <div className={`mb-4 text-left ${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    {field.options.map((option) => (
                        <div key={option}>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name={`${field.id}[${option}]`}
                                    value={option}
                                    checked={data[field.id]?.includes(option) || false}
                                    onChange={(e) => handleChange(e, field)}
                                    className="form-checkbox"
                                />
                                <span className="ml-2">{option}</span>
                            </label>
                            <hr />
                        </div>
                    ))}
                    <InputError message={errors[field.id]} />
                </div>
            );
        case 'checkbox':
            return (
                <div className={`mb-4 ${field.class}`}>
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name={field.id}
                            checked={data[field.id] || false}
                            onChange={(e) => handleChange(e, field)}
                            className="form-checkbox"
                        />
                        <span className="ml-2">{field.label}</span>
                    </label>
                    <InputError message={errors[field.id]} />
                </div>
            );
        case 'file':
            return (
                <div className="mb-4">
                    <label className="block text-gray-700">{field.label}</label>
                    <input
                        id={field.id}
                        type="file"
                        name={field.id}
                        onChange={(e) => handleChange(e, field)}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                    />
                    <InputError message={errors[field.id]} />
                </div>
            );
        case 'multi_select':
            return (
                <div className={`mb-4 ${field.class}`}>
                    <label className="block text-gray-700">{field.label}</label>
                    <select
                        name={field.id}
                        multiple
                        value={data[field.id] || []}
                        onChange={(e) => handleChange(e, field)}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                    >
                        {field.options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors[field.id]} />
                </div>
            );
        case 'body_selector': // Caso para o renderizador do seletor de corpo humano
            return (
                <div className="mb-4">
                    <label className="block text-gray-700">{field.label}</label>
                    <DraggableBodySelector 
                        imageSrc="https://keyar-atendimentos.s3.amazonaws.com/form_pictures/body_human.png"
                        label="Selecione a área do corpo"
                        onPositionChange={handleChange} // Recebe a posição selecionada
                        id={field.id}
                    />
                    <InputError message={errors[field.id]} />
                </div>
            );
        default:
            return null;
    }
};

export default FormField;
