"use client";
import React, { PropsWithChildren } from "react";
import { Button } from "./button";
import { useFormStatus } from "react-dom";

interface NextButtonProps extends PropsWithChildren {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

const NextButton = ({ onClick, children }: NextButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="button" // Changed from "button" to "submit"
      aria-disabled={pending}
      onClick={onClick}
      className={`bg-customBlue hover:bg-opacity-80`}
    >
      {pending ? "Submitting..." : children}
    </Button>
  );
};

export default NextButton;