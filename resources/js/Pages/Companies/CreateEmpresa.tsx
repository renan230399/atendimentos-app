import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const CreateEmpresa = ({ auth }) => {
    const { data, setData, post, processing, errors } = useForm({
        nome_empresa: '',
        logo_empresa: null, // Para o logotipo da empresa
    });

    const [logoPreview, setLogoPreview] = useState(null); // Estado para pré-visualização do logo

    // Manipulador de mudanças para o nome da empresa
    const handleInputChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    // Manipulador para o upload do logotipo
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo_empresa', file);

        // Criando uma pré-visualização do logo
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Envio do formulário
    const submit = (e) => {
        e.preventDefault();
        post('/empresas'); // Faz o post para a rota de criação de empresas
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Cadastrar Nova Empresa" />

            <div className="p-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">Cadastrar Nova Empresa</h1>

                <form onSubmit={submit}>
                    {/* Nome da empresa */}
                    <div className="mb-4">
                        <InputLabel htmlFor="nome_empresa" value="Nome da Empresa" />
                        <TextInput
                            id="nome_empresa"
                            name="nome_empresa"
                            value={data.nome_empresa}
                            className="mt-1 block w-full"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.nome_empresa} className="mt-2" />
                    </div>

                    {/* Upload do logotipo */}
                    <div className="mb-4">
                        <InputLabel htmlFor="logo_empresa" value="Logotipo da Empresa" />
                        <input
                            id="logo_empresa"
                            type="file"
                            className="mt-1 block w-full"
                            onChange={handleLogoChange}
                            accept="image/*" // Aceita apenas arquivos de imagem
                        />
                        <InputError message={errors.logo_empresa} className="mt-2" />

                        {/* Pré-visualização do logotipo */}
                        {logoPreview && (
                            <div className="mt-4">
                                <p className="text-sm">Pré-visualização do Logotipo:</p>
                                <img
                                    src={logoPreview}
                                    alt="Pré-visualização do logotipo"
                                    className="mt-2 h-20 w-20 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>

                    {/* Botão de envio */}
                    <PrimaryButton className="mt-4" disabled={processing}>
                        {processing ? 'Cadastrando...' : 'Cadastrar Empresa'}
                    </PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateEmpresa;
