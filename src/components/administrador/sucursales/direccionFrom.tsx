"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import React, {useImperativeHandle, forwardRef} from "react";

interface DireccionFormProps {
    action: (codigo: string, colonia: string, calle: string) => void;
}

function DireccionForm({ action }: DireccionFormProps) {

    //Interface para las colonias
    interface Colonia {
        Colonia: string;
        VALUE: string;
    }

    //Bandera para verificar si el codigo postal es valido
    const [isValid, setIsValid] = useState(false);

    //Guarda la informacion de las colonias
    const [colonias, setColonias] = useState<Colonia[]>([]);

    //Guarda la información del municipio
    const [municipio, setMunicipio] = useState("");

    //Controla el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});


    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        codigo: "",
        calle: "",
        colonia: "",
    });

    //Controla cada vez que el codigo postal es invalido 
    useEffect(() => {
        if(isValid == false) {
            setInputValue({
            ...inputValue,
            calle: "",
            colonia: "",
        });
        }
    }, [isValid]);

    //Controla el cambio del input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "codigo") {
            setIsValid(false);
        }

        setInputValue({
            ...inputValue,
            [name]: value,
        });
        console.log(inputValue);

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

        if (isValid) {
            action(inputValue.codigo, inputValue.colonia, inputValue.calle);
        }
    };

    const handleSubmit = async (e: any) => {

        e.preventDefault();
        console.log("Submit");

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
                console.log(data);
                setMunicipio(data[0][0].Municipio);
                setColonias(data[1]);
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
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <div className="flex-grow">
                    <label
                        htmlFor="codigo"
                        className="font-bold text-lg flex-grow text-left"
                    >
                        Código Postal
                    </label>
                    <input
                        type="number"
                        className={`border rounded-md w-full py-2 px-2 ${errors["codigo"] ? "border-red-500" : "border-black"}`}
                        name="codigo"
                        onChange={handleChange}
                    />

                </div>
                <button
                    //disabled={inputValue['codigo'].length !== 5 || isValid == true || errors['codigo'] !== undefined}
                    hidden={isValid}
                    className={`${inputValue['codigo'].length !== 5 || isValid == true || errors['codigo'] !== undefined ? 'bg-gray-400 text-black':'bg-acento hover:bg-acentohover text-white'} rounded-md h-10 px-3 `}
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
                        <label className="font-bold text-lg flex-grow text-left" htmlFor="colonia">
                            Colonia
                        </label>
                        <select onChange={handleChange} name="colonia" defaultValue={'Default'} className={`border rounded-md w-full py-2 px-2 ${errors["rol"] ? "border-red-500" : "border-black"}`}
                        >
                            <option value="Default" disabled>Seleccione una colonia</option>
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
                            htmlFor="nombre"
                            className="font-bold text-lg flex-grow text-left"
                        >
                            Calle
                        </label>
                        <input
                            type="text"
                            className={`border rounded-md w-full py-2 px-2 ${errors["calle"] ? "border-red-500" : "border-black"}`}
                            name="calle"
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
