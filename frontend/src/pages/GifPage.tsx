import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGifById, incrementView } from '../services/gifService';
import { LikeButton } from '../components/LikeButton';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/layout/Header';
import { ShareSection } from '../components/ShareSection';
import { GifGallery } from '../components/GifGallery';
import { GifPageSkeleton } from '../components/skeletons/GifPageSkeleton';
import type { Gif } from '../types/gif.types';
import { usePageMeta } from '../hooks/usePageMeta';
import { toast } from 'react-toastify';

export const GifPage = () => {
  const { id } = useParams();
  const [gif, setGif] = useState<Gif | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [sizeKB, setSizeKB] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const embedCode = `<iframe src="${gif?.url}" width="500" height="500" frameBorder="0" allowFullScreen title="GIF Embed"></iframe>`;

  usePageMeta({
    title: gif?.title ? `${gif?.title}` : ''
  });

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const res = await getGifById(id as string);
        const likedByUser = res.likedBy?.includes(user?.userId) || false;
        setGif({ ...res, likedByUser });
      } catch {
        setGif(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchGif();
  }, [id, user]);

  useEffect(() => {
    const fetchGifData = async () => {
      if (!gif) return;

      try {
        const headRes = await fetch(gif.url, { method: 'HEAD' });
        const contentLength = headRes.headers.get('content-length');
        if (contentLength) setSizeKB(Math.round(Number(contentLength) / 1024));
      } catch {
        setSizeKB(null);
      }

      const img = new Image();
      img.src = gif.url;
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        setDimensions(null);
      };
    };

    fetchGifData();
  }, [gif]);

  useEffect(() => {
    window.scrollTo(0, 0);
    incrementView(id as string);
  }, [id]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) return <GifPageSkeleton />;

  if (!gif) return <div className="text-center mt-8 text-red-500">GIF no encontrado</div>;

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto mt-8 px-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">{gif.title}</h1>

        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-full md:w-[200px] flex flex-col gap-4">
            {gif.uploadedBy && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-gray-300 shadow-md">
                <Link
                  className="gap-2 items-center group inline-flex"
                  to={`/profile/${gif.uploadedBy.username}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={gif.uploadedBy.avatar || '/default-avatar.gif'}
                    alt={`Foto de perfil de ${gif.uploadedBy.username}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-m">{gif.uploadedBy.name}</span>
                    <span className="font-semibold group-hover:underline cursor-pointer">@{gif.uploadedBy.username}</span>
                  </div>
                </Link>
                {gif.uploadedBy.bio && <p className="mt-2 text-sm text-gray-400">{gif.uploadedBy.bio}</p>}
              </div>
            )}

            <div className="text-lg text-gray-300 p-3 rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 shadow-sm">
              <p>
                <strong className="text-gray-400">Visualizaciones:</strong> {gif.views}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 m-auto items-center">
            <div
              className="w-full rounded-2xl overflow-hidden shadow bg-white
                hover:bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%),linear-gradient(45deg,#ccc_25%,white_25%,white_75%,#ccc_75%)]
                hover:bg-[length:40px_40px] transition-colors duration-300 ease-in-out"
            >
              <img src={gif.url} alt={gif.title} className="w-full h-auto rounded-2xl" />
            </div>

            <div className="flex flex-wrap gap-2">
              {gif.tags.map((tag) => (
                <Link to={`/tag/${tag}`} key={tag} className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[200px] flex flex-col gap-3 items-start">
            <LikeButton
              gifId={gif._id}
              initialLikes={gif.likes}
              initiallyLiked={gif.likedByUser}
              userId={user?.userId || ''}
              isAuthenticated={isAuthenticated}
            />
            <ShareSection />

            {isAuthenticated && gif.uploadedBy?._id === user?.userId && (
              <Link
                to={`/edit/${gif._id}`}
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                Editar GIF
              </Link>
            )}
          </div>
        </div>

        <div className="m-4 text-center max-w-lg mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Compartir</h2>

          <b>Compartir enlace</b>
          <input
            type="text"
            value={window.location.href}
            readOnly
            onClick={() => {
              copyText(window.location.href)
              toast.success("Enlace copiado");
            }}
            className="w-full mb-4 p-2 border border-gray-300 rounded cursor-pointer text-blue-700 hover:bg-blue-100 transition"
            id="text-share"
          />

          <b>Insertar en tu sitio web</b>
          <input
            type="text"
            value={embedCode}
            readOnly
            onClick={() => {
              copyText(embedCode)
              toast.success("Enlace copiado");
            }}
            className="w-full p-2 border border-gray-300 rounded cursor-pointer text-blue-700 hover:bg-blue-100 transition"
            id="text-share2"
          />
        </div>

        <div className="w-full max-w-xs sm:max-w-md lg:w-lg m-auto mt-4 text-lg text-gray-200 rounded-lg p-4 bg-gradient-to-r from-purple-900 via-purple-700 to-pink-700">
          <h2 className="font-semibold mb-2 text-white">Detalles</h2>
          {sizeKB !== null && (
            <p>
              <strong>Tamaño:</strong> {sizeKB} KB
            </p>
          )}
          {dimensions && (
            <p>
              <strong>Dimensiones:</strong> {dimensions.width} x {dimensions.height} px
            </p>
          )}
          {gif.createdAt && (
            <p>
              <strong>Fecha de subida:</strong> {new Date(gif.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="mt-8 p-4">
          <h2 className="text-2xl font-semibold py-4">GIFs relacionados</h2>
          <GifGallery tag={gif.tags[0]} />
        </div>
      </div>
    </>
  );
};
