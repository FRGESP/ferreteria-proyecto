import { checkRole } from "@/actions";

async function layoutAdministrador({ children }: { children: React.ReactNode }) {
    await checkRole(3);
    return (
      <div>
        {children}
      </div>
    )
  }
  
  export default layoutAdministrador
  