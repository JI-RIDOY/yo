import React, { createContext, useState, useContext, useEffect } from "react";
import {
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 🔥 SEND USER TO BACKEND
    await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
      }),
    });

    return user;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loginWithGoogle, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
