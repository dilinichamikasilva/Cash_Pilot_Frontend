import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import HomePage from "../pages/HomePage"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

            </Routes>
        </Router>
    )
}

export default AppRoutes