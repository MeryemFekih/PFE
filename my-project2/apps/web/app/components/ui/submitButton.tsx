"use client";
import { Button } from "./button";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils"; // Assuming you're using clsx or tailwind-merge

interface SubmitButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode;
}

const SubmitButton = ({ children, className, ...props }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className={cn(
        "bg-customBlue hover:bg-opacity-80",
        className
      )}
      {...props}
    >
      {pending ? "Submitting..." : children}
    </Button>
  );
};

export default SubmitButton;