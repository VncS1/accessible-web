import React, { useState } from 'react';
import { AccessibilityScore } from '../AcessibilityScore';
import './styles.css';

export function Tabs({ results }) {
  const [activeTab, setActiveTab] = useState('home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="tab-content">
            <p>Bem-vindo ao Auditor de Acessibilidade! Abaixo você vê a pontuação geral da página:</p>
            <AccessibilityScore results={results} />
          </div>
        );
      case 'violations':
        return (
          <div className="tab-content">
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
          <div className="tab-content">
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
          <div className="tab-content">
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
          <div className="tab-content">
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
      <div className="tabs-header">
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
          Home
        </button>
        <button className={activeTab === 'violations' ? 'active' : ''} onClick={() => setActiveTab('violations')}>
          Violations
        </button>
        <button className={activeTab === 'passes' ? 'active' : ''} onClick={() => setActiveTab('passes')}>
          Passes
        </button>
        <button className={activeTab === 'incomplete' ? 'active' : ''} onClick={() => setActiveTab('incomplete')}>
          Incomplete
        </button>
        <button className={activeTab === 'inapplicable' ? 'active' : ''} onClick={() => setActiveTab('inapplicable')}>
          Inapplicable
        </button>
      </div>
      <div className="tabs-content">{renderTabContent()}</div>
    </div>
  );
}
