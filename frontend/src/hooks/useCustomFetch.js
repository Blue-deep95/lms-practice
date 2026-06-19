import { useState, useEffect, useCallback } from 'react';
import API from '../api/api';

/**
 * A custom hook to fetch data using the API Axios instance.
 * @param {string} url The endpoint to fetch from
 * @param {object} options Axios config options (like params, headers, etc.)
 * @returns {object} { data, loading, error, refetch, setData, setError, setLoading }
 */
export default function useCustomFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // We serialize options to prevent infinite render loops if the user passes an inline object literal
  const serializedOptions = JSON.stringify(options);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const parsedOptions = serializedOptions ? JSON.parse(serializedOptions) : {};
      const response = await API.get(url, parsedOptions);
      
      if (response.data && response.data.success) {
        setData(response.data.data);
      } else {
        setData(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, [url, serializedOptions]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchData();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
    setError,
    setLoading,
  };
}
