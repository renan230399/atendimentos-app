import React from 'react';
import PropTypes from 'prop-types';

const ArchiveUpload = ({ id, onChange, accept = "image/*", className = "" }) => {
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

ArchiveUpload.propTypes = {
    id: PropTypes.string.isRequired, // O ID do input é obrigatório
    onChange: PropTypes.func.isRequired, // Função chamada quando o arquivo é alterado
    accept: PropTypes.string, // Tipo de arquivo aceito
    className: PropTypes.string, // Classe CSS adicional para estilização
};

export default ArchiveUpload;
