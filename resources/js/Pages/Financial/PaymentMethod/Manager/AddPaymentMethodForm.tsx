import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { z } from 'zod';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

// Definir o esquema Zod corretamente
const paymentMethodSchema = z.object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }),
    type: z.enum(['credit_card', 'debit_card', 'cash', 'bank_transfer'], {
      errorMap: () => ({ message: 'Tipo é obrigatório' }),
    }),
});

interface AddPaymentMethodFormProps {
  account: number;
  setIsAddingPaymentMethod: () => void;
}

const AddPaymentMethodForm: React.FC<AddPaymentMethodFormProps> = ({ account, setIsAddingPaymentMethod }) => {
  const { data, setData, post, reset, errors: serverErrors } = useForm({
    account_id: account,
    name: '',
    type: '',
  });

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação com Zod
    const result = paymentMethodSchema.safeParse(data);
    if (!result.success) {
      // Captura e armazena os erros de validação do Zod
      const zodErrors = result.error.format();
      setClientErrors({
        name: zodErrors.name?._errors?.[0] || '',
        type: zodErrors.type?._errors?.[0] || '',
      });
      return; // Não continua com o envio se houver erros
    }

    post(route('payment_methods.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setIsAddingPaymentMethod();
      },
      onError: (err) => {
        console.error('Erro ao cadastrar método de pagamento:', err);
      },
    });
  };

  return (
    <form onSubmit={handleAddPaymentMethod} className="mt-4 flex flex-wrap ">
      <div className="w-[35%] m-auto">
        <InputLabel value="Nome do método de pagamento" />
        <TextInput
          id="name"
          name="name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
        />
        <InputError message={clientErrors.name || serverErrors.name} className="mt-2" />
      </div>
      <div className="w-[60%] m-auto">
        <InputLabel value="Categoria" />
        <select
          value={data.type}
          onChange={(e) => setData('type', e.target.value)}
          id="type"
          name="type"
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Selecione o Tipo</option>
          <option value="credit_card">Cartão de Crédito</option>
          <option value="debit_card">Cartão de Débito</option>
          <option value="cash">Dinheiro</option>
          <option value="bank_transfer">Transferência Bancária</option>
        </select>
        <InputError message={clientErrors.type || serverErrors.type} className="mt-2" />
      </div>

      <PrimaryButton type="submit" className="mt-2">
        Cadastrar Método
      </PrimaryButton>
    </form>
  );
};

export default AddPaymentMethodForm;
