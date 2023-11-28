import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className='navbar navbar-dark bg-dark'>
      <div className='d-flex'>
        <Link className='btn btn-dark m-1' to='/'>Inicio</Link>
        <Link className='btn btn-dark m-1' to='/nuevo'>Login</Link>
        <button className='btn btn-dark m-1' onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;