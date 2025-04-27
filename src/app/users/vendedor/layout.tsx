import { checkRole } from "@/actions";

async function layoutVendedor({ children }: { children: React.ReactNode }) {
    await checkRole(1);
    return (
      <div>
        {children}
      </div>
    )
  }
  
  export default layoutVendedor
  