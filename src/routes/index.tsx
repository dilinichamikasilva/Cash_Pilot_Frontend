import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import HomePage from "../pages/HomePage"
import Dashboard from "../pages/Dashboard"
import Budget from "../pages/Budget"
import CompleteRegistration  from "../pages/CompleteRegistration"
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                

                {/* protected pages */}

                <Route 
                    path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/budget" element={
                        <ProtectedRoute>
                            <Budget />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/complete-registration" element={
                        <ProtectedRoute>
                            <CompleteRegistration  />
                        </ProtectedRoute>
                    } 
                />
                

            </Routes>
        </Router>
    )
}

export default AppRoutes