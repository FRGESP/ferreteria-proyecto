"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Car, Pencil } from "lucide-react";
import axios from "axios";
import { updateBitacoraInventarioSucursal } from "@/actions";
import { useRouter } from "next/navigation";


interface UpdateStockModalProps {
    IdProducto: number;
    IdSucursalPropMod: string;
    onGuardado: () => void;
    NombreProducto: string;
}

//Guarda la informacion del Producto
export interface Producto {
    Stock: string;
    StockMinimo: string;
}

//Va a guardar la bitacora de los cambios
export interface Bitacora {
    Campo: string;
    ValorAnterior: string;
    ValorNuevo: string;
}

function UpdateStockModal({ IdProducto, IdSucursalPropMod, NombreProducto,onGuardado }: UpdateStockModalProps) {
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


    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        Stock: "",
        StockMinimo: "",
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
            Stock: "",
        StockMinimo: "",
        });
        setBitacora({});
        setIsBitacoraEmpty(false);
        await getProducto();
        setIsOpen(true);
    };
    //Funcion para cerrar el modal
    const closeModal = () => {
        setIsOpen(false);
    };


    useEffect(() => {
        setIsBitacoraEmpty(!bitacora || Object.keys(bitacora).length === 0);
    }, [bitacora]);

    //Funcion para obtener el id del Producto
    const getProducto = async () => {
        const response = await axios.get(`/api/users/administrador/sucursales/sucursalid/productos//${IdProducto}/${IdSucursalPropMod}`);
        const data = response.data;
        setProducto(data);
        console.log(data);
        setInputValue({
            Stock: data.Stock,
            StockMinimo: data.StockMinimo,
        });
    }

    const handleSubmit = async () => {

        const newErrors: Record<string, string> = {};

        Object.entries(inputValue).forEach(([Key, value]) => {
            if (String(value).trim() === "") {
                newErrors[Key] = "Este campo es obligatorio"
            }
            if ((Key === "Stock" || Key === "StockMinimo")) {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && (Key === "Stock" || Key == 'StockMinimo') && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                } else if (Key === "Stock" && Number(value) > Number(Producto!.Stock)) {
                    newErrors[Key] = "El valor no puede ser mayor al stock actual";
                }
            }
        })
        setErrors(newErrors);

        if (Object.keys(newErrors).length == 0) {

            const registrosBitacoras: Bitacora[] = Object.entries(bitacora!).map(([key, value]) => ({
                Campo: key,
                ValorAnterior: Producto ? Producto[key as keyof Producto] : "",
                ValorNuevo: value,
                Sucursal: IdSucursalPropMod,
            }));
            console.log(registrosBitacoras);
            console.log(inputValue);
            const response = await updateBitacoraInventarioSucursal(IdProducto, registrosBitacoras);
            const responseUpdate = await axios.put(`/api/users/administrador/sucursales/sucursalid/productos/${IdProducto}`, {
                Stock: inputValue.Stock,
                StockMinimo: inputValue.StockMinimo,
                Sucursal: IdSucursalPropMod,
            })

            if (responseUpdate.status === 200) {
                onGuardado();
                setIsOpen(false);
                toast({
                    title: "Producto actualizado",
                    description: "La Producto ha sido actualizado correctamente",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Error",
                    description: "La Producto no ha sido actualizado",
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
                                {NombreProducto}
                            </p>
                            <div className="flex justify-center flex-col items-center py-3">
                                <div className="w-full">
                                    <label
                                        htmlFor="Stock"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Stock
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["Stock"] ? "border-red-500" : "border-black"}`}
                                        autoFocus
                                        name="Stock"
                                        defaultValue={Producto?.Stock}
                                        onChange={handleChange}
                                    />
                                    {errors["Stock"] && (<span className="text-sm text-red-500">{errors["Stock"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="StockMinimo"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Stock Mínimo
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["StockMinimo"] ? "border-red-500" : "border-black"}`}
                                        name="StockMinimo"
                                        defaultValue={Producto?.StockMinimo}
                                        onChange={handleChange}
                                    />
                                    {errors["StockMinimo"] && (<span className="text-sm text-red-500">{errors["StockMinimo"]}</span>)}
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

export default UpdateStockModal;
