// Polyfills for Node.js globals in browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
}

// Make Buffer available in global scope
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
}

export {};
