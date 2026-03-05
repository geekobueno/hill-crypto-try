import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResultDisplay from './ResultDisplay';

describe('ResultDisplay', () => {
  // Mock clipboard API
  const mockClipboard = {
    writeText: vi.fn(),
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });
    mockClipboard.writeText.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Display functionality', () => {
    it('should display ciphertext with default label', () => {
      render(<ResultDisplay result="HGDAL" type="ciphertext" />);
      
      expect(screen.getByText('Texte chiffré')).toBeInTheDocument();
      expect(screen.getByText('HGDAL')).toBeInTheDocument();
    });

    it('should display plaintext with default label', () => {
      render(<ResultDisplay result="HELLO" type="plaintext" />);
      
      expect(screen.getByText('Texte déchiffré')).toBeInTheDocument();
      expect(screen.getByText('HELLO')).toBeInTheDocument();
    });

    it('should display custom label when provided', () => {
      render(<ResultDisplay result="TEST" type="ciphertext" label="Résultat" />);
      
      expect(screen.getByText('Résultat')).toBeInTheDocument();
      expect(screen.queryByText('Texte chiffré')).not.toBeInTheDocument();
    });

    it('should display character count', () => {
      render(<ResultDisplay result="HELLO" type="plaintext" />);
      
      expect(screen.getByText('5 caractères')).toBeInTheDocument();
    });

    it('should display singular character count for single character', () => {
      render(<ResultDisplay result="A" type="plaintext" />);
      
      expect(screen.getByText('1 caractère')).toBeInTheDocument();
    });

    it('should handle empty result gracefully', () => {
      render(<ResultDisplay result="" type="ciphertext" />);
      
      expect(screen.getByText('Aucun résultat')).toBeInTheDocument();
      expect(screen.queryByText('Copier')).not.toBeInTheDocument();
    });
  });

  describe('Copy functionality', () => {
    it('should copy text to clipboard when button is clicked', async () => {
      render(<ResultDisplay result="HGDAL" type="ciphertext" />);
      
      const copyButton = screen.getByRole('button', { name: /copier le texte/i });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('HGDAL');
      });
    });

    it('should show success feedback after copying', async () => {
      render(<ResultDisplay result="HELLO" type="plaintext" />);
      
      const copyButton = screen.getByRole('button', { name: /copier le texte/i });
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText('✓ Copié !')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for copy button', () => {
      render(<ResultDisplay result="ACCESSIBLE" type="plaintext" />);
      
      const copyButton = screen.getByRole('button', { name: /copier le texte/i });
      expect(copyButton).toBeInTheDocument();
    });

    it('should have proper ARIA label for result region', () => {
      render(<ResultDisplay result="HELLO" type="plaintext" />);
      
      const resultRegion = screen.getByRole('region', { name: /texte déchiffré: hello/i });
      expect(resultRegion).toBeInTheDocument();
    });
  });

  describe('Styling and visual feedback', () => {
    it('should apply terminal-style cryptographic aesthetic', () => {
      const { container } = render(<ResultDisplay result="STYLED" type="ciphertext" />);
      
      const resultText = screen.getByText('STYLED');
      expect(resultText).toHaveClass('font-mono', 'text-green-400');
    });
  });

  describe('Edge cases', () => {
    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000);
      render(<ResultDisplay result={longText} type="ciphertext" />);
      
      expect(screen.getByText(longText)).toBeInTheDocument();
      expect(screen.getByText('1000 caractères')).toBeInTheDocument();
    });

    it('should handle special characters in result', () => {
      render(<ResultDisplay result="ABC123XYZ" type="plaintext" />);
      
      expect(screen.getByText('ABC123XYZ')).toBeInTheDocument();
    });
  });
});
