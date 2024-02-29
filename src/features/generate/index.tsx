import React, { useEffect, useState } from "react";
import {TabType} from "@/features/generate/constants";
import MobileGeneratePage from "@/features/generate/components/mobile-page";
import DesktopGeneratePage from "@/features/generate/components/desktop-page";

function GeneratePage() {
  const [isMobile, setIsMobile] = useState(true);
  const [value, setValue] = useState<TabType>(TabType.Video);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile)
    return (
      <DesktopGeneratePage />
    );

  return (
    <MobileGeneratePage />
  );
}

export default GeneratePage;