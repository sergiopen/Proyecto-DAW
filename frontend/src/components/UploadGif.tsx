import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uploadGif } from '../services/gifService';

export const UploadGif = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage('El título es obligatorio');
      return;
    }

    if (!file) {
      setMessage('Selecciona un archivo GIF');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title.trim());

    const tagList = tags.includes(',')
      ? tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
      : [tags.trim()].filter(Boolean);

    tagList.forEach((tag) => formData.append('tags', tag));
    formData.append('gif', file);

    try {
      const data = await uploadGif(formData);
      toast.success('GIF publicado correctamente');
      setTitle('');
      setTags('');
      setFile(null);
      setPreviewUrl(null);
      navigate(`/gif/${data._id}`);
    } catch {
      setMessage('Error al subir el GIF');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-gray-800 rounded-lg shadow-lg space-y-6 text-white"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Título
        </label>
        <input
          id="title"
          type="text"
          placeholder="Introduce el título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1 ">
          Tags (separados por comas)
        </label>
        <input
          id="tags"
          type="text"
          placeholder="Ejemplo: meme, funny, gato"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="gif"
          className="block mb-2 text-sm font-semibold cursor-pointer"
        >
          Selecciona archivo GIF
        </label>
        <input
          id="gif"
          type="file"
          accept="image/gif"
          onChange={handleFileChange}
          className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-600 file:text-white
            hover:file:bg-indigo-700
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {previewUrl && (
        <div className="w-full border rounded-md overflow-hidden">
          <img src={previewUrl} alt="Vista previa del GIF seleccionado" className="w-full h-auto" />
        </div>
      )}

      {message && <p className="text-center text-red-600 font-medium">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-md text-white font-semibold text-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        Subir GIF
      </button>
    </form>
  );
};

export default UploadGif;
