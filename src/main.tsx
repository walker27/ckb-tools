import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router';
import { routes } from './routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { rootQueryClient } from './lib/queryClient';




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider>
        <QueryClientProvider client={rootQueryClient}>
          <RouterProvider router={routes} />
        </QueryClientProvider>
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
)
