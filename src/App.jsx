import React from 'react';
import styles from './App.module.css';
import { Outlet } from 'react-router-dom';

import Header from './Components/Header';

function App() {
  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
