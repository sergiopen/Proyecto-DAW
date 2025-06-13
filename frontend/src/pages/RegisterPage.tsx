import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/layout/Header';
import { usePageMeta } from '../hooks/usePageMeta';

export const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, register } = useAuth();

  usePageMeta({ title: "Registro" });

  if (isAuthenticated) return <Navigate to="/" />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.username.trim()) newErrors.username = 'El usuario es obligatorio';
    else if (form.username.length > 20) newErrors.username = 'Máximo 20 caracteres';

    if (!form.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) newErrors.email = 'Email no válido';

    if (!form.password) newErrors.password = 'La contraseña es obligatoria';
    else if (form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register(form);
      setSuccess('Usuario registrado correctamente');
      setForm({ username: '', email: '', password: '' });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Registro</h2>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Usuario"
              value={form.username}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.username ? 'border-red-600' : 'border-gray-300'}`}
            />
            {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.email ? 'border-red-600' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.password ? 'border-red-600' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            Registrar
          </button>

          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
          {success && <p className="text-green-600 mt-4 text-center">{success}</p>}
        </form>
      </main>
    </div>
  );
};
