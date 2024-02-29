import React, { useEffect, useState } from "react";
import MobileGeneratePage from "@/features/generate/components/mobile-page";
import DesktopGeneratePage from "@/features/generate/components/desktop-page";

function GeneratePage() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <DesktopGeneratePage />
      <MobileGeneratePage />
    </>
  )
}

export default GeneratePage;