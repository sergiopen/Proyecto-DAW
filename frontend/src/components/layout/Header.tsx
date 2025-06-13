import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 mb-4 px-6 py-4 text-white bg-zinc-900 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        GiFlow
      </Link>

      {isAuthenticated && (
        <div className="lg:hidden flex items-center gap-2">
          <Link
            to="/upload"
            className="flex items-center gap-1 px-3 py-3 rounded-md bg-violet-600 hover:bg-violet-700 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="text-white text-sm">Subir</span>
          </Link>

          <button
            className="flex items-center justify-center p-2 rounded hover:bg-zinc-800 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      <nav className="hidden lg:flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <div className="flex gap-5">
              <Link
                to="/upload"
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-violet-600 hover:bg-violet-700 transition-colors !text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span>Subir</span>
              </Link>

              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="flex items-center group"
                  >
                    <img
                      src={user?.avatar || '/default-avatar.gif'}
                      alt={`${user?.username} foto de perfil`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="ml-2 group-hover:underline">{user?.username}</p>
                  </Link>
                </div>

                <div className="absolute right-0 top-full bg-zinc-800 border border-zinc-700 rounded-b shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 w-40 translate-x-6">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="block px-4 py-2 hover:bg-zinc-700 w-full"
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left font-bold px-4 py-2 hover:bg-zinc-700 cursor-pointer text-red-500"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Iniciar sesión
            </Link>
            <Link to="/register" className="hover:underline">
              Registro
            </Link>
          </>
        )}
      </nav>

      {menuOpen && (
        <nav className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded shadow-lg z-50 flex flex-col">
          {isAuthenticated ? (
            <>
              <Link
                to={`/profile/${user?.username}`}
                className="block px-4 py-2 hover:bg-zinc-700"
                onClick={() => setMenuOpen(false)}
              >
                Mi perfil
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-left px-4 py-2 hover:bg-zinc-700 cursor-pointer text-red-500"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-zinc-700"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 hover:bg-zinc-700"
                onClick={() => setMenuOpen(false)}
              >
                Registro
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};
