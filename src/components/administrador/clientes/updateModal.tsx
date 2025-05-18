"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import axios from "axios";
import DireccionForm from "@/components/administrador/sucursales/direccionFrom";
import { updateBitacoraCliente } from "@/actions";
import { useRouter } from "next/navigation";


interface UpdateModalProps {
    IdCliente: number;
    onGuardado: () => void;
}

//Guarda la informacion del Cliente
export interface Cliente {
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Edad: string;
    Telefono: string;
    Codigo: string;
    Calle: string;
    Colonia: string;
    NombreColonia: string;
    Rango: string;
    NombreRango: string;
    CreditoMaximo: string;
}

//Va a guardar la bitacora de los cambios
export interface Bitacora {
    Campo: string;
    ValorAnterior: string;
    ValorNuevo: string;
}


function UpdateModal({ IdCliente, onGuardado }: UpdateModalProps) {
    const { toast } = useToast();
    const router = useRouter();

    //ContRola el estado del modal
    const [isOpen, setIsOpen] = useState(false);

    //ContRola el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});

    //Guarda la informacion de la bitacora
    const [bitacora, setBitacora] = useState<{ [key: string]: string }>();

    //Controla si hay informacion en la bitacora
    const [isBitacoraEmpty, setIsBitacoraEmpty] = useState(false);

    //Guarda la informacion del Cliente
    const [Cliente, setCliente] = useState<Cliente>()

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        Nombre: "",
        ApellidoPaterno: "",
        ApellidoMaterno: "",
        Edad: "",
        Telefono: "",
        Codigo: "",
        Calle: "",
        Colonia: "",
        Rango: "",
        CreditoMaximo: "",
    });

    //Empieza las funciones del componente direccion

    //Bandera para revisar si es necesario verificar los campos de la direccion
    const [isRequired, setIsRequired] = useState(false);

    //Funcion para guardar la direccion 
    const saveDireccion = (Codigo: string, Colonia: string, Calle: string, isRequiredPar: boolean, nombreCol?: string) => {
        setInputValue({
            ...inputValue,
            Codigo: Codigo,
            Colonia: Colonia,
            Calle: Calle,
        });

        let diccionarioElementos = {
            Codigo: Codigo,
            Colonia: Colonia,
            Calle: Calle,
        }

        Object.entries(diccionarioElementos).forEach(([name, value]) => {
            if (String(Cliente![name as keyof Cliente]) != value) {
                setBitacora((prev) => ({
                    ...prev,
                    [name]: name === "Colonia" ? nombreCol ? nombreCol : value : value,
                }));
            } else {
                setBitacora((prev) => {
                    const newBitacora = { ...prev };
                    delete newBitacora[name];
                    return newBitacora;
                });
            }
        })



        if (isRequiredPar) {
            setIsRequired(true);
        }

    }
    //Funcion para verificar los campos de la direccion
    const verfificarCampos = () => {
        const newErrors: Record<string, string> = {};
        Object.entries(inputValue).forEach(([Key, value]) => {
            if (Key === "Codigo" || Key === "Calle" || Key === "Colonia") {
                if (value.trim() === "") {
                    newErrors[Key] = "Ingrese una dirección válida y completa";
                } else {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[Key];
                        return newErrors;
                    });
                }
            } else {
                newErrors[Key] = errors[Key];
            }
        })
        setErrors(newErrors);
    }

    useEffect(() => {
        if (isRequired) {
            verfificarCampos();
        }
    }, [inputValue])

    //Terminan las funciones del componente direccion


    //ContRola el cambio del input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        let selectedText: string | null = null;

        if (e.target instanceof HTMLSelectElement) {
            selectedText = e.target.options[e.target.selectedIndex].text;
            console.log(selectedText);
        }

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

        if (String(Cliente![name as keyof Cliente]) !== value) {
            setBitacora((prev) => ({
                ...prev,
                [name]: selectedText ? selectedText : value,
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
        setIsRequired(false); // Necesario para el formulario de direccion
        setInputValue({
            Nombre: "",
            ApellidoPaterno: "",
            ApellidoMaterno: "",
            Edad: "",
            Telefono: "",
            Codigo: "",
            Calle: "",
            Colonia: "",
            Rango: "",
            CreditoMaximo: "",
        });
        setBitacora({});
        setIsBitacoraEmpty(false);
        await getCliente();
        setIsOpen(true);
    };
    //Funcion para cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };


    useEffect(() => {
        setIsBitacoraEmpty(!bitacora || Object.keys(bitacora).length === 0);
    }, [bitacora]);

    //Funcion para obtener el id del Cliente
    const getCliente = async () => {
        const response = await axios.get(`/api/users/administrador/clientes/${IdCliente}`);
        const data = response.data;
        setCliente(data);
        setInputValue({
            Nombre: data.Nombre,
            ApellidoPaterno: data.ApellidoPaterno,
            ApellidoMaterno: data.ApellidoMaterno,
            Edad: data.Edad,
            Telefono: data.Telefono,
            Codigo: data.Codigo,
            Calle: data.Calle,
            Colonia: data.Colonia,
            Rango: data.Rango,
            CreditoMaximo: data.CreditoMaximo,
        });
    }

    const handleSubmit = async () => {

        const newErrors: Record<string, string> = {};

        Object.entries(inputValue).forEach(([Key, value]) => {
            if (String(value).trim() === "") {
                if (Key === "Codigo" || Key === "Calle" || Key === "Colonia") {
                    newErrors["Codigo"] = "Ingrese una dirección válida y completa";
                } else {
                    newErrors[Key] = "Este campo es obligatorio"
                }
            }
            if (Key === "Telefono" || Key === "CreditoMaximo" || Key === "Edad") {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && Key === "Edad" && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }

            }
        })
        setErrors(newErrors);

        if (Object.keys(newErrors).length == 0) {

            const registrosBitacoras: Bitacora[] = Object.entries(bitacora!).map(([key, value]) => ({
                Campo: key,
                ValorAnterior: Cliente ? key === 'Colonia' ? Cliente["NombreColonia"] : key == 'Rango' ? Cliente['NombreRango'] : Cliente[key as keyof Cliente] : "",
                ValorNuevo: value,
            }));
            console.log(registrosBitacoras);
            console.log(inputValue);
            const response = await updateBitacoraCliente(IdCliente, registrosBitacoras);
            const responseUpdate = await axios.put(`/api/users/administrador/clientes/${IdCliente}`, inputValue)

            if (responseUpdate.status === 200) {
                onGuardado();
                setIsOpen(false);
                toast({
                    title: "Cliente actualizado",
                    description: "El Cliente ha sido actualizado correctamente",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Error",
                    description: "El Cliente no ha sido actualizado correctamente",
                    variant: "destructive",
                });
            }
        }
    };


    return (
        <div>
            <button className=" ml-1 rounded-md p-2 hover:bg-gray-200 " onClick={openModal}
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
                                Actualizar Cliente
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
                                        autoFocus
                                        name="Nombre"
                                        defaultValue={Cliente?.Nombre}
                                        onChange={handleChange}
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
                                        defaultValue={Cliente?.ApellidoPaterno}
                                        onChange={handleChange}
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
                                        defaultValue={Cliente?.ApellidoMaterno}
                                        onChange={handleChange}
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
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Edad"] ? "border-red-500" : "border-black"}`}
                                        name="Edad"
                                        defaultValue={Cliente?.Edad}
                                        onChange={handleChange}
                                    />
                                    {errors["Edad"] && (<span className="text-sm text-red-500">{errors["Edad"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="Telefono"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Telefono"] ? "border-red-500" : "border-black"}`}
                                        name="Telefono"
                                        defaultValue={Cliente?.Telefono}
                                        onChange={handleChange}
                                    />
                                    {errors["Telefono"] && (<span className="text-sm text-red-500">{errors["Telefono"]}</span>)}
                                </div>
                                <div className={`${errors["Codigo"] ? "border-red-500 border rounded-md w-full py-2 px-2 " : ""} w-full mt-3`}>
                                    <DireccionForm action={saveDireccion} codigo={Cliente?.Codigo} colonia={Cliente?.Colonia} calle={Cliente?.Calle} />
                                </div>
                                {errors["Codigo"] && (<span className="text-sm text-red-500">{errors["Codigo"]}</span>)}
                                <div className=" w-full mt-3">
                                    <label
                                        htmlFor="Rango"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Rango
                                    </label>
                                    <select onChange={handleChange} name="Rango" defaultValue={String(Cliente?.Rango)} className={`border rounded-md w-full py-2 px-2 ${errors["Rango"] ? "border-red-500" : "border-black"}`}
                                    >
                                        <option value="1">Público 1</option>
                                        <option value="2">Herrero 2</option>
                                        <option value="3">Herrero 3</option>
                                        <option value="4">Herrero 4</option>
                                        <option value="5">Mayoreo 1</option>
                                        <option value="6">Mayoreo 2</option>
                                    </select>
                                    {errors["Rango"] && (<span className="text-sm text-red-500">{errors["Rango"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="CreditoMaximo"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Crédito Máximo
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["CreditoMaximo"] ? "border-red-500" : "border-black"}`}
                                        name="CreditoMaximo"
                                        defaultValue={Cliente?.CreditoMaximo}
                                        onChange={handleChange}
                                    />
                                    {errors["CreditoMaximo"] && (<span className="text-sm text-red-500">{errors["CreditoMaximo"]}</span>)}
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
