import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

interface AccountSelectorProps {
  accounts: { id: number; name: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ accounts, value, onChange, error }) => (
  <div className="w-full mb-3">
    <InputLabel htmlFor="account_id" value="Conta" />
    <select
      id="account_id"
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full border-gray-300 rounded-md shadow-sm text-lg focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="">Selecione uma conta</option>
      {accounts.map((account) => (
        <option key={account.id} value={account.id}>
          {account.name}
        </option>
      ))}
    </select>
    <InputError message={error} className="mt-2" />
  </div>
);

export default AccountSelector;
