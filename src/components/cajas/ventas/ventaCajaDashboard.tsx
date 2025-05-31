"use client"
import { useState, useEffect, use } from "react";
import axios from "axios";
import { X, Search, ArrowRight, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import AddClienteModal from "@/components/cajas/ventas/addClienteModal";
import { getNotaVenta, addProductoVenta, getNotaNumber, deleteVenta } from "@/actions";
import PedidoModal from "@/components/cajas/ventas/pedidoModal";

function VentaCajaDashboard() {

    const router = useRouter();
    const { toast } = useToast();

    //Interface para los productos
    interface Producto {
        IdNotaProducto: number;
        IdProducto: number;
        Descripcion: string;
        PrecioUnitario: string;
        Piezas: string;
        Stock: string;
        Importe: string
    }

    interface paginacion {
        NumeroPaginas: number;
    }

    //interface para los nombres de los productos
    interface Nombres {
        Id: string;
        Descripcion: string;
    }


    //Controla el estado de los errores
    const [errors, setErrors] = useState<Record<string, string>>({});

    //Guarda los nombres de los productos o de cualquier otra información
    const [nombresProductos, setNombresProductos] = useState<Nombres[]>([]);

    //Guarda la informacion de los nombres de los clientes 
    const [nombresClientes, setNombresClientes] = useState<Nombres[]>([]);

    //Guarda la informacion del cliente seleccionado
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Nombres | null>(null);

    //Guarda la informacion del producto seleccionado
    const [productoSeleccionado, setProductoSeleccionado] = useState<Nombres | null>(null);

    //Bandera para saber si se esta buscando un cliente
    const [isSearchingCliente, setIsSearchingCliente] = useState(false);

    //Bandera para saber si se esta buscando un producto
    const [isSearchingProducto, setIsSearchingProducto] = useState(false);

    //Guarda la informacion de los productos
    const [productos, setProductos] = useState<Producto[]>([]);

    //Numero de productos
    const [numeroProductos, setNumeroProductos] = useState(0);

    //Total de la venta
    const [totalVenta, setTotalVenta] = useState(0);

    //Total de envío
    const [totalEnvio, setTotalEnvio] = useState(0);

    //Guarda el numero de la nota de venta
    const [numeroNotaVenta, setNumeroNotaVenta] = useState(0);

    //Guarda la informacion de la busqueda
    const [inputValue, setInputValue] = useState({
        nombreCliente: "",
        nombreProducto: "",
        piezas: "1",
    })

    //Bandera para actualizar la tabla
    const [update, setUpdate] = useState(false);

    //Bandera para actualizar la tabla
    const [finPedido, setFinPedido] = useState(false);

    const getNombres = async () => {
        const response = await axios.get('/api/users/cajero/ventas');
        setNombresClientes(response.data[0]);
        setNombresProductos(response.data[1]);
    }
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value,
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

        if (name === "piezas") {
            if (isNaN(value) || parseInt(value) <= 0) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "Este campo debe ser un número válido y mayor a 0",
                }));
            }
            else {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }

        }
        console.log(inputValue);
    }

    const handleDelete = async (id: number) => {
        const response = await axios.delete(`/api/users/cajero/ventas/${id}`);
        if (response.status === 200) {
            toast({
                title: "Producto eliminado",
                description: "El producto ha sido eliminado correctamente",
                variant: "success",
            });
            getNotaVentaData();
        }
        else {
            toast({
                title: "Error",
                description: "No se pudo eliminar el producto",
                variant: "destructive",
            });
        }
    }

    const handleDeletePedido = async (id: number) => {
        if (confirm("¿Estás seguro de que deseas cancelar el pedido?")) {
            const response = await deleteVenta(id);
            if (response === 200) {
                toast({
                    title: "Pedido eliminado",
                    description: "El Pedido ha sido eliminado correctamente",
                    variant: "success",
                });
                setClienteSeleccionado(null);
                setProductos([]);
                setTotalVenta(0);
                setNumeroProductos(0);
                setTotalEnvio(0);
                setNumeroNotaVenta(0);
                getNombres();
                setProductoSeleccionado(null);
            }
            else {
                toast({
                    title: "Error",
                    description: "No se pudo eliminar el Pedido",
                    variant: "destructive",
                });
            }
        }
    }

    const handleAddProducto = async (e: any) => {
        e.preventDefault();
        if (!errors["piezas"]) {
            console.log("Agregar producto");
            setProductoSeleccionado(null);
            setInputValue({
                ...inputValue,
                piezas: "1",
            });
            await addProducto();
        }
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();

        // Quitar el focus del input activo
        (document.activeElement as HTMLElement)?.blur();
    }

    //Para que el input de piezas se ponga en focus
    const focusInputPiezas = () => {
        const inputPiezas = document.getElementById("inputPiezas") as HTMLInputElement;
        inputPiezas.focus();
    }

    //Para que el input de producto se ponga en focus
    const focusInputProducto = () => {
        const inputNombreProducto = document.getElementById("inputNombreProducto") as HTMLInputElement;
        inputNombreProducto.focus();
    }

    //Funcion para obtener la nota de venta
    const getNotaVentaData = async () => {
        console.log("Obteniendo nota de venta");
        const response = await getNotaVenta();
        console.log("Response de la nota de venta", response);
        if (response) {
            setClienteSeleccionado(nombresClientes.find(cliente => Number(cliente.Id) == response[4][0].IdCliente) || null);
            console.log("Cliente res:", response[4][0].IdCliente);
            console.log("Nombres clientes:", nombresClientes);
            console.log("Cliente seleccionado:", clienteSeleccionado);
            setProductos(response[0]);
            setTotalVenta(response[1][0].Total);
            setNumeroProductos(response[2][0].NumeroProductos);
            setTotalEnvio(response[3][0].Cargo);
        } else {
            toast({
                title: "Error",
                description: "No se pudo obtener la nota de venta",
                variant: "destructive",
            });
        }
    }

    //Funcion para añdir productos a la venta
    const addProducto = async () => {
        if (clienteSeleccionado && productoSeleccionado) {
            const response = await addProductoVenta({
                "producto": productoSeleccionado.Id,
                "cliente": clienteSeleccionado.Id,
                "piezas": inputValue.piezas,
            });
            if (response == -1) {
                toast({
                    title: "Error",
                    description: "No se pudo agregar el producto, el stock es 0",
                    variant: "destructive",
                });
            }
            if (response != 0) {
                setErrors({
                    ...errors,
                    [productoSeleccionado.Id]: "1",
                });
                setTimeout(function () {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[productoSeleccionado.Id];
                        return newErrors;
                    });
                }, 1500);
                setErrors({
                    ...errors,
                    [productoSeleccionado.Id]: "1",
                });
                setTimeout(function () {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[productoSeleccionado.Id];
                        return newErrors;
                    });
                }, 1500);

            }
        }
        getNotaVentaData();
    }

    const getNumeroNotaVenta = async () => {
        const result = await getNotaNumber();
        console.log("Resultado de getNotaNumber:", result);
        if (result != 0) {
            setNumeroNotaVenta(result);
            getNotaVentaData();
        }
    }

    const nombresClientesFiltrados = nombresClientes.filter((nombre) =>
        nombre.Descripcion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(inputValue.nombreCliente.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
    );

    const nombresProductosFiltrados = nombresProductos.filter((nombre) =>
        nombre.Descripcion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(inputValue.nombreProducto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
    );


    useEffect(() => {
        const fetchNombres = async () => {
            await getNombres();
        };
        fetchNombres();
    }, [])

    useEffect(() => {
        getNumeroNotaVenta();
    }, [nombresClientes])

    useEffect(() => {
        if (update) {
            getNombres();
            setUpdate(false);
        }
    }, [update]);

    useEffect(() => {
        if (finPedido) {
            setClienteSeleccionado(null);
            setProductos([]);
            setTotalVenta(0);
            setNumeroProductos(0);
            setTotalEnvio(0);
            setNumeroNotaVenta(0);
            getNombres();
            setProductoSeleccionado(null);
        }
        setFinPedido(false);
    }, [finPedido]);

    useEffect(() => {
        if (productoSeleccionado) {
            focusInputPiezas();
            setInputValue({
                ...inputValue,
                nombreProducto: "",
            });
        } else {
            if (clienteSeleccionado) {
                focusInputProducto();
            }
        }
    }, [productoSeleccionado, clienteSeleccionado]);

    return (
        <div className='flex flex-col h-[90vh] w-full p-[1%] gap-3 bg-[#F5F5F5]'>
            <div className='flex-[5] flex flex-col gap-2 '>
                <div className='flex-[1] overflow-y-auto flex justify-center items-center rounded-lg border border-[#c9c9c9d7] border-solid] bg-white'>
                    {!clienteSeleccionado && (
                        <form className="relative w-[50%] mr-1" onSubmit={handleSearch}>
                            {!clienteSeleccionado && (
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-gray-500" size={20} />
                                </span>)}
                            <input
                                type="text"
                                name="nombreCliente"
                                disabled={clienteSeleccionado ? true : false}
                                onChange={handleChange}
                                value={inputValue.nombreCliente}
                                onFocus={() => setIsSearchingCliente(true)}
                                onBlur={() => setTimeout(() => setIsSearchingCliente(false), 300)}
                                autoComplete="off"
                                className="w-full border border-gray-400 shadow-lg rounded-2xl py-2 pl-10 pr-3 text-lg"
                                placeholder={`Buscar Cliente`}
                            />
                            {isSearchingCliente && (
                                <ul className="fixed top-[15] left-15 z-50 mt-2 rounded shadow bg-white max-h-60 h-fit overflow-y-auto">
                                    {nombresClientesFiltrados.length > 0 ? (
                                        nombresClientesFiltrados.map((nombre) => (
                                            <li
                                                key={nombre.Id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => { setClienteSeleccionado(nombre); (document.activeElement as HTMLElement)?.blur(); }}
                                            >
                                                {nombre.Descripcion}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-2 text-gray-500">No hay resultados</li>
                                    )}
                                </ul>
                            )}
                        </form>
                    )}
                    {clienteSeleccionado && (
                        <p className="text-2xl mr-1"><span className="font-bold">Cliente:</span> {clienteSeleccionado?.Descripcion}</p>
                    )}
                    {!clienteSeleccionado && (<AddClienteModal onGuardado={() => setUpdate(true)} />)}
                    {(clienteSeleccionado && productos.length == 0 && numeroNotaVenta == 0) && (<button className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded" onClick={() => setClienteSeleccionado(null)}><X strokeWidth={4} size={40} /></button>)}
                </div>
                <div className='flex-[6] rounded-lg border border-[#c9c9c9d7] border-solid] bg-white'>
                    <div className='flex h-full w-full'>
                        <div className="flex-1 flex-col overflow-y-auto flex border-r border-gray-200 border-solid p-5 max-h-[60vh]">
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="bg-white">ID</th>
                                            <th className="px-4 py-2 bg-white">Producto</th>
                                            <th className="px-4 py-2 bg-white">Piezas</th>
                                            <th className="px-4 py-2 bg-white">Stock</th>
                                            <th className="px-4 py-2 bg-white">Precio Unitario</th>
                                            <th className="px-4 py-2 bg-white">Importe</th>
                                            <th className="bg-white"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <button
                                            className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded border-none"
                                            onClick={() => console.log("Eliminar producto")}
                                        >
                                            <Trash strokeWidth={2} size={20} />
                                        </button> */}
                                        {productos.length > 0 ? (
                                            productos.map((producto) => (
                                                <tr key={producto.IdNotaProducto} className={`transition-colors duration-200 hover:bg-gray-100 ${errors[producto.IdProducto] ? "bg-yellow-300" : "bg-white"}`}>
                                                    <td className="px-4 py-2">{producto.IdProducto}</td>
                                                    <td className="px-4 py-2">{producto.Descripcion}</td>
                                                    <td className="px-4 py-2">{producto.Piezas}</td>
                                                    <td className="px-4 py-2">{producto.Stock}</td>
                                                    <td className="px-4 py-2">${producto.PrecioUnitario}</td>
                                                    <td className="px-4 py-2">${producto.Importe}</td>
                                                    <td className="px-4 py-2">
                                                        <button
                                                            className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded border-none"
                                                            onClick={() => handleDelete(producto.IdNotaProducto)}
                                                        >
                                                            <Trash strokeWidth={2} size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="text-center py-4">No hay productos en la venta</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="w-1/3 flex p-4 justify-center items-center">
                            <div className="bg-white w-full shadow-lg rounded-2xl p-6 flex flex-col items-center gap-1 border border-gray-200">
                                <div className="w-full text-center space-y-1">
                                    <p className="text-gray-600 text-base">Número de Productos</p>
                                    <p className="text-lg font-medium">{numeroProductos ? numeroProductos : 0}</p>
                                    <p className="text-gray-600 text-base">Costo de Envío</p>
                                    <p className="text-lg font-medium">${totalEnvio}</p>

                                    <p className="text-gray-600 text-base">Total de Productos</p>
                                    <p className="text-lg font-medium">${totalVenta - totalEnvio}</p>
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-xl font-bold text-gray-700">Total</p>
                                    <p className="text-3xl font-semibold text-green-600">
                                        ${totalVenta}
                                    </p>
                                </div>
                                {(productos.length > 0 && clienteSeleccionado) ? (
                                    <div className="w-full">
                                        <PedidoModal onGuardado={() => setFinPedido(true)} totalVenta={totalVenta} IdCliente={clienteSeleccionado.Id} />
                                    </div>
                                ) : (<button disabled={(productos.length > 0 && clienteSeleccionado) ? false : true} className={`mt-2 w-full ${productos.length > 0 && clienteSeleccionado ? "bg-acento hover:bg-acentohover" : "bg-gray-400"} text-white rounded-xl py-3 font-semibold transition duration-200`}>
                                    Terminar Pedido
                                </button>)}

                                <button onClick={() => handleDeletePedido(numeroNotaVenta)} disabled={(clienteSeleccionado && (numeroNotaVenta != 0 || productos.length > 0)) ? false : true} className={`w-full ${clienteSeleccionado && (numeroNotaVenta != 0 || productos.length > 0) ? "bg-red-500 hover:bg-red-700" : "bg-gray-400"} text-white rounded-xl py-3 font-semibold transition duration-200`}>
                                    Cancelar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-[1] justify-center overflow-y-auto rounded-lg border border-[#c9c9c9d7] border-solid] bg-white'>
                <div className='h-full w-[100%] overflow-y-auto flex justify-center items-center'>
                    <form className="relative w-[50%]" onSubmit={handleSearch}>
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-500" size={20} />
                        </span>
                        <input
                            type="text"
                            name="nombreProducto"
                            id="inputNombreProducto"
                            onChange={handleChange}
                            disabled={productoSeleccionado || !clienteSeleccionado ? true : false}
                            value={productoSeleccionado ? productoSeleccionado.Descripcion : inputValue.nombreProducto}
                            onFocus={() => setIsSearchingProducto(true)}
                            onBlur={() => setTimeout(() => setIsSearchingProducto(false), 300)}
                            autoComplete="off"
                            className="w-full border border-gray-400 shadow-lg rounded-2xl py-2 pl-10 pr-3 text-lg"
                            placeholder={`Buscar Producto`}
                        />
                        {isSearchingProducto && (
                            <ul className="fixed bottom-[13%]  left-[2] z-50 mt-2 rounded shadow bg-white max-h-60 h-fit overflow-y-auto">
                                {nombresProductosFiltrados.length > 0 ? (
                                    nombresProductosFiltrados.map((nombre) => (
                                        <li
                                            key={nombre.Id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => { setProductoSeleccionado(nombre); (document.activeElement as HTMLElement)?.blur(); }}
                                        >
                                            {nombre.Descripcion}
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-2 text-gray-500">No hay resultados</li>
                                )}
                            </ul>
                        )}
                    </form>

                    {productoSeleccionado && (<button className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded" onClick={() => setProductoSeleccionado(null)}><X strokeWidth={4} size={45} /></button>)}
                    <div className="flex justify-center items-center ml-[2%]">
                        <form onSubmit={handleAddProducto} className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        name="piezas"
                                        disabled={productoSeleccionado ? false : true}
                                        onChange={handleChange}
                                        value={inputValue.piezas}
                                        autoComplete="off"
                                        id="inputPiezas"
                                        className="w-fit border border-gray-400 shadow-lg rounded-2xl py-2 pl-5 pr-3 text-lg"
                                        placeholder={`Número de Piezas`}
                                    />
                                    {productoSeleccionado && (<button className="hover:bg-gray-200 text-green-600 ml-2 py-1 rounded" onClick={handleAddProducto}><ArrowRight strokeWidth={4} size={40} /></button>
                                    )}
                                </div>
                                {errors["piezas"] && (<span className="text-sm text-red-500">{errors["piezas"]}</span>)}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VentaCajaDashboard