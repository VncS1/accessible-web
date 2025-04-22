import React, { useEffect, useState } from "react";
import { Tabs } from "../Tabs/index";
import ptBR from "../../../public/pt_BR.json"; // ajuste o path conforme sua estrutura
import "./styles.css";

export function Popup() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function translateItem(item) {
    const rule = ptBR.rules[item.id];
    return {
      ...item,
      help: rule?.help || item.help,
      description: rule?.description || item.description,
    };
  }

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage(
      { action: "analyzeAccessibility" },
      (response) => {
        if (response.success) {
          const raw = response.results;
          const translated = {
            passes: (raw.passes || []).map(translateItem),
            violations: (raw.violations || []).map(translateItem),
            incomplete: (raw.incomplete || []).map(translateItem),
            inapplicable: (raw.inapplicable || []).map(translateItem),
          };
          setResults(translated);
        } else {
          setError(response.error);
        }
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="popup-container" role="main" aria-busy={loading}>
      <h1 className="popup-title">
        <span role="img" aria-label="acessibilidade">
          ♿
        </span>{" "}
        Auditor de Acessibilidade
      </h1>

      {loading ? (
        <div className="loading-container" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p>Analisando página...</p>
        </div>
      ) : error ? (
        <div className="error-message" role="alert">
          ⚠️ Erro: {error}
        </div>
      ) : results ? (
        <Tabs results={results} />
      ) : (
        <div className="success-message" role="status" aria-live="polite">
          ✅ Nenhuma violação encontrada!
        </div>
      )}
    </div>
  );
}
