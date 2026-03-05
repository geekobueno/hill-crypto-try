import { ModuloType } from './types';

/**
 * Character mapping utilities for different modulo types.
 * 
 * Modulo 26: A-Z (0-25)
 * Modulo 37: A-Z (0-25), 0-9 (26-35), space (36)
 */

/**
 * Converts a character to its numeric value based on the modulo type.
 * 
 * @param char - Single character to convert
 * @param modulo - Modulo type (26 or 37)
 * @returns Numeric value or -1 if character is not supported
 */
export function charToNumber(char: string, modulo: ModuloType): number {
  const upperChar = char.toUpperCase();
  
  // Letters A-Z (0-25) - supported in both modulos
  if (upperChar >= 'A' && upperChar <= 'Z') {
    return upperChar.charCodeAt(0) - 'A'.charCodeAt(0);
  }
  
  // For modulo 37, also support digits and space
  if (modulo === 37) {
    // Digits 0-9 (26-35)
    if (char >= '0' && char <= '9') {
      return 26 + parseInt(char, 10);
    }
    
    // Space (36)
    if (char === ' ') {
      return 36;
    }
  }
  
  return -1; // Unsupported character
}

/**
 * Converts a numeric value to its character based on the modulo type.
 * 
 * @param num - Numeric value to convert
 * @param modulo - Modulo type (26 or 37)
 * @returns Character or '?' if value is out of range
 */
export function numberToChar(num: number, modulo: ModuloType): string {
  // Ensure number is in valid range
  if (num < 0 || num >= modulo) {
    return '?';
  }
  
  // Letters A-Z (0-25)
  if (num <= 25) {
    return String.fromCharCode(num + 'A'.charCodeAt(0));
  }
  
  // For modulo 37
  if (modulo === 37) {
    // Digits 0-9 (26-35)
    if (num >= 26 && num <= 35) {
      return (num - 26).toString();
    }
    
    // Space (36)
    if (num === 36) {
      return ' ';
    }
  }
  
  return '?';
}

/**
 * Cleans text to only include valid characters for the given modulo.
 * 
 * @param text - Text to clean
 * @param modulo - Modulo type (26 or 37)
 * @returns Cleaned text with only valid characters
 */
export function cleanText(text: string, modulo: ModuloType): string {
  let cleaned = '';
  
  for (const char of text) {
    if (charToNumber(char, modulo) !== -1) {
      cleaned += modulo === 26 ? char.toUpperCase() : char;
    }
  }
  
  return cleaned;
}

/**
 * Gets the padding character for the given modulo.
 * 
 * @param modulo - Modulo type (26 or 37)
 * @returns Padding character ('X' for 26, space for 37)
 */
export function getPaddingChar(modulo: ModuloType): string {
  return modulo === 26 ? 'X' : ' ';
}

/**
 * Gets a description of the character set for the given modulo.
 * 
 * @param modulo - Modulo type (26 or 37)
 * @returns Description string
 */
export function getCharSetDescription(modulo: ModuloType): string {
  if (modulo === 26) {
    return 'A-Z (lettres uniquement)';
  } else {
    return 'A-Z, 0-9, espace';
  }
}

/**
 * Gets the valid character pattern for input validation.
 * 
 * @param modulo - Modulo type (26 or 37)
 * @returns Regex pattern string
 */
export function getValidCharPattern(modulo: ModuloType): string {
  if (modulo === 26) {
    return '[^A-Za-z]';
  } else {
    return '[^A-Za-z0-9 ]';
  }
}
