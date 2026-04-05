import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch, create, and manage service records.
 * @param {string} homeId — the authenticated user's home ID
 * Returns { records, loading, error, refresh, addRecord }
 */
export function useServiceRecords(homeId) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    if (!homeId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('service_records')
        .select('*, providers(name, company)')
        .eq('home_id', homeId)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setRecords(data || []);
    } catch (err) {
      console.error('Failed to load service records:', err.message);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [homeId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (record) => {
    try {
      const { data, error: insertError } = await supabase
        .from('service_records')
        .insert({ ...record, home_id: homeId })
        .select('*, providers(name, company)');

      if (insertError) throw insertError;
      await fetchRecords();
      return { success: true };
    } catch (err) {
      console.error('Failed to add service record:', err.message);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  return { records, loading, error, refresh: fetchRecords, addRecord };
}

/**
 * Hook to get spending stats.
 * Returns { spentThisYear, totalCount }
 */
export function useServiceStats(records) {
  const currentYear = new Date().getFullYear();

  const spentThisYear = records
    .filter((r) => new Date(r.date).getFullYear() === currentYear)
    .reduce((sum, r) => sum + parseFloat(r.cost || 0), 0);

  const totalCount = records.length;

  return { spentThisYear, totalCount };
}
