import type { UseFormRegisterReturn } from 'react-hook-form'

interface TextFieldProps {
  label: string
  type?: string
  error?: string
  registration: UseFormRegisterReturn
  placeholder?: string
}

export default function TextField({ label, type = 'text', error, registration, placeholder }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-lg border border-input bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:outline-none focus:ring-2"
        {...registration}
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}
