import { useState, useCallback } from "react";
import { Form, FormInput, FormGroup, Button } from "shards-react";

import { useAccount } from "hooks";

import s from "./Login.module.scss";

export default function Login() {
  const { login, error } = useAccount();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (username.length && password.length) {
        login({ username, password });
      }
    },
    [username, password, login]
  );

  return (
    <Form onSubmit={handleSubmit} className={s.login}>
      <FormGroup>
        <label htmlFor="#username">Username</label>
        <FormInput
          id="#username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
      </FormGroup>
      <FormGroup>
        <label htmlFor="#password">Password</label>
        <FormInput
          type="password"
          id="#password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
      </FormGroup>
      <Button type="submit">Login</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Form>
  );
}
