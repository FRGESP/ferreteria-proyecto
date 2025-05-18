"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { changeSucursal, getSucursalSession } from "@/actions";
import { useRouter } from "next/navigation";

interface SelectSucursalProps {
    onGuardado: () => void;
}

function SelectSucursal({ onGuardado }: SelectSucursalProps) {

    const router = useRouter();

    //Guarda la informacion de la sucursal
    interface Sucursal {
        Nombre: string;
        Id: number;
    }

    //Guarda la informacion de las sucursales
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    //Guarda la informacion de la sucursal en la session
    const [sucursalSession, setSucursalSession] = useState(0);

    // Obtiene las sucursales desde la API
    const getSucursalfromSession = async () => {
        const sucursalVar = await getSucursalSession();
        setSucursalSession(sucursalVar);

    }

    const getSucursales = async () => {
        const response = await axios.get(`/api/users/administrador/empleados/sucursal`);
        const data = response.data;
        console.log(data);
        setSucursales(data);
    }

    useEffect(() => {
        if (sucursalSession !== 0) {
            console.log("Sucursal desde el session: " + sucursalSession);
            getSucursales();
        }
    }, [sucursalSession]);

    // Obtiene la sucursal desde la session al cargar el componente
    useEffect(() => {
        getSucursalfromSession();
    }, []);

    // Cambia la sucursal seleccionada
    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        await changeSucursal(parseInt(e.target.value));
        getSucursalfromSession();
        onGuardado();
    }

    return (
        <div>
            <select name="Sucursales" value={sucursalSession} className=" bg-[#ffffff] rounded-xl py-2 px-3 text-lg border border-solid border-black" onChange={handleChange}>
                <option value={0} hidden disabled>Cargando...</option>
                {sucursales.map((sucursal) => (
                    <option key={sucursal.Id} value={sucursal.Id}>{sucursal.Nombre}</option>
                ))}
            </select>
        </div>
    )
}

export default SelectSucursal