import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className={cn("flex items-center justify-center flex-shrink-0", className)}>
      <img 
        src="/lovable-uploads/25edcaf7-1e78-4390-89cd-a58e523fbab7.png" 
        alt="Sistema de Integração Hidrológico Logo" 
        className={cn(sizes[size], "object-contain flex-shrink-0")}
      />
    </div>
  );
};