import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { ChatProvider } from './contexts/ChatContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { EscrowProvider } from './contexts/EscrowContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
        <EscrowProvider>
          <AuthProvider>
            <AdminProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </AdminProvider>
          </AuthProvider>
        </EscrowProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </StrictMode>
);