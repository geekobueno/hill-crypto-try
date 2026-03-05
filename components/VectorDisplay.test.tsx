import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VectorDisplay from './VectorDisplay';
import { Vector } from '@/lib/types';

describe('VectorDisplay', () => {
  describe('Basic Rendering', () => {
    it('should render a vertical vector with correct values', () => {
      const vector: Vector = [7, 4, 11];
      render(<VectorDisplay vector={vector} />);
      
      // Check that all values are displayed
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
    });

    it('should render a horizontal vector when orientation is horizontal', () => {
      const vector: Vector = [7, 4];
      const { container } = render(
        <VectorDisplay vector={vector} orientation="horizontal" />
      );
      
      // Check for horizontal flex layout
      const vectorContainer = container.querySelector('.flex-row');
      expect(vectorContainer).toBeInTheDocument();
    });

    it('should render an empty vector without errors', () => {
      const vector: Vector = [];
      const { container } = render(<VectorDisplay vector={vector} />);
      
      expect(container).toBeInTheDocument();
    });

    it('should render a single-element vector', () => {
      const vector: Vector = [13];
      render(<VectorDisplay vector={vector} />);
      
      expect(screen.getByText('13')).toBeInTheDocument();
    });
  });

  describe('Label Display', () => {
    it('should display label when provided', () => {
      const vector: Vector = [1, 2, 3];
      render(<VectorDisplay vector={vector} label="Vecteur de test" />);
      
      expect(screen.getByText('Vecteur de test')).toBeInTheDocument();
    });

    it('should not display label when not provided', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(<VectorDisplay vector={vector} />);
      
      const label = container.querySelector('.text-xs.font-mono.text-gray-400');
      expect(label).not.toBeInTheDocument();
    });
  });

  describe('Letter-to-Number Mapping', () => {
    it('should show letter mappings when showMapping is true', () => {
      const vector: Vector = [7, 4, 11, 11, 14]; // HELLO
      render(<VectorDisplay vector={vector} showMapping={true} />);
      
      expect(screen.getByText('H=7')).toBeInTheDocument();
      expect(screen.getByText('E=4')).toBeInTheDocument();
      expect(screen.getAllByText('L=11')).toHaveLength(2);
      expect(screen.getByText('O=14')).toBeInTheDocument();
    });

    it('should not show letter mappings when showMapping is false', () => {
      const vector: Vector = [7, 4, 11];
      render(<VectorDisplay vector={vector} showMapping={false} />);
      
      expect(screen.queryByText('H=7')).not.toBeInTheDocument();
    });

    it('should correctly map all letters A-Z', () => {
      // Test boundary values
      const vector: Vector = [0, 25]; // A and Z
      render(<VectorDisplay vector={vector} showMapping={true} />);
      
      expect(screen.getByText('A=0')).toBeInTheDocument();
      expect(screen.getByText('Z=25')).toBeInTheDocument();
    });

    it('should handle duplicate values in mapping', () => {
      const vector: Vector = [11, 11]; // LL
      render(<VectorDisplay vector={vector} showMapping={true} />);
      
      const mappings = screen.getAllByText('L=11');
      expect(mappings).toHaveLength(2);
    });
  });

  describe('Highlight State', () => {
    it('should apply highlight styles when highlight is true', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(
        <VectorDisplay vector={vector} highlight={true} />
      );
      
      // Check for highlight color class
      const brackets = container.querySelectorAll('.border-green-400');
      expect(brackets.length).toBeGreaterThan(0);
    });

    it('should not apply highlight styles when highlight is false', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(
        <VectorDisplay vector={vector} highlight={false} />
      );
      
      // Check for non-highlight color class
      const brackets = container.querySelectorAll('.border-green-500\\/50');
      expect(brackets.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for the vector', () => {
      const vector: Vector = [7, 4, 11];
      render(<VectorDisplay vector={vector} label="Vecteur de test" />);
      
      expect(screen.getByRole('list', { name: 'Vecteur de test' })).toBeInTheDocument();
    });

    it('should have default ARIA label when no label provided', () => {
      const vector: Vector = [1, 2, 3];
      render(<VectorDisplay vector={vector} />);
      
      expect(screen.getByRole('list', { name: 'Vecteur' })).toBeInTheDocument();
    });

    it('should have ARIA labels for each element', () => {
      const vector: Vector = [7, 4];
      render(<VectorDisplay vector={vector} />);
      
      expect(screen.getByRole('listitem', { name: 'Élément 1: 7' })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: 'Élément 2: 4' })).toBeInTheDocument();
    });

    it('should include letter mapping in ARIA labels when showMapping is true', () => {
      const vector: Vector = [7];
      render(<VectorDisplay vector={vector} showMapping={true} />);
      
      expect(screen.getByRole('listitem', { name: 'Élément 1: 7 (H)' })).toBeInTheDocument();
    });

    it('should have ARIA labels for letter mappings', () => {
      const vector: Vector = [7, 4];
      render(<VectorDisplay vector={vector} showMapping={true} />);
      
      expect(screen.getByLabelText('Correspondance: H égale 7')).toBeInTheDocument();
      expect(screen.getByLabelText('Correspondance: E égale 4')).toBeInTheDocument();
    });

    it('should mark brackets as aria-hidden', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(<VectorDisplay vector={vector} />);
      
      const brackets = container.querySelectorAll('[aria-hidden="true"]');
      expect(brackets.length).toBe(2); // Top and bottom brackets
    });
  });

  describe('Styling and Layout', () => {
    it('should use monospace font for values', () => {
      const vector: Vector = [7, 4, 11];
      const { container } = render(<VectorDisplay vector={vector} />);
      
      const elements = container.querySelectorAll('.font-mono');
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should apply terminal-style cryptographic aesthetic', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(<VectorDisplay vector={vector} />);
      
      // Check for green color scheme
      const greenElements = container.querySelectorAll('[class*="green"]');
      expect(greenElements.length).toBeGreaterThan(0);
    });

    it('should have transition classes for animations', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(<VectorDisplay vector={vector} />);
      
      const transitionElements = container.querySelectorAll('.transition-all, .transition-colors');
      expect(transitionElements.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle vector with all zeros', () => {
      const vector: Vector = [0, 0, 0];
      render(<VectorDisplay vector={vector} showMapping={true} />);
      
      expect(screen.getAllByText('0')).toHaveLength(3);
      expect(screen.getAllByText('A=0')).toHaveLength(3);
    });

    it('should handle vector with maximum values (25)', () => {
      const vector: Vector = [25, 25];
      render(<VectorDisplay vector={vector} showMapping={true} />);
      
      expect(screen.getAllByText('25')).toHaveLength(2);
      expect(screen.getAllByText('Z=25')).toHaveLength(2);
    });

    it('should handle large vectors', () => {
      const vector: Vector = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      render(<VectorDisplay vector={vector} />);
      
      vector.forEach(value => {
        expect(screen.getByText(value.toString())).toBeInTheDocument();
      });
    });
  });

  describe('Orientation', () => {
    it('should default to vertical orientation', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(<VectorDisplay vector={vector} />);
      
      const verticalContainer = container.querySelector('.flex-col');
      expect(verticalContainer).toBeInTheDocument();
    });

    it('should render horizontal brackets for horizontal orientation', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(
        <VectorDisplay vector={vector} orientation="horizontal" />
      );
      
      // Check for left and right brackets (horizontal orientation)
      const leftBracket = container.querySelector('.border-l-2.border-t-2.border-b-2');
      const rightBracket = container.querySelector('.border-r-2.border-t-2.border-b-2');
      
      expect(leftBracket).toBeInTheDocument();
      expect(rightBracket).toBeInTheDocument();
    });

    it('should render vertical brackets for vertical orientation', () => {
      const vector: Vector = [1, 2, 3];
      const { container } = render(
        <VectorDisplay vector={vector} orientation="vertical" />
      );
      
      // Check for top and bottom brackets (vertical orientation)
      const topBracket = container.querySelector('.border-l-2.border-r-2.border-t-2');
      const bottomBracket = container.querySelector('.border-l-2.border-r-2.border-b-2');
      
      expect(topBracket).toBeInTheDocument();
      expect(bottomBracket).toBeInTheDocument();
    });
  });
});
