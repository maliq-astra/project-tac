import { Theme } from '../types/theme';

export const useGameStyles = (theme: Theme) => {
  const containerStyle = {
    backgroundColor: theme.background,
    transition: 'background-color 0.3s ease',
  };

  const symbolButtonStyle = (isSelected: boolean) => ({
    backgroundColor: isSelected ? theme.primary : 'white',
    color: isSelected ? 'white' : theme.primary,
    borderColor: theme.primary,
    textShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
    transform: isSelected ? 'translateY(-2px)' : 'none',
    transition: 'all 0.3s ease',
  });

  return { containerStyle, symbolButtonStyle };
}; 