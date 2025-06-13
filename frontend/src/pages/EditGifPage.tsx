import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGifById, updateGif, deleteGif } from '../services/gifService';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/layout/Header';
import { GifPageSkeleton } from '../components/skeletons/GifPageSkeleton';
import type { Gif } from '../types/gif.types';
import { usePageMeta } from '../hooks/usePageMeta';
import { toast } from 'react-toastify';

export const EditGifPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [gif, setGif] = useState<Gif | null>(null);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    usePageMeta({
        title: gif ? `Editar: ${gif.title}` : 'Editar GIF',
    });

    useEffect(() => {
        const fetchGif = async () => {
            setLoading(true);
            setError('');
            try {
                if (!id || !isAuthenticated) {
                    setError('No autorizado');
                    setLoading(false);
                    return;
                }
                const res = await getGifById(id);
                if (res.uploadedBy?._id !== user?.userId) {
                    setError('No tienes permiso para editar este GIF.');
                    setLoading(false);
                    return;
                }
                setGif(res);
                setTitle(res.title);
                setTags(res.tags.join(', '));
            } catch {
                setError('GIF no encontrado.');
            } finally {
                setLoading(false);
            }
        };
        fetchGif();
    }, [id, user, isAuthenticated]);

    const validateInputs = () => {
        let valid = true;
        if (!title.trim()) {
            setTitleError('El título no puede estar vacío');
            valid = false;
        } else {
            setTitleError('');
        }
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateInputs()) return;

        setSubmitting(true);
        const updatedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        try {
            await updateGif(id!, { title: title.trim(), tags: updatedTags });
            toast.success('GIF actualizado correctamente');
            navigate(`/gif/${id}`);
        } catch {
            setError('Error al actualizar el GIF');
            toast.error('Error al actualizar el GIF');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm('¿Estás seguro de que quieres eliminar este GIF?');
        if (!confirm) return;
        setError('');
        try {
            await deleteGif(id!);
            toast.success('GIF eliminado correctamente');
            navigate('/');
        } catch {
            setError('Error al eliminar el GIF');
            toast.error('Error al eliminar el GIF');
        }
    };

    const formatDate = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) return <GifPageSkeleton />;
    if (error && !gif) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <>
            <Header />
            <div className="max-w-[1000px] mx-auto mt-12 px-4">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">Editar GIF</h1>

                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <img
                        src={gif?.url}
                        alt={gif?.title}
                        className="w-[500px] h-[500px] rounded mb-4 object-contain mx-auto"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>

                            <span>{gif?.views ?? 0} visualizaciones</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                            <span>{gif?.likes ?? 0} likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8 7V3M16 7V3M4 11h16M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
                            </svg>
                            <span>{gif!.createdAt ? formatDate(gif!.createdAt) : ''}</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 text-center text-red-500 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                            Título
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${titleError ? 'border-red-500' : 'border-gray-700'
                                } focus:outline-none focus:ring-2 ${titleError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                                }`}
                            disabled={submitting}
                        />
                        {titleError && (
                            <p className="mt-1 text-sm text-red-500">{titleError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                            Tags (separados por comas)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={submitting}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
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
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            )}
                            Guardar cambios
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
                            disabled={submitting}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Eliminar GIF
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
