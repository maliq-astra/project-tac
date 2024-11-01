import React, { useEffect, useState, useRef } from 'react';
import './DifficultyPicker.css';
import { Difficulty } from '../../types/game';
import { difficultyThemes } from '../../types/game';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

interface DifficultyPickerProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

const DifficultyPicker: React.FC<DifficultyPickerProps> = ({ difficulty, setDifficulty }) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'impossible'];
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerAnimation = (direction: 'left' | 'right') => {
    setSlideDirection(null);
    setTimeout(() => {
      setSlideDirection(direction);
      setKey(prev => prev + 1);
    }, 10);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    const currentIndex = difficulties.indexOf(difficulty);
    
    if (e.key === 'ArrowRight') {
      triggerAnimation('right');
      const nextIndex = (currentIndex + 1) % difficulties.length;
      setDifficulty(difficulties[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      triggerAnimation('left');
      const prevIndex = (currentIndex - 1 + difficulties.length) % difficulties.length;
      setDifficulty(difficulties[prevIndex]);
    }
  };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    element.addEventListener('keydown', handleKeyPress);
    // Make the div focusable
    element.tabIndex = 0;
    
    return () => {
      element.removeEventListener('keydown', handleKeyPress);
    };
  }, [difficulty]);

  const handlePrevClick = () => {
    triggerAnimation('left');
    const currentIndex = difficulties.indexOf(difficulty);
    const prevIndex = (currentIndex - 1 + difficulties.length) % difficulties.length;
    setDifficulty(difficulties[prevIndex]);
  };

  const handleNextClick = () => {
    triggerAnimation('right');
    const currentIndex = difficulties.indexOf(difficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    setDifficulty(difficulties[nextIndex]);
  };

  const theme = difficultyThemes[difficulty];
  
  const buttonStyle = {
    color: theme.primary,
  };

  const displayStyle = {
    boxShadow: `0 4px 8px ${theme.shadow}`,
  };

  return (
    <div 
      ref={containerRef}
      className="difficulty-picker"
    >
      <button 
        className="arrow-button left" 
        onClick={handlePrevClick}
        style={buttonStyle}
        aria-label="Previous difficulty"
      >
        <ArrowBackRoundedIcon sx={{ fontSize: 40 }} />
      </button>
      
      <div className="difficulty-display" style={displayStyle}>
        <div 
          key={key} 
          className={`difficulty-label ${difficulty} ${slideDirection ? `slide-${slideDirection}` : ''}`}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>
      </div>

      <button 
        className="arrow-button right" 
        onClick={handleNextClick}
        style={buttonStyle}
        aria-label="Next difficulty"
      >
        <ArrowForwardRoundedIcon sx={{ fontSize: 40 }} />
      </button>
    </div>
  );
};

export default DifficultyPicker; 