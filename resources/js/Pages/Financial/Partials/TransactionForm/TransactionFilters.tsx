import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import DatePicker from 'react-datepicker';
import InputLabel from '@/Components/InputLabel';

const TransactionFilters = ({
  filterDate,
  setFilterDate,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filterAccountIds,
  setFilterAccountIds,
  statusOptions,
  accounts,
  categories,
  selectedStatusTemplate,
  statusOptionTemplate
}) => {
  return (
    <div className="mb-4 w-full pl-5 flex flex-wrap">
      {/* Filtro por Data */}
      <div className='m-auto'>
        <InputLabel htmlFor="filter_date" className="w-full m-auto" value="Selecione um dos dias do intervalo" />
        <DatePicker
          id="filter_date"
          selected={filterDate}
          onChange={(date) => setFilterDate(date)}
          isClearable
          placeholderText="Selecione uma data"
          dateFormat="dd/MM/yyyy"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Filtro por Tipo de Transação */}
      <div className='m-auto'>
        <InputLabel htmlFor="filter_type" value="Tipo de Transação" />
        <select
          id="filter_type"
          value={filterType || ''}
          onChange={(e) => setFilterType(e.target.value || null)}
          className="w-full p-2 border rounded"
        >
          <option value="">Todos</option>
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
          <option value="transfer">Transferência</option>
        </select>
      </div>

      {/* Filtro por Status */}
      <div className='m-auto'>
        <InputLabel htmlFor="filter_status" value="Status" />
        <Dropdown
            value={filterStatus} // Garantir que o valor inicial seja uma string vazia para evitar mostrar o ícone de limpar
            onChange={(e) => setFilterStatus(e.value || '')} // Ajusta para string vazia se o valor for limpo
            options={statusOptions}
            optionLabel="label"
            placeholder="Selecione o status"
            valueTemplate={selectedStatusTemplate}
            itemTemplate={statusOptionTemplate}
            showClear
            className="w-full md:w-14rem border rounded border-gray-600"
        />






      </div>

      {/* Filtro por Nome da Conta */}
      <div className='m-auto'>
        <InputLabel htmlFor="filter_account" value="Contas" />
        <MultiSelect
          value={filterAccountIds.includes(0) ? [0] : filterAccountIds}
          options={accounts.map(account => ({ label: account.name, value: account.id }))}
          onChange={(e) => {
            if (e.value.includes(0)) {
              setFilterAccountIds([0]);
            } else {
              setFilterAccountIds(e.value);
            }
          }}
          placeholder="Selecione Contas"
          className="w-full md:w-20rem bg-white border border-gray-600"
          maxSelectedLabels={3}
          display="chip"
        />
      </div>
      <div className='m-auto'>
        <InputLabel htmlFor="filter_category" value="Categorias" />
        <MultiSelect
    showClear
    value={filterCategory.includes(0) ? [0] : filterCategory}
    options={categories.map(category => ({ label: category.name, value: category.id }))}
    onChange={(e) => {
        if (e.value.includes(0)) {
            setFilterCategory([0]);
        } else {
            setFilterCategory(e.value);
            console.log('Evento onChange chamado:', e.value); // Adiciona um log para depurar

        }
    }}
    placeholder="Selecione Categorias"
    className="w-full md:w-20rem bg-white border border-gray-600"
    display="chip"
/>

        </div>
    </div>
  );
};

export default TransactionFilters;
