import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const EnderecoSection = ({ data, setData, errors }) => {
    return (
        <>
          <div className='w-[100%] md:w-[20%] m-auto'>
                <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/localizacao.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
            </div>
            <div className='w-[100%] md:w-[78%] flex flex-wrap gap-1 border-b-2 pb-5'>
                <div className='w-[20%]'>
                    <InputLabel htmlFor="estado" value="Estado" />
                    <TextInput
                        id="estado"
                        value={data.estado}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('estado', e.target.value)}
                    />
                    <InputError message={errors.estado} className="mt-2" />
                </div>
                <div className='w-[30%]'>
                    <InputLabel htmlFor="cidade" value="Cidade" />
                    <TextInput
                        id="cidade"
                        value={data.cidade}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('cidade', e.target.value)}
                    />
                    <InputError message={errors.cidade} className="mt-2" />
                </div>
                <div className='w-[30%]'>
                    <InputLabel htmlFor="bairro" value="Bairro" />
                    <TextInput
                        id="bairro"
                        value={data.bairro}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('bairro', e.target.value)}
                    />
                    <InputError message={errors.bairro} className="mt-2" />
                </div>
                <div className='w-[85%]'>
                    <InputLabel htmlFor="rua" value="Rua" />
                    <TextInput
                        id="rua"
                        value={data.rua}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('rua', e.target.value)}
                    />
                    <InputError message={errors.rua} className="mt-2" />
                </div>
                <div className='w-[10%]'>
                    <InputLabel htmlFor="numero" value="Número" />
                    <TextInput
                        id="numero"
                        value={data.numero}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('numero', e.target.value)}
                    />
                    <InputError message={errors.numero} className="mt-2" />
                </div>
                <div className='w-[100%]'>
                    <InputLabel htmlFor="complemento" value="Complemento" />
                    <TextInput
                        id="complemento"
                        value={data.complemento}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('complemento', e.target.value)}
                    />
                    <InputError message={errors.complemento} className="mt-2" />
                </div>
            </div>
        </>
       
    );
};

export default EnderecoSection;
