import { forwardRef, useEffect, useRef, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    isFocused?: boolean;
    rows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className = '', isFocused = false, rows = 3, ...props }, ref) => {
        const textareaRef = ref ? (ref as React.MutableRefObject<HTMLTextAreaElement>) : useRef<HTMLTextAreaElement>(null);

        useEffect(() => {
            if (isFocused && textareaRef.current) {
                textareaRef.current.focus();
            }
        }, [isFocused]);

        return (
            <textarea
                {...props}
                rows={rows}
                className={
                    'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                    className
                }
                ref={textareaRef}
            ></textarea>
        );
    }
);

export default TextArea;
