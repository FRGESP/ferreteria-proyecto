"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import AddModal from "@/components/administrador/productos/addModal";
import UpdateModal from "@/components/administrador/clientes/updateModal";
import { deleteProducto } from "@/actions";


function ProductosDashboard() {

    const router = useRouter();
    const { toast } = useToast();

    interface Producto {
        IdProducto: number;
        Descripcion: string;
        Tipo: string;
        Categoria: string;
        Subcategoria: string;
        PesoPromedio: string;
        CostoBase: string;
        CostoExtra: string;
        Precio: string;
    }

    interface Tipo {
        IdTipo: number;
        Tipo: string;
        Cantidad: string;
    }

    //Interface para los selects
    interface SelectOption {
        value: string;
        label: string;
    }

    interface paginacion {
        NumeroPaginas: number;
    }

    //interface para los nombres de los productos
    interface Nombres {
        Id: string;
        Descripcion: string;
    }

    //Guarda la informacion de los selects de tipos
    const [selectOptionsTipos, setSelectOptionsTipos] = useState<SelectOption[]>([]);

    //Guarda la informacion de los selects de categorias
    const [selectOptionsCategorias, setSelectOptionsCategorias] = useState<SelectOption[]>([]);

    //Guarda la informacion de los selects de subcategorias
    const [selectOptionsSubcategorias, setSelectOptionsSubcategorias] = useState<SelectOption[]>([]);

    //Guarda la informacion de los selects de rangos
    const [selectOptionsRangos, setSelectOptionsRangos] = useState<SelectOption[]>([]);

    //Pagina actual
    const [currentPage, setCurrentPage] = useState(1);

    //Numero de paginas 
    const [totalPages, setTotalPages] = useState<paginacion>();

    //Guarda la informacion de los Productos
    const [Productos, setProductos] = useState<Producto[]>([]);

    //Guarda la informacion de los tipos
    const [Tipos, setTipos] = useState<Tipo[]>([]);

    //Guarda los nombres de los productos o de cualquier otra información
    const [nombres, setNombres] = useState<Nombres[]>([]);

    //Bandera para saber si se esta buscando un producto
    const [isSearching, setIsSearching] = useState(false);

    //Bandera para cuando se escoge una opcion del input del nombre
    const [isNameSelected, setIsNameSelected] = useState(false);

    //Guarda la informacion de la busqueda
    const [searchValue, setSearchValue] = useState({
        nombre: "",
        tipo: "0",
        categoria: "0",
        subcategoria: "0",
        rango: "1",
    })

    //Bandera para actualizar la tabla
    const [update, setUpdate] = useState(false);

    // Guarda que boton se han seleccionado
    const [selectedButton, setSelectedButton] = useState("Productos");

    //Actualiza el estado del boton seleccionado
    const handleButtonClick = (button: string) => {
        setSelectedButton(button);
    };

    const getProductos = async (rangoProp?: string) => {
        // console.log("searchValue", searchValue);
        const respose = await axios.post('/api/users/administrador/productos', {
            tipo: Number(searchValue.tipo),
            categoria: Number(searchValue.categoria),
            subcategoria: Number(searchValue.subcategoria),
            rango: Number(rangoProp ? rangoProp : searchValue.rango),
            nombre: searchValue.nombre,
            pagina: currentPage,
        })
        // console.log(respose.data);
        setProductos(respose.data[0]);
        setTotalPages({ NumeroPaginas: respose.data[1].NumeroPaginas });
    }

    const getSelects = async () => {
        const respose = await axios.get(`/api/users/administrador/productos/selects/${searchValue.tipo}`);
        const data = respose.data;

        setSelectOptionsTipos(data[0]);
        setSelectOptionsCategorias(data[1]);
        setSelectOptionsSubcategorias(data[2]);
        setSelectOptionsRangos(data[3]);
        setNombres(data[4]);
    }

    //Funcion para obtener el nombre de los tipos
    const getTipos = async () => {
        const respose = await axios.post('/api/users/administrador/productos/tipos', { nombre: searchValue.nombre, pagina: currentPage });
        const data = respose.data;
        setTipos(data[0]);
        setNombres(data[1]);
        setTotalPages({ NumeroPaginas: data[2].NumeroPaginas });
        console.log("tipos", data[0]);
        console.log("nombres", data[1]);
        console.log("paginas", data[2].NumeroPaginas);
    }

    const handleChange = (e: any) => {

        if (e.target.name === "tipo") {
            setSearchValue({
                ...searchValue,
                nombre: "",
                tipo: e.target.value,
                categoria: "",
                subcategoria: "",
            })
        } else if (e.target.name !== "nombre" && e.target.name !== "rango") {
            setSearchValue({
                ...searchValue,
                [e.target.name]: e.target.value,
                nombre: "",
            });
        } else {
            setSearchValue({
                ...searchValue,
                [e.target.name]: e.target.value,
            });
            if (e.target.name === "rango") {
                getProductos(e.target.value);
            }
        }

        if (e.target.name !== "rango") {
            setCurrentPage(1);
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar a este producto?")) {
            try {
                const response = await deleteProducto(id);
                if (response.status === 200) {
                    getProductos();
                    toast({
                        title: "Producto eliminado",
                        description: "El Producto ha sido eliminado correctamente",
                        variant: "success",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "No se pudo eliminar el Producto",
                    variant: "destructive",
                });
            }
        }
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();
        if (searchValue) {
            if (selectedButton === "Productos") {
                setSearchValue({
                    ...searchValue,
                    tipo: "0",
                    categoria: "0",
                    subcategoria: "0",
                })
                getProductos();
            } else if (selectedButton === "Tipos") {
                getTipos();
            }
        }
        // Quitar el focus del input activo
        (document.activeElement as HTMLElement)?.blur();
    }

    //Funcion para cuando se escoge una opcion del input del nombre
    const handleNombreSelected = (nombre: string) => {
        setIsNameSelected(true);
        setSearchValue({
            ...searchValue,
            nombre: nombre,
            tipo: "0",
            categoria: "0",
            subcategoria: "0",
        });
    }

    const nombresFiltrados = nombres.filter((nombre) =>
        nombre.Descripcion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(searchValue.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase())
    );

    useEffect(() => {
        if (selectedButton === "Productos") {
            getSelects();
            getProductos();
        }

    }, [searchValue.tipo]);

    useEffect(() => {
        if (selectedButton === "Productos") {
            getProductos();
        } else if (selectedButton === "Tipos") {
            getTipos();
            getSelects();
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [currentPage]);

    useEffect(() => {
        if (searchValue.nombre === "" && selectedButton === "Productos") {
            getProductos();
        }
    }, [searchValue.rango, searchValue.categoria, searchValue.subcategoria]);

    useEffect(() => {
        if (isNameSelected) {
            if (selectedButton === "Productos") getProductos();
            else if (selectedButton === "Tipos") getTipos();
            setIsNameSelected(false);
        }
    }, [searchValue.nombre]);

    useEffect(() => {
        if (update) {
            if (selectedButton === "Productos") {
                getProductos();
                getSelects();
            }
            setUpdate(false);
        }
    }, [update]);

    useEffect(() => {
        if (selectedButton === "Tipos") {
            setSearchValue({
                nombre: "",
                tipo: "0",
                categoria: "0",
                subcategoria: "0",
                rango: "1",
            })
            getTipos();
        }
        if (selectedButton === "Productos") {
            setTotalPages({ NumeroPaginas: 0 });
            setCurrentPage(1);
        }
    }, [selectedButton]);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
            <div className="w-full flex justify-center items-center mb-[2.5%]">
                <div className='w-full flex justify-center items-center gap-3'>
                    <button onClick={() => handleButtonClick("Productos")} className={`font-bold border border-black border-solid px-3 py-2 rounded-lg ${selectedButton === "Productos" ? "bg-acento text-white" : "bg-white hover:bg-gray-200"}`}>
                        Productos
                    </button>
                    <button onClick={() => handleButtonClick("Tipos")} className={`font-bold border border-black border-solid px-3 py-2 rounded-lg ${selectedButton === "Tipos" ? "bg-acento text-white" : "bg-white hover:bg-gray-200"}`}>
                        Tipos
                    </button>
                    <button onClick={() => handleButtonClick("Categorias")} className={`font-bold border border-black border-solid px-3 py-2 rounded-lg ${selectedButton === "Categorias" ? "bg-acento text-white" : "bg-white hover:bg-gray-200"}`}>
                        Categorías
                    </button>
                    <button onClick={() => handleButtonClick("Subcategorias")} className={`font-bold border border-black border-solid px-3 py-2 rounded-lg ${selectedButton === "Subcategorias" ? "bg-acento text-white" : "bg-white hover:bg-gray-200"}`}>
                        Subcategorías
                    </button>
                </div>
            </div>

            <div className="w-[100%] flex justify-between items-center mb-[1%]">
                <div className={`flex items-center flex-1 gap-2 ${selectedButton === "Productos" ? "mr-[2%]" : "mr-1"}`}>
                    <form className="relative w-full" onSubmit={handleSearch}>
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-500" size={20} />
                        </span>
                        <input
                            type="text"
                            name="nombre"
                            onChange={handleChange}
                            value={searchValue.nombre}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setTimeout(() => setIsSearching(false), 300)}
                            autoComplete="off"
                            className="w-full border border-black rounded-xl py-2 pl-10 pr-3 text-lg"
                            placeholder={`Buscar ${selectedButton === "Productos" ? "producto" : selectedButton === "Tipos" ? "tipo" : selectedButton === "Categorias" ? "categoría" : "subcategoría"}`}
                        />
                        {isSearching && (
                            <ul className="absolute inset-y-10 left-0 border mt-2 rounded shadow bg-white max-h-60 h-fit overflow-y-auto">
                                {nombresFiltrados.length > 0 ? (
                                    nombresFiltrados.map((nombre) => (
                                        <li
                                            key={nombre.Id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleNombreSelected(nombre.Descripcion)}
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
                    {/* <button
                        type="submit"
                        className="hover:bg-gray-100 rounded-md"
                        onClick={handleSearch}
                    >
                        <Search strokeWidth={2} size={45} />
                    </button> */}
                </div>

                {/* <div className="flex items-center justify-end gap-3 w-fit max-w-[80%] flex-wrap">
                    {["Productos", "Tipos"].find(item => item === selectedButton) ? (
                        <select value={searchValue.tipo} name="tipo" id="tipo" onChange={handleChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                            <option value="0">Todos los tipos</option>
                            {selectOptionsTipos.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    ) : ''}

                    {["Productos", "Categorias", "Tipos"].find(item => item === selectedButton) ? (
                        <select value={searchValue.categoria} name="categoria" id="categoria" onChange={handleChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                            <option value="0">Todas las categorías</option>
                            {selectOptionsCategorias.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    ) : ''}
                    {["Productos", "Categorias", "Tipos", "Subcategorias"].find(item => item === selectedButton) ? (
                        <select value={searchValue.subcategoria} name="subcategoria" id="subcategoria" onChange={handleChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                            <option value="0">Todas las subcategorias</option>
                            {selectOptionsSubcategorias.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    ) : ''}
                    {selectedButton == "Productos" ? (
                        <select value={searchValue.rango} name="rango" id="rango" onChange={handleChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                            {selectOptionsRangos.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    ) : ''}
                    <AddModal onGuardado={() => setUpdate(true)} />
                </div> */}
                {selectedButton === "Productos" && (
                    <div className="flex items-center justify-end gap-3 w-fit max-w-[80%] flex-wrap">
                        <select value={searchValue.tipo} name="tipo" id="tipo" onChange={handleChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                            <option value="0">Todos los tipos</option>
                            {selectOptionsTipos.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>

                        <select value={searchValue.categoria} name="categoria" id="categoria" onChange={handleChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                            <option value="0">Todas las categorías</option>
                            {selectOptionsCategorias.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                        <select value={searchValue.subcategoria} name="subcategoria" id="subcategoria" onChange={handleChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                            <option value="0">Todas las subcategorias</option>
                            {selectOptionsSubcategorias.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                        <select value={searchValue.rango} name="rango" id="rango" onChange={handleChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                            {selectOptionsRangos.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <AddModal onGuardado={() => setUpdate(true)} />
            </div>

            {selectedButton === "Productos" ? (
                Productos.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Descripción</th>
                                <th>Tipo</th>
                                <th>Categoría</th>
                                <th>Subcategoría</th>
                                <th>Peso Promedio</th>
                                <th>Costo Base</th>
                                <th>Costo Extra</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Productos.map((Producto) => (
                                <tr key={Producto.IdProducto}>
                                    <td>{Producto.IdProducto}</td>
                                    <td>{Producto.Descripcion}</td>
                                    <td>{Producto.Tipo}</td>
                                    <td>{Producto.Categoria}</td>
                                    <td>{Producto.Subcategoria}</td>
                                    <td>{Producto.PesoPromedio} Kg</td>
                                    <td>${Producto.CostoBase}</td>
                                    <td>${Producto.CostoExtra}</td>
                                    <td>${Producto.Precio}</td>
                                    <td>
                                        <div className="flex gap-3 w-full justify-center">
                                            <UpdateModal IdCliente={Producto.IdProducto} onGuardado={() => setUpdate(true)} />
                                            <button className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded" onClick={() => handleDelete(Producto.IdProducto)}><Trash strokeWidth={2} size={25} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex justify-center items-center w-full h-full">
                        <p className="text-lg font-bold">No se encontraron productos</p>
                    </div>
                )

            ) : ''}

            {selectedButton === "Tipos" && (
                <table className="table-auto border-collapse w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th className="text-left px-4 py-2">Cantidad de Productos</th>
                            <th className="text-center px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Tipos.map((Tipo) => (
                            <tr key={Tipo.IdTipo} className="border-t">
                                <td>{Tipo.IdTipo}</td>
                                <td>{Tipo.Tipo}</td>
                                <td>{Tipo.Cantidad}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                    <div className="flex gap-2 justify-center">
                                        <UpdateModal IdCliente={Tipo.IdTipo} onGuardado={() => setUpdate(true)} />
                                        <button
                                            className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded"
                                            onClick={() => handleDelete(Tipo.IdTipo)}
                                        >
                                            <Trash strokeWidth={2} size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {totalPages && (
                <div className="flex gap-2 mt-4">
                    <div className="flex gap-2 mt-4">
                        {Array.from({ length: totalPages.NumeroPaginas }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-acento text-white' : 'bg-gray-200'}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductosDashboard