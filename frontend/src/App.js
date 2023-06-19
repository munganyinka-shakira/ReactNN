import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/index';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import LaptopOwners from './pages/laptopOwners';
import Equipments from './pages/equipments';
import Dashboard from './pages/Dashboard';
// import NotFound from './pages/404';
import DashboardLayout from './components/Layout/Dashboard';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path="/" element={<DashboardLayout children={<Dashboard />} />} />
          <Route path="login" element={<Login />} />
          <Route path="laptopOwners" element={<DashboardLayout children={<LaptopOwners />} />} />
          <Route path="equipments" element={<DashboardLayout children={<Equipments />} />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </Provider>

);
}
