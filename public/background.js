/* eslint-disable no-undef */

// Adiciona um listener para mensagens recebidas do content script ou popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'accessibilityResults') {
    console.log('Resultados recebidos do content script:', message.data);

    // Simula processamento assíncrono
    setTimeout(() => {
      sendResponse({ success: true, message: 'Resultados processados com sucesso!' });
    }, 1000);

    // Retorna true para manter o canal aberto até que sendResponse seja chamado
    return true;
  }

  if (message.action === 'accessibilityError') {
    console.error('Erro recebido do content script:', message.error);

    // Simula processamento assíncrono
    setTimeout(() => {
      sendResponse({ success: false, message: 'Erro processado!' });
    }, 1000);

    // Retorna true para manter o canal aberto até que sendResponse seja chamado
    return true;
  }

  if (message.action === 'analyzeAccessibility') {
    // Obtém a aba ativa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.error("Nenhuma aba ativa encontrada.");
        sendResponse({ success: false, error: "Nenhuma aba ativa encontrada." });
        return;
      }

      const tab = tabs[0]; // Aba ativa
      const tabId = tab.id; // ID da aba ativa
      const url = tab.url; // URL da aba ativa

      if (!url || !url.startsWith("http")) {
        console.error("Página inválida. A extensão não pode ser executada aqui.");
        sendResponse({ success: false, error: "Página inválida." });
        return;
      }

      console.log("É um site válido!", url);

      // Injeta o script do axe-core na página ativa
      chrome.scripting.executeScript(
        {
          target: { tabId },
          files: ["axe.min.js"], // Certifique-se de que axe.min.js está no diretório correto
        },
        () => {
          // Executa o script para análise de acessibilidade
          chrome.scripting.executeScript(
            {
              target: { tabId },
              function: () => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] }));
                  }, 1000);
                });
              },
            },
            (results) => {
              if (chrome.runtime.lastError) {
                console.error("Erro ao executar o script:", chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
                return;
              }

              sendResponse({ success: true, results });
            }
          );
        }
      );
    });

    // Retorna true para manter o canal aberto até que sendResponse seja chamado
    return true;
  }
});