import React, { useEffect, useState } from "react";
/* global chrome */
export function Popup() {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
     
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error("Erro ao acessar as abas:", chrome.runtime.lastError);
        return;
      }
    
      if (!tabs || tabs.length === 0) {
        console.error("Nenhuma aba ativa encontrada.");
        return;
      }
    
      const tabId = tabs[0].id;
      console.log("Aba ativa encontrada:", tabId);
    
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          function: () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(window.axe.run());
              }, 1000);
            });
          }
        },
        (results) => {
          if (chrome.runtime.lastError) {
            console.error("Erro ao executar o script:", chrome.runtime.lastError);
            return;
          }
    
          console.log("Resultados de acessibilidade:", results);
          setResultados(results)
        }
      );
    });
  }, []);

  return (
    <div style={{ width: 250, padding: 10 }}>
      <h2>Problemas de Acessibilidade</h2>
      {resultados.length > 0 ? (
        <ul>
          {resultados.map((item, index) => (
            <li key={index}>{item.description}</li>
          ))}
        </ul>
      ) : (
        <p>Nenhum problema encontrado! 🎉</p>
      )}
    </div>
  );
}