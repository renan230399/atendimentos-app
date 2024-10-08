import React, { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import ArchiveUpload from '@/Components/ArchiveUpload';

const InputFile = ({ label, file, setFile, errors, accept = "image/*", defaultPreview = "https://keyar-atendimentos.s3.amazonaws.com/icones/documentos.png" }) => {
    const [previewImage, setPreviewImage] = useState(defaultPreview);

    // Função chamada quando o usuário escolhe um arquivo
    const handleFileChange = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            setFile(newFile);
            setPreviewImage(URL.createObjectURL(newFile)); // Atualiza a imagem de visualização
        }
    };

    useEffect(() => {
        // Atualiza a pré-visualização se o arquivo mudar externamente
        if (file instanceof File) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(file || defaultPreview);
        }
    }, [file, defaultPreview]);

    return (
        <div className='flex'>
            <div className="w-full m-auto bg-white">
                {/* Exibe a pré-visualização do arquivo */}
                <img
                    src={previewImage}
                    className="m-auto w-20 h-20 md:w-40 md:h-40 object-cover rounded-full"
                    alt="Preview"
                />
            </div>

            <div className="w-full m-auto">
                <InputLabel htmlFor="file" value={label} />
                <ArchiveUpload 
                    id="file"
                    onChange={handleFileChange}
                    accept={accept}
                />
                <InputError message={errors} className="mt-2" />
            </div>
        </div>
    );
};

export default InputFile;
