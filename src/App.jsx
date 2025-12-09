import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Deposit from './pages/Deposit';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/profile-setup"
                        element={
                            <ProtectedRoute>
                                <ProfileSetup />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/deposit"
                        element={
                            <ProtectedRoute>
                                <Deposit />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/payment"
                        element={
                            <ProtectedRoute>
                                <Payment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/games"
                        element={
                            <ProtectedRoute>
                                <Games />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
