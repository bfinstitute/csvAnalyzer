import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import ProtectedRoute from './components/ProtectedRoute';
import CSVEditor from './components/CSVEditor';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <CSVEditor />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
