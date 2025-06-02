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
const itemsVendedor = [
  {
    title: "Clientes",
    url: "/users/vendedor/clientes",
    icon: "/assets/administrador/Clientes.png",
    iconBold: "/assets/administrador/ClientesVerde.png",
  },
  {
    title: "Pedidos",
    url: "/users/vendedor/pedidos",
    icon: "/assets/cajero/Pedidos.png",
    iconBold: "/assets/cajero/PedidosVerde.png",
  },
];

const itemsAdmin = [
  {
    title: "Empleados",
    url: "/users/administrador/empleados",
    icon: "/assets/administrador/Empleados.png",
    iconBold: "/assets/administrador/EmpleadosVerde.png",
  },
  {
    title: "Productos",
    url: "/users/administrador/productos",
    icon: "/assets/administrador/Productos.png",
    iconBold: "/assets/administrador/ProductosVerde.png",
  },
  {
    title: "Cargos",
    url: "/users/administrador/cargos",
    icon: "/assets/administrador/Cargos.png",
    iconBold: "/assets/administrador/CargosVerde.png",
  },
  {
    title: "Sucursales",
    url: "/users/administrador/sucursales",
    icon: "/assets/administrador/Sucursales.png",
    iconBold: "/assets/administrador/SucursalesVerde.png",
  },
  {
    title: "Clientes",
    url: "/users/administrador/clientes",
    icon: "/assets/administrador/Clientes.png",
    iconBold: "/assets/administrador/ClientesVerde.png",
  },
  {
    title: "Registros",
    url: "/users/administrador/registros",
    icon: "/assets/administrador/Registros.png",
    iconBold: "/assets/administrador/RegistrosVerde.png",
  }
];

const itemsCajero = [
  {
    title: "Ventas",
    url: "/users/cajero/ventas",
    icon: "/assets/cajero/Ventas.png",
    iconBold: "/assets/cajero/VentasVerde.png",
  },
  {
    title: "Pedidos",
    url: "/users/cajero/pedidos",
    icon: "/assets/cajero/Pedidos.png",
    iconBold: "/assets/cajero/PedidosVerde.png",
  },
  {
    title: "Clientes",
    url: "/users/cajero/clientes",
    icon: "/assets/administrador/Clientes.png",
    iconBold: "/assets/administrador/ClientesVerde.png",
  },
];

export function AppSidebar() {

  const pathname = usePathname();

  const [logoutaction, setLogout] = useState(false);

  const handleLogout = async () => {
    setLogout(true);
    await logout();
    setLogout(false);
  };

  const isCajero = pathname.toString().substring(0,13) == "/users/cajero";
  const isadmin = pathname.toString().substring(0,12) == "/users/admin";
  const itemsChoice = isadmin ? itemsAdmin : isCajero ? itemsCajero : itemsVendedor;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex flex-col justify-center items-center overflow-hidden">
          <img src="/assets/Login/Logo.png" alt="" className="items-center w-20"/>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg">{isadmin ? "Administrador" : isCajero ? "Caja" : "Vendedor"}</SidebarGroupLabel>
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
