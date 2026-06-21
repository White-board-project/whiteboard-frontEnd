import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/common/utils/cn';
import { Text, textClassNames } from '../text';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export type InputFieldProps = InputProps & {
    id: string;
    label: ReactNode;
    errorMessage?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
    return (
        <input
            className={cn(
                'w-full rounded-control border border-outline-variant bg-surface px-4 py-3 text-on-surface text-sm outline-none transition placeholder:text-outline focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-fixed disabled:cursor-not-allowed disabled:opacity-70',
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
    { id, label, errorMessage, className, 'aria-describedby': ariaDescribedBy, ...props },
    ref,
) {
    const errorId = `${id}-error`;
    const describedBy = [ariaDescribedBy, errorMessage ? errorId : undefined].filter(Boolean).join(' ');

    return (
        <div className="block">
            <label className={textClassNames({ variant: 'label-sm', tone: 'muted' })} htmlFor={id}>
                {label}
            </label>
            <Input
                aria-describedby={describedBy || undefined}
                aria-invalid={errorMessage ? 'true' : 'false'}
                className={cn('mt-2', className)}
                id={id}
                ref={ref}
                {...props}
            />
            {errorMessage ? (
                <Text as="p" className="mt-2" id={errorId} tone="fieldError" variant="label-sm">
                    {errorMessage}
                </Text>
            ) : null}
        </div>
    );
});
