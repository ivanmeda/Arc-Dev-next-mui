import ProfileForm from "./profile-form";
import { Fragment, useState } from "react";
import { CircularProgress, Snackbar } from "@material-ui/core";
import { useRouter } from "next/router";

function UserProfile() {
  const router = useRouter();
  const [alertNotification, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  async function changePasswordHandler(passwordData) {
    setAlert({
      open: true,
      message: "Pending...",
      backgroundColor: "",
    });
    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setAlert({
      open: true,
      message: data.message,
      backgroundColor: "#4BB543",
    });
    router.replace("/projects");
  }

  return (
    <Fragment>
      {" "}
      <ProfileForm onChangePassword={changePasswordHandler} />
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
    </Fragment>
  );
}

export default UserProfile;
