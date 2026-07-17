import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { buildPixPayload } from '../lib/pix'

const pixPayload = buildPixPayload({
  key: '5ef95f65-0bb6-4e24-94a8-9d0d56f88500',
  name: 'Ramon Carvalho dos Santos',
  city: 'Parnamirim',
})

export default function PixDonation() {
  const [copied, setCopied] = useState(false)

  async function copyPayload() {
    await navigator.clipboard.writeText(pixPayload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center sm:flex-row sm:text-left">
      <div className="shrink-0 rounded-xl bg-white p-3">
        <QRCodeSVG value={pixPayload} size={160} />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <p className="font-mono text-sm tracking-wide text-muted-foreground">apoie o projeto</p>
          <h3 className="mt-1 font-display text-2xl">Contribua via Pix</h3>
        </div>
        <p className="text-muted-foreground">
          O Legado Terra é mantido de forma independente. Se quiser ajudar a manter no ar, escaneie
          o QR Code ou copie o código Pix — qualquer valor ajuda.
        </p>
        <button
          type="button"
          onClick={copyPayload}
          className="w-fit rounded-full border border-input px-6 py-3 font-medium text-foreground transition-opacity hover:opacity-90"
        >
          {copied ? 'Código copiado!' : 'Copiar código Pix'}
        </button>
      </div>
    </div>
  )
}
