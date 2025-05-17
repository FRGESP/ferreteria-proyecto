"use client"
import { useState, useEffect, use } from "react";
import axios from "axios";
import { Pencil, Trash, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import AddModal from "@/components/administrador/clientes/addModal";
import UpdateModal from "@/components/administrador/empleados/updateModal";
import { deleteCliente } from "@/actions";
import dayjs from "dayjs";

function ClientesDashboard() {

    const router = useRouter();
    const { toast } = useToast();

    interface Cliente {
        Id: number;
        Nombre: string;
        Telefono: string;
        Direccion: string;
        Edad: string;
        Rango: string;
        Credito: string;
        CreditoMaximo: string;
        Fecha: string;
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
        const respose = await axios.get('/api/users/administrador/clientes')
        setClientes(respose.data);
    }

    const handleChange = (e: any) => {
        setSearchValue({
            ...searchValue,
            [e.target.name]: e.target.value,
        });
    }

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar a este cliente?")) {
            try {const response = await deleteCliente(id);
            if (response.status === 200) {
                getClientes();
                toast({
                    title: "Cliente eliminado",
                    description: "El Cliente ha sido eliminado correctamente",
                    variant: "success",
                });
            }
        } catch (error) {
            console.error("Error deleting customer:", error);
            toast({
                title: "Error",
                description: "No se pudo eliminar el Cliente",
                variant: "destructive",
            });
        }
        }
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
                <AddModal onGuardado={() => setUpdate(true)}/>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Edad</th>
                        <th>Rango del Cliente</th>
                        <th>Saldo</th>
                        <th>Crédito Maximo</th>
                        <th>Fecha de Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Clientes.map((Cliente) => (
                        <tr key={Cliente.Id}>
                            <td>{Cliente.Id}</td>
                            <td>{Cliente.Nombre}</td>
                            <td>{Cliente.Telefono}</td>
                            <td>{Cliente.Direccion}</td>
                            <td>{Cliente.Edad}</td>
                            <td>{Cliente.Rango}</td>
                            <td>{Cliente.Credito}</td>
                            <td>{Cliente.CreditoMaximo}</td>
                            <td>{dayjs(Cliente.Fecha).format("DD/MM/YYYY")}</td>
                            <td>
                                <div className="flex gap-3 w-full justify-center">
                                    <UpdateModal IdEmpleado={Cliente.Id} onGuardado={() => setUpdate(true)}/>
                                    <button className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded" ><Trash strokeWidth={2} size={25} onClick={() => handleDelete(Cliente.Id)} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ClientesDashboard