// react-big-calendar-dnd.d.ts (na raiz do projeto)
declare module 'react-big-calendar/lib/addons/dragAndDrop' {
    import { CalendarProps } from 'react-big-calendar';
  
    interface EventDropArgs {
      event: any;
      start: Date;
      end: Date;
      allDay: boolean;
    }
  
    interface EventResizeArgs {
      event: any;
      start: Date;
      end: Date;
      allDay: boolean;
    }
  
    interface DropFromOutsideArgs {
      start: Date;
      end: Date;
      allDay: boolean;
    }
  
    const withDragAndDrop: <T>(calendar: React.ComponentType<CalendarProps<T>>) => React.ComponentType<CalendarProps<T>>;
  
    export default withDragAndDrop;
  }
  