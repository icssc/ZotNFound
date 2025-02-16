import { useContext, createContext } from "react";
import {
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [keywords, setKeywords] = useState([]);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((res) => {
      if (res.user.email.endsWith("@uci.edu")) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    });
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser == null) {
        setUser(null);
      } else if (currentUser.email.endsWith("@uci.edu")) {
        setUser(currentUser);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getSearchKeywords = () => {
      axios.get(
        `${
          import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL
        }/searches/${user.email}`
      )
      .then((response) => {
        setKeywords(response.data);
      })
      .catch((err) => {
        console.error(err);
      })
    }
    if (user) {
      getSearchKeywords();
    }
  }, [user]);

  const addKeyword = async (keyword) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL
        }/searches`,
        {
          email: user.email,
          keyword: keyword,
        },
      )
      if (response.data != 'email already subscribed to keyword') {
        setKeywords((prevKeywords) => [...prevKeywords, keyword]);
        return {success: true, description: "added"};
      }
      return {success: true, description: "existing"};
    } catch (err) {
      console.error(err);
      return {success: false, description: "error"};
    }
  }

  const removeKeyword = async (deletedKw) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL
        }/searches`,
        {
          email: user.email,
          keyword: deletedKw,
        },
      )
      if (response.status === 200) {
        setKeywords((prevKeywords) => prevKeywords.filter((keyword) => keyword !== deletedKw));
      }
    }
    catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user, keywords, addKeyword, removeKeyword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
