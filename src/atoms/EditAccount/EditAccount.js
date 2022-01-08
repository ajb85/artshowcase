import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormInput,
  FormGroup,
} from "shards-react";

import { useAccount } from "hooks";

export default function EditAccount() {
  const stateAccount = useAccount();
  const { update } = stateAccount;
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState({
    ...stateAccount.value,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setAccount({ ...account, username: stateAccount.value.username });
  }, [stateAccount.value.username]); // eslint-disable-line

  const handleAccountChange = useCallback(
    (e) => {
      const { id, value } = e.target;
      setAccount({ ...account, [id]: value });
    },
    [account]
  );

  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const updates = {};
      if (account.username !== stateAccount.value.username) {
        updates.username = account.username;
      }

      if (account.oldPassword) {
        updates.oldPassword = account.oldPassword;
        updates.newPassword = account.newPassword;
      }

      update(updates).then((success) => success && toggle());
    },
    [account, stateAccount.value.username, update, toggle]
  );

  const usernameIsSameOrEmpty =
    stateAccount.value.username === account.username || !account.username;

  const noPasswordChanges =
    !account.oldPassword && !account.newPassword && !account.confirmPassword;

  const invalidPasswords =
    !noPasswordChanges &&
    (!account.oldPassword ||
      !account.newPassword ||
      !account.confirmPassword ||
      account.confirmPassword !== account.newPassword);

  console.log("PASSWORDS: ");

  return (
    <>
      <Button onClick={toggle}>Edit Account</Button>

      <Modal open={isOpen} toggle={toggle}>
        <ModalHeader>{"Edit Account"}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="username">Username</label>
              <FormInput
                id="username"
                placeholder="Name"
                value={account.username}
                onChange={handleAccountChange}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="oldPassword">Old Password</label>
              <FormInput
                id="oldPassword"
                type="password"
                placeholder="OldPassword"
                value={account.oldPassword}
                onChange={handleAccountChange}
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="newPassword">New Password</label>
              <FormInput
                id="newPassword"
                type="password"
                placeholder="New Password"
                value={account.newPassword}
                onChange={handleAccountChange}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <FormInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={account.confirmPassword}
                onChange={handleAccountChange}
              />
            </FormGroup>
            <Button
              type="submit"
              disabled={
                usernameIsSameOrEmpty && (noPasswordChanges || invalidPasswords)
              }
            >
              Submit
            </Button>
            <Button onClick={toggle}>Cancel</Button>
            {stateAccount.error && (
              <p style={{ color: "red" }}>{stateAccount.error}</p>
            )}
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}
