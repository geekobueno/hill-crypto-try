import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MatrixInput from './MatrixInput';
import { Matrix, MatrixValidation } from '@/lib/types';

describe('MatrixInput', () => {
  it('renders a 2x2 matrix grid', () => {
    const onChange = vi.fn();
    render(<MatrixInput size={2} modulo={26} onChange={onChange} />);
    
    // Should have 4 input fields for 2x2 matrix
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(4);
  });

  it('renders a 3x3 matrix grid', () => {
    const onChange = vi.fn();
    render(<MatrixInput size={3} modulo={26} onChange={onChange} />);
    
    // Should have 9 input fields for 3x3 matrix
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(9);
  });

  it('initializes with provided initial matrix', () => {
    const onChange = vi.fn();
    const initialMatrix: Matrix = [[3, 3], [2, 5]];
    render(<MatrixInput size={2} initialMatrix={initialMatrix} modulo={26} onChange={onChange} />);
    
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(inputs[0].value).toBe('3');
    expect(inputs[1].value).toBe('3');
    expect(inputs[2].value).toBe('2');
    expect(inputs[3].value).toBe('5');
  });

  it('calls onChange when a cell value changes', () => {
    const onChange = vi.fn();
    render(<MatrixInput size={2} modulo={26} onChange={onChange} />);
    
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: '5' } });
    
    expect(onChange).toHaveBeenCalled();
    const [matrix, validation] = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(matrix[0][0]).toBe(5);
  });

  it('constrains input values to [0, 25]', () => {
    const onChange = vi.fn();
    render(<MatrixInput size={2} modulo={26} onChange={onChange} />);
    
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    
    // Test upper bound
    fireEvent.change(inputs[0], { target: { value: '30' } });
    let [matrix] = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(matrix[0][0]).toBe(25);
    
    // Test lower bound (negative values should become 0)
    fireEvent.change(inputs[0], { target: { value: '-5' } });
    [matrix] = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(matrix[0][0]).toBe(0);
  });

  it('validates matrix and shows validation feedback', () => {
    const onChange = vi.fn();
    // Valid matrix: [[3, 3], [2, 5]] has det = 9, gcd(9, 26) = 1
    const validMatrix: Matrix = [[3, 3], [2, 5]];
    render(<MatrixInput size={2} initialMatrix={validMatrix} modulo={26} onChange={onChange} />);
    
    // Should show valid feedback
    expect(screen.getByText('La matrice est valide pour le chiffrement')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument(); // determinant
    expect(screen.getByText('1')).toBeInTheDocument(); // gcd
  });

  it('shows error message for invalid matrix', () => {
    const onChange = vi.fn();
    // Invalid matrix: [[2, 4], [1, 2]] has det = 0, not coprime with 26
    const invalidMatrix: Matrix = [[2, 4], [1, 2]];
    render(<MatrixInput size={2} initialMatrix={invalidMatrix} modulo={26} onChange={onChange} />);
    
    // Should show error feedback
    expect(screen.getByText(/n'est pas premier avec 26/)).toBeInTheDocument();
  });

  it('re-validates matrix on every cell change', () => {
    const onChange = vi.fn();
    render(<MatrixInput size={2} modulo={26} onChange={onChange} />);
    
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    
    // Change multiple cells to create a valid matrix
    fireEvent.change(inputs[0], { target: { value: '3' } });
    fireEvent.change(inputs[1], { target: { value: '3' } });
    fireEvent.change(inputs[2], { target: { value: '2' } });
    fireEvent.change(inputs[3], { target: { value: '5' } });
    
    // Should have called onChange for each change
    expect(onChange).toHaveBeenCalledTimes(5); // 4 changes + 1 initial
    
    // Last call should have valid matrix
    const [, validation] = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(validation.isValid).toBe(true);
  });
});
