"use client"
import { useState, useEffect, use } from "react";
import axios from "axios";
import { Pencil, Trash, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
// import AddModal from "@/components/administrador/Registros/addModal";
// import UpdateModal from "@/components/administrador/Registros/updateModal";
// import { deleteRegistro } from "@/actions";
import dayjs from "dayjs";

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

    //Guarda la informacion de los Registros
    const [Registros, setRegistros] = useState<Registro[]>([]);
    //Guarda la informacion de la busqueda
    const [searchValue, setSearchValue] = useState({
        nombre:"",
        tabla:"CLIENTE"
    })
    //Bandera para actualizar la tabla
    const [update, setUpdate] = useState(false);

    const getRegistros = async () => {
        const respose = await axios.get('/api/users/administrador/clientes')
        setRegistros(respose.data);
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
            const response = await axios.post(`/api/users/administrador/Registros`, searchValue);
            const data = response.data;
            setRegistros(data);
        } 
    }

    useEffect(() => {
        getRegistros();
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
                <p>Registro:</p>
                <select defaultValue={'CLIENTE'} name="tabla" className=" bg-[#ffffff] rounded-xl py-2 px-3 text-lg border border-solid border-black">
                    <option value="CLIENTE">Clientes</option>
                    <option value="EMPLEADO">Empleados</option>
                    {/* <option value="sucursales">Sucursales</option>
                    <option value="productos">Productos</option>
                    <option value="ventas">Ventas</option> */}
                </select>
                <form className="w-full" onSubmit={handleSearch}>
                    <input onChange={handleChange} type="text" name="nombre" className="w-full border border-solid border-black rounded-xl py-2 px-3 text-lg" placeholder="Ingrese el nombre del Registro" />
                </form>
                <button className="hover:bg-gray-100 rounded-md"><Search strokeWidth={2} size={45} onClick={handleSearch}/></button>
            </div>
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
        </div>
    )
}

export default RegistrosDashboard