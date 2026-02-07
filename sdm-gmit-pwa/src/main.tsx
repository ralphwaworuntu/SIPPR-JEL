import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css';
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { toast } from './components/ui/Toast'

const updateSW = registerSW({
  onNeedRefresh() {
    toast.info(
      <div className="flex flex-col gap-2">
        <span>Konten baru tersedia.</span>
        <button
          onClick={() => updateSW(true)}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity w-full"
        >
          Refresh Sekarang
        </button>
      </div>
    )
  },
})

import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent aggressive refetching
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      // Global error handler for all queries
      console.error('Global Query Error:', error);
      toast.error(`Terjadi kesalahan saat memuat data: ${error.message}`);
    },
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
