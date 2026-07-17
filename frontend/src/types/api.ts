export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  cep: string | null
  city: string | null
  state: string | null
  lat: string | null
  lng: string | null
  clinic?: {
    id: number
    name: string
    verified: boolean
  } | null
}

export const Species = {
  Cao: 1,
  Gato: 2,
} as const
export type Species = (typeof Species)[keyof typeof Species]
export const speciesLabels: Record<Species, string> = {
  [Species.Cao]: 'Cão',
  [Species.Gato]: 'Gato',
}

export const Sex = {
  Macho: 1,
  Femea: 2,
} as const
export type Sex = (typeof Sex)[keyof typeof Sex]
export const sexLabels: Record<Sex, string> = {
  [Sex.Macho]: 'Macho',
  [Sex.Femea]: 'Fêmea',
}

export const DonationType = {
  SangueTotal: 1,
} as const
export type DonationType = (typeof DonationType)[keyof typeof DonationType]
export const donationTypeLabels: Record<DonationType, string> = {
  [DonationType.SangueTotal]: 'Sangue total',
}

export const TypingStatus = {
  NaoTestado: 1,
  Autoinformado: 2,
  ConfirmadoClinica: 3,
} as const
export type TypingStatus = (typeof TypingStatus)[keyof typeof TypingStatus]
export const typingStatusLabels: Record<TypingStatus, string> = {
  [TypingStatus.NaoTestado]: 'Não testado',
  [TypingStatus.Autoinformado]: 'Autoinformado (não confirmado)',
  [TypingStatus.ConfirmadoClinica]: 'Confirmado em clínica',
}

export const EligibilityStatus = {
  Apto: 1,
  EmCarencia: 2,
  AbaixoPeso: 3,
  AguardandoConfirmacao: 4,
  Inativo: 5,
} as const
export type EligibilityStatus = (typeof EligibilityStatus)[keyof typeof EligibilityStatus]
export const eligibilityStatusLabels: Record<EligibilityStatus, string> = {
  [EligibilityStatus.Apto]: 'Apto',
  [EligibilityStatus.EmCarencia]: 'Em carência',
  [EligibilityStatus.AbaixoPeso]: 'Abaixo do peso mínimo',
  [EligibilityStatus.AguardandoConfirmacao]: 'Aguardando confirmação',
  [EligibilityStatus.Inativo]: 'Inativo',
}

export const BloodType = {
  Dea11Positivo: 1,
  Dea11Negativo: 2,
  TipoA: 21,
  TipoB: 22,
  TipoAB: 23,
  TipoMik: 24,
} as const
export type BloodType = (typeof BloodType)[keyof typeof BloodType]
export const bloodTypeLabels: Record<BloodType, string> = {
  [BloodType.Dea11Positivo]: 'DEA 1.1 Positivo',
  [BloodType.Dea11Negativo]: 'DEA 1.1 Negativo',
  [BloodType.TipoA]: 'Tipo A',
  [BloodType.TipoB]: 'Tipo B',
  [BloodType.TipoAB]: 'Tipo AB',
  [BloodType.TipoMik]: 'Tipo Mik',
}
export const bloodTypesBySpecies: Record<Species, BloodType[]> = {
  [Species.Cao]: [BloodType.Dea11Positivo, BloodType.Dea11Negativo],
  [Species.Gato]: [BloodType.TipoA, BloodType.TipoB, BloodType.TipoAB, BloodType.TipoMik],
}

export const ReportReason = {
  TutorNaoResponde: 1,
  InformacaoFalsa: 2,
  PetNaoEhMaisDoador: 3,
  Outro: 4,
} as const
export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason]
export const reportReasonLabels: Record<ReportReason, string> = {
  [ReportReason.TutorNaoResponde]: 'Tutor não responde',
  [ReportReason.InformacaoFalsa]: 'Informação falsa',
  [ReportReason.PetNaoEhMaisDoador]: 'Pet não é mais doador',
  [ReportReason.Outro]: 'Outro',
}

export const DonationRequestStatus = {
  Aberta: 1,
  Atendida: 2,
  Expirada: 3,
} as const
export type DonationRequestStatus = (typeof DonationRequestStatus)[keyof typeof DonationRequestStatus]
export const donationRequestStatusLabels: Record<DonationRequestStatus, string> = {
  [DonationRequestStatus.Aberta]: 'Aberta',
  [DonationRequestStatus.Atendida]: 'Atendida',
  [DonationRequestStatus.Expirada]: 'Expirada',
}

export interface DonorProfile {
  id: number
  blood_type: BloodType | null
  blood_type_label: string | null
  typing_status: TypingStatus
  typing_status_label: string
  eligibility_status: EligibilityStatus
  eligibility_status_label: string
  last_donation_at: string | null
  donation_types: { value: DonationType; label: string }[]
}

export interface Pet {
  id: number
  name: string
  species: Species
  species_label: string
  sex: Sex
  sex_label: string
  breed: string | null
  weight: string | null
  birthdate: string | null
  photo_path: string | null
  castrado: boolean
  lat: string
  lng: string
  donor_profile?: DonorProfile | null
  created_at: string
}

export const ContactRequestStatus = {
  Pendente: 1,
  Aceita: 2,
  Recusada: 3,
} as const
export type ContactRequestStatus = (typeof ContactRequestStatus)[keyof typeof ContactRequestStatus]
export const contactRequestStatusLabels: Record<ContactRequestStatus, string> = {
  [ContactRequestStatus.Pendente]: 'Pendente',
  [ContactRequestStatus.Aceita]: 'Aceita',
  [ContactRequestStatus.Recusada]: 'Recusada',
}

export interface ContactRequest {
  id: number
  direction: 'sent' | 'received'
  status: ContactRequestStatus
  status_label: string
  pet: {
    id: number
    name: string
    species_label: string
  }
  requester_name: string
  target_phone: string | null
  created_at: string
}

export interface DonorSearchResult {
  id: number
  name: string
  species: Species
  species_label: string
  breed: string | null
  photo_path: string | null
  distance_km: number
  lat: number
  lng: number
  donor_profile: DonorProfile
  contact_status: ContactRequestStatus | null
  contact_status_label: string | null
  tutor: {
    name: string
    phone: string | null
  }
}

export interface DonationRequestSearchResult {
  id: number
  pet: {
    name: string
    species: Species
    species_label: string
    breed: string | null
    photo_path: string | null
  }
  blood_type_needed: BloodType | null
  blood_type_needed_label: string | null
  donation_type_label: string
  distance_km: number
  lat: number
  lng: number
  expires_at: string
  requester: {
    name: string
    phone: string | null
  }
}
