  "use client";
  import { Button } from "./button";
  import { useFormStatus } from "react-dom";

  const SubmitButton = ({ children }: { children: React.ReactNode }) => {
    const { pending } = useFormStatus();
    
    return (
      <Button 
        type="submit" 
        disabled={pending}
        className="bg-customBlue hover:bg-opacity-80"
      >
        {pending ? "Submitting..." : children}
      </Button>
    );
  };

  export default SubmitButton;
