"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { changeSucursal } from "@/actions";
import { useRouter } from "next/navigation";

interface SelectSucursalProps {
    isAdmin: boolean;
    Sucursal: number;
}

function SelectSucursal({ isAdmin, Sucursal }: SelectSucursalProps) {
    
    const router = useRouter();

    //Guarda la informacion de la sucursal
    interface Sucursal {
        Nombre: string;
        Id: number;
    }

    //Guarda la informacion de las sucursales
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    // Obtiene las sucursales desde la API
    const getSucursales = async () => {
        const response = await axios.get(`/api/users/administrador/empleados/sucursal`);
        const data = response.data;
        setSucursales(data);
    }

    // Obtiene las sucursales al cargar el componente
    useEffect(() => {
        getSucursales();
    }, []);

    // Cambia la sucursal seleccionada
    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        await changeSucursal(parseInt(e.target.value));
        window.location.reload();
    }

    return (
        <div>{isAdmin && sucursales.length > 0 && (
            <div>
                <select name="Sucursales" defaultValue={Sucursal} className=" bg-[#f5f3f4] rounded-xl py-2 px-3 text-lg" onChange={handleChange}>
                    {sucursales.map((sucursal) => (
                        <option key={sucursal.Id} value={sucursal.Id}>{sucursal.Nombre}</option>
                    ))}
                </select>
            </div>
        )}</div>
    )
}

export default SelectSucursal