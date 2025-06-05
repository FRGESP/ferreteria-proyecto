"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";


interface CajasInventarioProps {
    IdSucursalProp: string;
}

function CajasInventario({ IdSucursalProp }: CajasInventarioProps) {

    interface Producto {
        IdProducto: number;
        Descripcion: string;
        Tipo: string;
        Categoria: string;
        Subcategoria: string;
        Disponible: string;
        Reservado: string;
        StockMinimo: number;
        Total: number;
    }

    interface Tipo {
        IdTipo: number;
        Tipo: string;
        GP1: string;
        GH2: string;
        GH3: string;
        GH4: string;
        GMY1: string;
        GMY2: string;
        Cantidad: string;
    }

    interface Categoria {
        IdCategoria: number;
        Categoria: string;
        Tipo: string;
        Cantidad: string;
    }

    interface Subcategoria {
        IdSubcategoria: number;
        Subcategoria: string;
        Tipo: string;
        CostoBase: string;
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

    //Pagina actual
    const [currentPage, setCurrentPage] = useState(1);

    //Numero de paginas 
    const [totalPages, setTotalPages] = useState<paginacion>();

    //Guarda la informacion de los Productos
    const [Productos, setProductos] = useState<Producto[]>([]);

    //Guarda los nombres de los productos o de cualquier otra información
    const [nombres, setNombres] = useState<Nombres[]>([]);

    //Bandera para saber si se esta buscando un producto
    const [isSearching, setIsSearching] = useState(false);

    //Bandera para cuando se escoge una opcion del input del nombre
    const [isNameSelected, setIsNameSelected] = useState(false);

    //Bandera para saber si se está cambiando de botón
    const [isButtonSelected, setIsButtonSelected] = useState(false);

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

    const getProductos = async () => {
        // console.log("searchValue", searchValue);
        const respose = await axios.post('/api/users/administrador/sucursales/sucursalid', {
            sucursal: IdSucursalProp,
            tipo: Number(searchValue.tipo),
            categoria: Number(searchValue.categoria),
            subcategoria: Number(searchValue.subcategoria),
            nombre: searchValue.nombre,
            pagina: currentPage,
        })
        console.log(respose.data);
        setProductos(respose.data[0]);
        setTotalPages({ NumeroPaginas: respose.data[1].NumeroPaginas });
    }

    const getSelects = async () => {
        const respose = await axios.get(`/api/users/administrador/productos/selects/${searchValue.tipo}`);
        const data = respose.data;

        setSelectOptionsTipos(data[0]);
        setSelectOptionsCategorias(data[1]);
        setSelectOptionsSubcategorias(data[2]);
        setNombres(data[4]);
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
                getProductos();
            }
        }

        if (e.target.name !== "rango") {
            setCurrentPage(1);
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
            
            setIsNameSelected(false);
        }
        if (isButtonSelected) {
            if (selectedButton === "Productos") {
                getProductos();
            }

            setIsButtonSelected(false);
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
        setIsButtonSelected(true);
        if (selectedButton === "Productos") {
            if (searchValue.nombre === "") {
                getProductos();
            }
            setSearchValue({
                ...searchValue,
                nombre: ""
            })
            getSelects();
        }
        setTotalPages({ NumeroPaginas: 0 });
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [selectedButton]);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
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
                </div>

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
                    </div>
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
                                <th>Stock Mínimo</th>
                                <th>Stock Reservado</th>
                                <th>Stock Disponible</th>
                                <th>Stock Total</th>
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
                                    <td>{Producto.StockMinimo ? Producto.StockMinimo : '0'}</td>
                                    <td>{Producto.Reservado}</td>
                                    <td>{Producto.Disponible}</td>
                                    <td><p className={`${(Number(Producto.Total) < Producto.StockMinimo) || Producto.StockMinimo == null ? "bg-red-500 " : "bg-green-600"} text-white rounded-lg w-fit py-2 px-3`}>{Producto.Total}</p></td>
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

export default CajasInventario;