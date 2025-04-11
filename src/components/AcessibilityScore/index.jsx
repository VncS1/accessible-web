import React from 'react';
import './styles.css';

export function AccessibilityScore({ results }) {
  const { passes, violations, incomplete, inapplicable } = results;
  
  // Total de testes
  const total = passes.length + violations.length + incomplete.length + inapplicable.length;
  
  // Soma ponderada: cada item recebe seu peso
  const weightedSum = (passes.length * 1) + (inapplicable.length * 1) + (incomplete.length * 0.5) + (violations.length * 0);
  
  // A nota é a porcentagem da soma ponderada sobre o total de itens
  const score = total > 0 ? Math.round((weightedSum / total) * 100) : 0;
  
  let comentario = '';
  if (score >= 90) comentario = "Excelente acessibilidade!";
  else if (score >= 70) comentario = "Bom nível de acessibilidade.";
  else if (score >= 50) comentario = "Acessibilidade razoável, mas há muito a melhorar.";
  else comentario = "Baixo nível de acessibilidade. Recomendamos atenção imediata.";

  return (
    <div className="accessibility-score">
      <h2>Pontuação: {score} / 100</h2>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${score}%` }}></div>
      </div>
      <p>{comentario}</p>
    </div>
  );
}
