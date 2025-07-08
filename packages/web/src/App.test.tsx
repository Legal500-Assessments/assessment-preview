import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the Heroes vs Villains title', () => {
    render(<App />);
    expect(screen.getByText('Heroes vs Villains')).toBeInTheDocument();
  });

  it('renders the table headers correctly', () => {
    render(<App />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Studio')).toBeInTheDocument();
  });

  it('renders all characters in the table', () => {
    render(<App />);
    
    expect(screen.getByText('Dark Shadow')).toBeInTheDocument();
    expect(screen.getByText('Professor Light')).toBeInTheDocument();
    expect(screen.getByText('Thunder Woman')).toBeInTheDocument();

    expect(screen.getByText('A mysterious vigilante who can manipulate shadows and darkness to fight crime')).toBeInTheDocument();
    expect(screen.getByText('A brilliant scientist corrupted by power, using light-based technology for evil')).toBeInTheDocument();

    expect(screen.getAllByText('Hero')).toHaveLength(5);
    expect(screen.getAllByText('Villain')).toHaveLength(5);

    expect(screen.getAllByText('Cosmic Comics')).toHaveLength(5);
    expect(screen.getAllByText('Epic Entertainment')).toHaveLength(5);
  });
}); 