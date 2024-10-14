import React, { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import ArchiveUpload from '@/Components/ArchiveUpload';

interface InputFileProps {
    label?: string;
    file?: File | string;
    setFile: (file: File) => void;
    errors?: string;
    accept?: string;
    defaultPreview?: string;
}

const InputFile: React.FC<InputFileProps> = ({ 
    label = '', 
    file = '', 
    setFile = () => {}, 
    errors = '', 
    accept = "image/*", 
    defaultPreview = "https://keyar-atendimentos.s3.amazonaws.com/icones/documentos.png" 
}) => {
    const [previewImage, setPreviewImage] = useState<string>(defaultPreview);

    // Função chamada quando o usuário escolhe um arquivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0]; // Verifica se há um arquivo selecionado
        if (newFile) {
            setFile(newFile); // Atualiza o estado do arquivo no componente pai
            setPreviewImage(URL.createObjectURL(newFile)); // Atualiza a imagem de visualização
        }
    };

    useEffect(() => {
        // Atualiza a pré-visualização se o arquivo mudar externamente ou quando o componente é inicializado
        if (file instanceof File) {
            setPreviewImage(URL.createObjectURL(file)); // Mostra a pré-visualização do arquivo selecionado
        } else {
            setPreviewImage(file || defaultPreview); // Mostra a URL ou o preview padrão
        }
    }, [file, defaultPreview]);

    return (
        <div className='flex'>
            <div className="w-full m-auto bg-white">
                {/* Exibe a pré-visualização do arquivo */}
                <img
                    src={previewImage} // Usa o estado de previewImage
                    className="m-auto w-20 h-20 md:w-40 md:h-40 object-cover rounded-full"
                    alt="Pré-visualização"
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
