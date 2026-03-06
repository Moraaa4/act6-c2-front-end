"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/movies");

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch (_) { }

        throw new Error(errData.message || `Server returned ${response.status}: ${response.statusText}`);
      }

      const resData = await response.json();

      if (!resData.success || !Array.isArray(resData.data)) {
        throw new Error('Invalid data format received from the backend service.');
      }

      if (resData.data.length === 0) {
        throw new Error('No se encontraron películas.');
      }

      setData(resData.data);
    } catch (err: any) {
      console.error('[Frontend Error]:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = data?.filter((movie) => {
    const title = (movie.title || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    const ratingStr = movie.vote_average ? movie.vote_average.toFixed(1) : '';
    const statusText = ratingStr >= 7.0 ? 'recomendada' : 'regular';

    return title.includes(search) || statusText.includes(search) || ratingStr.includes(search);
  }) || [];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>APP de Moraaa</h1>
        <p>Ya quedo</p>
      </header>

      <main id="main-content" className="main-content">

        {/* Buscador */}
        {!loading && !error && data && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <input
              type="text"
              placeholder="Buscador por estado (ej. Recomendada) o Título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.8rem 1.5rem',
                width: '100%',
                maxWidth: '500px',
                borderRadius: '25px',
                border: '2px solid #6c5ce7',
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}
            />
          </div>
        )}

        {loading && (
          <div id="state-loading" className="state-container">
            <div className="spinner"></div>
            <p>Cargando películas populares...</p>
          </div>
        )}

        {error && !loading && (
          <div id="state-error" className="state-container">
            <div className="error-icon">⚠️</div>
            <h2 id="error-title">¡Ups! Algo salió mal.</h2>
            <p id="error-message">{error}</p>
            <button id="retry-btn" className="retry-btn" onClick={loadData}>Reintentar</button>
          </div>
        )}

        {data && !loading && (
          <div id="state-success" style={{ display: 'block', width: '100%' }}>
            { }
            <div
              id="characters-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem',
                alignItems: 'start'
              }}
            >
              {filteredData.length > 0 ? filteredData.map((movie, index) => {
                const title = movie.title || 'Título Desconocido';
                const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
                const image = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : `https://via.placeholder.com/500x750?text=Sin+Imagen`;

                const statusText = movie.vote_average >= 7.0 ? 'Recomendada' : 'Regular';
                const statusColor = movie.vote_average >= 7.0 ? '#22c55e' : '#ef4444';

                return (
                  <div key={index} className="character-card" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="card-image-wrapper">
                      <img src={image} alt={title} className="card-image tmdb-poster" loading="lazy" />
                      <div className="rating-badge">⭐ {rating}</div>
                    </div>
                    <div className="card-content">
                      <h2 className="card-title">{title}</h2>
                      <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusColor }}></span>
                        <span>Estado: {statusText}</span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                  No se encontraron resultados para la búsqueda.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
