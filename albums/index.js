import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import { App } from './App';

// define albumsTable as root element and render the App element within it 
var rootElement = document.getElementById('albumsTable');
var root = createRoot(rootElement);
root.render(React.createElement(
  StrictMode,
  null,
  React.createElement(App, null)
));
