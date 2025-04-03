/* eslint-disable no-undef */
// Importa as traduções do arquivo JSON
import ptBRTranslations from '../../../public/pt_BR.json';
import React, { useEffect, useState } from 'react';
import './styles.css';

// Função para traduzir uma violação usando o JSON de traduções
function traduzirViolacao(violacao) {
  // Verifica se existe uma tradução para o identificador da violação
  const traducao = ptBRTranslations.rules[violacao.id];
  if (traducao) {
    return {
      ...violacao,
      help: traducao.help || violacao.help,
      description: traducao.description || violacao.description,
    };
  }
  return violacao;
}

export function Popup() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'analyzeAccessibility' }, (response) => {
      // Usa uma função imediata assíncrona se precisar tratar algo assíncrono,
      // mas nesse caso a tradução é síncrona.
      if (response.success) {
        const violacoesTraduzidas = (response.results.violations || []).map(violacao =>
          traduzirViolacao(violacao)
        );
        setViolations(violacoesTraduzidas);
        console.log('Violations traduzidas:', violacoesTraduzidas);
      } else {
        console.error('Erro na análise:', response.error);
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
      ) : violations.length > 0 ? (
        <div className="violations-list">
          {violations.map((violation, index) => (
            <div key={index} className="violation">
              <div className="violation-header">
                <h3 className="violation-title">{violation.help}</h3>
                <span className="violation-impact">Impacto: {violation.impact}</span>
              </div>
              <p className="violation-description">
                {violation.description}
              </p>
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
