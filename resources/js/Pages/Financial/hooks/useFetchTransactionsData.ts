import { useState, useEffect } from 'react';
import { Account, Category } from '../FinancialInterfaces';
export const useFetchTransactionsData = (accountsProp?: Account[], categoriesProp?: Category[]) => {
  const [accounts, setAccounts] = useState<Account[]>(accountsProp || []);
  const [categories, setCategories] = useState<Category[]>(categoriesProp || []);
  const [loading, setLoading] = useState(!accountsProp || !categoriesProp);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountsProp || !categoriesProp) {
      async function fetchData() {
        try {
          setLoading(true);
          const accountsResponse = await fetch('/api/accounts');
          const categoriesResponse = await fetch('/api/categories');
          
          if (!accountsResponse.ok || !categoriesResponse.ok) {
            throw new Error('Erro ao buscar dados');
          }

          const accountsData = await accountsResponse.json();
          const categoriesData = await categoriesResponse.json();

          setAccounts(accountsData);
          setCategories(categoriesData);
        } catch (err) {
          setError('Erro ao carregar dados');
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }
  }, [accountsProp, categoriesProp]);

  return { accounts, categories, loading, error };
};
