"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import axios from "axios";
import {updateBitacoraEmpleado } from "@/actions";
import { useRouter } from "next/navigation";


interface UpdateModalProps {
    IdEmpleado: number;
    onGuardado: () => void;
}

//Guarda la informacion del empleado
export interface Empleado {
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Edad: string;
    Telefono: string;
    Sucursal: string;
    Rol: string;
    Estatus: string;
}

//Va a guardar la bitacora de los cambios
export interface Bitacora {
    Campo: string;
    ValorAnterior: string;
    ValorNuevo: string;
}


function UpdateModal({ IdEmpleado, onGuardado }: UpdateModalProps) {
    const { toast } = useToast();
    const router = useRouter();

    //ContRola el estado del modal
    const [isOpen, setIsOpen] = useState(false);

    //ContRola el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});

    //Guarda la informacion de la bitacora
    const [bitacora, setBitacora] = useState<{[key: string]:string}>();

    //Controla si hay informacion en la bitacora
    const [isBitacoraEmpty, setIsBitacoraEmpty] = useState(false);

    //Guarda la informacion del empleado
    const [empleado, setEmpleado] = useState<Empleado>()

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        Nombre: "",
        ApellidoPaterno: "",
        ApellidoMaterno: "",
        Edad: "",
        Telefono: "",
        Sucursal: "",
        Rol: "",
        Estatus: "",
    });

    //ContRola el cambio del input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });

        if (value.trim() === "") {
            setErrors((prev) => ({
                ...prev,
                [name]: "Este campo es obligatorio",
            }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        if(String(empleado![name as keyof Empleado]) !== value){
            setBitacora((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setBitacora((prev) => {
                const newBitacora = { ...prev };
                delete newBitacora[name];
                return newBitacora;
            });
        }

    };

    //Funcion para abrir el modal
    const openModal = async () => {
        // Reiniciar los valores de los inputs y errores al abrir el modal
        setErrors({});
        setInputValue({
            Nombre: "",
            ApellidoPaterno: "",
            ApellidoMaterno: "",
            Edad: "",
            Telefono: "",
            Sucursal: "",
            Rol: "",
            Estatus: "",
        });
        setBitacora({});
        setIsBitacoraEmpty(false);
        await getSucursales();
        await getEmpleado();
        setIsOpen(true);
    };
    //Funcion para cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };

    //Interface Sucursal 
    interface Sucursal {
        Id: number;
        Nombre: string;
    }

    //Guarda la informacion de las Sucursales
    const [Sucursales, setSucursales] = useState([]);

    //Funcion para obtener el Nombre y el id de las Sucursales
    const getSucursales = async () => {
        const response = await axios.get(`/api/users/administrador/empleados/sucursal`);
        const data = response.data;
        setSucursales(data);
    }

    useEffect(() => {
        setIsBitacoraEmpty(!bitacora || Object.keys(bitacora).length === 0);
    }, [bitacora]);

    //Funcion para obtener el id del empleado
    const getEmpleado = async () => {
        const response = await axios.get(`/api/users/administrador/empleados/${IdEmpleado}`);
        const data = response.data;
        setEmpleado(data);
        setInputValue({
            Nombre: data.Nombre,
            ApellidoPaterno: data.ApellidoPaterno,
            ApellidoMaterno: data.ApellidoMaterno,
            Edad: data.Edad,
            Telefono: data.Telefono,
            Sucursal: data.Sucursal,
            Rol: data.Rol,
            Estatus: data.Estatus,
        });
    }

    const handleSubmit = async () => {

        const newErrors: Record<string, string> = {};

        Object.entries(inputValue).forEach(([Key, value]) => {
            if (String(value).trim() === "") {
                newErrors[Key] = "Este campo es obligatorio"
            }
        })
        setErrors(newErrors);


        if (Object.keys(newErrors).length == 0) {

            const registrosBitacoras: Bitacora[] = Object.entries(bitacora!).map(([key, value]) => ({
                Campo: key,
                ValorAnterior: empleado ? empleado[key as keyof Empleado] : "",
                ValorNuevo: value,
            }));

            const response = await updateBitacoraEmpleado(IdEmpleado, registrosBitacoras);
            const responseUpdate = await axios.put(`/api/users/administrador/empleados/${IdEmpleado}`, inputValue)

            if (responseUpdate.status === 200) {
                onGuardado();
                setIsOpen(false);
                toast({
                    title: "Empleado agregado",
                    description: "El empleado ha sido actualizado correctamente",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Error",
                    description: "El empleado no ha sido actualizado correctamente",
                    variant: "destructive",
                });
            }
        }
    };

    //Guarda los campos modificados


    return (
        <div>
            <button className=" ml-1 rounded-md p-2 hover:bg-gray-200 "onClick={openModal}
            >
                <Pencil
                    className="text-yellow-500"
                    size={25}
                />
            </button>

            {isOpen && (
                <div className="flex items-center justify-center">
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] h-auto overflow-y-auto">
                            <p className="font-bold text-2xl text-center mb-5">
                                Editar Empleado
                            </p>
                            <div className="flex justify-center flex-col items-center py-3">
                                <div className="w-full">
                                    <label
                                        htmlFor="Nombre"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Nombre"] ? "border-red-500" : "border-black"}`}
                                        name="Nombre"
                                        onChange={handleChange}
                                        defaultValue={empleado?.Nombre}
                                    />
                                    {errors["Nombre"] && (<span className="text-sm text-red-500">{errors["Nombre"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="ApellidoPaterno"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Apellido Paterno
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["ApellidoPaterno"] ? "border-red-500" : "border-black"}`}
                                        name="ApellidoPaterno"
                                        onChange={handleChange}
                                        defaultValue={empleado?.ApellidoPaterno}
                                    />
                                    {errors["ApellidoPaterno"] && (<span className="text-sm text-red-500">{errors["ApellidoPaterno"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="ApellidoMaterno"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Apellido Materno
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["ApellidoMaterno"] ? "border-red-500" : "border-black"}`}
                                        name="ApellidoMaterno"
                                        onChange={handleChange}
                                        defaultValue={empleado?.ApellidoMaterno}
                                    />
                                    {errors["ApellidoMaterno"] && (<span className="text-sm text-red-500">{errors["ApellidoMaterno"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="Edad"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Edad
                                    </label>
                                    <input
                                        type="number"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Edad"] ? "border-red-500" : "border-black"}`}
                                        name="Edad"
                                        onChange={handleChange}
                                        defaultValue={empleado?.Edad}
                                    />
                                    {errors["Edad"] && (<span className="text-sm text-red-500">{errors["Edad"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="Telefono"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Telefono
                                    </label>
                                    <input
                                        type="number"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Telefono"] ? "border-red-500" : "border-black"}`}
                                        name="Telefono"
                                        onChange={handleChange}
                                        defaultValue={empleado?.Telefono}
                                    />
                                    {errors["Telefono"] && (<span className="text-sm text-red-500">{errors["Telefono"]}</span>)}
                                </div>
                                <div className=" w-full mt-3">
                                    <label
                                        htmlFor="Sucursal"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Sucursal
                                    </label>
                                    <select onChange={handleChange} name="Sucursal" defaultValue={String(empleado?.Sucursal)} className={`border rounded-md w-full py-2 px-2 ${errors["Sucursal"] ? "border-red-500" : "border-black"}`}>
                                        {Sucursales.map((Sucursal: Sucursal) => (
                                            <option key={Sucursal.Id} value={Sucursal.Id}>
                                                {Sucursal.Nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors["Sucursal"] && (<span className="text-sm text-red-500">{errors["Sucursal"]}</span>)}
                                </div>
                                <div className="flex grid-cols-2 gap-5 justify-center mt-3">
                                    <div>
                                        <label className="font-bold text-lg flex-grow text-left" htmlFor="Rol">
                                            Rol
                                        </label>
                                        <select onChange={handleChange} name="Rol" defaultValue={String(empleado?.Rol)} className={`border rounded-md w-full py-2 px-2 ${errors["Rol"] ? "border-red-500" : "border-black"}`}
                                        >
                                            <option value="3">Administrador</option>
                                            <option value="1">Vendedor</option>
                                            <option value="2">Cajero</option>
                                        </select>
                                        {errors["Rol"] && (<span className="text-sm text-red-500">{errors["Rol"]}</span>)}
                                    </div>
                                    <div>
                                        <label className="font-bold text-lg flex-grow text-left" htmlFor="Estatus">
                                            Estatus
                                        </label>
                                        <select onChange={handleChange} name="Estatus" defaultValue={String(empleado?.Estatus)} className={`border rounded-md w-full py-2 px-2 ${errors["Estatus"] ? "border-red-500" : "border-black"}`}
                                        >
                                            <option value="1">Activo</option>
                                            <option value="3">Suspendido</option>
                                            <option value="2">Despedido</option>
                                        </select>
                                        {errors["Estatus"] && (<span className="text-sm text-red-500">{errors["Estatus"]}</span>)}
                                    </div>
                                </div>
                                <div className="flex gap-5 justify-center">
                                    <button
                                        onClick={closeModal}
                                        className="px-[20%] py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 mt-5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className={`px-[20%] py-2 font-semibold text-white bg-acento rounded  mt-5 ${isBitacoraEmpty ? "bg-gray-500" : "hover:bg-acentohover"}`}
                                        disabled={isBitacoraEmpty}
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateModal;
