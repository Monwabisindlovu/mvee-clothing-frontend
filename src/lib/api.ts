const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body:
        options.body && !isFormData
          ? JSON.stringify(options.body)
          : (options.body as BodyInit | null),
    });

    if (!res.ok) {
      let errorMessage = `API error: ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {}
      throw new Error(errorMessage);
    }

    if (res.status === 204) {
      return null as T;
    }

    return res.json();
  } catch (err) {
    console.error('apiFetch error:', err);
    throw err;
  }
}
