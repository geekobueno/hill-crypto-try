import { describe, it, expect } from 'vitest';
import {
  charToNumber,
  numberToChar,
  cleanText,
  getPaddingChar,
  getCharSetDescription,
  getValidCharPattern
} from './charMapping';

describe('charMapping', () => {
  describe('charToNumber', () => {
    describe('modulo 26', () => {
      it('converts uppercase letters A-Z to 0-25', () => {
        expect(charToNumber('A', 26)).toBe(0);
        expect(charToNumber('B', 26)).toBe(1);
        expect(charToNumber('Z', 26)).toBe(25);
      });

      it('converts lowercase letters to uppercase first', () => {
        expect(charToNumber('a', 26)).toBe(0);
        expect(charToNumber('z', 26)).toBe(25);
      });

      it('returns -1 for digits in modulo 26', () => {
        expect(charToNumber('0', 26)).toBe(-1);
        expect(charToNumber('9', 26)).toBe(-1);
      });

      it('returns -1 for space in modulo 26', () => {
        expect(charToNumber(' ', 26)).toBe(-1);
      });

      it('returns -1 for special characters', () => {
        expect(charToNumber('!', 26)).toBe(-1);
        expect(charToNumber('@', 26)).toBe(-1);
      });
    });

    describe('modulo 37', () => {
      it('converts uppercase letters A-Z to 0-25', () => {
        expect(charToNumber('A', 37)).toBe(0);
        expect(charToNumber('Z', 37)).toBe(25);
      });

      it('converts digits 0-9 to 26-35', () => {
        expect(charToNumber('0', 37)).toBe(26);
        expect(charToNumber('5', 37)).toBe(31);
        expect(charToNumber('9', 37)).toBe(35);
      });

      it('converts space to 36', () => {
        expect(charToNumber(' ', 37)).toBe(36);
      });

      it('returns -1 for special characters', () => {
        expect(charToNumber('!', 37)).toBe(-1);
        expect(charToNumber('@', 37)).toBe(-1);
      });
    });
  });

  describe('numberToChar', () => {
    describe('modulo 26', () => {
      it('converts 0-25 to A-Z', () => {
        expect(numberToChar(0, 26)).toBe('A');
        expect(numberToChar(1, 26)).toBe('B');
        expect(numberToChar(25, 26)).toBe('Z');
      });

      it('returns ? for out of range numbers', () => {
        expect(numberToChar(-1, 26)).toBe('?');
        expect(numberToChar(26, 26)).toBe('?');
        expect(numberToChar(100, 26)).toBe('?');
      });
    });

    describe('modulo 37', () => {
      it('converts 0-25 to A-Z', () => {
        expect(numberToChar(0, 37)).toBe('A');
        expect(numberToChar(25, 37)).toBe('Z');
      });

      it('converts 26-35 to 0-9', () => {
        expect(numberToChar(26, 37)).toBe('0');
        expect(numberToChar(31, 37)).toBe('5');
        expect(numberToChar(35, 37)).toBe('9');
      });

      it('converts 36 to space', () => {
        expect(numberToChar(36, 37)).toBe(' ');
      });

      it('returns ? for out of range numbers', () => {
        expect(numberToChar(-1, 37)).toBe('?');
        expect(numberToChar(37, 37)).toBe('?');
      });
    });
  });

  describe('cleanText', () => {
    it('removes invalid characters for modulo 26', () => {
      expect(cleanText('Hello123!', 26)).toBe('HELLO');
      expect(cleanText('Test @#$ Message', 26)).toBe('TESTMESSAGE');
    });

    it('preserves valid characters for modulo 37', () => {
      expect(cleanText('Hello 123', 37)).toBe('Hello 123');
      expect(cleanText('Test@Message', 37)).toBe('TestMessage');
    });

    it('converts to uppercase for modulo 26', () => {
      expect(cleanText('hello', 26)).toBe('HELLO');
    });

    it('preserves case for modulo 37', () => {
      expect(cleanText('Hello', 37)).toBe('Hello');
    });
  });

  describe('getPaddingChar', () => {
    it('returns X for modulo 26', () => {
      expect(getPaddingChar(26)).toBe('X');
    });

    it('returns space for modulo 37', () => {
      expect(getPaddingChar(37)).toBe(' ');
    });
  });

  describe('getCharSetDescription', () => {
    it('returns correct description for modulo 26', () => {
      expect(getCharSetDescription(26)).toBe('A-Z (lettres uniquement)');
    });

    it('returns correct description for modulo 37', () => {
      expect(getCharSetDescription(37)).toBe('A-Z, 0-9, espace');
    });
  });

  describe('getValidCharPattern', () => {
    it('returns correct pattern for modulo 26', () => {
      expect(getValidCharPattern(26)).toBe('[^A-Za-z]');
    });

    it('returns correct pattern for modulo 37', () => {
      expect(getValidCharPattern(37)).toBe('[^A-Za-z0-9 ]');
    });
  });
});
