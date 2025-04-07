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
import { getAuthToken } from "../utils/Utils";

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
    const getSearchKeywords = async () => {
      try {
        const token = await getAuthToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/searches/${
            user.email
          }`,
          config
        );
        setKeywords(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      getSearchKeywords();
    }
  }, [user]);

  const addKeyword = async (keyword) => {
    if (keywords.includes(keyword)) {
      return { success: true, wasAdded: false };
    }
  
    const token = await getAuthToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/searches`,
        {
          email: user.email,
          keyword: keyword,
        },
        config
      );
  
      if (response.status === 200 || response.status === 201) {
        setKeywords((prevKeywords) => [...prevKeywords, keyword]);
        return { success: true, wasAdded: true };
      }
  
      return { success: true, wasAdded: false };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };
  

  const removeKeyword = async (deletedKw) => {
    const token = await getAuthToken();
    const config = {
      data: {
        email: user.email,
        keyword: deletedKw,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/searches`,
        config
      );
      if (response.status === 200) {
        setKeywords((prevKeywords) =>
          prevKeywords.filter((keyword) => keyword !== deletedKw)
        );
      }
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        logOut,
        user,
        keywords,
        addKeyword,
        removeKeyword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
