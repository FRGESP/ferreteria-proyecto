"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { addProducto } from "@/actions";


interface AddModalProps {
    onGuardado: () => void;
}

function AddModal({ onGuardado }: AddModalProps) {

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

    //Bandera si se quiere añadir un tipo
    const [addTipo, setAddTipo] = useState(false);

    //Bandera para si se quiere añadir una categoria
    const [addCategoria, setAddCategoria] = useState(false);

    //Bandera para si se quiere añadir una subcategoria
    const [addSubcategoria, setAddSubcategoria] = useState(false);

    //Guarda la informacion de los selects de tipos
    const [selectOptionsTipos, setSelectOptionsTipos] = useState<SelectOption[]>([]);

    //Guarda la informacion de los selects de categorias
    const [selectOptionsCategorias, setSelectOptionsCategorias] = useState<SelectOption[]>([]);

    //Guarda la informacion de los selects de subcategorias
    const [selectOptionsSubcategorias, setSelectOptionsSubcategorias] = useState<SelectOption[]>([]);



    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        nombre: "",
        tipo: "",
        categoria: "",
        subcategoria: "",
        pesoInicial: "",
        pesoFinal: "",
        costoExtra: "",
        costoBase: "0",
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
            categoria: "",
            subcategoria: "",
            pesoInicial: "",
            pesoFinal: "",
            costoExtra: "",
            costoBase: "0",
        });
        setAddTipo(false);
        setAddCategoria(false);
        setAddSubcategoria(false);
    };

    //Funcion para obtener los valores de los selects
    const getSelects = async () => {
        const respose = await axios.get(`/api/users/administrador/productos/selects/${inputValue.tipo == '' ? 0 : inputValue.tipo}`);
        const data = respose.data;

        setSelectOptionsTipos(data[0]);
        setSelectOptionsCategorias(data[1]);
        setSelectOptionsSubcategorias(data[2]);
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
                if(Key === "costoBase") {
                    if (addSubcategoria) newErrors[Key] = "Este campo es obligatorio"
                } else {
                    newErrors[Key] = "Este campo es obligatorio";
                }
            }
            if ((Key === "costoBase" && addSubcategoria) || Key === "costoExtra" || Key === "pesoInicial" || Key === "pesoFinal") {
                if (isNaN(Number(value))) {
                    newErrors[Key] = "Este campo debe ser un número";
                } else if (Number(value) <= 0 && ((Key === "costoBase" && addSubcategoria) || Key === "pesoInicial" || Key === "pesoFinal") && value.trim() !== "") {
                    newErrors[Key] = "Este campo debe ser mayor a 0";
                }

            }
        })
        setErrors(newErrors);

        console.log(newErrors);

        if (Object.keys(newErrors).length == 0) {
            const tipoAdd = !addTipo && !addCategoria && !addSubcategoria ? 0 : 
                addTipo && !addCategoria && !addSubcategoria ? 1 :
                !addTipo && addCategoria && addSubcategoria ? 2 :
                !addTipo && addCategoria && !addSubcategoria ? 3 : 4;

            console.log("TIPO PAAA", tipoAdd);
            console.log(inputValue)

            const response = await addProducto(inputValue, tipoAdd);
            console.log(response);
            if (response === 200) {
                setIsOpen(false);

                toast({
                    title: "Producto agregado",
                    description: "El producto ha sido agregado correctamente",
                    variant: "success",
                });
                onGuardado();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo agregar al producto",
                    variant: "destructive",
                });
            }
        }
    };

    useEffect(() => {
        if (isOpen && !addTipo) {
            getSelects();
        }
    }, [inputValue.tipo]);

    useEffect(() => {
        inputValue.tipo = "0";
    }, [addTipo])

    useEffect(() => {
        inputValue.categoria = "";
    }, [addCategoria])

    useEffect(() => {
        inputValue.subcategoria = "";
    }, [addSubcategoria])

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
                                Agregar Producto
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
                                    {!addTipo ? (
                                        <div className="flex gap-2">
                                            <select onChange={handleChange} name="tipo" defaultValue={'Default'} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["tipo"] ? "border-red-500" : "border-black"}`}>
                                                <option value="Default" disabled hidden>Seleccione un tipo</option>
                                                {selectOptionsTipos.map((tipo: SelectOption) => (
                                                    <option key={tipo.value} value={tipo.value}>
                                                        {tipo.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* <button className="rounded-md px-1 hover:bg-gray-200" onClick={() => setAddTipo(true)}>
                                                <Plus
                                                    className="text-acento stroke-[5]"
                                                    size={30}

                                                />
                                            </button> */}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className={`flex-grow border rounded-md w-full py-2 px-2 ${errors["tipo"] ? "border-red-500" : "border-black"}`}
                                                    name="tipo"
                                                    onChange={handleChange}
                                                    placeholder="Ingrese el nombre del nuevo tipo"
                                                />
                                                <button className="rounded-md px-1 hover:bg-gray-200" onClick={() => setAddTipo(false)}>
                                                    <X
                                                        className="text-red-600 stroke-[5]"
                                                        size={30}

                                                    />
                                                </button>
                                            </div>
                                        </div>

                                    )}
                                    {errors["tipo"] && (<span className="text-sm text-red-500">{errors["tipo"]}</span>)}
                                </div>



                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="categoria"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Categoría
                                    </label>
                                    {!addCategoria && !addTipo ? (
                                        <div>
                                            <div className="flex gap-2">
                                                <select onChange={handleChange} name="categoria" defaultValue={'Default'} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["categoria"] ? "border-red-500" : "border-black"}`}>
                                                    <option value="Default" disabled hidden>Seleccione una categoria</option>
                                                    {selectOptionsCategorias.map((tipo: SelectOption) => (
                                                        <option key={tipo.value} value={tipo.value}>
                                                            {tipo.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button className="rounded-md px-1 hover:bg-gray-200" onClick={() => setAddCategoria(true)}>
                                                    <Plus
                                                        className="text-acento stroke-[5]"
                                                        size={30}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className={`border rounded-md w-full py-2 px-2 ${errors["categoria"] ? "border-red-500" : "border-black"}`}
                                                name="categoria"
                                                placeholder="Ingrese el nombre de la nueva categoría"
                                                onChange={handleChange}
                                            />

                                            {addCategoria && (
                                                <button className="rounded-md px-1 hover:bg-gray-200" onClick={() => setAddCategoria(false)}>
                                                    <X
                                                        className="text-red-600 stroke-[5]"
                                                        size={30}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {errors["categoria"] && (<span className="text-sm text-red-500">{errors["categoria"]}</span>)}
                                </div>

                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="subcategoria"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Subcategoría
                                    </label>
                                    {!addSubcategoria && !addTipo ? (
                                        <div>
                                            <div className="flex gap-2">
                                                <select onChange={handleChange} name="subcategoria" defaultValue={'Default'} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["subcategoria"] ? "border-red-500" : "border-black"}`}>
                                                    <option value="Default" disabled hidden>Seleccione una subcategoria</option>
                                                    {selectOptionsSubcategorias.map((tipo: SelectOption) => (
                                                        <option key={tipo.value} value={tipo.value}>
                                                            {tipo.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button className="rounded-md px-1 hover:bg-gray-200" onClick={() => setAddSubcategoria(true)}>
                                                    <Plus
                                                        className="text-acento stroke-[5]"
                                                        size={30}
                                                    />
                                                </button>
                                            </div>
                                            {errors["subcategoria"] && (<span className="text-sm text-red-500">{errors["subcategoria"]}</span>)}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className={`flex-grow border rounded-md w-full py-2 px-2 ${errors["subcategoria"] ? "border-red-500" : "border-black"}`}
                                                    name="subcategoria"
                                                    placeholder="Ingrese el nombre de la nueva subcategoría"
                                                    onChange={handleChange}
                                                />
                                                {addSubcategoria && (
                                                    <button className="rounded-md px-1 hover:bg-gray-200" onClick={() => setAddSubcategoria(false)}>
                                                        <X
                                                            className="text-red-600 stroke-[5]"
                                                            size={30}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                            {errors["subcategoria"] && (<span className="text-sm text-red-500">{errors["subcategoria"]}</span>)}

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
                                                    placeholder="Ingrese el costo base de la subcategoría"
                                                    onChange={handleChange}
                                                />
                                                {errors["costoBase"] && (<span className="text-sm text-red-500">{errors["costoBase"]}</span>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="pesoInicial"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Peso Inicial
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["pesoInicial"] ? "border-red-500" : "border-black"}`}
                                        name="pesoInicial"
                                        placeholder="Ingrese el peso inicial del producto"
                                        onChange={handleChange}
                                    />
                                    {errors["pesoInicial"] && (<span className="text-sm text-red-500">{errors["pesoInicial"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="pesoFinal"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Peso Final
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["pesoFinal"] ? "border-red-500" : "border-black"}`}
                                        name="pesoFinal"
                                        placeholder="Ingrese el peso final del producto"
                                        onChange={handleChange}
                                    />
                                    {errors["pesoFinal"] && (<span className="text-sm text-red-500">{errors["pesoFinal"]}</span>)}
                                </div>
                                <div className="w-full mt-3">
                                    <label
                                        htmlFor="costoExtra"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Costo Extra
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["costoExtra"] ? "border-red-500" : "border-black"}`}
                                        name="costoExtra"
                                        placeholder="Ingrese el costo extra del producto"
                                        onChange={handleChange}
                                    />
                                    {errors["costoExtra"] && (<span className="text-sm text-red-500">{errors["costoExtra"]}</span>)}
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

export default AddModal;
