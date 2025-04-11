import React, { useEffect, useState } from 'react';
import { Tabs } from '../Tabs';
import './styles.css';

export function Popup() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ action: 'analyzeAccessibility' }, (response) => {
      if (response.success) {
        setResults(response.results);
      } else {
        setError(response.error);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="popup-container">
      <h1 className="popup-title">
        <span role="img" aria-label="acessibilidade">♿</span> Auditor de Acessibilidade
      </h1>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analisando página...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          ⚠️ Erro: {error}
        </div>
      ) : results ? (
        <Tabs results={results} />
      ) : (
        <div className="success-message">
          ✅ Nenhuma violação encontrada!
        </div>
      )}
    </div>
  );
}
