"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ReactNode } from "react";

const NProgressProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar height="4px" color="hsl(131 38% 74%)" shallowRouting />
    </>
  );
};

export default NProgressProvider;
