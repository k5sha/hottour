import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
                <Toaster
                position="top-center"
                containerStyle={{zIndex: 999999}}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1f2937',
                        color: 'white',
                        border: '1px solid #374151',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: 'white',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: 'white',
                        },
                    },
                }}
            />
      <App />
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
