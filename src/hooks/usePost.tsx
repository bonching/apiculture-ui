import { useState, useCallback } from "react";

export function usePost<T = unknown>(
    options: {
        extractData?: boolean;
        headers?: Record<string, string>;
    } = {}
): {
    data: T | null;
    loading: boolean;
    error: Error | null;
    mutate: (url: string, body: any, mutateOptions?: { method?: 'POST' | 'PUT' }) => Promise<T | void>;
} {
    const { extractData = true, headers = {} } = options;
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (
        url: string,
        body: any,
        mutateOptions: { method?: 'POST' | 'PUT' } = {}
    ): Promise<T | void> => {
        if (!url || !body) {
            setLoading(false);
            return Promise.reject(new Error('URL or body missing'));
        }

        const { method = 'POST' } = mutateOptions;
        const controller = new AbortController();
        setError(null);
        setData(null); // Reset previous data
        setLoading(true);

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            const parsedData = extractData ? (result as { data: T }).data : (result as T);
            setData(parsedData);
            return parsedData;
        } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") {
                setError(err);
                return Promise.reject(err);
            }
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    }, [extractData, headers]); // Stable deps

    return { data, loading, error, mutate };
}