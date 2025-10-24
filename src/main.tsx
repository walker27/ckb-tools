import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import './global.css'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router';
import AppRoutes from './routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { rootQueryClient } from './lib/queryClient';




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider>
        <BrowserRouter>
          <QueryClientProvider client={rootQueryClient}>
            <AppRoutes />
          </QueryClientProvider>
        </BrowserRouter>
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
)
