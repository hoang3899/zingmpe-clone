import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

import { StateProvider } from './context/StateProvider';
import { initialState } from './context/initalState';
import reducer from './context/reducer';
import { AnimatePresence } from "framer-motion"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AnimatePresence>
    <Router>
      <StateProvider initialState={initialState} reducer={reducer}>
          <App />
      </StateProvider>
    </Router>
  </AnimatePresence>
);