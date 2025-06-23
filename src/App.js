import './App.css';
// import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path='/' element={<Signup />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Routes>
      </Router>
    </>

  );
}

export default App;
