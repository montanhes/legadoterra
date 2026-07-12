import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts: string[] = []
  if (digits.length > 0) parts.push(digits.slice(0, 2))
  if (digits.length > 2) parts.push(digits.slice(2, 4))
  if (digits.length > 4) parts.push(digits.slice(4, 8))
  return parts.join('/')
}

interface DateFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  control: Control<T>
  error?: string
}

export default function DateField<T extends FieldValues>({
  label,
  name,
  control,
  error,
}: DateFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="text"
            inputMode="numeric"
            placeholder="dd/mm/aaaa"
            maxLength={10}
            value={(field.value as string) ?? ''}
            onChange={(e) => field.onChange(maskDate(e.target.value))}
            onBlur={field.onBlur}
            className="rounded-lg border border-input bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:outline-none focus:ring-2"
          />
        )}
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}
