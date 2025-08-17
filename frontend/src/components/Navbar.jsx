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
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Leave & Shift Manager</Link>

      <div className="space-x-2">
        <div className="space-x-4 inline-flex mx-4">
          <Link to="/shifts" className="hover:underline">Shifts</Link>
          <Link to="/leaves" className="hover:underline">Leave</Link>
          <Link to="/overtime" className="hover:underline">Overtime</Link>
          <Link to="/swaps" className="hover:underline">Swaps</Link>
        </div>

        {user ? (
          <>
            <Link to="/profile" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-800">
              {user.name || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-900">
              Login
            </Link>
            <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
