import React, { useEffect, useState } from 'react';
import './styles.css';

export function Popup() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
      { action: 'analyzeAccessibility' },
      (response) => {
        if (response.success) {
          setViolations(response.results.violations || []);
          console.log('Todos os resultados:', response.results);
        } else {
          console.log('Erro na análise:', response.error);
          setError(response.error);
        }
        setLoading(false);
      }
    );
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
      ) : violations.length > 0 ? (
        <div className="violations-list">
          {console.log("aaa")}
          {violations.map((violation, index) => (
            <div key={index} className="violation">
              <div className="violation-header">
                <h3 className="violation-title">{violation.help}</h3>
                <span className="violation-impact">Impacto: {violation.impact}</span>
              </div>
              <p className="violation-description">{violation.description}</p>
              <div className="violation-details">
                <p className="violation-help">
                  Solução: {violation.helpUrl ? (
                    <a href={violation.helpUrl} target="_blank" rel="noreferrer">
                      Ver guia
                    </a>
                  ) : 'Nenhum guia disponível'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="success-message">
          ✅ Nenhuma violação encontrada!
        </div>
      )}
    </div>
  );
}
