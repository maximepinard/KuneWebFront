import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../global-context";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axiosCustom from "../tools/axiosCustom";
import { toast } from "react-toastify";
import "../assets/css/login.css";

function Login() {
  const navigate = useNavigate();
  const [lock, setLock] = useState(false);
  const { setUser } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const expired = searchParams.get("expired");

    if (expired === "1") {
      // Set the user to undefined to log them out
      toast.warn("Session expirée, veuillez vous reconnecter", {
        toastId: "expired",
      });
      setUser(undefined);
    }
  }, [location, setUser]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (lock) {
      return;
    }
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const toastId = toast.loading("Connexion");
    setLock(true);
    try {
      await axiosCustom.post("/user/login", {
        username,
        password,
      });
      setUser({ login: username });
      toast.update(toastId, {
        type: "success",
        render: "Connexion réussie",
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
      });
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      toast.update(toastId, {
        type: "error",
        render: "Connexion échouée",
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
      });
    } finally {
      setTimeout(() => setLock(false), 500);
    }
  };

  return (
    <div id="login" className="basic-page">
      <div className="page-title">Connexion</div>
      <form onSubmit={handleLogin}>
        <input type="text" name="username" placeholder="Pseudo" />
        <input type="password" name="password" placeholder="Mot de Passe" />
        <NavLink to="/register">S'enregistrer</NavLink>
        <button type="submit" disabled={lock}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default Login;
