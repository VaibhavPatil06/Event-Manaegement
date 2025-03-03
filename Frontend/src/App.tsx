import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import axios from "axios";
import { toast } from "react-toastify";
import { setIsAuthenticated, setUser } from "./store/slices/authSlice";

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const me = async () => {
      try {
        const admin = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/me`,
          { withCredentials: true }
        );

        if (!admin.data.success) {
          toast.error(admin.data.message || "something went wrong");
          dispatch(setIsAuthenticated(false));
          return;
        }
        dispatch(setIsAuthenticated(true));
        dispatch(setUser(admin?.data?.data));
      } catch (error) {
        dispatch(setIsAuthenticated(false));
        console.log(error)
        // const err = error as AxiosError<{ message: string }>; // 👈 Explicitly cast error as AxiosError
        // toast.error(err.response?.data?.message || "Something went wrong");
      }
    };
    me();
  }, [isAuthenticated]);
  return <div className="App">{isAuthenticated ? <Home /> : <Auth />}</div>;
}

export default App;
