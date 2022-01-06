import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

export const MenuPage = (props: {
  children: JSX.Element;
  menu: JSX.Element;
}) => {
  return (
    <>
      <CssBaseline />
      {props.menu}
      <Box sx={{ bgcolor: "whitesmoke", height: "100vh" }}>
        <Container maxWidth="lg">{props.children}</Container>
      </Box>
    </>
  );
};
