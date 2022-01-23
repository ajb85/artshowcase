import {
  useState,
  createContext,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const context = createContext();
const { Provider } = context;
const initialToken = localStorage.getItem("token") || null;

export default function Account(props) {
  const navigate = useNavigate();
  const [account, setAccount] = useState({});
  const [token, setToken] = useState(initialToken);
  const [tokenIsValidated, setTokenIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateToken = useCallback(
    (token) => {
      setToken(token);
      setTokenIsValidated(!!token);
    },
    [setToken, setTokenIsValidated]
  );

  const login = useCallback(
    async (formData) => {
      try {
        setIsLoading(true);
        const response = await axios.post("/account/login", formData);
        if (response.data) {
          const { token, ...accountInfo } = response.data;
          setAccount(accountInfo);
          updateToken(token);
          setIsLoading(false);
          setError("");
          navigate("/manager");
        }
      } catch (err) {
        setError("Something went wrong logging in :(");
        setIsLoading(false);
      }
    },
    [updateToken, navigate]
  );

  const updateAccount = useCallback(async (updates) => {
    try {
      setIsLoading(true);

      const results = await axios.put("/account", updates);
      if (results.data) {
        setAccount(results.data);
        setIsLoading(false);
        setError("");
        return true;
      }
    } catch (err) {
      setIsLoading(false);
      setError("Oops, couldn't update your account:(");
    }
    return false;
  }, []);

  useEffect(() => {
    // If the token is updated, update local storage as well
    const cachedToken = localStorage.getItem("token");
    if (token !== cachedToken) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    // If the token ever disappears, purge account data
    if (!token && account?.id) {
      setAccount({});
    }
  }, [account?.id, token, setAccount]);

  useEffect(() => {
    // If the token isn't validated but there is a token, validate it and update account
    if (!tokenIsValidated && token) {
      setIsLoading(true);
      axios
        .get("/account")
        .then((response) => {
          if (response) {
            const { token: newToken, ...accountInfo } = response.data;
            updateToken(newToken);
            setAccount(accountInfo);
            setIsLoading(false);
            setError("");
          }
        })
        .catch((err) => {
          setError("Whoops, couldn't verify who you are :(");
          setIsLoading(false);
        });
    }
  }, [tokenIsValidated, token, updateToken, setIsLoading, setAccount]);

  const value = {
    value: account,
    login,
    isLoading,
    error,
    update: updateAccount,
    token: { value: token, validated: tokenIsValidated },
  };

  return <Provider value={value}>{props.children}</Provider>;
}

export function useAccount() {
  return useContext(context);
}
