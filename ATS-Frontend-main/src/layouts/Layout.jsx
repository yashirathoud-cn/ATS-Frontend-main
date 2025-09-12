import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import ScrollProgressIndicator from "./BackToTopButton";


const Layout = () => {
  return (
    <div >
     <Header />
      <main>
        <Outlet />
      </main>
     <Footer />
     <ScrollProgressIndicator />
    </div>
  );
};

export default Layout;
