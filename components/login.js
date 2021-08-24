import React, { useEffect, useRef, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { signIn } from "next-auth/client";
import { CircularProgress, Snackbar } from "@material-ui/core";
import { useRouter } from "next/router";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Arc Development
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url("/assets/background.jpg")`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
    [theme.breakpoints.down("md")]: {
      backgroundImage: `url("/assets/mobileBackground.jpg")`,
    },
  },
  paper: {
    margin: theme.spacing(8, 4),
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
async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

export default function SignInSide() {
  const classes = useStyles();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [email, setEmail] = useState("");
  const [emailHelper, setEmailHelper] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHelper, setPasswordHelper] = useState("");

  const [message, setMessage] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [disabled, setDisabled] = useState(true);
  useState;
  const [alertNotification, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const router = useRouter();

  const onChange = (event) => {
    let valid;

    switch (event.target.id) {
      case "email":
        setEmail(event.target.value);
        valid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          event.target.value
        );

        if (!valid) {
          setEmailHelper("Invalid email");
        } else {
          setEmailHelper("");
        }
        break;
      case "password":
        setPassword(event.target.value);
        valid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/.test(
          event.target.value
        );

        if (!valid) {
          setPasswordHelper(
            "Minimum five characters, at least one letter and one number"
          );
        } else {
          setPasswordHelper("");
        }
        break;
      default:
        break;
    }
  };

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();
    setLoading(true);

    // optional: Add validation
    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      }).then((res) => {
        setAlert({
          open: true,
          message: res.error || res.message || "Successfully Log In!",
          backgroundColor: res.error ? '"#FF3232"' : "#4BB543",
        });
        return res;
      });

      if (result.error) {
        setLoading(false);
      }
      if (!result.error) {
        router.replace("/projects");
        setLoading(false);
      }
    } else {
      try {
        const result = await createUser(email, password);
        if (!result.error) {
          await signIn("credentials", {
            redirect: false,
            email: email,
            password: password,
          }).then((res) => {
            setAlert({
              open: true,
              message:
                res.error ||
                res.message ||
                result.message ||
                "Successfully Log In!",
              backgroundColor: res.error ? '"#FF3232"' : "#4BB543",
            });
            return res;
          });
          setAlert({
            open: true,
            message: "Please wait...",
            backgroundColor: "#4BB543",
          });
          router.replace("/projects");
          setLoading(false);
          setAlert({
            open: false,
            message: "",
            backgroundColor: "#4BB543",
          });
        }
      } catch (error) {
        setLoading(false);
        setAlert({
          open: true,
          message: error.message,
          backgroundColor: "#FF3232",
        });
      }
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "Sign in" : "Sign Up"}
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={emailHelper.length !== 0}
              helperText={emailHelper}
              value={email}
              onChange={onChange}
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              error={passwordHelper.length !== 0}
              helperText={passwordHelper}
              value={password}
              onChange={onChange}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Grid item container alignItems="center" direction="column">
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={submitHandler}
                disabled={
                  passwordHelper.length !== 0 ||
                  emailHelper.length !== 0 ||
                  email.length === 0 ||
                  password.length === 0
                }
              >
                {loading ? (
                  <CircularProgress size={20} color="secondary" />
                ) : isLogin ? (
                  "Sing In"
                ) : (
                  "Sing Up"
                )}
              </Button>
              <Button
                style={{ fontWeight: 300 }}
                color="primary"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sing Up" : "Sing In"}
              </Button>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={false} md={7} className={classes.image} />

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
    </Grid>
  );
}
