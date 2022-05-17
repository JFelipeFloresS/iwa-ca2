import React from 'react';
import  { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import { App } from  './App';

// Define app-div as root and renders the React App within it
const rootElement = document.getElementById('app-div');
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
