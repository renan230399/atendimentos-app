import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TelefoneInput from '@/Components/TelefoneInput';
import { RiDeleteBin5Fill } from "react-icons/ri";

const CabecalhoPopup = ({ icone, titulo }) => {
    return (
        <>
            <div className='w-[100%] md:w-[20%] m-auto'>
                <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/contatos.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
            </div>
    
            <div className='w-[100%] md:w-[78%] flex flex-wrap gap-1 border-b-2 pb-5'>
                
            </div>
        </>
    );
};

export default CabecalhoPopup;
