import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.clear();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
    // Ouve por mudanças no evento 'userChanged'
    window.addEventListener("userChanged", loadUser);
    
    return () => {
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  return { user, loading };
}