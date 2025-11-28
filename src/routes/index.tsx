import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import HomePage from "../pages/HomePage"
import Dashboard from "../pages/Dashboard"
import Budget from "../pages/Budget"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/budget" element={<Budget />} />

            </Routes>
        </Router>
    )
}

export default AppRoutes