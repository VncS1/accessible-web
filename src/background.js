/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Mensagem recebida no background:', message);
  if (message.action === "analyzeAccessibility") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];

      // 1. Injeta o axe-core
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["axe.min.js"],
      });

      // 2. Aguarda 500ms para garantir o carregamento
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3. Executa a análise
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return window.axe.run(document, {
            runOnly: ["wcag2a", "wcag2aa"],
          });
        },
      });

      sendResponse({
        success: true,
        results: results[0].result,
      });
    });

    return true;
  }
});
