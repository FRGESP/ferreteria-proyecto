"use client"
import { useState, useEffect, use } from "react";
import axios from "axios";
import { Pencil, Trash, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import dayjs from "dayjs";
import { get } from "http";

function RegistrosDashboard() {

    const router = useRouter();
    const { toast } = useToast();

    interface Registro {
        IdBitacora: string;
        Accion: string;
        Usuario: string;
        RegistroAfectado: string;
        Campo: string;
        ValorAnterior: string;
        ValorNuevo: string;
        Fecha: string;
    }

    //Interface Sucursal 
    interface Sucursal {
        Id: number;
        Nombre: string;
    }

    //Guarda la informacion de los Registros
    const [Registros, setRegistros] = useState<Registro[]>([]);

    //Guarda la informacion de la busqueda
    const [searchValue, setSearchValue] = useState({
        nombre: "",
        tabla: "CLIENTE",
        sucursal: ""
    })

    //Bandera para actualizar la tabla
    const [update, setUpdate] = useState(false);

    //Guarda la informacion de las sucursales
    const [sucursales, setSucursales] = useState([]);

    const getSucursales = async () => {
        const response = await axios.get(`/api/users/administrador/empleados/sucursal`);
        const data = response.data;
        setSucursales(data);
    }

    //Cada vez que se actualiza la tabla, se obtiene la informacion de los registros
    useEffect(() => {
        getRegistros();
    }, [searchValue.tabla, searchValue.sucursal])

    const getRegistros = async () => {
        const respose = await axios.post(`/api/users/administrador/registros/${searchValue.tabla}`, {
            nombre: searchValue.nombre,
            sucursal: searchValue.tabla == "STOCK" ? searchValue.sucursal ? searchValue.sucursal : '' : 0
        });
        setRegistros(respose.data);
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === "tabla") {
            setSearchValue({
                ...searchValue,
                tabla: value,
                nombre: "", // Reinicia el input cuando cambia el select
            });
        } else {
            setSearchValue({
                ...searchValue,
                [name]: value,
            });
        }
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();
        if (searchValue) {
            const respose = await axios.post(`/api/users/administrador/registros/${searchValue.tabla}`, {
            nombre: searchValue.nombre,
            sucursal: searchValue.tabla == "STOCK" ? searchValue.sucursal ? searchValue.sucursal : '' : 0
        });
            setRegistros(respose.data);
        }
    }

    useEffect(() => {
        getRegistros();
        getSucursales();
    }, []);

    useEffect(() => {
        if (update) {
            getRegistros();
            setUpdate(false);
        }
    }, [update]);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
            <div className="w-[70%] flex items-center justify-center mb-[2%] gap-5">
                <select defaultValue={'CLIENTE'} onChange={handleChange} name="tabla" className=" bg-[#ffffff] rounded-xl py-2 px-3 text-lg border border-solid border-black">
                    <option value="CLIENTE">Clientes</option>
                    <option value="EMPLEADO">Empleados</option>
                    <option value="PRODUCTO">Productos</option>
                    <option value="PEDIDO">Pedidos</option>
                    <option value="STOCK">Stock</option>
                </select>
                {searchValue.tabla === "STOCK" && (
                    <select onChange={handleChange} name="sucursal" defaultValue={'Default'} className=" bg-[#ffffff] rounded-xl py-2 px-3 text-lg border border-solid border-black">
                        <option value="Default" disabled hidden>Seleccione una sucursal</option>
                        {sucursales.map((sucursal: Sucursal) => (
                            <option key={sucursal.Id} value={sucursal.Id}>
                                {sucursal.Nombre}
                            </option>
                        ))}
                    </select>
                )}
                <form className="w-full" onSubmit={handleSearch}>
                    <input value={searchValue.nombre ?? ""} onChange={handleChange} type="text" name="nombre" className="w-full border border-solid border-black rounded-xl py-2 px-3 text-lg" placeholder="Ingrese el nombre del registro" />
                </form>
                <button className="hover:bg-gray-100 rounded-md"><Search strokeWidth={2} size={45} onClick={handleSearch} /></button>
            </div>
            {Registros.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Accion</th>
                            <th>Usuario</th>
                            <th>Registro Afectado</th>
                            <th>Campo</th>
                            <th>Valor Anterior</th>
                            <th>Valor Nuevo</th>
                            <th>Fecha de Moficación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Registros.map((Registro) => (
                            <tr key={Registro.IdBitacora}>
                                <td>{Registro.IdBitacora}</td>
                                <td>{Registro.Accion}</td>
                                <td>{Registro.Usuario}</td>
                                <td>{Registro.RegistroAfectado}</td>
                                <td>{Registro.Campo}</td>
                                <td>{Registro.ValorAnterior}</td>
                                <td>{Registro.ValorNuevo}</td>
                                <td>{dayjs(Registro.Fecha).format("DD/MM/YYYY")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg font-bold">No hay registros disponibles</p>
                </div>
            )}
        </div>
    )
}

export default RegistrosDashboard