import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="w-3/5 mx-auto mt-20">
      <h1 className="text-5xl font-bold mb-6 text-center">I want to...</h1>

      <div className="flex gap-6 justify-center">
        {/* Left Box */}
        {user ? (
          <Link to="/taskslist">
            <div className="flex-1 bg-gray-200 text-gray-800 p-20 text-center text-2xl font-semibold rounded-3xl shadow-lg hover:bg-gray-300 transition">
              View Lost / Found Items
            </div>
          </Link>
        ) : (
          <div className="flex-1 bg-gray-200 text-gray-800 p-20 text-center text-2xl font-semibold rounded-3xl shadow-lg">
            View Lost / Found Items
          </div>
        )}

        {/* Right Box */}
        {user ? (
          <Link to="/tasksform">
            <div className="flex-1 bg-gray-200 text-gray-800 p-20 text-center text-2xl font-semibold rounded-3xl shadow-lg hover:bg-gray-300 transition">
              Report Lost / Found Item
            </div>
          </Link>
        ) : (
          <div className="flex-1 bg-gray-200 text-gray-800 p-20 text-center text-2xl font-semibold rounded-3xl shadow-lg">
            Report Lost / Found Item
          </div>
        )}
      </div>

      {!user && (
        <p className="text-gray-700 text-xl text-center mt-6">
          New users are kindly requested to{' '}
          <Link to="/register" className="text-3xl text-blue-600 underline">
            register
          </Link>{' '}
          or{' '}
          <Link to="/login" className="text-3xl text-blue-600 underline">
            login
          </Link>{' '}
          to submit or view items.
        </p>
      )}
    </div>
  );
};

export default Home;