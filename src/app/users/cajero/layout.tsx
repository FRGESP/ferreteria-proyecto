import { checkRole } from "@/actions";

async function layoutCajero({ children }: { children: React.ReactNode }) {
    await checkRole(2);
    return (
      <div>
        {children}
      </div>
    )
  }
  
  export default layoutCajero
  