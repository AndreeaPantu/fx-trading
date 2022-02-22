import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AuthForm = (props) => {
  const navigate = useNavigate();
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const [errorMessagesLogin, setErrorMessagesLogin] = useState({
    email: false,
    password: false
  })

  const [registerCredentials, setRegisterCredentials] = useState({
    user: "",
    email: "",
    password: "",
    coPassword: "",
  });

  const [errorMessagesRegister, setErrorMessagesRegister] = useState({
    user: false,
    user_2 : false,
    email: false,
    password: false,
    password_2 : false,
    coPassword: false
  })

  const handleChange = (e) => {
    console.log(e);
    const target = e.target;
    const value = target.value;
    const name = target.name;
    if (props.page === "login") {
      setLoginCredentials((previous) => {
        return { ...previous, [name]: value };
      });
    } else if (props.page === "register") {
      setRegisterCredentials((previous) => {
        return { ...previous, [name]: value };
      });
    }
  };

  const createCookie = (name, value, days) => {
    var date, expires;
    if (days) {
      date = new Date();
      date.setDate(date.getDate() + days);
      expires = "; expires=" + date.toUTCString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let url = "http://localhost:8080/api/auth/login";
    let isValid = validateLoginForm();

    if(isValid){
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginCredentials),
      })
        .then((res) =>
          res.json().then((data) => ({
            status: res.status,
            body: data,
          }))
        )
        .then((response) => {
          let username = response.body.username;
          if (response.status === 200) {
            createCookie("username", `${username}`, 2);
            toast.success("🦄 Login success", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setLoginCredentials({ email: "", password: "" });
            setTimeout(() => {
              navigate("/");
            }, 1500);
          } else {
            setLoginCredentials({ email: "", password: "" });
            toast.warn("🦄 Login failed!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    
  };

  function validateLoginForm() {
    let isValid = true;
      let error_email = false;
      let error_password = false;
  
    setErrorMessagesLogin((previous) => {
      return {
        email: false,
        password: false
      };
    });

    const pattern = /^\S+@\S+\.\S+$/;
    if (!pattern.test(loginCredentials.email) || !(loginCredentials.email.length > 0)) {
      isValid = false;
      error_email = true;
    }

    if (!(loginCredentials.password.length > 0)) {
      isValid = false;
      error_password = true;
    }

    setErrorMessagesLogin((previous) => {
      return {
        email: error_email,
        password: error_password
      };
    });
    return isValid;
  }

  const handleRegister = (e) => {
    e.preventDefault();
    const url = "http://localhost:8080/api/auth/register";
    let isValid = validateRegisterForm();
    if(isValid){
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerCredentials.user,
          email: registerCredentials.email,
          password: registerCredentials.password,
          repassword: registerCredentials.coPassword,
        }),
      })
        .then((res) =>
          res.json().then((data) => ({
            status: res.status,
            body: data,
          }))
        )
        .then((data) => {
          if (data.status === 200) {
            createCookie("username", `${registerCredentials.user}`, 2);
            toast.success("🦄 Register success", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
  
            setTimeout(() => {
              navigate("/");
            }, 1500);
          } else if (data.status === 409) {
            if (data.body.existing === "email") {
              toast.error(`🦄 ${data.body.message}!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
            if (data.body.existing === "username") {
              toast.error(`🦄 ${data.body.message}!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          } else {
            toast.warn("🦄 Register failed!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function validateRegisterForm() {
    let isValid = true;
    const passRegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      let error_user = false;
      let error_user_2 = false;
      let error_email = false;
      let error_password = false;
      let error_password_2 = false;
      let error_coPassword = false;

  
    setErrorMessagesRegister((previous) => {
      return {
        user: false,
        user_2 : false,
        email: false,
        password: false,
        password_2 : false,
        coPassword: false
      };
    });
    if (registerCredentials.user.length === 0) {
      isValid = false;
      error_user = true;

    } else if (registerCredentials.user.length < 3 || registerCredentials.user.length > 20) {
      isValid = false;
      error_user_2 = true;
    }

    const pattern = /^\S+@\S+\.\S+$/;
    if (!pattern.test(registerCredentials.email)) {
      isValid = false;
      error_email = true;
    }

    if (registerCredentials.password.length < 7 || registerCredentials.password.length >= 20) {
      isValid = false;
      error_password = true;
    } else if (passRegExp.test(registerCredentials.password) === false) {
      isValid = false;
      error_password_2 = true;
    }

    if (registerCredentials.coPassword !== registerCredentials.password) {
      isValid = false;
      error_coPassword = true;
    }

    setErrorMessagesRegister((previous) => {
      return {
        user: error_user,
        user_2 : error_user_2,
        email: error_email,
        password: error_password,
        password_2 : error_password_2,
        coPassword: error_coPassword
      };
    });
    return isValid;
  }

  if (props.page === "login") {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <main className="main">
          <div className="main__container">
            <h1 className="main__title">Log in to your account</h1>
            <hr className="solid" />
            <form id="form" method="POST">
              <div className="mb-3 d-flex align-content-center justify-content-evenly">
                <i className="fas fa-user-alt icon-auth"></i>
                <input
                  id="inputEmail"
                  type="email"
                  name="email"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Email"
                  onChange={handleChange}
                  value={loginCredentials.email}
                />
                
              </div>
              {errorMessagesLogin.email && <p className="error">Email is not valid</p>}
              <div className="mb-3 d-flex align-content-center ">
                <i className="fas fa-unlock icon-auth"></i>
                <div className="mb-3 d-flex align-content-center flex-column"></div>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="inputPassword"
                  placeholder="Password"
                  onChange={handleChange}
                  value={loginCredentials.password}
                />
                
              </div>
              {errorMessagesLogin.password && <p className="error">Password is not valid</p>}
              <button
                id="loginBtn"
                type="submit"
                className="main__btn"
                onClick={handleLogin}
              >
                Login
              </button>
              <div className="register">
                <p>
                  You don't have an account?{" "}
                  <a className="link-primary" href="/register">
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
          <img
            className="mobile__image"
            src="https://raw.githubusercontent.com/WebToLearn/fx-trading-app/master/App/ui/src/assets/img/logo-main.svg"
            alt="logo"
          />
        </main>
      </>
    );
  } else if (props.page === "register") {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <main className="main">
          <div className="main__container">
            <h1 className="main__title">Register a new account</h1>
            <hr className="solid" />
            <form method="POST" id="form">
              <div className="mb-3 align-content-center">
                <p>Username</p>
                <input
                  className="form-control"
                  id="inputUsername"
                  type="text"
                  name="user"
                  aria-describedby="emailHelp"
                  placeholder="Username"
                  value={registerCredentials.user}
                  onChange={handleChange}
                />
                {errorMessagesRegister.user && <p className="error">Username is not valid</p>}
                {errorMessagesRegister.user_2 && <p className="error">Username must be between 3 and 20 characters</p>}
              </div>
              <div className="mb-3 align-content-center">
                <p>Email address</p>
                <input
                  className="form-control"
                  id="inputEmail"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerCredentials.email}
                  onChange={handleChange}
                />
                {errorMessagesRegister.email && <p className="error">Email is not valid</p>}
              </div>
              <div className="mb-3 align-content-center">
                <p>Password</p>
                <input
                  className="form-control"
                  id="inputPassword"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerCredentials.password}
                  onChange={handleChange}
                />
                {errorMessagesRegister.password && <p className="error">Password must be between 8 and 20 characters</p>}
                {errorMessagesRegister.password_2 && <p className="error">Password must be 8 characters long and must contain at least: one uppercase, one lowercase, a number and a special character!</p>}
              </div>
              <div className="mb-3 align-content-center">
                <p>Confirm Password</p>
                <input
                  className="form-control"
                  id="inputPasswordConfirm"
                  type="password"
                  name="coPassword"
                  placeholder="Confirm Password"
                  value={registerCredentials.coPassword}
                  onChange={handleChange}
                />
                {errorMessagesRegister.coPassword && <p className="error">Passwords do not match</p>}
              </div>
              <button
                id="submitBtn"
                className="main__btn"
                type="submit"
                onClick={handleRegister}
              >
                Register
              </button>
            </form>
            <div className="register">
              <p>
                Already have an account?{" "}
                <a className="link-primary" href="/login">
                  Login
                </a>
              </p>
            </div>
          </div>
          <img
            className="mobile__image register__logo"
            src="https://raw.githubusercontent.com/WebToLearn/fx-trading-app/master/App/ui/src/assets/img/logo-main.svg"
            alt="logo"
          />
        </main>
      </>
    );
  }
};

export default AuthForm;
