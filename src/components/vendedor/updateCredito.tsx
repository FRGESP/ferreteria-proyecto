"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {  DollarSign } from "lucide-react";
import axios from "axios";
import { addAbonoCredito } from "@/actions";


interface UpdateCreditoProps {
    onGuardado: () => void;
    IdClienteProp: number
}

function UpdateCredito({ onGuardado, IdClienteProp }: UpdateCreditoProps) {

    //Interface para los selects
    interface SelectOption {
        value: string;
        label: string;
    }

    interface CreditoCliente {
        IdCliente: string;
        Deuda: string;
    }

    const { toast } = useToast();


    //Controla el estado del modal
    const [isOpen, setIsOpen] = useState(false);

    //Controla el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});

    //Guarda la informacion del credito del cliente
    const [creditoCliente, setCreditoCliente] = useState<CreditoCliente>();

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        monto: "",
    });


    //Obtiene la informacion del crédito del cliente
    const getCreditoCliente = async () => {
        const response = await axios.get(`/api/users/vendedor/clientes/deuda/${IdClienteProp}`);
        const data = response.data;
        console.log(data);
        setCreditoCliente(data);
    }

    //Controla el cambio del input
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
        console.log(errors);
    };

    //Funcion para abrir el modal
    const openModal = () => {
        setIsOpen(true);
        // Reiniciar los valores de los inputs y errores al abrir el modal
        setErrors({});
        setInputValue({
            monto: "",
        });
        getCreditoCliente();
    };


    //Funcion para cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };

    const handleSubmit = async () => {

        const newErrors: Record<string, string> = {};

        Object.entries(inputValue).forEach(([Key, value]) => {
            if (value.trim() === "") {
                newErrors[Key] = "Este campo es obligatorio";
            }
            if ((Key === "monto")) {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && Key === "monto" && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                } else if (Number(value) > Number(creditoCliente?.Deuda) && Key === "monto" && value.trim() !== "") {
                    newErrors[Key] = "El monto no puede ser mayor a la deuda del cliente";
                }
            }
        })
        setErrors(newErrors);


        if (Object.keys(newErrors).length == 0) {
    

            const response = await addAbonoCredito({
                IdCliente: IdClienteProp,
                Monto: inputValue.monto,
            });
            console.log(response);
            if (response === 200) {
                setIsOpen(false);

                toast({
                    title: "Abono agregad0",
                    description: "El abono ha sido agregado correctamente",
                    variant: "success",
                });
                onGuardado();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo agregar el abono",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div>
            <button className=" rounded-md p-2 hover:bg-gray-200" onClick={openModal}>
                <DollarSign
                    className="text-acento stroke-[3]"
                    size={45}

                />
            </button>

            {isOpen && (
                <div className="flex items-center justify-center">
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] h-auto overflow-y-auto">
                            <p className="font-bold text-2xl text-center mb-5">
                                <span>Saldo Pendiente: </span> <span className="bg-orange-500 py-1 px-3 text-white rounded-xl">${creditoCliente?.Deuda}</span>
                            </p>
                            <div className="flex justify-center flex-col items-center py-3">
                                <div className="w-full">
                                    <label
                                        htmlFor="monto"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Monto a abonar
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["monto"] ? "border-red-500" : "border-black"}`}
                                        autoFocus
                                        name="monto"
                                        onChange={handleChange}
                                    />
                                    {errors["monto"] && (<span className="text-sm text-red-500">{errors["monto"]}</span>)}
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
                                    className="px-[20%] py-2 font-semibold text-white bg-acento rounded hover:bg-acentohover mt-5"
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
    )
}
        </div >
    );
}

export default UpdateCredito;
