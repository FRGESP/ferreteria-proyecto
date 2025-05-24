"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { addTipo } from "@/actions";


interface AddModalTipoProps {
    onGuardado: () => void;
}

function AddModalTipo({ onGuardado }: AddModalTipoProps) {

    const { toast } = useToast();

    //Controla el estado del modal
    const [isOpen, setIsOpen] = useState(false);

    //Controla el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        nombre: "",
        gPublico1: "",
        gHerrero2: "",
        gHerrero3: "",
        gHerrero4: "",
        gMayoreo1: "",
        gMayoreo2: "",
    });


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
    };

    //Funcion para abrir el modal
    const openModal = () => {
        setIsOpen(true);
        // Reiniciar los valores de los inputs y errores al abrir el modal
        setErrors({});
        setInputValue({
            nombre: "",
            gPublico1: "",
            gHerrero2: "",
            gHerrero3: "",
            gHerrero4: "",
            gMayoreo1: "",
            gMayoreo2: "",
        });
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
            if (Key !== "nombre") {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser numérico";
                } else if (Number(value) <= 0 && Key !== "nombre"  && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }

            }
        })
        setErrors(newErrors);


        if (Object.keys(newErrors).length == 0) {

            const response = await addTipo(inputValue);
            if (response === 200) {
                setIsOpen(false);

                toast({
                    title: "Tipo de producto agregado",
                    description: "El tipo de producto ha sido agregado correctamente",
                    variant: "success",
                });
                onGuardado();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo agregar el tipo de producto",
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
                                Agregar Tipo
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
                                        htmlFor="gPublico1"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Público 1
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["gPublico1"] ? "border-red-500" : "border-black"}`}
                                        name="gPublico1"
                                        onChange={handleChange}
                                    />
                                    {errors["gPublico1"] && (<span className="text-sm text-red-500">{errors["gPublico1"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="gHerrero2"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Herrero 2
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["gHerrero2"] ? "border-red-500" : "border-black"}`}
                                        name="gHerrero2"
                                        onChange={handleChange}
                                    />
                                    {errors["gHerrero2"] && (<span className="text-sm text-red-500">{errors["gHerrero2"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="gHerrero3"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Herrero 3
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["gHerrero3"] ? "border-red-500" : "border-black"}`}
                                        name="gHerrero3"
                                        onChange={handleChange}
                                    />
                                    {errors["gHerrero3"] && (<span className="text-sm text-red-500">{errors["gHerrero3"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="gHerrero4"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Herrero 4
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["gHerrero4"] ? "border-red-500" : "border-black"}`}
                                        name="gHerrero4"
                                        onChange={handleChange}
                                    />
                                    {errors["gHerrero4"] && (<span className="text-sm text-red-500">{errors["gHerrero4"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="gMayoreo1"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Mayoreo 1
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["gMayoreo1"] ? "border-red-500" : "border-black"}`}
                                        name="gMayoreo1"
                                        onChange={handleChange}
                                    />
                                    {errors["gMayoreo1"] && (<span className="text-sm text-red-500">{errors["gMayoreo1"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="gMayoreo2"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Mayoreo 2
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["gMayoreo2"] ? "border-red-500" : "border-black"}`}
                                        name="gMayoreo2"
                                        onChange={handleChange}
                                    />
                                    {errors["gMayoreo2"] && (<span className="text-sm text-red-500">{errors["gMayoreo2"]}</span>)}
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

export default AddModalTipo;
