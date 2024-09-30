import React, { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import DateOfBirthInput from '@/Components/DateOfBirthInput';
import TextInput from '@/Components/TextInput';
import CpfInput from '@/Components/CpfInput';
import ArchiveUpload from '@/Components/ArchiveUpload';

const DocumentSection = ({ data, setData, errors, patient_name, profile_picture, handleFileChange }) => {
    const [previewImage, setPreviewImage] = useState(profile_picture);

    // Função para converter data no formato ISO (1999-03-23T03:00:00.000000Z) para YYYY-MM-DD
    const formatDateForInput = (date) => {
        if (!date) return '';
        return date.split('T')[0]; // Pega apenas a parte 'YYYY-MM-DD' antes do 'T'
    };

    // Função chamada quando o usuário escolhe uma nova imagem de perfil
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
            setPreviewImage(URL.createObjectURL(file)); // Atualiza a imagem de visualização
        }
    };

    useEffect(() => {
        // Atualiza a pré-visualização se a imagem de perfil mudar externamente
        if (profile_picture instanceof File) {
            setPreviewImage(URL.createObjectURL(profile_picture));
        } else {
            setPreviewImage(profile_picture || 'https://keyar-atendimentos.s3.amazonaws.com/icones/documentos.png');
        }
    }, [profile_picture]);

    return (
        <>
            <div className="w-[100%] md:w-[20%] m-auto bg-white">
                {/* Exibe a foto de perfil, seja uma URL ou um arquivo local */}
                <img
                    src={previewImage}
                    className="m-auto w-20 h-20 md:w-40 md:h-40 object-cover rounded-full"
                    alt="Profile Picture"
                />
            </div>

            <div className="w-[100%] md:w-[78%] md:m-auto flex flex-wrap gap-1">
                <div className="w-[100%] md:w-[100%]">
                    <h1 className="text-2xl font-bold mb-6">Document Information</h1>
                </div>

                {/* Patient Name Field */}
                <div className="w-[100%] md:w-[100%]">
                    <InputLabel htmlFor="patient_name" value="Nome do paciente" />
                    <TextInput
                        id="patient_name"
                        value={patient_name}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('patient_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.patient_name} className="mt-2" />
                </div>

                {/* Date of Birth */}
                <div className="w-[100%] md:w-[32%]">
                    <DateOfBirthInput
                        value={formatDateForInput(data.birth_date)}
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

                {/* Profile Picture Upload */}
                <div className="w-[100%]">
                    <InputLabel htmlFor="profile_picture" value="Cadastrar foto de perfil" />
                    <ArchiveUpload 
                        id="profile_picture"
                        onChange={handleImageChange} // Chama a função que atualiza a pré-visualização
                        accept="image/*"
                    />
                    <InputError message={errors.profile_picture} className="mt-2" />
                </div>
            </div>
        </>
    );
};

export default DocumentSection;
