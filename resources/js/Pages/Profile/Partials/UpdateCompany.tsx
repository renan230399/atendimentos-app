import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';
import {User} from '@/Pages/ProfileInterfaces';
export default function UpdateCompany({ className = '' }: { className?: string }) {
    const user = usePage<PageProps>().props.auth.user as User; // Certifique-se de fazer o cast para a interface User
    const company = user.company; // Agora 'company' deve ser reconhecido
    // Inicializa os fornecedores como uma string JSON válida, se houver dados, ou como um array vazio em JSON.
    const initialSuppliers = company?.suppliers ? JSON.parse(company.suppliers) : [];

    // O estado agora está sendo gerenciado pelo useForm com dados corretos
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        company_name: company?.company_name || '', // Nome da empresa
        company_logo: null as File | null, // Define o tipo aqui
        suppliers: initialSuppliers, // Fornecedores como array de objetos
    });

    // Submissão do formulário
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Converte suppliers para uma string JSON se necessário antes de enviar
        const formData = {
            ...data,
            suppliers: JSON.stringify(data.suppliers),
        };

        // Use `post` ou `put`, dependendo de sua lógica de envio
        post(route('companies.update', company.id), {
            data: formData,
            forceFormData: true, // Força o envio como FormData, necessário para uploads de arquivos
            onSuccess: () => {
            },
        });
    };



    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Informações da Empresa</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Atualize o nome da sua empresa, o logo, e os fornecedores.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Campo para o nome da empresa */}
                <div>
                    <InputLabel htmlFor="company_name" value="Nome da Empresa" />

                    <TextInput
                        id="company_name"
                        className="mt-1 block w-full"
                        name="company_name"
                        value={data.company_name} // Certifique-se de que o valor esteja correto
                        onChange={(e) => setData('company_name', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.company_name} />
                </div>

                {/* Campo para o logo da empresa */}
                <div>
                    <InputLabel htmlFor="company_logo" value="Logo da Empresa" />

                    <TextInput
                        id="company_logo"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null; // file é do tipo File | null
                            setData('company_logo', file); // A função setData agora aceita File | null
                        }}
                    />

                    {/* Exibe uma prévia do logo existente, caso já tenha sido salvo */}
                    {company?.company_logo && (
                        <img
                            src={company.company_logo}
                            alt="Logo da Empresa"
                            className="mt-4 w-32 h-32 object-cover"
                        />
                    )}

                    <InputError className="mt-2" message={errors.company_logo} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Salvar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">Salvo com sucesso.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
