/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📩 Mensagem recebida no background:', message);

  if (message.action === "analyzeAccessibility") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];

      try {
        console.log('🔹 Injetando axe-core...');
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["axe.min.js"],
        });

        // Aguarda um tempo para garantir que axe-core seja carregado
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log('🚀 Executando análise de acessibilidade...');
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: async () => {
            if (!window.axe) {
              console.error("⚠️ Axe-core não foi carregado corretamente.");
              return { error: "Axe-core não carregado." };
            }
            try {
              const analysis = await window.axe.run(document, {
                runOnly: ["wcag2a", "wcag2aa"],
              });
              return { success: true, results: analysis };
            } catch (error) {
              console.error("Erro ao executar análise:", error);
              return { error: error.message };
            }
          },
        });

        console.log('✅ Análise concluída, retornando os resultados.');
        console.log('Resultados obtidos:', results[0].result);
        sendResponse(results[0].result);
      } catch (error) {
        console.error("❌ Erro geral no background.js:", error);
        sendResponse({ success: false, error: error.message });
      }
    });

    return true; // Necessário para indicar resposta assíncrona
  }
});
