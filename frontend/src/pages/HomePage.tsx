import { GifGallery } from '../components/GifGallery';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../components/SearchBar';
import { usePageMeta } from '../hooks/usePageMeta';

export const HomePage = () => {
  usePageMeta({
    title: 'Inicio',
    description: 'Bienvenido a la mejor galería de GIFs',
  });

  return (
    <>
      <Header />
      <main className="max-w-[1280px] mx-auto px-6">
        <SearchBar />
        <GifGallery />
      </main>
    </>
  );
};
