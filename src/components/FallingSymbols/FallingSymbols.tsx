import React from 'react';
import { Theme } from '../../types/theme';

interface FallingSymbolsProps {
  winner: string | null;
  theme: Theme;
}

const FallingSymbols: React.FC<FallingSymbolsProps> = ({ winner, theme }) => {
  if (!winner || winner === 'draw') return null;

  return (
    <div className="falling-symbols-container">
      <div className="falling-symbols">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="symbol-column"
            style={{
              left: `${i * 10}%`,
            }}
          >
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="falling-symbol"
                style={{
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  top: `-${50 + Math.random() * 100}px`,
                  color: theme.primary,
                }}
              >
                {winner}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FallingSymbols 