/* eslint-disable react/jsx-no-undef */
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route  } from "react-router-dom"
import Login from './login';
import Acceuil from './Acceuil';
import AuthProvider from 'react-auth-kit';
import "primereact/resources/themes/tailwind-light/theme.css";
import { QueryClient, QueryClientProvider } from 'react-query';
import createStore from 'react-auth-kit/createStore';
import { PrimeReactProvider } from 'primereact/api';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import 'primeicons/primeicons.css';
import { ConfigProvider } from 'antd';

const queryClient = new QueryClient();
const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});
function App() {

  const theme = {
    components: {
      Segmented: {
        itemSelectedBg:'green-500'
      },
    },
  }

  return (
    <ConfigProvider theme={theme}>
    <AuthProvider store={store} >
    <PrimeReactProvider>
    <QueryClientProvider client={queryClient}>
    <MantineProvider>
    <Notifications />
      <BrowserRouter>
      <Routes>
       <Route path="" element={<Login/>} />
       <Route path="login" element={<Login/>} />
       <Route path="acceuil/*" element={<Acceuil/>} />        
      </Routes>
      </BrowserRouter>
    </MantineProvider>
    </QueryClientProvider>
    </PrimeReactProvider>
    </AuthProvider>
    </ConfigProvider>
  )
}

export default App
