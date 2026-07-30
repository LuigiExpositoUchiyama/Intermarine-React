import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import App from './App';

import authService from './Services/authService';

import Login from './Pages/Login';
import GestaoProducao from './Pages/GestaoProducao';
import DashboardProducao from './Pages/DashboardProducao';
import ProdutividadeOperador from './Pages/ProdutividadeOperador';
import DashboardOperadores from './Pages/DashboardOperadores';
import OperadorDetalhe from './Pages/OperadorDetalhe';
import DetalheProducao from './Pages/DetalheProducao';
import OrdemDetalhe from './Pages/OrdemDetalhe';
import OperadoresStatus from './Pages/OperadoresStatus';
import ParalisacaoOperador from './Pages/ParalisacaoOperador';
import OperadoresForaProducao from './Pages/OperadoresForaProducao/OperadoresForaProducao';

import ProducaoCopy from './Pages/DashboardProducaoCopy';
import GestaoCopy from './Pages/GestaoProducao copy';
import ProdutividadeCopy from './Pages/ProdutividadeOperador copy';

function ProtectedRoute({ children }) {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <GestaoProducao />,
      },

      {
        path: 'dashboard-producao',
        element: <DashboardProducao />,
      },

      {
        path: 'produtividade-operador',
        element: <ProdutividadeOperador />,
      },

      {
        path: 'dashboard-operadores',
        element: <DashboardOperadores />,
      },

      {
        path: 'operador-detalhe/:id',
        element: <OperadorDetalhe />,
      },

      {
        path: 'detalhe-producao/:tipo/:id',
        element: <DetalheProducao />,
      },

      {
        path: 'ordem-detalhe/:tipo/:id',
        element: <OrdemDetalhe />,
      },

      {
        path: 'operadores-status',
        element: <OperadoresStatus />,
      },

      {
        path: 'paralisacao-operador/:tipo/:id',
        element: <ParalisacaoOperador />,
      },

      {
        path: 'operadores-fora-producao',
        element: <OperadoresForaProducao />,
      },

      {
        path: 'gestao-copy',
        element: <GestaoCopy />,
      },

      {
        path: 'producao-copy',
        element: <ProducaoCopy />,
      },

      {
        path: 'produtividade-copy',
        element: <ProdutividadeCopy />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
