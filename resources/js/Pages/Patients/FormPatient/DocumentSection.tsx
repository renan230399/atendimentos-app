import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DateOfBirthInput from '@/Components/DateOfBirthInput';
import TextInput from '@/Components/TextInput';
import CpfInput from '@/Components/CpfInput';
import InputFile from '@/Components/InputFile';
import CustomDropdown from '@/Components/CustomDropdown';
// Definição das opções de status com ícones
const statusOptions = [
    { value: 1, label: 'Ativo', icon: <span className="text-green-500">✔</span> },
    { value: 0, label: 'Inativo', icon: <span className="text-red-500">⏳</span> },
];

interface DocumentSectionProps {
    data: {
        profile_picture: string | File | null;
        patient_name: string;
        birth_date: string | null;
        cpf: string;
        gender: string | null; // Permitir que seja string ou null
        status: boolean;
        [key: string]: any; // Para permitir campos adicionais
    };
    setData: (field: string, value: any) => void;
    errors: {
        profile_picture?: string;
        patient_name?: string;
        birth_date?: string | null;
        cpf?: string;
        gender?: string; // Pode ser string, já que o erro seria uma mensagem
        status?: string;
        [key: string]: any; // Para permitir erros adicionais
    };
}


const DocumentSection: React.FC<DocumentSectionProps> = ({ data, setData, errors }) => {
    return (
        <>
            <div className="w-full flex flex-wrap gap-1 space-y-2">
                {/* Foto de perfil */}
                <div className='md:w-[30%] w-full'>
                    <InputLabel htmlFor="profile_picture" value="Foto" />

                    <TextInput
                        id="profile_picture"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            const selectedFile = e.target.files?.[0] || null;
                            setData('profile_picture', selectedFile);
                            console.log('Imagem selecionada:', selectedFile); // Verifica se a imagem foi capturada corretamente
                        }}
                    />


                    {/* Exibe uma prévia do logo existente, caso já tenha sido salvo */}
                    {data?.profile_picture && (
                        <img 
                        src={typeof data.profile_picture === 'string' 
                            ? data.profile_picture 
                            : data.profile_picture 
                                ? URL.createObjectURL(data.profile_picture) 
                                : ''} 
                        alt="Foto de perfil" 
                        className="mt-4 w-32 h-32 object-cover"
                    />
 
                    )}

                    <InputError className="mt-2" message={errors.profile_picture} />
                </div>
                {/* Nome do paciente */}
                <div className="w-[100%] md:w-[68%] m-auto">
                    <InputLabel htmlFor="patient_name" value="Nome do paciente" />
                    <TextInput
                        id="patient_name"
                        value={data.patient_name || ''}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('patient_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.patient_name} className="mt-2" />
                </div>
                
                {/* Data de nascimento */}
                <div className="w-[100%] md:w-[32%] m-auto">
                    <DateOfBirthInput
                        value={data.birth_date || ''} // Passa a data no formato ISO como value
                        onChange={(value) => setData('birth_date', value)} // Atualiza o valor no state quando o usuário muda a data
                        errors={errors} // Passa os erros para exibir mensagens de validação
                        id='birth_date'
                    />
                </div>

                {/* CPF */}
                <div className="w-[100%] md:w-[32%] m-auto">
                    <CpfInput
                        value={data.cpf || ''}
                        onChange={(e) => setData('cpf', e.target.value)}
                        errors={errors.cpf}
                    />
                </div>

                {/* Gênero */}
                <div className="w-[100%] md:w-[32%] m-auto">
                    <InputLabel htmlFor="gender" value="Gênero" />
                    <select
                        id="gender"
                        value={data.gender || ''}
                        onChange={(e) => setData('gender', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                    >
                        <option value="">Selecione o gênero</option>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                    </select>
                    <InputError message={errors.gender} className="mt-2" />
                </div>

                <CustomDropdown
                    id={`status`}
                    label="Status"
                    value={data.status || ''}
                    onChange={(value) => setData('status', value)}
                    options={statusOptions}
                    error={errors?.status}
                />
            </div>
        </>
    );
};

export default DocumentSection;
