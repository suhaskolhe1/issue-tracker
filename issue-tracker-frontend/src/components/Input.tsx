import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-stone-900">
                    {label}
                </label>
                <input
                    ref={ref}
                    className={`
            w-full px-3 py-2 bg-white border rounded-sm text-stone-900 
            transition-colors duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            disabled:bg-stone-100 disabled:text-stone-500
            ${error ? 'border-red-500' : 'border-stone-300 hover:border-stone-400'}
            ${className}
          `}
                    {...props}
                />
                {error && <span className="text-sm text-red-600">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
