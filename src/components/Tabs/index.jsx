import React, { useState, useRef, useEffect } from 'react';
import { AccessibilityScore } from '../AcessibilityScore/index';
import './styles.css';

export function Tabs({ results }) {
  const [activeTab, setActiveTab] = useState('home');
  const tabsRef = useRef([]); // refs para controle de foco

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'violations', label: 'Violations' },
    { id: 'passes', label: 'Passes' },
    { id: 'incomplete', label: 'Incomplete' },
    { id: 'inapplicable', label: 'Inapplicable' },
  ];

  // Foca o botão da aba ativa
  useEffect(() => {
    const idx = tabs.findIndex(tab => tab.id === activeTab);
    if (tabsRef.current[idx]) tabsRef.current[idx].focus();
  }, [activeTab]);

  const onKeyDown = (e) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    let newIndex = currentIndex;
    if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % tabs.length;
    if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (newIndex !== currentIndex) {
      setActiveTab(tabs[newIndex].id);
      e.preventDefault();
    }
  };

  const renderTabContent = () => {
    const paneProps = {
      role: 'tabpanel',
      'aria-labelledby': `tab-${activeTab}`,
      tabIndex: 0
    };
    switch (activeTab) {
      case 'home':
        return (
          <div className="tab-content" {...paneProps}>
            <p>Bem-vindo ao Auditor de Acessibilidade! Abaixo você vê a pontuação geral da página:</p>
            <AccessibilityScore results={results} />
          </div>
        );
      case 'violations':
        return (
          <div className="tab-content" {...paneProps}>
            {results.violations.length > 0 ? (
              results.violations.map((item, i) => (
                <div key={i} className="violation">
                  <h3 className="violation-title">{item.help}</h3>
                  <p className="violation-description">{item.description}</p>
                </div>
              ))
            ) : (
              <p>Nenhuma violação encontrada.</p>
            )}
          </div>
        );
      case 'passes':
        return (
          <div className="tab-content" {...paneProps}>
            {results.passes.length > 0 ? (
              results.passes.map((item, i) => (
                <div key={i} className="pass">
                  <h3 className="violation-title">{item.help}</h3>
                  <p className="violation-description">{item.description}</p>
                </div>
              ))
            ) : (
              <p>Nenhum teste aprovado encontrado.</p>
            )}
          </div>
        );
      case 'incomplete':
        return (
          <div className="tab-content" {...paneProps}>
            {results.incomplete.length > 0 ? (
              results.incomplete.map((item, i) => (
                <div key={i} className="incomplete">
                  <h3 className="violation-title">{item.help}</h3>
                  <p className="violation-description">{item.description}</p>
                </div>
              ))
            ) : (
              <p>Nenhum item para revisão encontrado.</p>
            )}
          </div>
        );
      case 'inapplicable':
        return (
          <div className="tab-content" {...paneProps}>
            {results.inapplicable.length > 0 ? (
              results.inapplicable.map((item, i) => (
                <div key={i} className="inapplicable">
                  <h3 className="violation-title">{item.help}</h3>
                  <p className="violation-description">{item.description}</p>
                </div>
              ))
            ) : (
              <p>Nenhuma regra inaplicável encontrada.</p>
            )}
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
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
            ref={el => (tabsRef.current[idx] = el)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  );
}
