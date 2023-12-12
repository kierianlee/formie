"use client";

import toast from "react-hot-toast";

interface ClipboardInputProps {
  value: string;
  inputValue: string;
}

const ClipboardInput = ({ inputValue, value }: ClipboardInputProps) => {
  return (
    <div
      className="cursor-pointer rounded-md bg-zinc-800 px-3 py-2 text-sm opacity-100"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        toast.success("Copied to clipboard", {});
      }}
    >
      {inputValue}
    </div>
  );
};

export default ClipboardInput;
