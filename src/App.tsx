import React from 'react';
import Client from './client/Client';
import { Route, Routes } from 'react-router-dom';
import AdminPanel from './admin/Admin';

const App: React.FC = () => {

  return (
    <Routes>
      <Route path='/' element={<Client />} />
      <Route path='admin' element={<AdminPanel />} />

    </Routes>
  );
};

export default App;
