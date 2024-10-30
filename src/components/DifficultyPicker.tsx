import React, { useEffect } from 'react';
import './DifficultyPicker.css';
import { Difficulty } from '../types/game';
import { difficultyThemes } from '../types/game';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

interface DifficultyPickerProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

const DifficultyPicker: React.FC<DifficultyPickerProps> = ({ difficulty, setDifficulty }) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'impossible'];

  const handleKeyPress = (e: KeyboardEvent) => {
    const currentIndex = difficulties.indexOf(difficulty);
    
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentIndex + 1) % difficulties.length;
      setDifficulty(difficulties[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentIndex - 1 + difficulties.length) % difficulties.length;
      setDifficulty(difficulties[prevIndex]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [difficulty]); // Re-add event listener when difficulty changes

  const handlePrevClick = () => {
    const currentIndex = difficulties.indexOf(difficulty);
    const prevIndex = (currentIndex - 1 + difficulties.length) % difficulties.length;
    setDifficulty(difficulties[prevIndex]);
  };

  const handleNextClick = () => {
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
    <div className="difficulty-picker">
      <button 
        className="arrow-button left" 
        onClick={handlePrevClick}
        style={buttonStyle}
        aria-label="Previous difficulty"
      >
        <ArrowBackRoundedIcon sx={{ fontSize: 40 }} />
      </button>
      
      <div className="difficulty-display" style={displayStyle}>
        <div className={`difficulty-label ${difficulty}`}>
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