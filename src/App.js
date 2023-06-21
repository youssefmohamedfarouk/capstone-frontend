import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useStytchSession } from "@stytch/react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Profile from "./Components/profile/Profile";
import EditProfile from "./Components/profile/EditProfile";
import "./App.css";

import axios from "axios";
import Example from "./Components/CreateEventSlideOver";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

function App() {
  const { session } = useStytchSession();
  const API = process.env.REACT_APP_API_URL;

  const [currentUser, setCurrentUser] = useState({
    stytch_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    about_me: "",
    interests: [],
    intra_extraversion: 50,
    phone_number: "0000000000",
    profile_pic: "",
    cover_photo: "",
  });

  console.log(currentUser);
  const libraries = ["places"];
  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  useEffect(() => {
    // const currentUserID = session.user_id;
    if (session && session.authentication_factors.length >= 1) {
      userLogin(session.user_id);
    }
  }, [session, session?.session_id]);

  const userLogin = (stytch_id) => {
    return axios.get(`${API}/users/${stytch_id}`).then((res) => {
      console.log(res.data);
      let currentUserPreJSON = res.data;
      console.log(currentUserPreJSON.friends);
      currentUserPreJSON.friends = currentUserPreJSON.friends.map((elem) =>
        JSON.parse(elem)
      );
      setCurrentUser(currentUserPreJSON);
    });
  };

  // if (!session || session.authentication_factors.length) {
  //   return null;
  // }

  return (
    <div className="App">
      <Router>
        <main>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  API={API}
                  session={session}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  isLoaded={isLoaded}
                  toast={toast}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  session={session}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  toast={toast}
                  userLogin={userLogin}
                />
              }
            />
            <Route
              path="/sign-up"
              element={
                <SignUp
                  session={session}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  toast={toast}
                />
              }
            />
            <Route
              path="/profile/:id"
              element={<Profile currentUser={currentUser} session={session} />}
            />
            <Route
              path="/profile/:id/edit"
              element={
                <EditProfile
                  setCurrentUser={setCurrentUser}
                  session={session}
                  currentUser={currentUser}
                />
              }
            />
          </Routes>
        </main>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
