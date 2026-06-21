import { InputField } from "@/common/components/ui";
import type { FieldProps } from "../../_types";

export function Field({
    id,
    label,
    name,
    placeholder,
    required = false,
    type = "text",
    disabled = false,
    autoComplete,
    registration,
    error,
}: FieldProps) {
    const inputName = registration?.name ?? name;

    return (
        <InputField
            {...(registration ?? {})}
            autoComplete={autoComplete}
            disabled={disabled}
            errorMessage={error?.message}
            id={id}
            label={label}
            name={inputName}
            placeholder={placeholder}
            required={required}
            type={type}
        />
    );
}
