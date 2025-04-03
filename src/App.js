import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Absensi from "./pages/Absensi";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-6">
                {children}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/home" element={<Layout><Home /></Layout>} />
                <Route path="/register" element={<Layout><Register /></Layout>} />
                <Route path="/absensi" element={<Layout><Absensi /></Layout>} />
            </Routes>
        </Router>
    );
};

export default App;