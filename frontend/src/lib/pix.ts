function emv(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, '0')}${value}`
}

// CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF) — algoritmo exigido pelo BR Code (Pix).
function crc16(payload: string): string {
  let crc = 0xffff

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8

    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

interface PixPayloadOptions {
  key: string
  name: string
  city: string
  txid?: string
}

/**
 * Monta o BR Code (payload EMV) de um Pix estático — sem valor fixo, o
 * doador digita o quanto quiser no app do banco.
 */
export function buildPixPayload({ key, name, city, txid = '***' }: PixPayloadOptions): string {
  const merchantAccountInfo = emv('26', emv('00', 'BR.GOV.BCB.PIX') + emv('01', key))
  const additionalData = emv('62', emv('05', txid))

  const payload =
    emv('00', '01') +
    merchantAccountInfo +
    emv('52', '0000') +
    emv('53', '986') +
    emv('58', 'BR') +
    emv('59', name.slice(0, 25)) +
    emv('60', city.slice(0, 15)) +
    additionalData +
    '6304'

  return payload + crc16(payload)
}
