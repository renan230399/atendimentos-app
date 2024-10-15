declare module 'dinero.js' {
    export default function Dinero(options: { amount: number, currency: string }): {
      toFormat: (format: string) => string;
    };
  }

  declare module 'react-datepicker/dist/portal' {
    const Portal: any;
    export default Portal;
  }
  
  