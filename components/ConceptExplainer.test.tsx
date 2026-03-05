import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConceptExplainer from './ConceptExplainer';

describe('ConceptExplainer', () => {
  it('renders the main heading in French', () => {
    render(<ConceptExplainer />);
    
    expect(screen.getByText('Concepts clés')).toBeInTheDocument();
  });

  it('displays all default concept terms', () => {
    render(<ConceptExplainer />);
    
    expect(screen.getByText('Modulo 26 vs Modulo 37')).toBeInTheDocument();
    expect(screen.getByText('Matrices valides pour Hill')).toBeInTheDocument();
    expect(screen.getByText('Padding automatique')).toBeInTheDocument();
    expect(screen.getByText('Déterminant')).toBeInTheDocument();
    expect(screen.getByText('Inverse modulaire')).toBeInTheDocument();
    expect(screen.getByText('Coprimalité')).toBeInTheDocument();
    expect(screen.getByText('Arithmétique modulaire')).toBeInTheDocument();
    expect(screen.getByText('Matrice de clé')).toBeInTheDocument();
  });

  it('concepts are initially collapsed', () => {
    render(<ConceptExplainer />);
    
    // Definitions should not be visible initially
    expect(screen.queryByText(/Une valeur scalaire calculée/)).not.toBeInTheDocument();
  });

  it('expands concept when clicked', () => {
    render(<ConceptExplainer />);
    
    const determinantButton = screen.getByRole('button', { name: /Déterminant/ });
    fireEvent.click(determinantButton);
    
    expect(screen.getByText(/Une valeur scalaire calculée/)).toBeInTheDocument();
  });

  it('collapses concept when clicked again', () => {
    render(<ConceptExplainer />);
    
    const determinantButton = screen.getByRole('button', { name: /Déterminant/ });
    
    // Expand
    fireEvent.click(determinantButton);
    expect(screen.getByText(/Une valeur scalaire calculée/)).toBeInTheDocument();
    
    // Collapse
    fireEvent.click(determinantButton);
    expect(screen.queryByText(/Une valeur scalaire calculée/)).not.toBeInTheDocument();
  });

  it('only one concept is expanded at a time', () => {
    render(<ConceptExplainer />);
    
    const determinantButton = screen.getByRole('button', { name: /Déterminant/ });
    const inverseButton = screen.getByRole('button', { name: /Inverse modulaire/ });
    
    // Expand first concept
    fireEvent.click(determinantButton);
    expect(screen.getByText(/Une valeur scalaire calculée/)).toBeInTheDocument();
    
    // Expand second concept
    fireEvent.click(inverseButton);
    expect(screen.getByText(/Un nombre x tel que/)).toBeInTheDocument();
    
    // First concept should be collapsed
    expect(screen.queryByText(/Une valeur scalaire calculée/)).not.toBeInTheDocument();
  });

  it('displays examples when concept is expanded', () => {
    render(<ConceptExplainer />);
    
    const determinantButton = screen.getByRole('button', { name: /Déterminant/ });
    fireEvent.click(determinantButton);
    
    expect(screen.getByText('Exemple :')).toBeInTheDocument();
    expect(screen.getByText(/Pour \[\[3,3\],\[2,5\]\]/)).toBeInTheDocument();
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<ConceptExplainer />);
    
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded');
      expect(button).toHaveAttribute('aria-controls');
    });
  });

  it('updates aria-expanded when concept is toggled', () => {
    render(<ConceptExplainer />);
    
    const determinantButton = screen.getByRole('button', { name: /Déterminant/ });
    
    expect(determinantButton).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(determinantButton);
    expect(determinantButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('displays helper text in French', () => {
    render(<ConceptExplainer />);
    
    expect(screen.getByText('Cliquez sur un concept pour voir sa définition et des exemples')).toBeInTheDocument();
  });

  it('uses monospace font for consistency', () => {
    const { container } = render(<ConceptExplainer />);
    
    const monoElements = container.querySelectorAll('.font-mono');
    expect(monoElements.length).toBeGreaterThan(0);
  });

  it('uses green color scheme for cryptographic aesthetic', () => {
    const { container } = render(<ConceptExplainer />);
    
    const greenElements = container.querySelectorAll('[class*="green"]');
    expect(greenElements.length).toBeGreaterThan(0);
  });

  it('accepts custom concepts via props', () => {
    const customConcepts = [
      {
        term: 'Concept personnalisé',
        definition: 'Une définition personnalisée',
        example: 'Un exemple personnalisé'
      }
    ];
    
    render(<ConceptExplainer concepts={customConcepts} />);
    
    expect(screen.getByText('Concept personnalisé')).toBeInTheDocument();
    expect(screen.queryByText('Déterminant')).not.toBeInTheDocument();
  });

  it('handles concepts without examples', () => {
    const conceptsWithoutExamples = [
      {
        term: 'Test',
        definition: 'Une définition de test'
      }
    ];
    
    render(<ConceptExplainer concepts={conceptsWithoutExamples} />);
    
    const button = screen.getByRole('button', { name: /Test/ });
    fireEvent.click(button);
    
    expect(screen.getByText('Une définition de test')).toBeInTheDocument();
    expect(screen.queryByText('Exemple :')).not.toBeInTheDocument();
  });

  it('rotates chevron icon when expanded', () => {
    const { container } = render(<ConceptExplainer />);
    
    const determinantButton = screen.getByRole('button', { name: /Déterminant/ });
    const chevron = determinantButton.querySelector('svg');
    
    expect(chevron).not.toHaveClass('rotate-180');
    
    fireEvent.click(determinantButton);
    expect(chevron).toHaveClass('rotate-180');
  });

  it('has focus styles for keyboard navigation', () => {
    render(<ConceptExplainer />);
    
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-green-500');
    });
  });
});
