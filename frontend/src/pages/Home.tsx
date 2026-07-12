import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await api.get('/api/user', { validateStatus: () => true })
      return response.status
    },
    retry: false,
  })

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold">Legado Terra</h1>
      <p className="text-gray-600 dark:text-gray-400">
        {isLoading && 'checando api...'}
        {isError && 'api indisponível'}
        {data && `api respondeu ${data}`}
      </p>
    </div>
  )
}
