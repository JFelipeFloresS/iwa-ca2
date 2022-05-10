import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import { App } from './App';

var rootElement = document.getElementById('albumsTable');
var root = createRoot(rootElement);
root.render(React.createElement(
  StrictMode,
  null,
  React.createElement(App, null)
));