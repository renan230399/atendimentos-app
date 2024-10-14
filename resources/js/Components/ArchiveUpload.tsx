import React from 'react';

type ArchiveUploadProps = {
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    className?: string;
};

const ArchiveUpload: React.FC<ArchiveUploadProps> = ({ id, onChange, accept = "image/*", className = "" }) => {
    return (
        <input
            type="file"
            id={id}
            className={`block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100 ${className}`}
            accept={accept}
            onChange={onChange} // Passa a função que será chamada ao alterar o arquivo
        />
    );
};

export default ArchiveUpload;
