import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ToastContainer, Bounce } from 'react-toastify'
import { ThemeProvider } from '@mui/material'
import theme from './Theme.js'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ThemeProvider theme={theme}>
      <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
        />
    <App />
    </ThemeProvider>
)
