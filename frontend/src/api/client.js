const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_URL}. Start the backend: cd backend && npm run dev`
    );
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const api = {
  signup: (body) =>
    request('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getTasks: () => request('/api/tasks'),
  createTask: (body) =>
    request('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateTaskStatus: (id, status) =>
    request(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
