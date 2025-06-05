"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Car, Pencil } from "lucide-react";
import axios from "axios";
import { updateBitacoraCargoGeneral } from "@/actions";
import { useRouter } from "next/navigation";


interface UpdateModalCargoGeneralProps {
    IdCargo: number;
    onGuardado: () => void;
}

//Guarda la informacion del Cargo
export interface Cargo {
    Nombre: string;
    Cargo: string;
    Parametro: string;
}

//Va a guardar la bitacora de los cambios
export interface Bitacora {
    Campo: string;
    ValorAnterior: string;
    ValorNuevo: string;
}

//Interface para los selects
interface SelectOption {
    value: string;
    label: string;
}

function UpdateModalCargoGeneral({ IdCargo, onGuardado }: UpdateModalCargoGeneralProps) {
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

    //Guarda la informacion del Cargo
    const [Cargo, setCargo] = useState<Cargo>()

    //Guarda la informacion de los selects de tipos
    const [selectOptionsTipos, setSelectOptionsTipos] = useState<SelectOption[]>([]);

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        Nombre: "",
        Cargo: "",
        Parametro: "",
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

        if (String(Cargo![name as keyof Cargo]) !== value) {
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
            Cargo: "",
            Parametro: "",
        });
        setBitacora({});
        setIsBitacoraEmpty(false);
        await getCargo();
        setIsOpen(true);
    };
    //Funcion para cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };


    useEffect(() => {
        setIsBitacoraEmpty(!bitacora || Object.keys(bitacora).length === 0);
    }, [bitacora]);

    //Funcion para obtener el id del Cargo
    const getCargo = async () => {
        const response = await axios.get(`/api/users/administrador/cargos/general/${IdCargo}`);
        const data = response.data;
        setCargo(data);
        console.log(data);
        setInputValue({
            Nombre: data.Nombre,
            Cargo: data.Cargo,
            Parametro: data.Parametro,
        });
    }

    const handleSubmit = async () => {

        const newErrors: Record<string, string> = {};

        Object.entries(inputValue).forEach(([Key, value]) => {
            if (String(value).trim() === "") {
                newErrors[Key] = "Este campo es obligatorio"
            }
            if ((Key === "Cargo" || Key === "Parametro")) {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && (Key === "Cargo" || Key == 'Parametro') && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }

            }
        })
        setErrors(newErrors);

        if (Object.keys(newErrors).length == 0) {

            const registrosBitacoras: Bitacora[] = Object.entries(bitacora!).map(([key, value]) => ({
                Campo: key,
                ValorAnterior: Cargo ? Cargo[key as keyof Cargo] : "",
                ValorNuevo: value,
            }));
            console.log(registrosBitacoras);
            console.log(inputValue);
            const response = await updateBitacoraCargoGeneral(IdCargo, registrosBitacoras);
            const responseUpdate = await axios.put(`/api/users/administrador/cargos/general/${IdCargo}`, inputValue)

            if (responseUpdate.status === 200) {
                onGuardado();
                setIsOpen(false);
                toast({
                    title: "Cargo actualizado",
                    description: "El Cargo ha sido actualizado correctamente",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Error",
                    description: "El Cargo no ha sido actualizado",
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
                                Editar Cargo
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
                                        defaultValue={Cargo?.Nombre}
                                        onChange={handleChange}
                                    />
                                    {errors["Nombre"] && (<span className="text-sm text-red-500">{errors["Nombre"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="Parametro"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Parámetro
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Parametro"] ? "border-red-500" : "border-black"}`}
                                        name="Parametro"
                                        defaultValue={Cargo?.Parametro}
                                        onChange={handleChange}
                                    />
                                    {errors["Parametro"] && (<span className="text-sm text-red-500">{errors["Parametro"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="Cargo"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Cargo
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Cargo"] ? "border-red-500" : "border-black"}`}
                                        name="Cargo"
                                        defaultValue={Cargo?.Cargo}
                                        onChange={handleChange}
                                    />
                                    {errors["Cargo"] && (<span className="text-sm text-red-500">{errors["Cargo"]}</span>)}
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

export default UpdateModalCargoGeneral;
