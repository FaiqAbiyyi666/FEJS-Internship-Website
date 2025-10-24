import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './Routes.jsx';
import './index.css';

import { LoadingProvider } from './contexts/LoadingContext.jsx';
import GlobalLoader from './components/common/GlobalLoader.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <GlobalLoader />
      <App />
    </LoadingProvider>
  </StrictMode>
);
