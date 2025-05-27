"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import AddModal from "@/components/administrador/cargos/addModal";
import UpdateModalCargos from "./updateModalCargos";
import UpdateModalCargoGeneral from "./generales/updateModalCargoGeneral";
import { deleteCargos } from "@/actions";


function CargosDashboard() {

    const router = useRouter();
    const { toast } = useToast();

    interface Cargo {
        IdCargo: number;
        NombreCargo: string;
        Cargo: string;
        Tipo: string;
    }

    interface CargoGeneral{
        IdCargoGeneral: number;
        NombreCargoGeneral: string;
        Parametro: string;
        Cargo: string;
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

    //Guarda la informacion de los Cargos
    const [Cargos, setCargos] = useState<Cargo[]>([]);

    //Guarda la informacion de los Cargos Generales
    const [CargosGenerales, setCargosGenerales] = useState<CargoGeneral[]>([]);

    //Garda el tipo seleccionado
    const [tipoSeleccionado, setTipoSeleccionado] = useState("1");

    //Guarda la informacion de la busqueda
    const [searchValue, setSearchValue] = useState({
        nombre: "",
    })

    //Bandera para actualizar la tabla
    const [update, setUpdate] = useState(false);

    const getCargos = async () => {
        console.log("searchValue", searchValue);
        const respose = await axios.put(`/api/users/administrador/cargos/${tipoSeleccionado}`, searchValue);
        console.log(respose.data[0]);
        if (tipoSeleccionado === '0') {
            setCargosGenerales(respose.data);
        } else {
            setCargos(respose.data);
        }
        
    }
    const getSelects = async () => {
        const respose = await axios.get(`/api/users/administrador/productos/selects/${tipoSeleccionado}`);
        const data = respose.data;

        setSelectOptionsTipos(data[0]);

    }

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setTipoSeleccionado(value)
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setSearchValue({
            ...searchValue,
            [name]: value
        });
    }

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar a este producto?")) {
            try {
                const response = await deleteCargos(id);
                if (response.status === 200) {
                    getCargos();
                    toast({
                        title: "Cargo eliminado",
                        description: "El Cargo ha sido eliminado correctamente",
                        variant: "success",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "No se pudo eliminar el Cargo",
                    variant: "destructive",
                });
            }
        }
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();
        getCargos();
    }

    useEffect(() => {
        getCargos();
        getSelects();
    }, [tipoSeleccionado]);



    useEffect(() => {
        if (update) {
            getCargos();
            setUpdate(false);
        }
    }, [update]);


    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>


            <div className="w-[100%] flex justify-between items-center mb-[1%]">
                <div className={`flex items-center flex-1 gap-2 mr-[5%]`}>
                    <form className="relative w-full" onSubmit={handleSearch}>
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-500" size={20} />
                        </span>
                        <input
                            type="text"
                            name="nombre"
                            onChange={handleChange}
                            value={searchValue.nombre}
                            autoComplete="off"
                            className="w-full border border-black rounded-xl py-2 pl-10 pr-3 text-lg"
                            placeholder={`Buscar Cargo`}
                        />
                    </form>
                    <button
                        type="submit"
                        className="hover:bg-gray-100 rounded-md"
                        onClick={handleSearch}
                    >
                        <Search strokeWidth={2} size={45} />
                    </button>
                </div>

                <select value={tipoSeleccionado} name="tipo" id="tipo" onChange={handleSelectChange} className="rounded-xl py-[0.6rem] px-3 text-lg border border-solid border-black w-fit">
                    <option value="0">General</option>
                    {selectOptionsTipos.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                        </option>
                    ))}
                </select>
                {tipoSeleccionado !== '0' && (
                    <AddModal tipoSeleccionado={tipoSeleccionado} onGuardado={() => setUpdate(true)} />
                )}
            </div>

            {tipoSeleccionado !== '0' && (
                Cargos.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Cargo por Kg</th>
                                <th>Tipo de roducto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Cargos.map((Cargo) => (
                                <tr key={Cargo.IdCargo}>
                                    <td>{Cargo.IdCargo}</td>
                                    <td>{Cargo.NombreCargo}</td>
                                    <td>${Cargo.Cargo}</td>
                                    <td>{Cargo.Tipo}</td>
                                    <td>
                                        <div className="flex gap-3 w-full justify-center">
                                            <UpdateModalCargos IdCargo={Cargo.IdCargo} onGuardado={() => setUpdate(true)} />
                                            <button className="hover:bg-gray-200 text-red-500 px-2 py-1 rounded" onClick={() => handleDelete(Cargo.IdCargo)}><Trash strokeWidth={2} size={25} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex justify-center items-center w-full h-full">
                        <p className="text-lg font-bold">No se encontraron cargos</p>
                    </div>
                )
            )}

            {tipoSeleccionado == '0' && (
                CargosGenerales.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Parámetro</th>
                                <th>Cargo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CargosGenerales.map((Cargo) => (
                                <tr key={Cargo.IdCargoGeneral}>
                                    <td>{Cargo.IdCargoGeneral}</td>
                                    <td>{Cargo.NombreCargoGeneral}</td>
                                    <td>{Cargo.Parametro}</td>
                                    <td>${Cargo.Cargo}</td>
                                    <td>
                                        <div className="flex gap-3 w-full justify-center">
                                            <UpdateModalCargoGeneral IdCargo={Cargo.IdCargoGeneral} onGuardado={() => setUpdate(true)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex justify-center items-center w-full h-full">
                        <p className="text-lg font-bold">No se encontraron cargos</p>
                    </div>
                )
            )}
        </div>
    )
}

export default CargosDashboard