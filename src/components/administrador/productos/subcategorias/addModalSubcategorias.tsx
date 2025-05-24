"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { addSubcategoria } from "@/actions";


interface AddModalSubcategoriasProps {
    onGuardado: () => void;
}

function AddModalSubcategorias({ onGuardado }: AddModalSubcategoriasProps) {

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
        nombre: "",
        tipo: "",
        costoBase: "",
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
            nombre: "",
            tipo: "",
            costoBase: "",
        });
        getSelects();
    };

    //Funcion para obtener los valores de los selects
    const getSelects = async () => {
        const respose = await axios.get(`/api/users/administrador/productos/selects/${inputValue.tipo == '' ? 0 : inputValue.tipo}`);
        const data = respose.data;

        setSelectOptionsTipos(data[0]);
    }

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
            if (Key === "costoBase") {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser numérico";
                } else if (Number(value) <= 0 && Key === "costoBase" && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }
            }
        })
        setErrors(newErrors);

        console.log(newErrors);

        if (Object.keys(newErrors).length == 0) {


            const response = await addSubcategoria(inputValue);
            console.log(response);
            if (response === 200) {
                setIsOpen(false);

                toast({
                    title: "Subcategoría agregada",
                    description: "La subcategoría ha sido agregada correctamente",
                    variant: "success",
                });
                onGuardado();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo agregar la subcategoría",
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
                                Agregar Categoría
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
                                <div className=" w-full mt-3">
                                    <label
                                        htmlFor="tipo"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Tipo
                                    </label>
                                    <select onChange={handleChange} name="tipo" defaultValue={'Default'} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["tipo"] ? "border-red-500" : "border-black"}`}>
                                        <option value="Default" disabled hidden>Seleccione un tipo de producto</option>
                                        {selectOptionsTipos.map((tipo: SelectOption) => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors["tipo"] && (<span className="text-sm text-red-500">{errors["tipo"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="costoBase"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Costo Base
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["costoBase"] ? "border-red-500" : "border-black"}`}
                                        name="costoBase"
                                        onChange={handleChange}
                                    />
                                    {errors["costoBase"] && (<span className="text-sm text-red-500">{errors["costoBase"]}</span>)}
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

export default AddModalSubcategorias;
