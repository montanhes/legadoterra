import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import 'react-day-picker/style.css'
import { formatBrDate, isValidBrDate, parseBrDate } from '../../lib/date'

const calendarVars = {
  '--rdp-accent-color': 'var(--primary)',
  '--rdp-accent-background-color': 'var(--muted)',
  '--rdp-today-color': 'var(--primary)',
} as CSSProperties

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
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const value = (field.value as string) ?? ''
          const selected = isValidBrDate(value) ? parseBrDate(value) : undefined

          return (
            <div ref={containerRef} className="relative">
              <input
                type="text"
                readOnly
                placeholder="dd/mm/aaaa"
                value={value}
                onClick={() => setOpen((v) => !v)}
                onBlur={field.onBlur}
                className="w-full cursor-pointer rounded-lg border border-input bg-card px-4 py-2.5 pr-10 text-foreground placeholder:text-muted-foreground focus:ring-ring focus:outline-none focus:ring-2"
              />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Escolher data no calendário"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M3 10h18" />
                </svg>
              </button>

              {open && (
                <div className="absolute top-full left-0 z-20 mt-2 rounded-xl border border-border bg-card p-3 shadow-lg">
                  <DayPicker
                    mode="single"
                    locale={ptBR}
                    captionLayout="dropdown"
                    endMonth={new Date()}
                    disabled={{ after: new Date() }}
                    selected={selected}
                    defaultMonth={selected}
                    style={calendarVars}
                    onSelect={(date) => {
                      if (!date) return
                      field.onChange(formatBrDate(date))
                      setOpen(false)
                    }}
                    classNames={{
                      root: 'rdp-root text-foreground',
                      month_caption:
                        'rdp-month_caption flex items-center justify-center font-mono text-sm text-muted-foreground',
                      weekday: 'rdp-weekday text-xs font-normal text-muted-foreground',
                      day_button:
                        'rdp-day_button rounded-full transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
                      selected:
                        'rdp-selected [&_.rdp-day_button]:border-transparent [&_.rdp-day_button]:bg-primary [&_.rdp-day_button]:text-primary-foreground',
                      today: 'rdp-today text-primary',
                      outside: 'rdp-outside opacity-40',
                      disabled: 'rdp-disabled opacity-30',
                      button_previous: 'rdp-button_previous rounded-full transition-colors hover:bg-muted',
                      button_next: 'rdp-button_next rounded-full transition-colors hover:bg-muted',
                    }}
                  />
                </div>
              )}
            </div>
          )
        }}
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  )
}
