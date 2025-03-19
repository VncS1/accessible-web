/* eslint-disable no-undef */
import axe from 'axe-core';

(async () => {
  try {
    // Executa a análise de acessibilidade
    const results = await axe.run();

    console.log('Resultados de acessibilidade:', results);

    // Envia os resultados para o background script
    chrome.runtime.sendMessage(
      { action: 'accessibilityResults', data: results },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Erro ao enviar mensagem:', chrome.runtime.lastError);
          return;
        }

        console.log('Resposta do background script:', response);
      }
    );
  } catch (error) {
    console.error('Erro ao executar análise de acessibilidade:', error);

    // Envia uma mensagem de erro para o background script
    chrome.runtime.sendMessage(
      { action: 'accessibilityError', error: error.message },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Erro ao enviar mensagem de erro:', chrome.runtime.lastError);
          return;
        }

        console.log('Resposta do background script ao erro:', response);
      }
    );
  }
})();
