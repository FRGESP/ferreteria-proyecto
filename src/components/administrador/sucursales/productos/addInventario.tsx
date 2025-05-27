"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { addStock } from "@/actions";


interface AddInventarioProps {
    onGuardado: () => void;
    NombreProductoProp: string;
    SucursalProp: string;
    IdProductoProp: number;
}

function AddInventario({ onGuardado, NombreProductoProp, SucursalProp, IdProductoProp }: AddInventarioProps) {

    //Interface para los selects
    interface SelectOption {
        value: string;
        label: string;
    }

    const { toast } = useToast();


    //Controla el estado del modal
    const [isOpen, setIsOpen] = useState(false);

    //Controla el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});

    //Guarda la informacion de los selects de tipos
    const [selectOptionsTipos, setSelectOptionsTipos] = useState<SelectOption[]>([]);



    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        cantidad: "",
    });


    //Controla el cambio del input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
        console.log(inputValue);
        console.log(name)
        console.log(value)

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
            cantidad: "",
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
                newErrors[Key] = "Este campo es obligatorio";
            }
            if ((Key === "cantidad")) {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && (Key === "cantidad") && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }

            }
        })
        setErrors(newErrors);

        console.log(newErrors);

        if (Object.keys(newErrors).length == 0) {
    

            const response = await addStock({
                cantidad: inputValue.cantidad,
                sucursal: SucursalProp,
                producto: IdProductoProp,
            });
            console.log(response);
            if (response === 200) {
                setIsOpen(false);

                toast({
                    title: "Stock agregado",
                    description: "EL stock ha sido agregada correctamente",
                    variant: "success",
                });
                onGuardado();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo agregar el stock",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <div>
            <button className=" ml-1 rounded-md p-2 hover:bg-gray-200 " onClick={openModal}
            >
                <Plus
                    className="text-green-500 stroke-[5]"
                    size={30}
                />
            </button>

            {isOpen && (
                <div className="flex items-center justify-center">
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] h-auto overflow-y-auto">
                            <p className="font-bold text-2xl text-center mb-5">
                                {`Agregar Stock a ${NombreProductoProp}`}
                            </p>
                            <div className="flex justify-center flex-col items-center py-3">
                                <div className="w-full">
                                    <label
                                        htmlFor="cantidad"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Cantidad
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["cantidad"] ? "border-red-500" : "border-black"}`}
                                        autoFocus
                                        name="cantidad"
                                        onChange={handleChange}
                                    />
                                    {errors["cantidad"] && (<span className="text-sm text-red-500">{errors["cantidad"]}</span>)}
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
                                    Agregar
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

export default AddInventario;
