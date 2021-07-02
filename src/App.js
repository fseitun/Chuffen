import React from 'react';
// import 'react-perfect-scrollbar/dist/css/styles.css'; // venía con el template, lo usa?
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core'; // manda a los childs el theme de Material-UI
import GlobalStyles from 'src/components/GlobalStyles';
import theme from 'src/theme'; // trae el theme de src/theme/index.js, lo reparte con ThemeProvider
import { routes } from 'src/routes';

export default function App() {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
}
