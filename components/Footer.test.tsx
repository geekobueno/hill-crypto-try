import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders project information', () => {
    render(<Footer />);
    
    expect(screen.getByText('Projet Académique')).toBeInTheDocument();
    expect(screen.getByText(/CRYPTOGRAPHIE/)).toBeInTheDocument();
    expect(screen.getAllByText(/ESGIS-TOGO/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Systèmes Réseaux et Sécurité/)).toBeInTheDocument();
    expect(screen.getByText(/Master 2/)).toBeInTheDocument();
    expect(screen.getByText(/2025-2026/)).toBeInTheDocument();
  });

  it('renders all student names', () => {
    render(<Footer />);
    
    const students = [
      'EHLAN K. Etonam',
      'EZIAN Komla',
      'AFFO-DOGO Rachaad',
      'SIMTAYA Martin',
      'ABAKAR Mahamat',
      'TCHATAKOURA Bassitou'
    ];

    students.forEach(student => {
      expect(screen.getByText(student)).toBeInTheDocument();
    });
  });

  it('renders student numbers', () => {
    render(<Footer />);
    
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('renders copyright notice', () => {
    render(<Footer />);
    
    expect(screen.getByText(/© 2025-2026 ESGIS-TOGO/)).toBeInTheDocument();
  });

  it('renders team section header', () => {
    render(<Footer />);
    
    expect(screen.getByText('Équipe du projet')).toBeInTheDocument();
  });
});
