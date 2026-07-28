import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const _verifyBlock = "4372656174656420627920526f62657274204272756e6e6572";

const _r = (h) => {
  let s = '';
  for (let i = 0; i < h.length; i += 2) s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
  return s;
};

Object.defineProperty(console, 'make', {
  get: () => _r(_verifyBlock),
  configurable: false,
  enumerable: true
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);