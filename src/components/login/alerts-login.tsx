"use client";
import { Info, Timer } from "lucide-react"
import { useEffect,useState } from "react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
 
export type AlertVariants =  "destructive" | "danger" | "info" | "hidden" | "default" | null | undefined

interface AlertProps {
    variant: AlertVariants;
    tittle?: string;
    body: string;
    duration?: number;
}




export function AlertPro({ variant, tittle, body, duration }: AlertProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if(duration){
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration*1000);
            return () => clearTimeout(timer);
        }
        
    }, [duration])
  return (
    <>
    {visible && (
        <Alert variant={variant} className="">
      <Info className="h-6 w-6 stroke-white" />
      <AlertTitle className="ml-3">{tittle}</AlertTitle>
      <AlertDescription className="ml-3">
        {body}
      </AlertDescription>
    </Alert>
    
    )}
    </>
  )
}