import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
    fullScreen?: boolean;
}

const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-[5px]'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = '',
    text,
    fullScreen = false
}) => {
    const spinnerStyle = sizeMap[size];

    const spinnerContent = (
        <div className={`flex ${text ? 'flex-col' : 'inline-flex'} items-center justify-center gap-3 ${className}`}>
            <div className={`relative ${spinnerStyle.split(' ')[0]} ${spinnerStyle.split(' ')[1]}`}>
                <div className={`absolute inset-0 rounded-full border-teal-100 ${spinnerStyle.split(' ')[2]}`} />
                <div className={`absolute inset-0 rounded-full border-transparent border-t-teal-600 animate-spin ${spinnerStyle.split(' ')[2]}`} />
            </div>
            {text && <p className="text-sm font-semibold text-slate-500 animate-pulse tracking-wide">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-[9999]">
                <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    {spinnerContent}
                </div>
            </div>
        );
    }

    return spinnerContent;
};
