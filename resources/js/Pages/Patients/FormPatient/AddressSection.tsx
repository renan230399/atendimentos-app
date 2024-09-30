import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const EnderecoSection = ({ data, setData, errors }) => {
    return (
        <>
            {/* Imagem de Localização */}
            <div className='w-[100%] md:w-[20%] m-auto'>
                <img src="https://keyar-atendimentos.s3.amazonaws.com/icones/localizacao.png" className="m-auto w-20 h-20 md:w-40 md:h-40" />
            </div>

            {/* Seção de Inputs */}
            <div className='w-[100%] md:w-[78%] flex flex-wrap gap-3 border-b-2 pb-5'>

                {/* Campo Estado (Select) */}
                <div className='w-[20%]'>
                    <InputLabel htmlFor="state" value="Estado" />
                    <select
                        id="state"
                        value={data.state}
                        onChange={(e) => setData('state', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione o estado</option>
                        {estados.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                    <InputError message={errors.state} className="mt-2" />
                </div>

                {/* Campo Cidade */}
                <div className='w-[30%]'>
                    <InputLabel htmlFor="city" value="Cidade" />
                    <TextInput
                        id="city"
                        value={data.city}
                        placeholder="Digite a cidade"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setData('city', e.target.value)}
                    />
                    <InputError message={errors.city} className="mt-2" />
                </div>

                {/* Campo Bairro */}
                <div className='w-[30%]'>
                    <InputLabel htmlFor="neighborhood" value="Bairro" />
                    <TextInput
                        id="neighborhood"
                        value={data.neighborhood}
                        placeholder="Digite o bairro"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setData('neighborhood', e.target.value)}
                    />
                    <InputError message={errors.neighborhood} className="mt-2" />
                </div>

                {/* Campo Rua */}
                <div className='w-[85%]'>
                    <InputLabel htmlFor="street" value="Rua" />
                    <TextInput
                        id="street"
                        value={data.street}
                        placeholder="Digite a rua"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setData('street', e.target.value)}
                    />
                    <InputError message={errors.street} className="mt-2" />
                </div>

                {/* Campo Número */}
                <div className='w-[10%]'>
                    <InputLabel htmlFor="house_number" value="Número" />
                    <TextInput
                        id="house_number"
                        value={data.house_number}
                        placeholder="Nº"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setData('house_number', e.target.value)}
                        type="number"
                    />
                    <InputError message={errors.house_number} className="mt-2" />
                </div>

                {/* Campo Complemento */}
                <div className='w-[100%]'>
                    <InputLabel htmlFor="address_complement" value="Complemento" />
                    <TextInput
                        id="address_complement"
                        value={data.address_complement}
                        placeholder="Digite um complemento (opcional)"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => setData('address_complement', e.target.value)}
                    />
                    <InputError message={errors.address_complement} className="mt-2" />
                </div>
            </div>
        </>
    );
};

export default EnderecoSection;
