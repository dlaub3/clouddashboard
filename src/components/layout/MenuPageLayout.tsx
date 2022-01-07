import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

export const MenuPageLayout = (props: {
  children: JSX.Element;
  menu: JSX.Element;
}) => {
  return (
    <>
      <CssBaseline />
      {props.menu}
      <Box
        sx={{
          bgcolor: "whitesmoke",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "auto",
          }}
          maxWidth="lg"
        >
          {props.children}
        </Container>
      </Box>
    </>
  );
};
