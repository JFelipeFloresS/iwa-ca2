import React from 'react';
import  { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from  './App';

console.log('here');

const rootElement = document.getElementById('albumsTable');
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
