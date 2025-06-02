"use client"
import { useState, useEffect, use } from "react";
import axios from "axios";
import { Search, ArrowBigRightDash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getClientesAction } from "@/actions";
import UpdateCredito from "@/components/vendedor/updateCredito";

function ClientesCajas() {

    const router = useRouter();
    const { toast } = useToast();

    interface Cliente {
        IdCliente: number;
        Nombre: string;
        Telefono: string;
        Direccion: string;
        Deuda: string;
    }

    //Guarda la informacion de los Clientes
    const [Clientes, setClientes] = useState<Cliente[]>([]);

    //Guarda la informacion de la busqueda
    const [searchValue, setSearchValue] = useState({
        nombre:""
    })
    //Bandera para actualizar la tabla
    const [update, setUpdate] = useState(false);

    const getClientes = async () => {
        const respose = await getClientesAction(searchValue.nombre, 0);
        console.log(respose);
        setClientes(respose);
    }

    const handleChange = (e: any) => {
        setSearchValue({
            ...searchValue,
            [e.target.name]: e.target.value,
        });
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();
        if (searchValue) {
            const response = await axios.post(`/api/users/administrador/clientes`, searchValue);
            const data = response.data;
            setClientes(data);
        } 
    }

    useEffect(() => {
        getClientes();
    }, []);

    useEffect(() => {
        if (update) {
            getClientes();
            setUpdate(false);
        }
    }, [update]);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
            <div className="w-[70%] flex items-center justify-center mb-[2%]">
                <form className="w-full" onSubmit={handleSearch}>
                    <input onChange={handleChange} type="text" name="nombre" className="w-full border border-solid border-black rounded-xl py-2 px-3 text-lg" placeholder="Ingrese el nombre del cliente" />
                </form>
                <button className="hover:bg-gray-100 ml-5 rounded-md"><Search strokeWidth={2} size={45} onClick={handleSearch}/></button>
            </div>
            {Clientes.length > 0 ? (
                <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Deuda</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Clientes.map((Cliente) => (
                        <tr key={Cliente.IdCliente}>
                            <td hidden>{Cliente.IdCliente}</td>
                            <td>{Cliente.Nombre}</td>
                            <td>{Cliente.Telefono}</td>
                            <td>{Cliente.Direccion}</td>
                            <td>${Cliente.Deuda}</td>

                            <td>
                                <div className="flex gap-3 w-full justify-center">
                                    {Cliente.Deuda !== "0.00" && <UpdateCredito IdClienteProp={Cliente.IdCliente} onGuardado={() => setUpdate(true)} />}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-lg">No hay clientes con adeudos</p>
                </div>
            )}
        </div>
    )
}

export default ClientesCajas