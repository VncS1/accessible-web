import React, { useState, useRef, useEffect } from "react";
import { AccessibilityScore } from "../AcessibilityScore/index";
import { Reviews } from "../Review/index";
import { ResultList } from "../ResultList/index";
import "./styles.css";

export function Tabs({ results, siteId }) {
  const [activeTab, setActiveTab] = useState("home");
  const tabsRef = useRef([]);
  const tabs = [
    { id: "home", label: "Home" },
    { id: "passes", label: "Aprovados" },
    { id: "violations", label: "Reprovados" },
    { id: "incomplete", label: "Incompleto" },
    { id: "inapplicable", label: "Sem Aplicação" },
    { id: "reviews", label: "Avaliações" },
  ];

  // foco acessível nas abas
  useEffect(() => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    tabsRef.current[idx]?.focus();
  }, [activeTab]);

  // navegação via setas esquerda/direita
  const onKeyDown = (e) => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    if (next !== idx) {
      setActiveTab(tabs[next].id);
      e.preventDefault();
    }
  };

  const renderTabContent = () => {
    const paneProps = {
      role: "tabpanel",
      "aria-labelledby": `tab-${activeTab}`,
      tabIndex: 0,
    };

    switch (activeTab) {
      case "home":
        return (
          <div className="tab-content" {...paneProps}>
            <p className="tab-description">
              Nesta aba <strong>Home</strong>, você verá a pontuação geral de
              acessibilidade da página, calculada a partir dos resultados
              detalhados do axe-core.
            </p>
            <AccessibilityScore results={results} />
          </div>
        );

      case "passes": {
        const passingOnly = results.passes.filter(
          (pass) => !results.violations.some((v) => v.id === pass.id)
        );
        return (
          <div className="tab-content" {...paneProps}>
            <p className="tab-description">
              Nesta aba <strong>Aprovados</strong>, listamos apenas os testes
              que passaram sem nunca apresentarem falhas.
            </p>
            <ResultList
              items={passingOnly}
              emptyMessage="Nenhum teste aprovado encontrado."
              showGuide={false}
            />
          </div>
        );
      }

      case "violations":
        return (
          <div className="tab-content" {...paneProps}>
            <p className="tab-description">
              Nesta aba <strong>Reprovados</strong>, estão todas as violações
              encontradas. Clique em “Ver guia” para acessar instruções de
              correção.
            </p>
            <ResultList
              items={results.violations}
              emptyMessage="Nenhuma violação encontrada."
              showGuide={true}
            />
          </div>
        );

      case "incomplete":
        return (
          <div className="tab-content" {...paneProps}>
            <p className="tab-description">
              Nesta aba <strong>Incompleto</strong>, são exibidos itens que não
              puderam ser avaliados com certeza e precisam de revisão manual.
            </p>
            <ResultList
              items={results.incomplete}
              emptyMessage="Nenhum item para revisão encontrado."
              showGuide={false}
            />
          </div>
        );

      case "inapplicable":
        return (
          <div className="tab-content" {...paneProps}>
            <p className="tab-description">
              Nesta aba <strong>Sem Aplicação</strong>, estão listadas as regras
              que não se aplicam à página atual.
            </p>
            <ResultList
              items={results.inapplicable}
              emptyMessage="Nenhuma regra inaplicável encontrada."
              showGuide={false}
            />
          </div>
        );

      case "reviews":
        return (
          <div className="tab-content" {...paneProps}>
            <p className="tab-description">
              Nesta aba <strong>Avaliações</strong>, você vê o feedback de
              outros usuários e pode enviar sua própria avaliação (após login).
            </p>
            <Reviews results={results} siteId={siteId} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="tabs-container">
      <div
        className="tabs-header"
        role="tablist"
        aria-label="Categorias de resultados"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
            ref={(el) => (tabsRef.current[i] = el)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
}
