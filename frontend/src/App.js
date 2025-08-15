import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TasksList from './pages/TasksList';
import TasksForm from './pages/TasksForm';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/taskslist" element={user ? <TasksList /> : <Login />} />
        <Route path="/tasksform" element={user ? <TasksForm /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
