import React, { useState } from "react";

import { createMuiTheme } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { useLogin, Notification } from "react-admin";
import { ThemeProvider } from "@material-ui/styles";

import { FaDiscord } from "react-icons/fa";

export default function LoginPage({ theme }) {
  const [loading, setLoading] = useState(false);
  const login = useLogin();

  const handleLogin = () => {
    setLoading(true);
    login();
  };

  return (
    <ThemeProvider theme={createMuiTheme(theme)}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        direction="column"
        style={{ height: "100%" }}
      >
        <CardActions>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            startIcon={<FaDiscord />}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading && <CircularProgress size={18} thickness={2} />}
            Login With Discord
          </Button>
        </CardActions>
      </Grid>
      <Notification />
    </ThemeProvider>
  );
}
