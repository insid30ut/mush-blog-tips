import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import reactLogo from '../../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center">
          <img src={reactLogo} alt="MycoHub Logo" className="h-8 w-8 mr-2" />
          Mycelial FunGuy
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          {user && (
            <>
              {user.email === 'mycelialfunguy@gmail.com' && (
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              )}
              <button onClick={logout} className="text-gray-300 hover:text-white bg-transparent border-none">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;