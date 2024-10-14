declare module 'dinero.js' {
    export default function Dinero(options: { amount: number, currency: string }): {
      toFormat: (format: string) => string;
    };
  }
  