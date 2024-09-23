import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './layout/Screen.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import UserRoute from './common/UserRoutes.jsx'
import './App.css'
import './Font.css'; 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
  <StrictMode>
    <UserRoute>
      <App/>
    </UserRoute>
  </StrictMode>,
</ChakraProvider>
)

