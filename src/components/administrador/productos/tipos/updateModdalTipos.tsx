"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import axios from "axios";
import { updateBitacoraTipo } from "@/actions";
import { useRouter } from "next/navigation";


interface UpdateModalTiposProps {
    IdTipo: number;
    onGuardado: () => void;
}

//Guarda la informacion del Tipo
export interface Tipo {
    Nombre: string;
    GananciaPublico1: string;
    GananciaHerrero2: string;
    GananciaHerrero3: string;
    GananciaHerrero4: string;
    GananciaMayoreo1: string;
    GananciaMayoreo2: string;
}

//Va a guardar la bitacora de los cambios
export interface Bitacora {
    Campo: string;
    ValorAnterior: string;
    ValorNuevo: string;
}

function UpdateModalTipos({ IdTipo, onGuardado }: UpdateModalTiposProps) {
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

    //Guarda la informacion del Tipo
    const [Tipo, setTipo] = useState<Tipo>()

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        Nombre: "",
        GananciaPublico1: "",
        GananciaHerrero2: "",
        GananciaHerrero3: "",
        GananciaHerrero4: "",
        GananciaMayoreo1: "",
        GananciaMayoreo2: "",
    });


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

        if (String(Tipo![name as keyof Tipo]) !== value) {
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
        setInputValue({
            Nombre: "",
            GananciaPublico1: "",
            GananciaHerrero2: "",
            GananciaHerrero3: "",
            GananciaHerrero4: "",
            GananciaMayoreo1: "",
            GananciaMayoreo2: "",
        });
        setBitacora({});
        setIsBitacoraEmpty(false);
        await getTipo();
        setIsOpen(true);
    };
    //Funcion para cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };


    useEffect(() => {
        setIsBitacoraEmpty(!bitacora || Object.keys(bitacora).length === 0);
    }, [bitacora]);

    //Funcion para obtener el id del Tipo
    const getTipo = async () => {
        const response = await axios.get(`/api/users/administrador/productos/tipos/${IdTipo}`);
        const data = response.data;
        setTipo({
            Nombre: data[0].Nombre,
            GananciaPublico1: data[1].GananciaPublico1,
            GananciaHerrero2: data[2].GananciaHerrero2,
            GananciaHerrero3: data[3].GananciaHerrero3,
            GananciaHerrero4: data[4].GananciaHerrero4,
            GananciaMayoreo1: data[5].GananciaMayoreo1,
            GananciaMayoreo2: data[6].GananciaMayoreo2,
        });
        console.log(data);
        setInputValue({
            Nombre: data[0].Nombre,
            GananciaPublico1: data[1].GananciaPublico1,
            GananciaHerrero2: data[2].GananciaHerrero2,
            GananciaHerrero3: data[3].GananciaHerrero3,
            GananciaHerrero4: data[4].GananciaHerrero4,
            GananciaMayoreo1: data[5].GananciaMayoreo1,
            GananciaMayoreo2: data[6].GananciaMayoreo2,
        });
    }

    const handleSubmit = async () => {

        const newErrors: Record<string, string> = {};

        Object.entries(inputValue).forEach(([Key, value]) => {
            if (String(value).trim() === "") {
                newErrors[Key] = "Este campo es obligatorio"
            }
            if (Key === "GananciaPublico1" || Key === "GananciaHerrero2" || Key === "GananciaHerrero3" || Key === "GananciaHerrero4" || Key === "GananciaMayoreo1" || Key === "GananciaMayoreo2") {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && (Key === "GananciaPublico1" || Key === "GananciaHerrero2" || Key === "GananciaHerrero3" || Key === "GananciaHerrero4" || Key === "GananciaMayoreo1" || Key === "GananciaMayoreo2") && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }

            }
        })
        setErrors(newErrors);

        if (Object.keys(newErrors).length == 0) {

            const registrosBitacoras: Bitacora[] = Object.entries(bitacora!).map(([key, value]) => ({
                Campo: key,
                ValorAnterior: Tipo ? Tipo[key as keyof Tipo] : "",
                ValorNuevo: value,
            }));
            console.log(registrosBitacoras);
            console.log(inputValue);
            const response = await updateBitacoraTipo(IdTipo, registrosBitacoras);
            const responseUpdate = await axios.put(`/api/users/administrador/productos/tipos/${IdTipo}`, inputValue)

            if (responseUpdate.status === 200) {
                onGuardado();
                setIsOpen(false);
                toast({
                    title: "Tipo actualizado",
                    description: "El Tipo ha sido actualizado correctamente",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Error",
                    description: "El Tipo no ha sido actualizado",
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
                                Editar Tipo
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
                                        defaultValue={Tipo?.Nombre}
                                        onChange={handleChange}
                                    />
                                    {errors["Nombre"] && (<span className="text-sm text-red-500">{errors["Nombre"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="GananciaPublico1"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Público 1
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["GananciaPublico1"] ? "border-red-500" : "border-black"}`}
                                        name="GananciaPublico1"
                                        defaultValue={Tipo?.GananciaPublico1}
                                        onChange={handleChange}
                                    />
                                    {errors["GananciaPublico1"] && (<span className="text-sm text-red-500">{errors["GananciaPublico1"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="GananciaHerrero2"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Herrero 2
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["GananciaHerrero2"] ? "border-red-500" : "border-black"}`}
                                        name="GananciaHerrero2"
                                        defaultValue={Tipo?.GananciaHerrero2}
                                        onChange={handleChange}
                                    />
                                    {errors["GananciaHerrero2"] && (<span className="text-sm text-red-500">{errors["GananciaHerrero2"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="GananciaHerrero3"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Herrero 3
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["GananciaHerrero3"] ? "border-red-500" : "border-black"}`}
                                        name="GananciaHerrero3"
                                        defaultValue={Tipo?.GananciaHerrero3}
                                        onChange={handleChange}
                                    />
                                    {errors["GananciaHerrero3"] && (<span className="text-sm text-red-500">{errors["GananciaHerrero3"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="GananciaHerrero4"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Herrero 4
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["GananciaHerrero4"] ? "border-red-500" : "border-black"}`}
                                        name="GananciaHerrero4"
                                        defaultValue={Tipo?.GananciaHerrero4}
                                        onChange={handleChange}
                                    />
                                    {errors["GananciaHerrero4"] && (<span className="text-sm text-red-500">{errors["GananciaHerrero4"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="GananciaMayoreo1"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Mayoreo 1
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["GananciaMayoreo1"] ? "border-red-500" : "border-black"}`}
                                        name="GananciaMayoreo1"
                                        defaultValue={Tipo?.GananciaMayoreo1}
                                        onChange={handleChange}
                                    />
                                    {errors["GananciaMayoreo1"] && (<span className="text-sm text-red-500">{errors["GananciaMayoreo1"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="GananciaMayoreo2"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Ganancia Mayoreo 2
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["GananciaMayoreo2"] ? "border-red-500" : "border-black"}`}
                                        name="GananciaMayoreo2"
                                        defaultValue={Tipo?.GananciaMayoreo2}
                                        onChange={handleChange}
                                    />
                                    {errors["GananciaMayoreo2"] && (<span className="text-sm text-red-500">{errors["GananciaMayoreo2"]}</span>)}
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
            )
            }
        </div>
    );
}

export default UpdateModalTipos;
