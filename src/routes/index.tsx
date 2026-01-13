import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import HomePage from "../pages/HomePage"
import Dashboard from "../pages/Dashboard"
import Budget from "../pages/Budget"
import CompleteRegistration  from "../pages/CompleteRegistration"
import ViewMonthlyBudget from "../pages/ViewMonthlyBudget"
import UpdateSpendingPage from "../pages/UpdateSpendingPage"
import SettingsPage from "../pages/SettingsPage"
import AnalyticsPage from "../pages/AnalyticsPage"
import ResetPassword from "../pages/ResetPassword"
import DocsPage from "../pages/DocsPage"
import ProtectedRoute from "./ProtectedRoute";
import TeamPage from "../pages/TeamPage"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                

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

                <Route 
                    path="/view-monthly-budget" element={
                        <ProtectedRoute>
                            <ViewMonthlyBudget  />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/update-spending" element={
                        <ProtectedRoute>
                            <UpdateSpendingPage  />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/settings" element={
                        <ProtectedRoute>
                            <SettingsPage  />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/analytics" element={
                        <ProtectedRoute>
                            <AnalyticsPage  />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/team" element={
                        <ProtectedRoute>
                            <TeamPage  />
                        </ProtectedRoute>
                    } 
                />




            

            </Routes>
        </Router>
    )
}

export default AppRoutes