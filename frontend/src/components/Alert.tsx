import Alert from "react-bootstrap/Alert";

interface AlertProps {
  message: string;
  variant: "success" | "danger" | "warning" | "info"; // Bootstrap alert variants
  onClose: () => void; // Function to close the alert
}

export default function CustomAlert({ message, variant, onClose }: AlertProps) {
  if (!message) return null; // If no message, don't render anything

  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  );
}
