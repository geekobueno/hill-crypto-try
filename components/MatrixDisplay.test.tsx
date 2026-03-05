import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MatrixDisplay from './MatrixDisplay';
import { Matrix } from '@/lib/types';

describe('MatrixDisplay', () => {
  it('renders a 2×2 matrix correctly', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    
    render(<MatrixDisplay matrix={matrix} />);
    
    // Check that all matrix elements are displayed
    const threes = screen.getAllByText('3');
    expect(threes).toHaveLength(2);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
  
  it('renders a 3×3 matrix correctly', () => {
    const matrix: Matrix = [
      [6, 24, 1],
      [13, 16, 10],
      [20, 17, 15]
    ];
    
    render(<MatrixDisplay matrix={matrix} />);
    
    // Check that all matrix elements are displayed
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });
  
  it('displays optional label in French', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    
    render(<MatrixDisplay matrix={matrix} label="Matrice de clé" />);
    
    expect(screen.getByText('Matrice de clé')).toBeInTheDocument();
  });
  
  it('applies highlight styling when highlight prop is true', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    
    const { container } = render(<MatrixDisplay matrix={matrix} highlight={true} />);
    
    // Check that highlight classes are applied
    const brackets = container.querySelectorAll('.border-green-400');
    expect(brackets.length).toBeGreaterThan(0);
  });
  
  it('uses monospace font for proper alignment', () => {
    const matrix: Matrix = [
      [1, 11],
      [111, 1111]
    ];
    
    const { container } = render(<MatrixDisplay matrix={matrix} />);
    
    // Check that font-mono class is applied to cells
    const cells = container.querySelectorAll('.font-mono');
    expect(cells.length).toBeGreaterThan(0);
  });
  
  it('has proper ARIA labels in French for accessibility', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    
    render(<MatrixDisplay matrix={matrix} label="Matrice de test" />);
    
    // Check for ARIA label on the table
    expect(screen.getByRole('table', { name: 'Matrice de test' })).toBeInTheDocument();
    
    // Check for ARIA labels on cells (French)
    expect(screen.getByLabelText(/Élément ligne 1 colonne 1/)).toBeInTheDocument();
  });
  
  it('renders without label when label prop is not provided', () => {
    const matrix: Matrix = [
      [3, 3],
      [2, 5]
    ];
    
    const { container } = render(<MatrixDisplay matrix={matrix} />);
    
    // Check that no label element exists
    const labels = container.querySelectorAll('.text-gray-400');
    expect(labels.length).toBe(0);
  });
  
  it('handles different matrix sizes dynamically', () => {
    const matrix2x2: Matrix = [
      [1, 2],
      [3, 4]
    ];
    
    const matrix3x3: Matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    
    const { rerender } = render(<MatrixDisplay matrix={matrix2x2} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    rerender(<MatrixDisplay matrix={matrix3x3} />);
    expect(screen.getByText('9')).toBeInTheDocument();
  });
});
