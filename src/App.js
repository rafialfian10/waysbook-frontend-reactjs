/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
// components react
import { Route, Routes } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { Helmet } from "react-helmet";

// components
import {
  PageNotFound,
  PrivateRouteAdmin,
  PrivateRouteUser,
} from "./components/private_route/PrivateRoute";
import { UserContext } from "./context/userContext";
import Navbars from "./components/navbar/Navbar";
import Home from "./Home/Home";
import DetailBook from "./containers/user_pages/detail_book/DetailBook";
import Profile from "./containers/user_pages/profile/Profile";
import Cart from "./containers/user_pages/cart/Cart";
import ProfileAdmin from "./containers/admin_pages/profile_admin/ProfileAdmin";
import AddBook from "./containers/admin_pages/add_book/AddBook";
import IncomBook from "./containers/admin_pages/incom_book/IncomBook";
import ListTransaction from "./containers/admin_pages/list_transaction/ListTransaction";
import ComplainAdmin from "./containers/admin_pages/complain_admin/ComplainAdmin";
import ComplainUser from "./containers/user_pages/complain_user/ComplainUser";
import Footer from "./components/footer/Footer";

// api
import { API, setAuthToken } from "./config/api";
// ----------------------------------------------------------

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [state, dispatch] = useContext(UserContext);
  // console.clear();
  // console.log("State :", state);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check_auth");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data;
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // state search
  const [search, setSearch] = useState("");

  // handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      {/* <Helmet>
        <link rel="icon" type="image/png" href="%PUBLIC_URL%/favicon.png" />
      </Helmet> */}
      <Navbars search={search} handleSearch={handleSearch} />
      <Routes>
        {/* public */}
        <Route exact path="/" element={<Home search={search} />} />
        <Route exact path="/detail_book/:id" element={<DetailBook />} />

        {/* admin */}
        <Route element={<PrivateRouteAdmin />}>
          <Route
            exact
            path="/list_transaction"
            element={<ListTransaction search={search} />}
          />
          <Route exact path="/profile_admin/:id" element={<ProfileAdmin />} />
          <Route exact path="/add_book" element={<AddBook />} />
          <Route
            exact
            path="/incom_book"
            element={<IncomBook search={search} />}
          />
          <Route exact path="/complain_admin" element={<ComplainAdmin />} />
        </Route>

        {/* user */}
        <Route element={<PrivateRouteUser />}>
          <Route exact path="/detail_book/:id" element={<DetailBook />} />
          <Route exact path="/cart/:id" element={<Cart />} />
          <Route exact path="/profile/:id" element={<Profile />} />
          <Route exact path="/complain_user" element={<ComplainUser />} />
        </Route>

        <Route exact path="/:pageName" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
