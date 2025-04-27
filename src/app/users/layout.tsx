import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { islogged } from "@/actions"
import AppNavbar from "@/components/ui/appNavbar"
import { Toaster } from "@/components/ui/toaster"

export default async function Layout({ children }: { children: React.ReactNode }) {
    await islogged()
  return (
    <SidebarProvider defaultOpen={false} className="relative flex">
      <AppSidebar />
      <div className="flex-1 relative">
        <div className="sticky top-0 shadow-md z-50">
          <AppNavbar />
        </div>
        <main className="">
          {children}
          <Toaster />
        </main>
        <footer className=" w-full bg-opacity-0 text-black py-3 text-left bottom-0 absolute">
      © 2024 BlackWaves. Ganadería El Rosario.
    </footer>
      </div>
    </SidebarProvider>
  )
}