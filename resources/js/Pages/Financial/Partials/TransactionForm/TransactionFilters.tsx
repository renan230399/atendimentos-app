import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
//import DatePicker from 'react-datepicker';
import InputLabel from '@/Components/InputLabel';
import CategoryTreeBuilder from '@/Components/Utils/CategoryTreeBuilder';
import { TreeSelect, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { TreeNode } from 'primereact/treenode';

interface TransactionFiltersProps {
  filterDate: Date | null;
  setFilterDate: (date: Date | null) => void;
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  filterCategory: TreeSelectSelectionKeysType[];  // Ajuste aqui
  setFilterCategory: (categories: TreeSelectSelectionKeysType[]) => void;  // Ajuste aqui
  filterAccountIds: number[];
  setFilterAccountIds: (accountIds: number[]) => void;
  statusOptions: { value: string; label: string }[];
  accounts: { id: number; name: string }[];
  categories: { id: number; name: string; parent_id: number | null }[];
  selectedStatusTemplate: (option: any) => JSX.Element;
  statusOptionTemplate: (option: any) => JSX.Element;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
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
  statusOptionTemplate,
}) => {
  const groupedCategories: TreeNode[] = CategoryTreeBuilder({ categories });

  return (
    <div className="w-full flex flex-wrap">
      {/* Filtro por Data */}
      <div className='m-auto w-[12%]'>
        <InputLabel htmlFor="filter_date" className="w-full m-auto" value="Selecione um dia" />
        {/*<DatePicker
          id="filter_date"
          selected={filterDate}
          onChange={(date) => setFilterDate(date)}
          isClearable
          autoComplete='off'
          placeholderText="Selecione uma data"
          dateFormat="dd/MM/yyyy"
          className="w-full p-2 border rounded"
        />*/}
      </div>

      {/* Filtro por Tipo de Transação */}
      <div className='m-auto md:w-[10%]'>
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
      <div className='m-auto md:w-[13%]'>
        <InputLabel htmlFor="filter_status" value="Status" />
        <Dropdown
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.value || '')}
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
      <div className='m-auto md:w-[30%]'>
        <InputLabel htmlFor="filter_account" value="Contas" />
        <MultiSelect
          value={filterAccountIds.includes(0) ? [0] : filterAccountIds}
          options={[{ label: 'Ainda não definido', value: 0 }, ...accounts.map(account => ({ label: account.name, value: account.id }))]}
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
          showClear
        />
      </div>

      {/* Filtro por Categorias usando TreeSelect */}
      <div className='m-auto md:w-[30%]'>
        <InputLabel htmlFor="filter_category" value="Categorias" />
        <TreeSelect
            value={filterCategory}
            options={groupedCategories}
            onChange={(e) => {
              const selectedValue = e.value;
              if (Array.isArray(selectedValue)) {
                setFilterCategory(selectedValue);
              } else if (typeof selectedValue === 'object' && selectedValue !== null) {
                // Se for um único objeto de tipo TreeSelectSelectionKeysType
                setFilterCategory([selectedValue]);
              } else {
                setFilterCategory([]); // Garante que seja um array vazio se o valor for inválido
              }
            }}
            metaKeySelection={false}
            className="w-full md:w-20rem bg-white border border-gray-600"
            selectionMode="checkbox"
            display="chip"
            placeholder="Selecione Categorias"
            showClear
          />


      </div>
    </div>
  );
};

export default TransactionFilters;
