import { useParams } from 'react-router-dom';
import { GifGallery } from '../components/GifGallery';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../components/SearchBar';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export const SearchResultsPage = () => {
    const { term } = useParams();

    usePageMeta({
        title: term ? `GIFs de ${term}` : ''
    });

    return (
        <>

            <Header />
            <div className='max-w-[1280px] mx-auto px-6'>
                <SearchBar />
                <h1 className="mx-auto max-w-[1280px] text-3xl font-bold mb-4 px-4 md:px-0">Resultados para: <Link to={`/search/${term}`}>{term}</Link></h1>
                <GifGallery searchQuery={term} />
            </div>
        </>
    );
};
