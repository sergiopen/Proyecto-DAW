import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername, updateUserProfile } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/layout/Header';
import { usePageMeta } from '../hooks/usePageMeta';
import { toast } from 'react-toastify';

export const EditProfilePage = () => {
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();

    usePageMeta({ title: "Editar Perfil" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const fetched = await getUserByUsername(user?.username as string);
                setUsername(fetched.user.username || '');
                setBio(fetched.user.bio || '');
            } catch {
                toast.error('Error cargando datos del perfil');
            } finally {
                setLoading(false);
            }
        };
        if (user?.username) fetchProfile();
    }, [user?.username]);

    const validateUsername = (name: string) => {
        if (!name.trim()) return 'El nombre de usuario no puede estar vacío';
        if (/\s/.test(name)) return 'El nombre de usuario no puede contener espacios';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const error = validateUsername(username);
        if (error) {
            setUsernameError(error);
            return;
        } else {
            setUsernameError('');
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('bio', bio);
            if (avatarFile) formData.append('avatar', avatarFile);

            await updateUserProfile(user?.userId as string, formData);

            toast.success('Perfil actualizado correctamente');
            await refreshUser();
            navigate(`/profile/${username}`);
        } catch {
            toast.error('Error actualizando perfil');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="text-center text-gray-800">Cargando...</p>;

    return (
        <>
            <Header />
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Editar perfil</h1>
            <main className="p-8 max-w-lg mx-auto bg-gray-800 rounded-lg shadow-lg space-y-6 text-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                            Nombre de usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-md bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                ${usernameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
                            required
                            autoComplete="off"
                        />
                        {usernameError && (
                            <p className="mt-1 text-sm text-red-500 font-medium">{usernameError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                            Biografía
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-400 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="avatar" className="block mb-2 text-sm font-semibold cursor-pointer text-gray-300">
                            Imagen de avatar
                        </label>
                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                            className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-600 file:text-white
                          hover:file:bg-indigo-700
                          focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-md text-white font-semibold text-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting && (
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
                        Guardar cambios
                    </button>
                </form>
            </main>
        </>
    );
};
