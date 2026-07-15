import type { UseFormRegisterReturn } from 'react-hook-form'
import { formatPhoneBR } from '../../lib/formatPhone'

interface PhoneFieldProps {
  label: string
  error?: string
  registration: UseFormRegisterReturn
  placeholder?: string
}

export default function PhoneField({ label, error, registration, placeholder }: PhoneFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        type="tel"
        inputMode="numeric"
        placeholder={placeholder}
        className="rounded-lg border border-input bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:outline-none focus:ring-2"
        {...registration}
        onChange={(event) => {
          event.target.value = formatPhoneBR(event.target.value)
          registration.onChange(event)
        }}
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}
