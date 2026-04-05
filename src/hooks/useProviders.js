import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch, create, update, and search providers.
 * @param {string} userId — the authenticated user's ID (providers belong to users, not homes)
 * Returns { providers, loading, error, refresh, addProvider, updateProvider, findOrCreateProvider }
 */
export function useProviders(userId) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProviders = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setProviders(data || []);
    } catch (err) {
      console.error('Failed to load providers:', err.message);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const addProvider = async (provider) => {
    try {
      const { data, error: insertError } = await supabase
        .from('providers')
        .insert({ ...provider, user_id: userId })
        .select();

      if (insertError) throw insertError;
      await fetchProviders();
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Failed to add provider:', err.message);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const updateProvider = async (id, updates) => {
    try {
      const { error: updateError } = await supabase
        .from('providers')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchProviders();
      return { success: true };
    } catch (err) {
      console.error('Failed to update provider:', err.message);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  /**
   * Find existing provider by name, or auto-create one.
   */
  const findOrCreateProvider = async (name, trade) => {
    if (!name || !name.trim()) return null;

    const trimmedName = name.trim();
    const existing = providers.find(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) return existing.id;

    const result = await addProvider({
      name: trimmedName,
      trade: trade || 'General',
    });

    return result.success ? result.data.id : null;
  };

  return {
    providers, loading, error,
    refresh: fetchProviders,
    addProvider, updateProvider, findOrCreateProvider,
  };
}
