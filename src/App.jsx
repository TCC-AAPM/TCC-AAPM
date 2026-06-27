import { BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import ScrollSubir from "./utils/scrollSubir";

function Layout() {
  const location = useLocation();

  const rotasSemFooter = ["/usuario/deletar-conta"];

  const semFooter = rotasSemFooter.includes(location.pathname);

  return (
    <>
      <ScrollSubir />
      <Header />
      <main className="app-content">
        <AppRoutes />
      </main>
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
