  "use client";
  import React, { PropsWithChildren } from "react";
  import { Button } from "./button";
  import { useFormStatus } from "react-dom";

  const SubmitButton = ({ children }: PropsWithChildren) => {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" aria-disabled={pending} className="bg-customBlue hover:bg-opacity-80" >
        {pending ? "Submitting..." : children}
      </Button>
    );
  };

  export default SubmitButton;
