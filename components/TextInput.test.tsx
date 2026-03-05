import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from './TextInput';

describe('TextInput Component', () => {
  it('renders with label and placeholder', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="" 
        onChange={onChange} 
        label="Texte à chiffrer"
        placeholder="Entrez votre texte..."
      />
    );
    
    expect(screen.getByLabelText('Texte à chiffrer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Entrez votre texte...')).toBeInTheDocument();
  });

  it('displays error message when input is empty', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    expect(screen.getByText('Veuillez entrer du texte à chiffrer')).toBeInTheDocument();
  });

  it('does not display error when input has text', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="Hello" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    expect(screen.queryByText('Veuillez entrer du texte à chiffrer')).not.toBeInTheDocument();
  });

  it('shows character count for original text', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="Hello World!" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    expect(screen.getByText(/Caractères:/)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument(); // "Hello World!" has 12 characters
  });

  it('shows processed text count (A-Z only)', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="Hello World 123!" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    expect(screen.getByText(/Traités:/)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Only "HELLOWORLD" = 10 letters
  });

  it('displays processed text preview in uppercase A-Z only', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="Hello World 123!" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    expect(screen.getByText('HELLOWORLD')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    const textarea = screen.getByLabelText('Texte à chiffrer');
    fireEvent.change(textarea, { target: { value: 'Test' } });
    
    expect(onChange).toHaveBeenCalledWith('Test');
  });

  it('can be disabled', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="Test" 
        onChange={onChange} 
        label="Texte à chiffrer"
        disabled={true}
      />
    );
    
    const textarea = screen.getByLabelText('Texte à chiffrer');
    expect(textarea).toBeDisabled();
  });

  it('shows processed text section only when there is text', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <TextInput 
        value="" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    expect(screen.queryByText('Texte traité (A-Z uniquement):')).not.toBeInTheDocument();
    
    rerender(
      <TextInput 
        value="Hello" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    expect(screen.getByText('Texte traité (A-Z uniquement):')).toBeInTheDocument();
  });

  it('handles text with no valid characters', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="123 !@#" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    // Should show 0 processed characters
    const processedCount = screen.getAllByText('0')[0]; // First occurrence is the processed count
    expect(processedCount).toBeInTheDocument();
  });

  it('has proper ARIA attributes for accessibility', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    const textarea = screen.getByLabelText('Texte à chiffrer');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'text-input-error');
  });

  it('removes ARIA error attributes when input is valid', () => {
    const onChange = vi.fn();
    render(
      <TextInput 
        value="Valid text" 
        onChange={onChange} 
        label="Texte à chiffrer"
      />
    );
    
    const textarea = screen.getByLabelText('Texte à chiffrer');
    expect(textarea).toHaveAttribute('aria-invalid', 'false');
    expect(textarea).not.toHaveAttribute('aria-describedby');
  });
});
