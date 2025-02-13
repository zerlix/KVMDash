import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemedApp } from './Theme';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
);