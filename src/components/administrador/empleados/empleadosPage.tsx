"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import AddModal from "./addModal";
import { deleteEmpleado } from "@/actions";

function EmpleadosPage() {

    const router = useRouter();
    const { toast } = useToast();

    interface Empleado {
        ID: number;
        IdEmp: number;
        Nombre: string;
        Telefono: string;
        Edad: string;
        Rol: string;
        Sucursal: string;
        Estatus: string;
    }

    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    const getEmpleados = async () => {
        const response = await axios.get(`/api/users/administrador/empleados`);
        const data = response.data;
        setEmpleados(data);
    }

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
            try {const response = await deleteEmpleado(id);
            console.log(response);
            if (response.status === 200) {
                getEmpleados();
                toast({
                    title: "Empleado eliminado",
                    description: "El empleado ha sido eliminado correctamente",
                    variant: "success",
                });
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast({
                title: "Error",
                description: "No se pudo eliminar el empleado",
                variant: "destructive",
            });
        }
        }
    }

    useEffect(() => {
        getEmpleados();
    }, []);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
            <div className="w-[70%] flex items-center justify-center mb-[2%]">
                <form action="" className="w-full">
                    <input type="text" className="w-full border border-solid border-black rounded-xl py-2 px-3 text-lg" placeholder="Inserte el nombre del empleado" />
                </form>
                <button className="hover:bg-gray-100 ml-5 rounded-md"><Search strokeWidth={2} size={45} /></button>
                <AddModal />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Edad</th>
                        <th>Rol</th>
                        <th>Sucursal</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.map((empleado) => (
                        <tr key={empleado.ID}>
                            <td>{empleado.ID}</td>
                            <td>{empleado.Nombre}</td>
                            <td>{empleado.Telefono}</td>
                            <td>{empleado.Edad}</td>
                            <td>{empleado.Rol}</td>
                            <td>{empleado.Sucursal}</td>
                            <td><div className=" justify-center flex">
                                <p className={`${empleado.Estatus == "Activo" ? "bg-green-600 text-white" : empleado.Estatus == "Suspendido" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"} rounded-lg w-fit py-2 px-1`}>{empleado.Estatus}</p>
                            </div></td>
                            <td>
                                <div className="flex gap-3 w-full justify-center">
                                    <button className=" hover:bg-gray-200 px-2 py-1 text-yellow-500 rounded"><Pencil strokeWidth={2} size={25} /></button>
                                    <button className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded" ><Trash strokeWidth={2} size={25} onClick={() => handleDelete(empleado.IdEmp)} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EmpleadosPage