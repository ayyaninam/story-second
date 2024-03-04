import React, { useEffect, useState } from "react";
import MobileGeneratePage from "@/features/generate/components/mobile-page";
import DesktopGeneratePage from "@/features/generate/components/desktop-page";

function GeneratePage() {
  return (
    <>
      <DesktopGeneratePage />
      <MobileGeneratePage />
    </>
  )
}

export default GeneratePage;