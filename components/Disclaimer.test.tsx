import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Disclaimer from './Disclaimer';

describe('Disclaimer', () => {
  it('renders the main warning title in French', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText('À des fins éducatives uniquement')).toBeInTheDocument();
  });

  it('displays warning about Hill cipher security', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/pas sécurisé/i)).toBeInTheDocument();
    expect(screen.getByText(/ne doit jamais être utilisé/i)).toBeInTheDocument();
  });

  it('mentions Lester S. Hill and the year 1929', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/Lester S. Hill/)).toBeInTheDocument();
    expect(screen.getByText(/1929/)).toBeInTheDocument();
  });

  it('lists educational concepts in French', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/Chiffrement par substitution polyalphabétique/)).toBeInTheDocument();
    expect(screen.getByText(/Opérations matricielles en cryptographie/)).toBeInTheDocument();
    expect(screen.getByText(/Arithmétique modulaire/)).toBeInTheDocument();
    expect(screen.getByText(/Vulnérabilités des systèmes cryptographiques classiques/)).toBeInTheDocument();
  });

  it('displays warning icon', () => {
    const { container } = render(<Disclaimer />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-yellow-500');
  });

  it('uses yellow color scheme for warning aesthetic', () => {
    const { container } = render(<Disclaimer />);
    
    const yellowElements = container.querySelectorAll('[class*="yellow"]');
    expect(yellowElements.length).toBeGreaterThan(0);
  });

  it('uses monospace font for consistency', () => {
    const { container } = render(<Disclaimer />);
    
    const monoElements = container.querySelectorAll('.font-mono');
    expect(monoElements.length).toBeGreaterThan(0);
  });

  it('has proper semantic structure with heading', () => {
    render(<Disclaimer />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('À des fins éducatives uniquement');
  });

  it('displays vulnerability warning prominently', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText('Avertissement :')).toBeInTheDocument();
  });

  it('mentions known-plaintext attack vulnerability', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/attaques par texte clair connu/i)).toBeInTheDocument();
  });
});
