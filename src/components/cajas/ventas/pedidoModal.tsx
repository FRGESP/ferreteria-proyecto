"use client";

import { useState, useEffect, use } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Check } from "lucide-react";
import axios from "axios";
import { pago, addPedido } from "@/actions";


interface PedidoModalProps {
    onGuardado: () => void;
    totalVenta: number;
    IdCliente: string;
}

function PedidoModal({ onGuardado, totalVenta, IdCliente }: PedidoModalProps) {

    const { toast } = useToast();

    //Controla el estado del modal
    const [isOpen, setIsOpen] = useState(false);

    //Controla el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});


    //Bandera para verificar si es valido
    const [isValid, setIsValid] = useState(false);



    //Guarda la informacion del input
    const [inputValue, setInputValue] = useState({
        receptor: "",
        metodoPago: "",
        credito: "",
        montoCredito: "",
        titular: "",
        banco: "",
        concepto: "",
        numeroCheque: "",
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
            receptor: "",
            metodoPago: "",
            credito: "",
            montoCredito: "",
            titular: "",
            banco: "",
            concepto: "",
            numeroCheque: "",
        });
        setIsValid(false);
    };

    //Funcion para verificar si el credito es valido
    const verificarCredito = async (e:any) => {
        e.preventDefault();
        console.log(inputValue.montoCredito);
        if (inputValue.montoCredito.trim() === "") {
            setErrors((prev) => ({
                ...prev,
                montoCredito: "Este campo es obligatorio",
            }));
            return;
        }
        if( isNaN(Number(inputValue.montoCredito)) || Number(inputValue.montoCredito) <= 0) {
            setErrors((prev) => ({
                ...prev,
                montoCredito: "El monto debe ser un número positivo",
            }));
            return;
        }
        if( Number(inputValue.montoCredito) > totalVenta) {
            setErrors((prev) => ({
                ...prev,
                montoCredito: `El monto no puede ser mayor al total de la venta ($${totalVenta}).`,
            }));
            return;
        }

        const response = await axios.post(`/api/users/cajero/ventas/pedidos`,{
            montoCredito: inputValue.montoCredito,
            cliente: IdCliente,
        });
        const data = response.data;
        console.log(data.Deficit);
        if(data.Deficit !== 0){
            setErrors((prev) => ({
                ...prev,
                montoCredito: `El cliente tiene un déficit de $${data.Deficit}, no puede aplicar crédito. Crédito máximo de $${data.Credito}.`,
            }));
            setIsValid(false);
        } else{
            setErrors((prev) => ({
                ...prev,
                montoCredito: "",
            }));
            setIsValid(true);
        }
        console.log(response.data);
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
            if(inputValue.metodoPago ===  "Transferencia") {
                if (Key === "titular" || Key === "banco" || Key === "concepto") {
                    if (value.trim() === "") {
                        newErrors[Key] = "Este campo es obligatorio";
                    }
                }
            }
            if(inputValue.metodoPago ===  "Cheque") {
                if (Key === "titular" || Key === "banco" || Key === "numeroCheque") {
                    if (value.trim() === "") {
                        newErrors[Key] = "Este campo es obligatorio";
                    }
                    if (Key === "numeroCheque" && isNaN(Number(value))) {
                        newErrors[Key] = "El número de cheque debe ser numérico";
                    }
                }
            }
            if(inputValue.credito === "si") {
                if (Key === "montoCredito") {
                    if (value.trim() === "") {
                        newErrors[Key] = "Este campo es obligatorio";
                    } 
                }
                if (Key === "montoCredito" && !isValid) {
                    newErrors[Key] = "El crédito no ha sido verificado o no es válido";
                }
            }
            if( (Key === "receptor" || Key === "metodoPago" || Key === "credito") && value.trim() === "") {
                newErrors[Key] = "Este campo es obligatorio";
            }
        })

        setErrors(newErrors);


        if (Object.keys(newErrors).length == 0) {
            
            const metodoPago = inputValue.metodoPago === "Efectivo" ? 1 : inputValue.metodoPago === "Transferencia" ? 2 : 3;
            
            let info;

            if(metodoPago === 1) {
                info = {
                    montoPago: totalVenta - (inputValue.credito === "si" ? Number(inputValue.montoCredito) : 0),
                };
            } else if(metodoPago === 2) {
                info = {
                    montoPago: totalVenta - (inputValue.credito === "si" ? Number(inputValue.montoCredito) : 0),
                    titular: inputValue.titular,
                    banco: inputValue.banco,
                    concepto: inputValue.concepto,
                };
            } else if(metodoPago === 3) {
                info = {
                    montoPago: totalVenta - (inputValue.credito === "si" ? Number(inputValue.montoCredito) : 0),
                    titular: inputValue.titular,
                    banco: inputValue.banco,
                    numeroCheque: inputValue.numeroCheque,
                };
            }

            const IdPago = await pago(info, metodoPago); 

            if(IdPago) {
                const response = await addPedido({
                    receptor: inputValue.receptor,
                    montoCredito: inputValue.credito === "si" ? Number(inputValue.montoCredito) : 0,
                    idPago: IdPago,
                    monto: totalVenta,
                    metodoPago: inputValue.metodoPago,
                })
                if (response === 200) {
                setIsOpen(false);

                toast({
                    title: "Pedido agregado",
                    description: "El pedido ha sido realizado de manera exitosa",
                    variant: "success",
                });
                onGuardado();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo realizar el pedido",
                    variant: "destructive",
                });
            }
            }
        }
    };

    useEffect(() => {
        setInputValue((prev) => ({
            ...prev,
            titular: "",
            banco: "",
            concepto: "",
            numeroCheque: "",
        }));
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.titular;
            delete newErrors.banco;
            delete newErrors.concepto;
            delete newErrors.numeroCheque;
            return newErrors;
        });
    }, [inputValue.metodoPago])

    useEffect(() => {
        if (inputValue.credito === "si") {
            setIsValid(false);
        }
    }, [inputValue.montoCredito])

    return (
        <div>
            <button onClick={openModal} className={`mt-2 w-full bg-acento hover:bg-acentohover text-white rounded-xl py-3 font-semibold transition duration-200`}>
                Terminar Pedido
            </button>

            {isOpen && (
                <div className="flex items-center justify-center">
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-[40%] w-full max-h-[90vh] h-auto overflow-y-auto">
                            <p className="font-bold text-2xl text-center mb-5">
                                Terminar Pedido
                            </p>
                            <div className="flex justify-center flex-col items-center py-3">
                                <div className="w-full">
                                    <label
                                        htmlFor="receptor"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Receptor del pedido
                                    </label>
                                    <input
                                        type="text"
                                        className={`border rounded-md w-full py-2 px-2 ${errors["receptor"] ? "border-red-500" : "border-black"}`}
                                        autoFocus
                                        name="receptor"
                                        onChange={handleChange}
                                    />
                                    {errors["receptor"] && (<span className="text-sm text-red-500">{errors["receptor"]}</span>)}
                                </div>
                                <div className=" w-full mt-3">
                                    <label
                                        htmlFor="credito"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Crédito a cuenta
                                    </label>
                                    <select onChange={handleChange} name="credito" defaultValue={''} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["metodoPago"] ? "border-red-500" : "border-black"}`}>
                                        <option value="" disabled hidden>Seleccione una opción</option>
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select>
                                    {errors["credito"] && (<span className="text-sm text-red-500">{errors["credito"]}</span>)}
                                </div>

                                {inputValue.credito === "si" && (
                                    <div className="w-full mt-3">
                                        <form onSubmit={verificarCredito} className="flex items-end gap-2">
                                            <div className="flex-grow">
                                                <label
                                                    htmlFor="montoCredito"
                                                    className="font-bold text-lg flex-grow text-left"
                                                >
                                                    Monto del crédito
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`border rounded-md w-full py-2 px-2 ${errors["montoCredito"] ? "border-red-500" : "border-black"} ${isValid ? "border-green-500" : ""}`}
                                                    name="montoCredito"
                                                    onChange={handleChange}
                                                    // defaultValue={codigo}
                                                />
                                            </div>
                                            <button
                                                hidden={isValid}
                                                className={`${isValid == true ? 'bg-gray-400 text-black' : 'bg-acento hover:bg-acentohover text-white'} rounded-md h-10 px-3 `}
                                                onClick={verificarCredito}
                                            >
                                                <Check strokeWidth={2} size={27} />
                                            </button>
                                        </form>
                                        {errors["montoCredito"] && (<span className="text-sm text-red-500">{errors["montoCredito"]}</span>)}
                                        {(!errors["montoCredito"] && isValid) && (<span className="text-sm text-green-500">Crédito Aprobado.</span>)}
                                    </div>
                                )}
                                <div className=" w-full mt-3">
                                    <label
                                        htmlFor="metodoPago"
                                        className="font-bold text-lg flex-grow text-left"
                                    >
                                        Método de pago
                                    </label>
                                    <select onChange={handleChange} name="metodoPago" defaultValue={''} className={`flex-grow border rounded-md w-full py-3 px-2 ${errors["metodoPago"] ? "border-red-500" : "border-black"}`}>
                                        <option value="" disabled hidden>Seleccione un método de pago</option>
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia">Transferencia bancaria</option>
                                        <option value="Cheque">Cheque</option>

                                    </select>
                                    {errors["metodoPago"] && (<span className="text-sm text-red-500">{errors["metodoPago"]}</span>)}
                                </div>
                                {inputValue.metodoPago === "Transferencia" && (
                                    <div className="w-full">
                                        <div className="w-full mt-3">
                                            <label
                                                htmlFor="titular"
                                                className="font-bold text-lg flex-grow text-left"
                                            >
                                                Titular
                                            </label>
                                            <input
                                                type="text"
                                                className={`border rounded-md w-full py-2 px-2 ${errors["titular"] ? "border-red-500" : "border-black"}`}
                                                name="titular"
                                                onChange={handleChange}
                                            />
                                            {errors["titular"] && (<span className="text-sm text-red-500">{errors["titular"]}</span>)}
                                        </div>
                                        <div className="w-full mt-3">
                                            <label
                                                htmlFor="banco"
                                                className="font-bold text-lg flex-grow text-left"
                                            >
                                                Banco
                                            </label>
                                            <input
                                                type="text"
                                                className={`border rounded-md w-full py-2 px-2 ${errors["banco"] ? "border-red-500" : "border-black"}`}
                                                name="banco"
                                                onChange={handleChange}
                                            />
                                            {errors["banco"] && (<span className="text-sm text-red-500">{errors["banco"]}</span>)}
                                        </div>
                                        <div className="w-full mt-3">
                                            <label
                                                htmlFor="concepto"
                                                className="font-bold text-lg flex-grow text-left"
                                            >
                                                Concepto
                                            </label>
                                            <input
                                                type="text"
                                                className={`border rounded-md w-full py-2 px-2 ${errors["concepto"] ? "border-red-500" : "border-black"}`}
                                                name="concepto"
                                                onChange={handleChange}
                                            />
                                            {errors["concepto"] && (<span className="text-sm text-red-500">{errors["concepto"]}</span>)}
                                        </div>
                                    </div>
                                )}
                                {inputValue.metodoPago === "Cheque" && (
                                    <div className="w-full">
                                        <div className="w-full mt-3">
                                            <label
                                                htmlFor="titular"
                                                className="font-bold text-lg flex-grow text-left"
                                            >
                                                Titular
                                            </label>
                                            <input
                                                type="text"
                                                className={`border rounded-md w-full py-2 px-2 ${errors["titular"] ? "border-red-500" : "border-black"}`}
                                                name="titular"
                                                onChange={handleChange}
                                            />
                                            {errors["titular"] && (<span className="text-sm text-red-500">{errors["titular"]}</span>)}
                                        </div>
                                        <div className="w-full mt-3">
                                            <label
                                                htmlFor="numeroCheque"
                                                className="font-bold text-lg flex-grow text-left"
                                            >
                                                Número de Cheque
                                            </label>
                                            <input
                                                type="text"
                                                className={`border rounded-md w-full py-2 px-2 ${errors["numeroCheque"] ? "border-red-500" : "border-black"}`}
                                                name="numeroCheque"
                                                onChange={handleChange}
                                            />
                                            {errors["numeroCheque"] && (<span className="text-sm text-red-500">{errors["numeroCheque"]}</span>)}
                                        </div>
                                        <div className="w-full mt-3">
                                            <label
                                                htmlFor="banco"
                                                className="font-bold text-lg flex-grow text-left"
                                            >
                                                Banco
                                            </label>
                                            <input
                                                type="text"
                                                className={`border rounded-md w-full py-2 px-2 ${errors["banco"] ? "border-red-500" : "border-black"}`}
                                                name="banco"
                                                onChange={handleChange}
                                            />
                                            {errors["banco"] && (<span className="text-sm text-red-500">{errors["banco"]}</span>)}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 text-center">
                                    <p className="text-2xl font-bold text-gray-700">Total a pagar</p>
                                    <p className="text-3xl font-semibold text-green-600">
                                        ${isValid ? (totalVenta - Number(inputValue.montoCredito)).toFixed(2) : totalVenta}
                                    </p>
                                </div>
                                {/* <button disabled={(productos.length > 0 && clienteSeleccionado) ? false : true} className={`mt-2 w-full ${productos.length > 0 && clienteSeleccionado ? "bg-acento hover:bg-acentohover" : "bg-gray-400"} text-white rounded-xl py-3 font-semibold transition duration-200`}>
                                    Terminar Pedido
                                </button> */}
                                <button onClick={handleSubmit} className={`mt-2 w-full bg-acento hover:bg-acentohover text-white rounded-xl py-3 font-semibold transition duration-200`}>
                                    Terminar Pedido
                                </button>

                                {/* <button onClick={() => handleDeletePedido(numeroNotaVenta)} disabled={(clienteSeleccionado && (numeroNotaVenta != 0 || productos.length > 0)) ? false : true} className={`w-full ${clienteSeleccionado && (numeroNotaVenta != 0 || productos.length > 0) ? "bg-red-500 hover:bg-red-700" : "bg-gray-400"} text-white rounded-xl py-3 font-semibold transition duration-200`}>
                                    Cancelar
                                </button> */}

                                <button onClick={closeModal} className={`mt-2 w-full bg-red-500 hover:bg-red-700 text-white rounded-xl py-3 font-semibold transition duration-200`}>
                                    Cancelar
                                </button>

                                {/* <div className="flex gap-5 justify-center">
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
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default PedidoModal;
