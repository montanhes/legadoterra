import { EligibilityStatus } from '../types/api'

const styles: Record<EligibilityStatus, string> = {
  [EligibilityStatus.Apto]: 'bg-primary text-primary-foreground',
  [EligibilityStatus.EmCarencia]: 'bg-muted text-muted-foreground',
  [EligibilityStatus.AbaixoPeso]: 'bg-muted text-muted-foreground',
  [EligibilityStatus.AguardandoConfirmacao]: 'bg-accent text-accent-foreground',
  [EligibilityStatus.Inativo]: 'bg-destructive text-destructive-foreground',
}

interface StatusBadgeProps {
  status: EligibilityStatus
  label: string
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 font-mono text-xs ${styles[status]}`}>{label}</span>
  )
}
