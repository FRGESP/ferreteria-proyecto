"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import React from "react";

interface DireccionFormProps {
    action: (codigo: string, colonia: string, calle: string, revision: boolean, nombreColonia?:string) => void;
    codigo?: string;  // Parametros opcionales para la actualizacion de la direccion
    colonia?: string;
    calle?: string;
}

function DireccionForm({ action, codigo, colonia, calle }: DireccionFormProps) {

    //Interface para las colonias
    interface Colonia {
        Colonia: string;
        VALUE: string;
    }

    const formRef = useRef<HTMLFormElement>(null);

    //Bandera para saber si se va a actualizar la direccion
    const [isUpdate, setIsUpdate] = useState(false);

    //Bandera para verificar si ya se cargaron los datos iniciales en caso de actualizacion
    const [isLoaded, setIsLoaded] = useState(false);

    //Guarda la informacion de los propos en caso de actualizacion
    const [updateProps, setUpdateProps] = useState({
        codigo: "",
        colonia: "",
        calle: "",
    });

    //Bandera que indica si es el primer render
    const isFirstRender = useRef(true);

    //Bandera que indica si es el segundo render
    const isSecondRender = useRef(true);

    //Bandera para verificar si el codigo postal es valido
    const [isValid, setIsValid] = useState(false);

    //Guarda la informacion de las colonias
    const [colonias, setColonias] = useState<Colonia[]>([]);

    //Guarda la información del municipio
    const [municipio, setMunicipio] = useState("");

    //Guarda el valor del nombre de la colonia en caso de ser actualizacion
    const [nombreColonia, setNombreColonia] = useState("");

    //Guarda la información del estado
    const [estado, setEstado] = useState("");

    //Controla el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});

    //Guarda la informacion si los inputs han sido modificados
    const [inputModified, setInputModified] = useState({
        codigo: false,
        calle: false,
        colonia: false,
    });

    //Bandera que indica si es necesaria la revision de los inputs
    const [isRequired, setIsRequired] = useState(false);

    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        codigo: "",
        calle: "",
        colonia: "",
    });

    //Controla cada vez que el codigo postal es invalido 
    useEffect(() => {
        //Controla para evitar una temprana detección de errores
        if (isFirstRender.current) {
            isFirstRender.current = false
            console.log("Es el primer render");
            return;
        } else if (isSecondRender.current) {
            isSecondRender.current = false
            console.log("Es el segundo render");
            return;
        }
        if (isValid == false) {
            setInputValue({
                ...inputValue,
                calle: "",
                colonia: "",
            });
            action(inputValue.codigo, "", "", false), "";
            setUpdateProps({
                codigo: "",
                colonia: "",
                calle: "",
            });
        }
    }, [isValid]);

    //Controla cada vez que el input es modificado
    useEffect(() => {
        if (isValid) {
            let contModified = 0;
            Object.entries(inputModified).forEach(([Key, value]) => { // Recorre el objeto inputModified para contar cuantos objetos han sido modificados
                if (value === true) {
                    contModified++;
                }
            })
            //Si todos los inputs han sido modificados es necesario la revision
            if (contModified === 2) {
                setIsRequired(true);
            } else {
                setIsRequired(false);
            }
            console.log(inputValue)
            action(inputValue.codigo, inputValue.colonia, inputValue.calle, isRequired, nombreColonia);
        }
        if (isUpdate && !isLoaded) {
            formRef.current?.requestSubmit();
            setIsLoaded(true);
        }
    }, [inputValue]);

    //Funcion para verificar si se trata de una actualizacion
    useEffect(() => {
        if (codigo && colonia && calle) {
            setIsUpdate(true);
            setInputValue({
                codigo: codigo,
                colonia: colonia,
                calle: calle,
            });
            setInputModified({
                codigo: true,
                colonia: true,
                calle: true,
            })
            setUpdateProps({
                codigo: codigo,
                colonia: colonia,
                calle: calle,
            });
        }
    }, [codigo, colonia, calle]);

    //Controla el cambio del input
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        let selectedText: string | null = null;

        if (isUpdate) {
            if (e.target instanceof HTMLSelectElement) {
                selectedText = e.target.options[e.target.selectedIndex].text;
                console.log(selectedText);
                setNombreColonia(selectedText);
            }
        }

        const { name, value } = e.target;

        if (name === "codigo") {
            setIsValid(false);
        }

        setInputModified((prev) => ({
            ...prev,
            [name]: true,
        }));

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

    const handleSubmit = async (e: any) => {

        e.preventDefault();

        if ((isNaN(Number(inputValue.codigo)) || Number(inputValue.codigo) <= 0) && inputValue.codigo.trim() !== "") {
            setErrors((prev) => ({
                ...prev,
                codigo: "El código postal debe ser un número",
            }));
            return;
        }

        if (inputValue.codigo.length === 5) {

            console.log("No hay errores");

            const response = await axios.get(`/api/users/administrador/direcciones/${inputValue.codigo}`);
            const data = response.data;

            if (data[0].length === 0) {
                setErrors((prev) => ({
                    ...prev,
                    codigo: "El código postal no es válido",
                }));
            } else {
                setMunicipio(data[0][0].Municipio);
                setColonias(data[1]);
                setEstado(data[2][0].Estado);
                setIsValid(true);
            }

        } else {
            setErrors((prev) => ({
                ...prev,
                codigo: "El código postal debe tener 5 dígitos",
            }));
        }
    };

    return (
        <div className="w-full mt-3">
            <form onSubmit={handleSubmit} className="flex items-end gap-2" ref={formRef}>
                <div className="flex-grow">
                    <label
                        htmlFor="codigo"
                        className="font-bold text-lg flex-grow text-left"
                    >
                        Código Postal
                    </label>
                    <input
                        type="text"
                        className={`border rounded-md w-full py-2 px-2 ${errors["codigo"] ? "border-red-500" : "border-black"}`}
                        name="codigo"
                        onChange={handleChange}
                        defaultValue={codigo}
                    />

                </div>
                <button
                    hidden={isValid}
                    className={`${inputValue['codigo'].length !== 5 || isValid == true || errors['codigo'] !== undefined ? 'bg-gray-400 text-black' : 'bg-acento hover:bg-acentohover text-white'} rounded-md h-10 px-3 `}
                    onClick={handleSubmit}
                >
                    <Check strokeWidth={2} size={27} />
                </button>
            </form>
            {errors["codigo"] && (<span className="text-sm text-red-500">{errors["codigo"]}</span>)}
            {isValid && (
                <div>
                    <div className="w-full mt-3">
                        <label
                            htmlFor="municipio"
                            className="font-bold text-lg flex-grow text-left"
                        >
                            Municipio
                        </label>
                        <input
                            type="text"
                            className={`border rounded-md w-full py-2 px-2 ${errors["municipio"] ? "border-red-500" : "border-black"}`}
                            name="municipio"
                            defaultValue={municipio}
                            disabled
                        />
                    </div>
                    <div className="w-full mt-3">
                        <label
                            htmlFor="estado"
                            className="font-bold text-lg flex-grow text-left"
                        >
                            Estado
                        </label>
                        <input
                            type="text"
                            className={`border rounded-md w-full py-2 px-2 ${errors["estado"] ? "border-red-500" : "border-black"}`}
                            name="estado"
                            defaultValue={estado}
                            disabled
                        />
                    </div>
                    <div className="w-full mt-3">
                        <label className="font-bold text-lg flex-grow text-left" htmlFor="colonia">
                            Colonia
                        </label>
                        <select onChange={handleChange} name="colonia" defaultValue={isUpdate && updateProps.colonia.length != 0 ? updateProps.colonia : "Default"} className={`border rounded-md w-full py-2 px-2 ${errors["rol"] ? "border-red-500" : "border-black"}`}
                        >
                            {(!isUpdate || updateProps.colonia.length == 0) && (<option value="Default" disabled>Seleccione una colonia</option>)}
                            {colonias.map((colonia) => (
                                <option key={colonia.VALUE} value={colonia.VALUE}>
                                    {colonia.Colonia}
                                </option>
                            ))}
                        </select>
                        {errors["colonia"] && (<span className="text-sm text-red-500">{errors["colonia"]}</span>)}
                    </div>
                    <div className="w-full mt-3">
                        <label
                            htmlFor="calle"
                            className="font-bold text-lg flex-grow text-left"
                        >
                            Calle
                        </label>
                        <input
                            type="text"
                            className={`border rounded-md w-full py-2 px-2 ${errors["calle"] ? "border-red-500" : "border-black"}`}
                            name="calle"
                            defaultValue={isUpdate ? updateProps.calle : ""}
                            onChange={handleChange}
                        />
                        {errors["calle"] && (<span className="text-sm text-red-500">{errors["calle"]}</span>)}
                    </div>
                </div>
            )}

        </div>
    );
}

export default DireccionForm;
