import { useEffect } from "react";
import AsideLogo from "../components/AsideLogo";
import AuthForm from "../components/AuthForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {

  useEffect(() => {
      let username = getCookie("username");
      if (username) {
        toast.error(`🦄 You are already logged in!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
  },[])

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  let username = getCookie("username");
  if(username) {
    return (
      <div id="app">
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
      </div>
    )
  } else {
    return (
      <div id="app">
        <div className="d-flex">
          <AsideLogo />
          <AuthForm page="login" />
        </div>
      </div>
    );
  }
  
};

export default LoginPage;
