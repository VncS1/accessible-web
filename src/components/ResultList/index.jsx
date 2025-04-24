import React from 'react';
import './styles.css';

export function ResultList({ items, emptyMessage, showGuide = true }) {
  // Elimina duplicados por rule id
  const unique = items.filter((item, idx, arr) =>
    arr.findIndex(x => x.id === item.id) === idx
  );

  if (unique.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  return (
    <div className="result-list">
      {unique.map(item => (
        <div key={item.id} className="result-item">
          <div className="result-header">
            <h3 className="result-title">{item.help}</h3>
            {showGuide && item.helpUrl && (
              <a
                href={item.helpUrl}
                target="_blank"
                rel="noreferrer"
                className="result-guide"
              >
                Ver guia
              </a>
            )}
          </div>
          <p className="result-description">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
