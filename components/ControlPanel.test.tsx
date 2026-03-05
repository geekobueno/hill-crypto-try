import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from './ControlPanel';

describe('ControlPanel', () => {
  const defaultProps = {
    matrixSize: 2 as 2 | 3,
    onMatrixSizeChange: vi.fn(),
    onEncrypt: vi.fn(),
    onDecrypt: vi.fn(),
    onGenerateMatrix: vi.fn(),
    encryptDisabled: false,
    decryptDisabled: false,
    isProcessing: false,
  };

  it('renders all control elements', () => {
    render(<ControlPanel {...defaultProps} />);
    
    // Check matrix size selector label
    expect(screen.getByText('Taille de la matrice')).toBeInTheDocument();
    
    // Check matrix size buttons
    expect(screen.getByText('2×2')).toBeInTheDocument();
    expect(screen.getByText('3×3')).toBeInTheDocument();
    
    // Check action buttons
    expect(screen.getByText('Chiffrer')).toBeInTheDocument();
    expect(screen.getByText('Déchiffrer')).toBeInTheDocument();
    expect(screen.getByText('Générer une matrice valide aléatoire')).toBeInTheDocument();
  });

  it('highlights the selected matrix size', () => {
    const { rerender } = render(<ControlPanel {...defaultProps} matrixSize={2} />);
    
    const button2x2 = screen.getByLabelText('Sélectionner matrice 2×2');
    const button3x3 = screen.getByLabelText('Sélectionner matrice 3×3');
    
    // 2×2 should be selected
    expect(button2x2).toHaveAttribute('aria-pressed', 'true');
    expect(button3x3).toHaveAttribute('aria-pressed', 'false');
    
    // Change to 3×3
    rerender(<ControlPanel {...defaultProps} matrixSize={3} />);
    
    expect(button2x2).toHaveAttribute('aria-pressed', 'false');
    expect(button3x3).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onMatrixSizeChange when size buttons are clicked', () => {
    const onMatrixSizeChange = vi.fn();
    render(<ControlPanel {...defaultProps} onMatrixSizeChange={onMatrixSizeChange} />);
    
    fireEvent.click(screen.getByText('3×3'));
    expect(onMatrixSizeChange).toHaveBeenCalledWith(3);
    
    fireEvent.click(screen.getByText('2×2'));
    expect(onMatrixSizeChange).toHaveBeenCalledWith(2);
  });

  it('calls onEncrypt when encrypt button is clicked', () => {
    const onEncrypt = vi.fn();
    render(<ControlPanel {...defaultProps} onEncrypt={onEncrypt} />);
    
    fireEvent.click(screen.getByText('Chiffrer'));
    expect(onEncrypt).toHaveBeenCalledTimes(1);
  });

  it('calls onDecrypt when decrypt button is clicked', () => {
    const onDecrypt = vi.fn();
    render(<ControlPanel {...defaultProps} onDecrypt={onDecrypt} />);
    
    fireEvent.click(screen.getByText('Déchiffrer'));
    expect(onDecrypt).toHaveBeenCalledTimes(1);
  });

  it('calls onGenerateMatrix when generate button is clicked', () => {
    const onGenerateMatrix = vi.fn();
    render(<ControlPanel {...defaultProps} onGenerateMatrix={onGenerateMatrix} />);
    
    fireEvent.click(screen.getByText('Générer une matrice valide aléatoire'));
    expect(onGenerateMatrix).toHaveBeenCalledTimes(1);
  });

  it('disables encrypt button when encryptDisabled is true', () => {
    render(<ControlPanel {...defaultProps} encryptDisabled={true} />);
    
    const encryptButton = screen.getByLabelText('Chiffrer le texte');
    expect(encryptButton).toBeDisabled();
    expect(encryptButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables decrypt button when decryptDisabled is true', () => {
    render(<ControlPanel {...defaultProps} decryptDisabled={true} />);
    
    const decryptButton = screen.getByLabelText('Déchiffrer le texte');
    expect(decryptButton).toBeDisabled();
    expect(decryptButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables all buttons when isProcessing is true', () => {
    render(<ControlPanel {...defaultProps} isProcessing={true} />);
    
    expect(screen.getByLabelText('Sélectionner matrice 2×2')).toBeDisabled();
    expect(screen.getByLabelText('Sélectionner matrice 3×3')).toBeDisabled();
    expect(screen.getByLabelText('Chiffrer le texte')).toBeDisabled();
    expect(screen.getByLabelText('Déchiffrer le texte')).toBeDisabled();
    expect(screen.getByLabelText('Générer une matrice valide aléatoire')).toBeDisabled();
  });

  it('shows helper text when encrypt is disabled', () => {
    render(<ControlPanel {...defaultProps} encryptDisabled={true} decryptDisabled={false} />);
    
    expect(screen.getByText('Entrez du texte pour activer le chiffrement')).toBeInTheDocument();
  });

  it('shows helper text when decrypt is disabled', () => {
    render(<ControlPanel {...defaultProps} encryptDisabled={false} decryptDisabled={true} />);
    
    expect(screen.getByText('Entrez du texte pour activer le déchiffrement')).toBeInTheDocument();
  });

  it('shows helper text when both encrypt and decrypt are disabled', () => {
    render(<ControlPanel {...defaultProps} encryptDisabled={true} decryptDisabled={true} />);
    
    expect(screen.getByText('Entrez du texte et une matrice valide pour activer les boutons')).toBeInTheDocument();
  });

  it('does not show helper text when buttons are enabled', () => {
    render(<ControlPanel {...defaultProps} encryptDisabled={false} decryptDisabled={false} />);
    
    expect(screen.queryByText(/Entrez du texte/)).not.toBeInTheDocument();
  });

  it('prevents button clicks when disabled', () => {
    const onEncrypt = vi.fn();
    const onDecrypt = vi.fn();
    const onGenerateMatrix = vi.fn();
    
    render(
      <ControlPanel 
        {...defaultProps} 
        encryptDisabled={true}
        decryptDisabled={true}
        onEncrypt={onEncrypt}
        onDecrypt={onDecrypt}
        onGenerateMatrix={onGenerateMatrix}
      />
    );
    
    fireEvent.click(screen.getByText('Chiffrer'));
    fireEvent.click(screen.getByText('Déchiffrer'));
    
    expect(onEncrypt).not.toHaveBeenCalled();
    expect(onDecrypt).not.toHaveBeenCalled();
  });

  it('prevents all interactions when isProcessing is true', () => {
    const onMatrixSizeChange = vi.fn();
    const onEncrypt = vi.fn();
    const onDecrypt = vi.fn();
    const onGenerateMatrix = vi.fn();
    
    render(
      <ControlPanel 
        {...defaultProps}
        isProcessing={true}
        onMatrixSizeChange={onMatrixSizeChange}
        onEncrypt={onEncrypt}
        onDecrypt={onDecrypt}
        onGenerateMatrix={onGenerateMatrix}
      />
    );
    
    fireEvent.click(screen.getByText('2×2'));
    fireEvent.click(screen.getByText('3×3'));
    fireEvent.click(screen.getByText('Chiffrer'));
    fireEvent.click(screen.getByText('Déchiffrer'));
    fireEvent.click(screen.getByText('Générer une matrice valide aléatoire'));
    
    expect(onMatrixSizeChange).not.toHaveBeenCalled();
    expect(onEncrypt).not.toHaveBeenCalled();
    expect(onDecrypt).not.toHaveBeenCalled();
    expect(onGenerateMatrix).not.toHaveBeenCalled();
  });
});
