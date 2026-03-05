import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AlphabetReference from './AlphabetReference';

describe('AlphabetReference', () => {
  it('renders all 26 letters of the alphabet', () => {
    render(<AlphabetReference />);
    
    // Check that all letters A-Z are present
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      expect(screen.getByText(letter)).toBeInTheDocument();
    }
  });

  it('renders all numbers 0-25', () => {
    render(<AlphabetReference />);
    
    // Check that all numbers 0-25 are present
    for (let i = 0; i < 26; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('renders the title', () => {
    render(<AlphabetReference />);
    expect(screen.getByText(/Correspondance Alphabet/i)).toBeInTheDocument();
  });

  it('renders in compact mode', () => {
    const { container } = render(<AlphabetReference compact={true} />);
    
    // In compact mode, should have flex-wrap layout
    const wrapper = container.querySelector('.flex-wrap');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders in full mode by default', () => {
    const { container } = render(<AlphabetReference />);
    
    // In full mode, should have grid layout
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('shows correct letter-number mapping', () => {
    render(<AlphabetReference />);
    
    // Test a few specific mappings
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    
    expect(screen.getByText('Z')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });
});
