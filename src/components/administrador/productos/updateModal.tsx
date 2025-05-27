"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import axios from "axios";
import DireccionForm from "@/components/administrador/sucursales/direccionFrom";
import { updateBitacoraProducto } from "@/actions";
import { useRouter } from "next/navigation";


interface UpdateModalProps {
    IdProducto: number;
    onGuardado: () => void;
}

//Interface para los selects
interface SelectOption {
    value: string;
    label: string;
}

//Guarda la informacion del Producto
export interface Producto {
    Descripcion: string;
    Tipo: string;
    NombreTipo: string;
    Categoria: string;
    NombreCategoria: string;
    Subcategoria: string;
    NombreSubcategoria: string;
    PesoInicial: string;
    PesoFinal: string;
    CostoExtra: string;
}

//Va a guardar la bitacora de los cambios
export interface Bitacora {
    Campo: string;
    ValorAnterior: string;
    ValorNuevo: string;
}

function UpdateModal({ IdProducto, onGuardado }: UpdateModalProps) {
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

    //Guarda la informacion del Producto
    const [Producto, setProducto] = useState<Producto>()

    //Guarda la informacion de los selects de tipos
    const [selectOptionsTipos, setSelectOptionsTipos] = useState<SelectOption[]>([]);

    //Guarda la informacion de los selects de categorias
    const [selectOptionsCategorias, setSelectOptionsCategorias] = useState<SelectOption[]>([]);

    //Guarda la informacion de los selects de subcategorias
    const [selectOptionsSubcategorias, setSelectOptionsSubcategorias] = useState<SelectOption[]>([]);

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        Descripcion: "",
        Tipo: "",
        NombreTipo: "",
        Categoria: "",
        NombreCategoria: "",
        Subcategoria: "",
        NombreSubcategoria: "",
        PesoInicial: "",
        PesoFinal: "",
        CostoExtra: "",
    });

    //Funcion para obtener los valores de los selects
    const getSelects = async () => {
        const respose = await axios.get(`/api/users/administrador/productos/selects/${inputValue.Tipo == '' ? 0 : inputValue.Tipo}`);
        const data = respose.data;

        setSelectOptionsTipos(data[0]);
        setSelectOptionsCategorias(data[1]);
        setSelectOptionsSubcategorias(data[2]);
    }

    //ContRola el cambio del input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        let selectedText: string | null = null;

        if (e.target instanceof HTMLSelectElement) {
            selectedText = e.target.options[e.target.selectedIndex].text;
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

        if (String(Producto![name as keyof Producto]) !== value) {
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
            Descripcion: "",
            Tipo: "",
            NombreTipo: "",
            Categoria: "",
            NombreCategoria: "",
            Subcategoria: "",
            NombreSubcategoria: "",
            PesoInicial: "",
            PesoFinal: "",
            CostoExtra: "",
        });
        setBitacora({});
        setIsBitacoraEmpty(false);
        await getProducto();
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

    useEffect(() => {
        if (inputValue.Tipo !== "") {
            getSelects();
        }
        if (isOpen) {
            setInputValue({
                ...inputValue,
                Categoria: "",
                Subcategoria: ""
            })
        }
    }, [inputValue.Tipo]);

    //Funcion para obtener el id del Producto
    const getProducto = async () => {
        const response = await axios.get(`/api/users/administrador/productos/${IdProducto}`);
        const data = response.data;
        setProducto(data);
        setInputValue({
            ...inputValue,
            Tipo: data.Tipo,
        })
        setInputValue({
            Descripcion: data.Descripcion,
            Tipo: data.Tipo,
            NombreTipo: data.NombreTipo,
            Categoria: data.Categoria,
            NombreCategoria: data.NombreCategoria,
            Subcategoria: data.Subcategoria,
            NombreSubcategoria: data.NombreSubcategoria,
            PesoInicial: data.PesoInicial,
            PesoFinal: data.PesoFinal,
            CostoExtra: data.CostoExtra,
        });
    }

    const handleSubmit = async () => {

        const newErrors: Record<string, string> = {};

        Object.entries(inputValue).forEach(([Key, value]) => {
            if (String(value).trim() === "") {
                newErrors[Key] = "Este campo es obligatorio"
            }
            if (Key === "PesoInicial" || Key === "PesoFinal" || Key === "CostoExtra") {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && (Key === 'PesoFinal' || Key === 'PesoInicial') && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }

            }
        })
        setErrors(newErrors);

        if (Object.keys(newErrors).length == 0) {

            const registrosBitacoras: Bitacora[] = Object.entries(bitacora!).map(([key, value]) => ({
                Campo: key,
                ValorAnterior: Producto ? key === 'Tipo' ? Producto["NombreTipo"] : key == 'Categoria' ? Producto['NombreCategoria'] : key == 'Subcategoria' ? Producto['NombreSubcategoria'] : Producto[key as keyof Producto] : "",
                ValorNuevo: value,
            }));
            console.log(registrosBitacoras);
            console.log(inputValue);
            const response = await updateBitacoraProducto(IdProducto, registrosBitacoras);
            const responseUpdate = await axios.put(`/api/users/administrador/productos/${IdProducto}`, inputValue)

            if (responseUpdate.status === 200) {
                onGuardado();
                setIsOpen(false);
                toast({
                    title: "Producto actualizado",
                    description: "El Producto ha sido actualizado correctamente",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Error",
                    description: "El Producto no ha sido actualizado",
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
                                Actualizar Producto
                            </p>
                            <div className="flex justify-center flex-col items-center py-3">
                                <div className="w-full">
                                    <label
                                        htmlFor="Descripcion"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Descripcion"] ? "border-red-500" : "border-black"}`}
                                        autoFocus
                                        name="Descripcion"
                                        defaultValue={Producto?.Descripcion}
                                        onChange={handleChange}
                                    />
                                    {errors["Descripcion"] && (<span className="text-sm text-red-500">{errors["Descripcion"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="Tipo"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Tipo
                                    </label>
                                    <select onChange={handleChange} name="Tipo" defaultValue={Producto?.Tipo} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["Tipo"] ? "border-red-500" : "border-black"}`}>
                                        {selectOptionsTipos.map((tipo: SelectOption) => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors["Tipo"] && (<span className="text-sm text-red-500">{errors["Tipo"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="Categoria"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Categoría
                                    </label>
                                    <select onChange={handleChange} name="Categoria" value={inputValue.Categoria} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["Categoria"] ? "border-red-500" : "border-black"}`}>
                                        <option value="" disabled hidden>{selectOptionsCategorias.length == 0 ? 'No existen categorías con ese tipo de productos' : 'Seleccione una categoría'}</option>
                                        {selectOptionsCategorias.map((tipo: SelectOption) => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors["Categoria"] && (<span className="text-sm text-red-500">{errors["Categoria"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="Subcategoria"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Subcategoría
                                    </label>
                                    <select onChange={handleChange} name="Subcategoria" value={inputValue.Subcategoria} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["Subcategoria"] ? "border-red-500" : "border-black"}`}>
                                        <option value="" disabled hidden>{selectOptionsSubcategorias.length == 0 ? 'No existen subcategorías con ese tipo de productos' : 'Seleccione una subcategoría'}</option>
                                        {selectOptionsSubcategorias.map((tipo: SelectOption) => (
                                            <option key={tipo.value} value={tipo.value}>
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors["Subcategoria"] && (<span className="text-sm text-red-500">{errors["Subcategoria"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="PesoInicial"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Peso Inicial
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["PesoInicial"] ? "border-red-500" : "border-black"}`}
                                        name="PesoInicial"
                                        defaultValue={Producto?.PesoInicial}
                                        onChange={handleChange}
                                    />
                                    {errors["PesoInicial"] && (<span className="text-sm text-red-500">{errors["PesoInicial"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="PesoFinal"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Peso Final
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["PesoFinal"] ? "border-red-500" : "border-black"}`}
                                        name="PesoFinal"
                                        defaultValue={Producto?.PesoFinal}
                                        onChange={handleChange}
                                    />
                                    {errors["PesoFinal"] && (<span className="text-sm text-red-500">{errors["PesoFinal"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="CostoExtra"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Costo Extra
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["CostoExtra"] ? "border-red-500" : "border-black"}`}
                                        name="CostoExtra"
                                        defaultValue={Producto?.CostoExtra}
                                        onChange={handleChange}
                                    />
                                    {errors["CostoExtra"] && (<span className="text-sm text-red-500">{errors["CostoExtra"]}</span>)}
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