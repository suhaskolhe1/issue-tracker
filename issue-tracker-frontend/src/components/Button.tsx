import React, {type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  isLoading,
                                                  variant = 'primary',
                                                  className = '',
                                                  disabled,
                                                  ...props
                                              }) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-accent text-white hover:bg-accent-hover border border-transparent",
        secondary: "bg-stone-200 text-stone-900 hover:bg-stone-300 border border-transparent",
        outline: "bg-transparent text-stone-900 hover:bg-stone-100 border border-stone-300"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Processing...' : children}
        </button>
    );
};
