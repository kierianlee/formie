"use client";

import { Input } from "@/components/ui/input";

interface ClipboardInputProps {
  value: string;
  inputValue: string;
}

const ClipboardInput = ({ inputValue, value }: ClipboardInputProps) => {
  return (
    <div
      className="cursor-pointer rounded-md bg-zinc-800 px-3 py-2 opacity-100 text-sm"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
      }}
    >
      {inputValue}
    </div>
  );
};

export default ClipboardInput;
