import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm, Controller } from "react-hook-form";
import { Snackbar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Profile(props) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordHelper, setNewPasswordHelper] = useState("");
  const [oldPasswordHelper, setOldPasswordHelper] = useState("");
  const [alertNotification, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const classes = useStyles();

  const onChange = (event) => {
    let valid;

    switch (event.target.id) {
      case "password":
        setPassword(event.target.value);
        valid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/.test(
          event.target.value
        );

        if (!valid) {
          setOldPasswordHelper(
            "Minimum five characters, at least one letter and one number"
          );
        } else {
          setOldPasswordHelper("");
        }
        break;
      case "newPassword":
        setNewPassword(event.target.value);
        valid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/.test(
          event.target.value
        );

        if (!valid) {
          setNewPasswordHelper(
            "Minimum five characters, at least one letter and one number"
          );
        } else {
          setNewPasswordHelper("");
        }
        break;
      default:
        break;
    }
  };

  async function changePasswordHandler(passwordData) {
    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
  }
  function onSubmit(event) {
    event.preventDefault();

    if (password === newPassword) {
      const response = props.onChangePassword({
        oldPassword: password,
        newPassword: newPassword,
      });
    } else {
      setAlert({
        open: true,
        message: "Passwords don't matches!",
        backgroundColor: "#FF3232",
      });
    }

    // optional: Add validation
  }
  return (
    <Container
      component="main"
      maxWidth="xs"
      alignItems="center"
      style={{ marginBottom: "40em" }}
    >
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <form className={classes.form} onSubmit={onSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            error={oldPasswordHelper.length !== 0}
            helperText={oldPasswordHelper}
            value={password}
            onChange={onChange}
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            error={newPasswordHelper.length !== 0}
            helperText={newPasswordHelper}
            value={newPassword}
            onChange={onChange}
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={
              newPasswordHelper.length !== 0 ||
              oldPasswordHelper.length !== 0 ||
              password.length === 0 ||
              newPassword.length === 0
            }
          >
            Change Password
          </Button>
        </form>
      </div>
      <Snackbar
        open={alertNotification.open}
        message={alertNotification.message}
        ContentProps={{
          style: { backgroundColor: alertNotification.backgroundColor },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={4000}
      />
    </Container>
  );
}
