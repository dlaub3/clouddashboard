import React from "react";
import propTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default class DefaultErrorBoundary extends React.Component {
  state = {
    isError: false,
  };

  static getDerivedStateFromError() {
    return { isError: true };
  }

  static propTypes = {
    children: propTypes.node.isRequired,
  };

  render() {
    return this.state.isError ? (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "whitesmoke" }}
      >
        <Typography color="tomato" variant="h2" fontSize="36">
          Something went wrong!
        </Typography>
        <Button
          onClick={() => window.location.assign("/")}
          sx={{ mt: 8 }}
          variant="contained"
        >
          Back to home
        </Button>
      </Box>
    ) : (
      this.props.children
    );
  }
}
