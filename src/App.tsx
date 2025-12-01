import { AuthProvider } from "./context/authContext"
import Router from "./routes"
import { Toaster } from "react-hot-toast";


export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router />
    </AuthProvider>
  )
}
