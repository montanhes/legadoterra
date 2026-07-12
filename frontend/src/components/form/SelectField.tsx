import type { UseFormRegisterReturn } from 'react-hook-form'

interface SelectFieldProps {
  label: string
  error?: string
  registration: UseFormRegisterReturn
  options: { value: string | number; label: string }[]
  placeholder?: string
}

export default function SelectField({
  label,
  error,
  registration,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <select
        className="rounded-lg border border-input bg-card px-4 py-2.5 text-foreground focus:ring-ring focus:outline-none focus:ring-2"
        {...registration}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}
