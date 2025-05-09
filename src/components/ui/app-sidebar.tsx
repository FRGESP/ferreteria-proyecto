"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { logout } from "@/actions";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";

// Menu items.
const itemsAlmacen = [
  {
    title: "Dietas",
    url: "/users/almacen/dietas",
    icon: "/assets/Almacen/Maiz.png",
    iconBold: "/assets/Almacen/MaizVerde.png",
  },
  {
    title: "Almacén",
    url: "/users/almacen/almacenpage",
    icon: "/assets/Almacen/Almacen.png",
    iconBold: "/assets/Almacen/AlmacenVerde.png",

  },
  {
    title: "Medicamento",
    url: "/users/almacen/medicamento",
    icon: "/assets/Almacen/Medicamentos.png",
    iconBold: "/assets/Almacen/MedicamentosVerde.png",
  },
  {
    title: "Ganado",
    url: "/users/almacen/ganado",
    icon: "/assets/Admin/Ganado.png",
    iconBold: "/assets/Admin/GanadoVerde.png",
  }
];

const itemsAdmin = [
  {
    title: "Empleados",
    url: "/users/administrador/empleados",
    icon: "/assets/administrador/Empleados.png",
    iconBold: "/assets/administrador/EmpleadosVerde.png",
  },
  {
    title: "Sucursales",
    url: "/users/administrador/sucursales",
    icon: "/assets/administrador/Sucursales.png",
    iconBold: "/assets/administrador/SucursalesVerde.png",
  }
];

const itemsEntradas = [
  {
    title: "Guias",
    url: "/users/entradas/guias",
    icon: "/assets/Entradas/Guias.png",
    iconBold: "/assets/Entradas/GuiasVerde.png",
  },
  {
    title: "Corrales",
    url: "/users/entradas/corrales",
    icon: "/assets/Entradas/Corrales.png",
    iconBold: "/assets/Entradas/CorralesVerde.png",
  }
];

export function AppSidebar() {

  const pathname = usePathname();

  const [logoutaction, setLogout] = useState(false);

  const handleLogout = async () => {
    setLogout(true);
    await logout();
    setLogout(false);
  };

  const isEntradas = pathname.toString().substring(0,15) == "/users/entradas";
  const isadmin = pathname.toString().substring(0,12) == "/users/admin";
  const itemsChoice = isadmin ? itemsAdmin : isEntradas ? itemsEntradas : itemsAlmacen;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex flex-col justify-center items-center overflow-hidden">
          <img src="/assets/Login/Logo.png" alt="" className="items-center w-20"/>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg">{isadmin ? "Administrador" : isEntradas ? "Entradas" : "Almacen"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsChoice.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="my-2 hover:bg-[#ececec] mb-4 py-3">
                    <Link href={item.url}>
                      <img src={`${pathname == item.url ? item.iconBold : item.icon}`} alt="" className="w-7 h-auto" />
                      <span className={`${pathname == item.url ? 'text-acento font-bold' : ''} text-lg`} >{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:overflow-x-hidden">
        <SidebarMenuItem key={"logout"}>
          <SidebarMenuButton onClick={handleLogout} disabled={logoutaction} className="hover:bg-[#eeeeee] mb-4">
            <img src="/assets/login/logout.png" alt="" className="w-8 h-auto"/>
            <span className="overflow-hidden text-lg">{"Salir"}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
