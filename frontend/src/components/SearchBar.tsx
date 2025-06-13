import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGifsSuggestions } from '../services/gifService'

type Suggestion =
    | { type: 'user'; username: string; avatar: string; name: string }
    | { type: 'gif'; title: string }

export const SearchBar = () => {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const q = query.trim()
        if (q.length < 2) {
            setSuggestions([])
            return
        }

        const fetchSuggestions = async () => {
            setLoading(true)
            try {
                const res = await getGifsSuggestions(q)
                const parsedSuggestions: Suggestion[] = res.suggestions.map((item: any) =>
                    item.username
                        ? { type: 'user', username: item.username, avatar: item.avatar, name: item.name }
                        : { type: 'gif', title: item.title }
                )
                setSuggestions(parsedSuggestions)
            } catch {
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }

        fetchSuggestions()
    }, [query])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = query.trim()
        if (!trimmed) return

        setSuggestions([])
        setQuery('')

        if (trimmed.startsWith('@')) {
            const username = trimmed.slice(1)
            if (username) navigate(`/profile/${encodeURIComponent(username)}`)
        } else {
            navigate(`/search/${encodeURIComponent(trimmed)}`)
        }
    }

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setSuggestions([])
        setQuery('')

        if (suggestion.type === 'user') {
            navigate(`/profile/${encodeURIComponent(suggestion.username)}`)
        } else {
            navigate(`/search/${encodeURIComponent(suggestion.title)}`)
        }
    }

    return (
        <div className="mb-6 mx-auto max-w-[1280px] px-4 md:px-0">
            <form
                onSubmit={handleSubmit}
                className="relative w-full flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition text-black"
                autoComplete="off"
            >
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Buscar por título o @usuario"
                    className="flex-grow bg-transparent outline-none placeholder-gray-400 text-xl"
                    id="input-text"
                />
                <button
                    type="submit"
                    className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full transition cursor-pointer"
                >
                    Buscar
                </button>

                {suggestions.length > 0 && (
                    <ul
                        id="suggestions-list"
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto text-black"
                    >
                        {suggestions.map((s, i) => (
                            <li
                                key={i}
                                role="option"
                                tabIndex={0}
                                className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                                onClick={() => handleSuggestionClick(s)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        handleSuggestionClick(s)
                                    }
                                }}
                            >
                                {s.type === 'user' ? (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={s.avatar || '/default-avatar.gif'}
                                            alt={s.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg">{s.name}</span>
                                            <span>@{s.username}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="block px-2 py-1">{s.title}</div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {loading && (
                    <div className="absolute right-4 top-3 text-gray-500 text-sm select-none">
                        Cargando...
                    </div>
                )}
            </form>
        </div>
    )
}
