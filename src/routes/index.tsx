import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import HomePage from "../pages/HomePage"
import Dashboard from "../pages/Dashboard"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />

            </Routes>
        </Router>
    )
}

export default AppRoutes