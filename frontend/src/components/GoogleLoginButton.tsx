import { googleLoginUrl } from '../lib/api'

export default function GoogleLoginButton() {
  return (
    <a
      href={googleLoginUrl}
      className="flex items-center justify-center gap-3 rounded-full border border-input bg-card px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.38a4.6 4.6 0 0 1-1.99 3.02v2.5h3.22c1.89-1.74 2.99-4.3 2.99-7.33Z"
        />
        <path
          fill="#34A853"
          d="M10 20c2.7 0 4.96-.89 6.61-2.42l-3.22-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H1.08v2.59A10 10 0 0 0 10 20Z"
        />
        <path
          fill="#FBBC05"
          d="M4.4 11.9a6 6 0 0 1 0-3.8V5.5H1.08a10 10 0 0 0 0 9l3.32-2.6Z"
        />
        <path
          fill="#EA4335"
          d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.96 9.96 0 0 0 10 0 10 10 0 0 0 1.08 5.5l3.32 2.6C5.19 5.74 7.4 3.98 10 3.98Z"
        />
      </svg>
      Continuar com Google
    </a>
  )
}
