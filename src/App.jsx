import { BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";

function Layout() {
  const location = useLocation();
  
  const rotasSemHeader = "/"; // rotas com header próprio
  const rotasSemFooter = ["/usuario/deletar-conta"];

  const semHeader = rotasSemHeader.includes(location.pathname);
  const semFooter = rotasSemFooter.includes(location.pathname);

  return (
    <>
      {!semHeader && <Header />}
      <AppRoutes />
      {!semFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}