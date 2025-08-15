import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-orange-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">QUT Lost & Found</Link>
      <div>
        {user && (
          <>
            <Link to="/" className="mr-4">Lost / Found</Link> {/* 改成 Home.jsx */}
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-800 text-white shadow-md transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
