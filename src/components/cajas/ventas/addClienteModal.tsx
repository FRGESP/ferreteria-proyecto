"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import axios from "axios";
import { addCliente } from "@/actions";
import { useRouter } from "next/navigation";
import DireccionForm from "@/components/administrador/sucursales/direccionFrom";
import { get } from "http";

interface AddClienteModalProps {
    onGuardado: () => void;
}

function AddClienteModal({ onGuardado }: AddClienteModalProps) {

    interface Vendedor {
        IdEmpleado: number;
        Nombre: string;
    }

    const { toast } = useToast();
    const router = useRouter();

    //Controla el estado del modal
    const [isOpen, setIsOpen] = useState(false);

    //Controla el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        nombre: "",
        apellidoPat: "",
        apellidoMat: "",
        edad: "",
        telefono: "",
        codigo: "",
        calle: "",
        colonia: "",
        rango: "1",
        creditoMaximo: "0",
        vendedor: "0",
    });

    //Empieza las funciones del componente direccion

    //Bandera para revisar si es necesario verificar los campos de la direccion
    const [isRequired, setIsRequired] = useState(false);

    //Funcion para guardar la direccion 
    const saveDireccion = (codigo: string, colonia: string, calle: string, isRequiredPar: boolean) => {
        setInputValue({
            ...inputValue,
            codigo: codigo,
            colonia: colonia,
            calle: calle,
        });

        if (isRequiredPar) {
            setIsRequired(true);
        }
        // setIsRequired(true);
        console.log(isRequired)

    }
    //Funcion para verificar los campos de la direccion
    const verfificarCampos = () => {
        const newErrors: Record<string, string> = {};
        Object.entries(inputValue).forEach(([Key, value]) => {
            if (Key === "codigo" || Key === "calle" || Key === "colonia") {
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

    //Controla el cambio del input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
        console.log(inputValue);

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
        console.log(errors);
    };

    //Funcion para abrir el modal
    const openModal = () => {
        setIsOpen(true);
        setIsRequired(false); // Necesario para el formulario de direccion
        // Reiniciar los valores de los inputs y errores al abrir el modal
        setErrors({});
        setInputValue({
            nombre: "",
            apellidoPat: "",
            apellidoMat: "",
            edad: "",
            telefono: "",
            codigo: "",
            calle: "",
            colonia: "",
            rango: "1",
            creditoMaximo: "0",
            vendedor: "0",
        });
    };

    //Funcion para cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };

    const handleSubmit = async () => {

        console.log(inputValue)
        console.log(errors)

        const newErrors: Record<string, string> = {};

        Object.entries(inputValue).forEach(([Key, value]) => {
            if (value.trim() === "") {
                if (Key === "codigo" || Key === "calle" || Key === "colonia") {
                    newErrors["codigo"] = "Ingrese una dirección válida y completa";
                } else {
                    newErrors[Key] = "Este campo es obligatorio"
                }
            }
            if (Key === "telefono" || Key === "edad") {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && Key === "edad" && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }
                if(Key === "telefono" && value.trim() !== "" && value.length > 10) {
                    newErrors[Key] = "El número de teléfono debe tener 10 dígitos";
                }
            }
        })
        setErrors(newErrors);

        if (Object.keys(newErrors).length == 0) {
            console.log(inputValue)
            const response = await addCliente(inputValue);
            console.log(response);
            if (response === 200) {
                setIsOpen(false);

                toast({
                    title: "Cliente agregado",
                    description: "El cliente ha sido agregado correctamente",
                    variant: "success",
                });
                onGuardado();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo agregar al cliente",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div>
            <button className=" rounded-md p-2 hover:bg-gray-200" onClick={openModal}>
                <Plus
                    className="text-acento stroke-[5]"
                    size={45}

                />
            </button>

            {isOpen && (
                <div className="flex items-center justify-center">
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] h-auto overflow-y-auto">
                            <p className="font-bold text-2xl text-center mb-5">
                                Agregar Cliente
                            </p>
                            <div className="flex justify-center flex-col items-center py-3">
                                <div className="w-full">
                                    <label
                                        htmlFor="nombre"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["nombre"] ? "border-red-500" : "border-black"}`}
                                        autoFocus
                                        name="nombre"
                                        onChange={handleChange}
                                    />
                                    {errors["nombre"] && (<span className="text-sm text-red-500">{errors["nombre"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="apellidoPat"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Apellido Paterno
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["apellidoPat"] ? "border-red-500" : "border-black"}`}
                                        name="apellidoPat"
                                        onChange={handleChange}
                                    />
                                    {errors["apellidoPat"] && (<span className="text-sm text-red-500">{errors["apellidoPat"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="apellidoMat"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Apellido Materno
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["apellidoMat"] ? "border-red-500" : "border-black"}`}
                                        name="apellidoMat"
                                        onChange={handleChange}
                                    />
                                    {errors["apellidoMat"] && (<span className="text-sm text-red-500">{errors["apellidoMat"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="edad"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Edad
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["edad"] ? "border-red-500" : "border-black"}`}
                                        name="edad"
                                        onChange={handleChange}
                                    />
                                    {errors["edad"] && (<span className="text-sm text-red-500">{errors["edad"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="telefono"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["telefono"] ? "border-red-500" : "border-black"}`}
                                        name="telefono"
                                        onChange={handleChange}
                                    />
                                    {errors["telefono"] && (<span className="text-sm text-red-500">{errors["telefono"]}</span>)}
                                </div>
                                <div className={`${errors["codigo"] ? "border-red-500 border rounded-md w-full py-2 px-2 " : ""} w-full mt-3`}>
                                    <DireccionForm action={saveDireccion} />
                                </div>
                                {errors["codigo"] && (<span className="text-sm text-red-500">{errors["codigo"]}</span>)}
                                <div className="flex gap-5 justify-center">
                                    <button
                                        onClick={closeModal}
                                        className="px-[20%] py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 mt-5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-[20%] py-2 font-semibold text-white bg-acento rounded hover:bg-acentohover mt-5"
                                    >
                                        Agregar
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

export default AddClienteModal;
