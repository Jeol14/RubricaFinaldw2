import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Login = ({ onRegisterClick }) => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/login',
        credentials,  
        { withCredentials: true }
      );
      console.log(response.data);
  
      if (response.data.email.endsWith('@administrador.com')) {
        navigate('/administrador');
      } else if (response.data.email.endsWith('@asesor.com')) {
        navigate('/asesor');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="container mt-5">
  <div className="row justify-content-center">
    <div className="col-md-6">
      <div className="card">
        <div className="card-header text-center">Iniciar Sesión</div>
        <div className="card-body">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Iniciar Sesión
            </button>
          </form>
          <p className="text-center mt-3">
            ¿No tienes una cuenta?{" "}
            <span onClick={onRegisterClick} style={{ color: "blue", cursor: "pointer" }}>
              Regístrate aquí
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

const Register = ({ onRegistrationSuccess }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [registrationMessage, setRegistrationMessage] = useState(null);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', user);
      console.log(response.data);

      if (response.status === 200) {
        // Display success message
        setRegistrationMessage('Registro Exitoso!');

        // Clear the form fields
        setUser({
          name: '',
          email: '',
          password: '',
        });

        // Invoke the callback to inform the parent component about the registration success
        onRegistrationSuccess();
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
    }
  };

  return (
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header text-center">Registro de Usuario</div>
          <div className="card-body">

          {registrationMessage && (
                <div className="alert alert-success" role="alert">
                  {registrationMessage}
                </div>
              )}

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Registrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>  
  );
};

Login.propTypes = {
  onRegisterClick: PropTypes.func.isRequired,
};

Register.propTypes = {
  onRegistrationSuccess: PropTypes.func.isRequired,
};

const App = () => {
  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  return (
    <div>
      {showRegister ? (
        <Register />
      ) : (
        <Login onRegisterClick={handleRegisterClick} />
      )}
    </div>
  );
};

export default App;
