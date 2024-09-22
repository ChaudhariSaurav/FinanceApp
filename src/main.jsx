import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './layout/Screen.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import UserRoute from './common/UserRoutes.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
  <StrictMode>
    <UserRoute>
      <Layout/>
    </UserRoute>
  </StrictMode>,
</ChakraProvider>
)
