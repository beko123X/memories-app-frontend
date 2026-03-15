import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // سيعمل في كل مرة يتغير فيها رابط الصفحة

  return null;
};

export default ScrollToTop;