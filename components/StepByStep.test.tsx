import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StepByStep from './StepByStep';
import { CalculationStep } from '@/lib/types';

describe('StepByStep', () => {
  const mockSteps: CalculationStep[] = [
    {
      type: 'vector_conversion',
      description: 'Convertir "HELLO" en vecteurs de taille 2',
      input: { text: 'HELLO' },
      output: { vector: [7, 4, 11, 11, 14] }
    },
    {
      type: 'matrix_multiplication',
      description: 'Chiffrer le vecteur 1: [7, 4]',
      input: {
        matrix: [[3, 3], [2, 5]],
        vector: [7, 4]
      },
      output: { vector: [7, 8] },
      intermediateSteps: [
        'Ligne 0: 3*7 + 3*4 = 33 ≡ 7 (mod 26)',
        'Ligne 1: 2*7 + 5*4 = 34 ≡ 8 (mod 26)'
      ]
    },
    {
      type: 'modulo_operation',
      description: 'Appliquer modulo 26',
      input: { value: 33 },
      output: { value: 7 }
    }
  ];

  it('renders step counter in French', () => {
    render(<StepByStep steps={mockSteps} />);
    
    expect(screen.getByText('Étape 1 sur 3')).toBeInTheDocument();
  });

  it('displays current step description', () => {
    render(<StepByStep steps={mockSteps} />);
    
    expect(screen.getByText('Convertir "HELLO" en vecteurs de taille 2')).toBeInTheDocument();
  });

  it('renders Previous and Next buttons in French', () => {
    render(<StepByStep steps={mockSteps} />);
    
    expect(screen.getByRole('button', { name: /Précédent/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Suivant/i })).toBeInTheDocument();
  });

  it('disables Previous button on first step', () => {
    render(<StepByStep steps={mockSteps} />);
    
    const previousButton = screen.getByRole('button', { name: /Précédent/i });
    expect(previousButton).toBeDisabled();
  });

  it('enables Next button when not on last step', () => {
    render(<StepByStep steps={mockSteps} />);
    
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('navigates to next step when Next button is clicked', async () => {
    render(<StepByStep steps={mockSteps} />);
    
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Étape 2 sur 3')).toBeInTheDocument();
    expect(await screen.findByText('Chiffrer le vecteur 1: [7, 4]')).toBeInTheDocument();
  });

  it('navigates to previous step when Previous button is clicked', () => {
    render(<StepByStep steps={mockSteps} />);
    
    // Go to step 2
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);
    
    // Go back to step 1
    const previousButton = screen.getByRole('button', { name: /Précédent/i });
    fireEvent.click(previousButton);
    
    expect(screen.getByText('Étape 1 sur 3')).toBeInTheDocument();
    expect(screen.getByText('Convertir "HELLO" en vecteurs de taille 2')).toBeInTheDocument();
  });

  it('disables Next button on last step', () => {
    render(<StepByStep steps={mockSteps} />);
    
    // Navigate to last step
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton); // Step 2
    fireEvent.click(nextButton); // Step 3
    
    expect(screen.getByText('Étape 3 sur 3')).toBeInTheDocument();
    expect(nextButton).toBeDisabled();
  });

  it('enables Previous button when not on first step', () => {
    render(<StepByStep steps={mockSteps} />);
    
    // Navigate to step 2
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);
    
    const previousButton = screen.getByRole('button', { name: /Précédent/i });
    expect(previousButton).not.toBeDisabled();
  });

  it('displays intermediate steps when available', async () => {
    render(<StepByStep steps={mockSteps} />);
    
    // Navigate to step 2 which has intermediate steps
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);
    
    expect(await screen.findByText('Calculs intermédiaires :')).toBeInTheDocument();
    expect(screen.getByText('Ligne 0: 3*7 + 3*4 = 33 ≡ 7 (mod 26)')).toBeInTheDocument();
    expect(screen.getByText('Ligne 1: 2*7 + 5*4 = 34 ≡ 8 (mod 26)')).toBeInTheDocument();
  });

  it('renders vector conversion step layout', () => {
    render(<StepByStep steps={mockSteps} />);
    
    expect(screen.getByText('Texte d\'entrée :')).toBeInTheDocument();
    expect(screen.getByText('HELLO')).toBeInTheDocument();
    expect(screen.getByText('Vecteur numérique')).toBeInTheDocument();
  });

  it('renders matrix multiplication step layout', async () => {
    render(<StepByStep steps={mockSteps} />);
    
    // Navigate to step 2
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);
    
    expect(await screen.findByText('Matrice de clé')).toBeInTheDocument();
    expect(screen.getByText('Vecteur d\'entrée')).toBeInTheDocument();
    expect(screen.getByText('Vecteur de sortie')).toBeInTheDocument();
  });

  it('renders modulo operation step layout', async () => {
    render(<StepByStep steps={mockSteps} />);
    
    // Navigate to step 3
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    expect(await screen.findByText('33')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('(mod 26)')).toBeInTheDocument();
  });

  it('renders inverse calculation step layout', () => {
    const inverseSteps: CalculationStep[] = [
      {
        type: 'inverse_calculation',
        description: 'Calculer la matrice inverse modulo 26',
        input: { matrix: [[3, 3], [2, 5]] },
        output: { matrix: [[15, 17], [20, 9]] }
      }
    ];
    
    render(<StepByStep steps={inverseSteps} />);
    
    expect(screen.getByText('Calcul de la matrice inverse modulo 26')).toBeInTheDocument();
    expect(screen.getByText('Matrice originale')).toBeInTheDocument();
    expect(screen.getByText('Matrice inverse')).toBeInTheDocument();
    expect(screen.getByText('Vérification : M × M⁻¹ ≡ I (mod 26)')).toBeInTheDocument();
  });

  it('handles empty steps array gracefully', () => {
    render(<StepByStep steps={[]} />);
    
    expect(screen.getByText('Aucune étape de calcul disponible')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Précédent/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Suivant/i })).not.toBeInTheDocument();
  });

  it('handles single step correctly', () => {
    const singleStep: CalculationStep[] = [
      {
        type: 'vector_conversion',
        description: 'Étape unique',
        input: { text: 'A' },
        output: { vector: [0] }
      }
    ];
    
    render(<StepByStep steps={singleStep} />);
    
    expect(screen.getByText('Étape 1 sur 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Précédent/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Suivant/i })).toBeDisabled();
  });

  it('uses monospace font for terminal aesthetic', () => {
    const { container } = render(<StepByStep steps={mockSteps} />);
    
    const monoElements = container.querySelectorAll('.font-mono');
    expect(monoElements.length).toBeGreaterThan(0);
  });

  it('applies green color scheme for cryptographic aesthetic', () => {
    const { container } = render(<StepByStep steps={mockSteps} />);
    
    const greenElements = container.querySelectorAll('[class*="green"]');
    expect(greenElements.length).toBeGreaterThan(0);
  });

  it('has proper ARIA labels for accessibility', () => {
    render(<StepByStep steps={mockSteps} />);
    
    expect(screen.getByRole('button', { name: 'Étape précédente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Étape suivante' })).toBeInTheDocument();
  });

  it('updates ARIA disabled state correctly', () => {
    render(<StepByStep steps={mockSteps} />);
    
    const previousButton = screen.getByRole('button', { name: /Précédent/i });
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    
    expect(previousButton).toHaveAttribute('aria-disabled', 'true');
    expect(nextButton).toHaveAttribute('aria-disabled', 'false');
    
    // Navigate to next step
    fireEvent.click(nextButton);
    
    expect(previousButton).toHaveAttribute('aria-disabled', 'false');
  });

  it('maintains step state across re-renders', () => {
    const { rerender } = render(<StepByStep steps={mockSteps} />);
    
    // Navigate to step 2
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Étape 2 sur 3')).toBeInTheDocument();
    
    // Re-render with same props
    rerender(<StepByStep steps={mockSteps} />);
    
    // Should still be on step 2
    expect(screen.getByText('Étape 2 sur 3')).toBeInTheDocument();
  });

  it('renders all step types correctly', async () => {
    const allStepTypes: CalculationStep[] = [
      {
        type: 'vector_conversion',
        description: 'Conversion de vecteur',
        input: { text: 'AB' },
        output: { vector: [0, 1] }
      },
      {
        type: 'matrix_multiplication',
        description: 'Multiplication matricielle',
        input: { matrix: [[1, 2], [3, 4]], vector: [0, 1] },
        output: { vector: [2, 4] }
      },
      {
        type: 'modulo_operation',
        description: 'Opération modulo',
        input: { value: 28 },
        output: { value: 2 }
      },
      {
        type: 'inverse_calculation',
        description: 'Calcul d\'inverse',
        input: { matrix: [[1, 2], [3, 4]] },
        output: { matrix: [[4, 24], [23, 1]] }
      }
    ];
    
    const { rerender } = render(<StepByStep steps={allStepTypes} />);
    
    // Check each step type renders
    expect(screen.getByText('Conversion de vecteur')).toBeInTheDocument();
    
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    
    fireEvent.click(nextButton);
    expect(await screen.findByText('Multiplication matricielle')).toBeInTheDocument();
    
    fireEvent.click(nextButton);
    expect(await screen.findByText('Opération modulo')).toBeInTheDocument();
    
    fireEvent.click(nextButton);
    expect(await screen.findByText('Calcul d\'inverse')).toBeInTheDocument();
  });
});
