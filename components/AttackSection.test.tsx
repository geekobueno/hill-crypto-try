import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AttackSection from './AttackSection';
import * as cryptanalysis from '@/lib/cryptanalysis';

// Mock the cryptanalysis module
vi.mock('@/lib/cryptanalysis', () => ({
  knownPlaintextAttack: vi.fn()
}));

// Mock the hillCipher module
vi.mock('@/lib/hillCipher', () => ({
  encrypt: vi.fn(() => ({ result: 'ENCRYPTED', steps: [], keyMatrix: [[1, 0], [0, 1]] }))
}));

const mockKnownPlaintextAttack = vi.mocked(cryptanalysis.knownPlaintextAttack);

beforeEach(() => {
  // Reset mock before each test
  mockKnownPlaintextAttack.mockReset();
  
  // Default implementation: return a valid matrix if all pairs have sufficient length
  mockKnownPlaintextAttack.mockImplementation((pairs, matrixSize) => {
    const allValid = pairs.every((pair: any) => {
      const cleanPlaintext = pair.plaintext.toUpperCase().replace(/[^A-Z]/g, '');
      const cleanCiphertext = pair.ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
      return cleanPlaintext.length >= matrixSize && cleanCiphertext.length >= matrixSize;
    });
    
    if (allValid && matrixSize === 2) {
      return [[3, 3], [2, 5]];
    } else if (allValid && matrixSize === 3) {
      return [[6, 24, 1], [13, 16, 10], [20, 17, 15]];
    }
    return null;
  });
});

describe('AttackSection', () => {
  it('renders with correct title and description', () => {
    render(<AttackSection matrixSize={2} />);
    
    expect(screen.getByText('Attaque par texte clair connu')).toBeInTheDocument();
    expect(screen.getByText(/Cette section démontre comment le chiffrement de Hill peut être cassé/)).toBeInTheDocument();
  });

  it('displays security warning', () => {
    render(<AttackSection matrixSize={2} />);
    
    expect(screen.getByText('Vulnérabilité de sécurité')).toBeInTheDocument();
    expect(screen.getByText(/Cette attaque démontre pourquoi le chiffrement de Hill/)).toBeInTheDocument();
  });

  it('renders correct number of input pairs for 2x2 matrix', () => {
    render(<AttackSection matrixSize={2} />);
    
    expect(screen.getByText('Paire 1')).toBeInTheDocument();
    expect(screen.getByText('Paire 2')).toBeInTheDocument();
    expect(screen.queryByText('Paire 3')).not.toBeInTheDocument();
  });

  it('renders correct number of input pairs for 3x3 matrix', () => {
    render(<AttackSection matrixSize={3} />);
    
    expect(screen.getByText('Paire 1')).toBeInTheDocument();
    expect(screen.getByText('Paire 2')).toBeInTheDocument();
    expect(screen.getByText('Paire 3')).toBeInTheDocument();
  });

  it('displays required number of pairs in description', () => {
    const { rerender } = render(<AttackSection matrixSize={2} />);
    expect(screen.getByText(/minimum 2 paire requise/)).toBeInTheDocument();
    
    rerender(<AttackSection matrixSize={3} />);
    expect(screen.getByText(/minimum 3 paires requises/)).toBeInTheDocument();
  });

  it('allows input in plaintext and ciphertext fields', () => {
    render(<AttackSection matrixSize={2} />);
    
    const plaintextInputs = screen.getAllByPlaceholderText('Ex: HELLO');
    const ciphertextInputs = screen.getAllByPlaceholderText('Ex: HGDAL');
    
    fireEvent.change(plaintextInputs[0], { target: { value: 'HELLO' } });
    fireEvent.change(ciphertextInputs[0], { target: { value: 'HGDAL' } });
    
    expect(plaintextInputs[0]).toHaveValue('HELLO');
    expect(ciphertextInputs[0]).toHaveValue('HGDAL');
  });

  it('disables attack button when pairs are incomplete', () => {
    render(<AttackSection matrixSize={2} />);
    
    const attackButton = screen.getByRole('button', { name: /Lancer l'attaque/ });
    expect(attackButton).toBeDisabled();
  });

  it('enables attack button when all pairs have sufficient text', () => {
    render(<AttackSection matrixSize={2} />);
    
    const plaintextInputs = screen.getAllByPlaceholderText('Ex: HELLO');
    const ciphertextInputs = screen.getAllByPlaceholderText('Ex: HGDAL');
    
    // Fill in both pairs with sufficient text
    fireEvent.change(plaintextInputs[0], { target: { value: 'HE' } });
    fireEvent.change(ciphertextInputs[0], { target: { value: 'AB' } });
    fireEvent.change(plaintextInputs[1], { target: { value: 'LO' } });
    fireEvent.change(ciphertextInputs[1], { target: { value: 'CD' } });
    
    const attackButton = screen.getByRole('button', { name: /Lancer l'attaque/ });
    expect(attackButton).not.toBeDisabled();
  });

  it('displays recovered key matrix when attack succeeds', () => {
    render(<AttackSection matrixSize={2} />);
    
    const plaintextInputs = screen.getAllByPlaceholderText('Ex: HELLO');
    const ciphertextInputs = screen.getAllByPlaceholderText('Ex: HGDAL');
    
    // Fill in pairs
    fireEvent.change(plaintextInputs[0], { target: { value: 'HE' } });
    fireEvent.change(ciphertextInputs[0], { target: { value: 'AB' } });
    fireEvent.change(plaintextInputs[1], { target: { value: 'LO' } });
    fireEvent.change(ciphertextInputs[1], { target: { value: 'CD' } });
    
    // Click attack button
    const attackButton = screen.getByRole('button', { name: /Lancer l'attaque/ });
    fireEvent.click(attackButton);
    
    // Check for success message
    expect(screen.getByText('Clé récupérée avec succès !')).toBeInTheDocument();
    expect(screen.getByText('Matrice de clé récupérée')).toBeInTheDocument();
  });

  it('displays mathematical steps when attack succeeds', () => {
    render(<AttackSection matrixSize={2} />);
    
    const plaintextInputs = screen.getAllByPlaceholderText('Ex: HELLO');
    const ciphertextInputs = screen.getAllByPlaceholderText('Ex: HGDAL');
    
    // Fill in pairs
    fireEvent.change(plaintextInputs[0], { target: { value: 'HE' } });
    fireEvent.change(ciphertextInputs[0], { target: { value: 'AB' } });
    fireEvent.change(plaintextInputs[1], { target: { value: 'LO' } });
    fireEvent.change(ciphertextInputs[1], { target: { value: 'CD' } });
    
    // Click attack button
    const attackButton = screen.getByRole('button', { name: /Lancer l'attaque/ });
    fireEvent.click(attackButton);
    
    // Check for mathematical steps
    expect(screen.getByText('Étapes mathématiques de l\'attaque')).toBeInTheDocument();
    expect(screen.getByText('Étape 1 : Construction des matrices')).toBeInTheDocument();
    expect(screen.getByText('Étape 2 : Équation matricielle')).toBeInTheDocument();
    expect(screen.getByText('Étape 3 : Calcul de l\'inverse')).toBeInTheDocument();
    expect(screen.getByText('Étape 4 : Récupération de la clé')).toBeInTheDocument();
    expect(screen.getByText('Étape 5 : Vérification')).toBeInTheDocument();
  });

  it('displays security implications note when attack succeeds', () => {
    render(<AttackSection matrixSize={2} />);
    
    const plaintextInputs = screen.getAllByPlaceholderText('Ex: HELLO');
    const ciphertextInputs = screen.getAllByPlaceholderText('Ex: HGDAL');
    
    // Fill in pairs
    fireEvent.change(plaintextInputs[0], { target: { value: 'HE' } });
    fireEvent.change(ciphertextInputs[0], { target: { value: 'AB' } });
    fireEvent.change(plaintextInputs[1], { target: { value: 'LO' } });
    fireEvent.change(ciphertextInputs[1], { target: { value: 'CD' } });
    
    // Click attack button
    const attackButton = screen.getByRole('button', { name: /Lancer l'attaque/ });
    fireEvent.click(attackButton);
    
    // Check for security implications
    expect(screen.getByText('Implications pour la sécurité')).toBeInTheDocument();
    expect(screen.getByText(/Cette démonstration montre que le chiffrement de Hill est vulnérable/)).toBeInTheDocument();
  });

  it('displays formula when attack succeeds', () => {
    render(<AttackSection matrixSize={2} />);
    
    const plaintextInputs = screen.getAllByPlaceholderText('Ex: HELLO');
    const ciphertextInputs = screen.getAllByPlaceholderText('Ex: HGDAL');
    
    // Fill in pairs
    fireEvent.change(plaintextInputs[0], { target: { value: 'HE' } });
    fireEvent.change(ciphertextInputs[0], { target: { value: 'AB' } });
    fireEvent.change(plaintextInputs[1], { target: { value: 'LO' } });
    fireEvent.change(ciphertextInputs[1], { target: { value: 'CD' } });
    
    // Click attack button
    const attackButton = screen.getByRole('button', { name: /Lancer l'attaque/ });
    fireEvent.click(attackButton);
    
    // Check for formula
    expect(screen.getByText('Formule de l\'attaque :')).toBeInTheDocument();
    expect(screen.getByText('K = C × P⁻¹ (mod 26)')).toBeInTheDocument();
  });

  it('displays error message when attack fails', () => {
    // Mock the attack to return null (failure)
    mockKnownPlaintextAttack.mockReturnValueOnce(null);
    
    render(<AttackSection matrixSize={2} />);
    
    const plaintextInputs = screen.getAllByPlaceholderText('Ex: HELLO');
    const ciphertextInputs = screen.getAllByPlaceholderText('Ex: HGDAL');
    
    // Fill in both pairs with sufficient text (but attack will fail due to mock)
    fireEvent.change(plaintextInputs[0], { target: { value: 'HE' } });
    fireEvent.change(ciphertextInputs[0], { target: { value: 'AB' } });
    fireEvent.change(plaintextInputs[1], { target: { value: 'LO' } });
    fireEvent.change(ciphertextInputs[1], { target: { value: 'CD' } });
    
    // Click attack button
    const attackButton = screen.getByRole('button', { name: /Lancer l'attaque/ });
    fireEvent.click(attackButton);
    
    // Check for error message
    expect(screen.getByText('Attaque échouée')).toBeInTheDocument();
    expect(screen.getByText(/Assurez-vous que/)).toBeInTheDocument();
  });

  it('resets results when input changes after successful attack', () => {
    render(<AttackSection matrixSize={2} />);
    
    const plaintextInputs = screen.getAllByPlaceholderText('Ex: HELLO');
    const ciphertextInputs = screen.getAllByPlaceholderText('Ex: HGDAL');
    
    // Fill in pairs and perform attack
    fireEvent.change(plaintextInputs[0], { target: { value: 'HE' } });
    fireEvent.change(ciphertextInputs[0], { target: { value: 'AB' } });
    fireEvent.change(plaintextInputs[1], { target: { value: 'LO' } });
    fireEvent.change(ciphertextInputs[1], { target: { value: 'CD' } });
    
    const attackButton = screen.getByRole('button', { name: /Lancer l'attaque/ });
    fireEvent.click(attackButton);
    
    // Verify success message appears
    expect(screen.getByText('Clé récupérée avec succès !')).toBeInTheDocument();
    
    // Change input
    fireEvent.change(plaintextInputs[0], { target: { value: 'HI' } });
    
    // Success message should disappear
    expect(screen.queryByText('Clé récupérée avec succès !')).not.toBeInTheDocument();
  });

  it('updates pairs when matrix size changes', () => {
    const { rerender } = render(<AttackSection matrixSize={2} />);
    
    expect(screen.getByText('Paire 1')).toBeInTheDocument();
    expect(screen.getByText('Paire 2')).toBeInTheDocument();
    expect(screen.queryByText('Paire 3')).not.toBeInTheDocument();
    
    rerender(<AttackSection matrixSize={3} />);
    
    expect(screen.getByText('Paire 1')).toBeInTheDocument();
    expect(screen.getByText('Paire 2')).toBeInTheDocument();
    expect(screen.getByText('Paire 3')).toBeInTheDocument();
  });
});
