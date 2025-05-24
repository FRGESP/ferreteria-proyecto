"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import axios from "axios";
import { updateBitacoraCategoria } from "@/actions";
import { useRouter } from "next/navigation";


interface UpdateModalCategoriasProps {
    IdCategoria: number;
    onGuardado: () => void;
}

//Guarda la informacion del Categoria
export interface Categoria {
    Nombre: string;
    Tipo: string;
    NombreTipo: string;
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

function UpdateModalCategorias({ IdCategoria, onGuardado }: UpdateModalCategoriasProps) {
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

    //Guarda la informacion del Categoria
    const [Categoria, setCategoria] = useState<Categoria>()

    //Guarda la informacion de los selects de tipos
    const [selectOptionsTipos, setSelectOptionsTipos] = useState<SelectOption[]>([]);

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        Nombre: "",
        Tipo: "",
        NombreTipo: "",
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

        if (String(Categoria![name as keyof Categoria]) !== value) {
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

    //Funcion para obtener los valores de los selects
    const getSelects = async () => {
        const respose = await axios.get(`/api/users/administrador/productos/selects/${inputValue.Tipo == '' ? 0 : inputValue.Tipo}`);
        const data = respose.data;

        setSelectOptionsTipos(data[0]);
    }


    //Funcion para abrir el modal
    const openModal = async () => {
        // Reiniciar los valores de los inputs y errores al abrir el modal
        setErrors({});
        setInputValue({
            Nombre: "",
            Tipo: "",
            NombreTipo: "",
        });
        setBitacora({});
        setIsBitacoraEmpty(false);
        await getCategoria();
        await getSelects();
        setIsOpen(true);
    };
    //Funcion para cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };


    useEffect(() => {
        setIsBitacoraEmpty(!bitacora || Object.keys(bitacora).length === 0);
    }, [bitacora]);

    //Funcion para obtener el id del Categoria
    const getCategoria = async () => {
        const response = await axios.get(`/api/users/administrador/productos/categorias/${IdCategoria}`);
        const data = response.data;
        setCategoria(data);
        console.log(data);
        setInputValue({
            Nombre: data.Nombre,
            Tipo: data.Tipo,
            NombreTipo: data.NombreTipo,
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
                ValorAnterior: Categoria ? key == 'Tipo' ? Categoria['NombreTipo'] : Categoria[key as keyof Categoria] : "",
                ValorNuevo: value,
            }));
            console.log(registrosBitacoras);
            console.log(inputValue);
            const response = await updateBitacoraCategoria(IdCategoria, registrosBitacoras);
            const responseUpdate = await axios.put(`/api/users/administrador/productos/categorias/${IdCategoria}`, inputValue)

            if (responseUpdate.status === 200) {
                onGuardado();
                setIsOpen(false);
                toast({
                    title: "Categoria actualizado",
                    description: "La Categoria ha sido actualizado correctamente",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Error",
                    description: "La Categoria no ha sido actualizado",
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
                                Editar Categoria
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
                                        defaultValue={Categoria?.Nombre}
                                        onChange={handleChange}
                                    />
                                    {errors["Nombre"] && (<span className="text-sm text-red-500">{errors["Nombre"]}</span>)}
                                </div>
                                <div className=" w-full mt-3">
                                    <label
                                        htmlFor="Tipo"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Tipo
                                    </label>
                                    <select onChange={handleChange} name="Tipo" defaultValue={Categoria?.Tipo} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["Tipo"] ? "border-red-500" : "border-black"}`}>
                                        <option value="Default" disabled hidden>Seleccione un tipo de producto</option>
                                        {selectOptionsTipos.map((tipo: SelectOption) => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors["Tipo"] && (<span className="text-sm text-red-500">{errors["Tipo"]}</span>)}
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

export default UpdateModalCategorias;
