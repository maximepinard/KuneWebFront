import { useContext, useState } from 'react';
import { AuthContext } from '../global-context';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosCustom from '../tools/axiosCustom';
import { toast } from 'react-toastify';
import '../assets/css/login.css';

function Register() {
  const navigate = useNavigate();
  const [lock, setLock] = useState(false);
  const { setUser } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (lock) {
      return;
    }

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const email = formData.get('email');

    const toastId = toast.loading('Enregistrement');
    setLock(true);

    try {
      const res = await axiosCustom.post('/user/register', {
        username,
        password,
        email
      });
      setUser(res.data);
      toast.update(toastId, {
        type: 'success',
        render: 'Enregistrement réussi',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000
      });
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      toast.update(toastId, {
        type: 'error',
        render: 'Enregistrement échoué',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000
      });
    } finally {
      setTimeout(() => setLock(false), 500);
    }
  };

  return (
    <div id="login" className="basic-page">
      <div className="page-title">S'enregistrer</div>
      <form onSubmit={handleRegister}>
        <input type="text" name="username" placeholder="Pseudo" />
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Mot de Passe" />
        <NavLink to="/login">Se connecter</NavLink>

        <button type="submit" disabled={lock}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default Register;
