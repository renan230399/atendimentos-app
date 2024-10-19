import { forwardRef, useEffect, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    isFocused?: boolean;
    rows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className = '', isFocused = false, rows = 3, ...props }, ref) => {
        useEffect(() => {
            if (isFocused && ref && typeof ref !== 'function' && 'current' in ref && ref.current) {
                ref.current.focus();
            }
        }, [isFocused, ref]);

        return (
            <textarea
                {...props}
                rows={rows}
                className={
                    'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                    className
                }
                ref={ref} // Usa o ref passado diretamente
            ></textarea>
        );
    }
);

export default TextArea;
