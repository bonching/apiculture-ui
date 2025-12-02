import { useState, useCallback } from "react";

export function usePost<T = unknown>(
    url: string | null,
    options: {
        extractData?: boolean;
        headers?: Record<string, string>;
    } = {}
): {
    data: T | null;
    loading: boolean;
    error: Error | null;
    mutate: (body: any) => Promise<T | void>;
} {
    const { extractData = true, headers = {} } = options;
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (body: any): Promise<T | void> => {
        if (!url || !body) {
            setLoading(false);
            return Promise.reject(new Error('URL or body missing'));
        }

        const controller = new AbortController();
        setError(null);
        setData(null); // Reset previous data
        setLoading(true);

        try {
            const response = await fetch(url, {
                method: 'POST',
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
    }, [url, extractData, headers]); // Stable deps; no body

    return { data, loading, error, mutate };
}