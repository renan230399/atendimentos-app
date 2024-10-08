import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DateOfBirthInput from '@/Components/DateOfBirthInput';
import TextInput from '@/Components/TextInput';
import CpfInput from '@/Components/CpfInput';
import InputFile from '@/Components/InputFile';
import ContactsInput from '@/Components/ContactsInput';

const DocumentSection = ({ data, setData, errors, patient_name, profile_picture }) => {

  
    return (
        <>
            <div className="w-[100%] md:w-[78%] md:m-auto flex flex-wrap gap-1">
                <div className="w-[100%] md:w-[100%]">
                    <h1 className="text-2xl font-bold mb-6">Informações do Paciente</h1>
                </div>

                {/* Nome do paciente */}
                <div className="w-[100%] md:w-[100%]">
                    <InputLabel htmlFor="patient_name" value="Nome do paciente" />
                    <TextInput
                        id="patient_name"
                        value={data.patient_name}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('patient_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.patient_name} className="mt-2" />
                </div>
                <div>

                </div>
                {/* Data de nascimento */}
                <div className="w-[100%] md:w-[32%]">
                    <DateOfBirthInput
                        value={data.birth_date}
                        onChange={(value) => setData('birth_date', value)}
                        errors={errors}
                    />
                </div>

                {/* CPF */}
                <div className="w-[100%] md:w-[32%]">
                    <CpfInput
                        value={data.cpf}
                        onChange={(e) => setData('cpf', e.target.value)}
                        errors={errors.cpf}
                    />
                </div>

                {/* Gênero */}
                <div className="w-[100%] md:w-[32%]">
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

                {/* Foto de perfil */}
                <div className="w-[100%]">
                    <InputFile
                        label="Cadastrar foto de perfil"
                        file={profile_picture}
                        setFile={(file) => setData('profile_picture', file)}
                        errors={errors.profile_picture}
                    />
                </div>
            </div>
        </>
    );
};

export default DocumentSection;
