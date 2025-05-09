"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import axios from "axios";
import { addEmpleado } from "@/actions";
import { useRouter } from "next/navigation";
import { on } from "events";

interface AddModalProps {
  onGuardado: () => void;
}

function AddModal({onGuardado}: AddModalProps) {
  const { toast } = useToast();
  const router = useRouter();

  //Controla el estado del modal
  const [isOpen, setIsOpen] = useState(false);

  //Controla el estado de los errores
  const [errors, setErrors] = useState<Record<string, string>>({});

  //Guarda la informacion del input
  const [inputValue, setInputValue] = useState({
    nombre: "",
    apellidoPat: "",
    apellidoMat: "",
    edad: "",
    telefono: "",
    sucursal: "",
    rol: "",
    estatus: "",
    password: ""
  });

  //Controla el cambio del input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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
    console.log(errors);
  };

  //Funcion para abrir el modal
  const openModal = () => {
    setIsOpen(true);
    // Reiniciar los valores de los inputs y errores al abrir el modal
    setErrors({});
    setInputValue({
      nombre: "",
      apellidoPat: "",
      apellidoMat: "",
      edad: "",
      telefono: "",
      sucursal: "",
      rol: "",
      estatus: "",
      password: ""
    });
  };
  //Funcion para cerrar el modal
  const closeModal = () => {
    setIsOpen(false);
  };

  //Interface Sucursal 
  interface Sucursal {
    Id: number;
    Nombre: string;
  }

  //Guarda la informacion de las sucursales
  const [sucursales, setSucursales] = useState([]);

  const getSucursales = async () => {
    const response = await axios.get(`/api/users/administrador/empleados/sucursal`);
    const data = response.data;
    setSucursales(data);
  }

  useEffect(() => {
    getSucursales();
  }, []);

  const handleSubmit = async () => {

    const newErrors: Record<string, string> = {};

    Object.entries(inputValue).forEach(([Key, value]) => {
      if (value.trim() === "") {
        newErrors[Key] = "Este campo es obligatorio"
      }
    })
    setErrors(newErrors);

    if (Object.keys(newErrors).length == 0) {
      const response = await addEmpleado(inputValue);
      console.log(response);
      if (response === 200) {
        setIsOpen(false);
        
        toast({
          title: "Empleado agregado",
          description: "El empleado ha sido agregado correctamente",
          variant: "success",
        });
        onGuardado();
      } else {
        toast({
          title: "Error",
          description: "No se pudo agregar el empleado",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      <button className=" ml-1 rounded-md p-2 hover:bg-gray-200" onClick={openModal}>
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
                Agregar Empleado
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
                <div className="w-full mt-3">
                  <label
                    htmlFor="apellidoPat"
                    className="font-bold text-lg flex-grow text-left"
                  >
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    className={`border rounded-md w-full py-2 px-2 ${errors["apellidoPat"] ? "border-red-500" : "border-black"}`}
                    name="apellidoPat"
                    onChange={handleChange}
                  />
                  {errors["apellidoPat"] && (<span className="text-sm text-red-500">{errors["apellidoPat"]}</span>)}
                </div>
                <div className="w-full mt-3">
                  <label
                    htmlFor="apellidoMat"
                    className="font-bold text-lg flex-grow text-left"
                  >
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    className={`border rounded-md w-full py-2 px-2 ${errors["apellidoMat"] ? "border-red-500" : "border-black"}`}
                    name="apellidoMat"
                    onChange={handleChange}
                  />
                  {errors["apellidoMat"] && (<span className="text-sm text-red-500">{errors["apellidoMat"]}</span>)}
                </div>
                <div className="w-full mt-3">
                  <label
                    htmlFor="edad"
                    className="font-bold text-lg flex-grow text-left"
                  >
                    Edad
                  </label>
                  <input
                    type="number"
                    className={`border rounded-md w-full py-2 px-2 ${errors["edad"] ? "border-red-500" : "border-black"}`}
                    name="edad"
                    onChange={handleChange}
                  />
                  {errors["edad"] && (<span className="text-sm text-red-500">{errors["edad"]}</span>)}
                </div>
                <div className="w-full mt-3">
                  <label
                    htmlFor="telefono"
                    className="font-bold text-lg flex-grow text-left"
                  >
                    Telefono
                  </label>
                  <input
                    type="number"
                    className={`border rounded-md w-full py-2 px-2 ${errors["telefono"] ? "border-red-500" : "border-black"}`}
                    name="telefono"
                    onChange={handleChange}
                  />
                  {errors["telefono"] && (<span className="text-sm text-red-500">{errors["telefono"]}</span>)}
                </div>
                <div className="w-full mt-3">
                  <label
                    htmlFor="password"
                    className="font-bold text-lg flex-grow text-left"
                  >
                    Contraseña:
                  </label>
                  <input
                    type="text"
                    className={`border rounded-md w-full py-2 px-2 ${errors["password"] ? "border-red-500" : "border-black"}`}
                    name="password"
                    onChange={handleChange}
                  />
                  {errors["password"] && (<span className="text-sm text-red-500">{errors["password"]}</span>)}
                </div>
                <div className=" w-full mt-3">
                  <label
                    htmlFor="sucursal"
                    className="font-bold text-lg flex-grow text-left"
                  >
                    Sucursal
                  </label>
                  <select onChange={handleChange} name="sucursal" defaultValue={'Default'} className={`border rounded-md w-full py-2 px-2 ${errors["sucursal"] ? "border-red-500" : "border-black"}`}>
                    <option value="Default" disabled hidden>Seleccione una sucursal</option>
                    {sucursales.map((sucursal: Sucursal) => (
                      <option key={sucursal.Id} value={sucursal.Id}>
                        {sucursal.Nombre}
                      </option>
                    ))}
                  </select>
                  {errors["sucursal"] && (<span className="text-sm text-red-500">{errors["sucursal"]}</span>)}
                </div>
                <div className="flex grid-cols-2 gap-5 justify-center mt-3">
                  <div>
                    <label className="font-bold text-lg flex-grow text-left" htmlFor="rol">
                      Rol
                    </label>
                    <select onChange={handleChange} name="rol" defaultValue={'Default'} className={`border rounded-md w-full py-2 px-2 ${errors["rol"] ? "border-red-500" : "border-black"}`}
                    >
                      <option value="Default" disabled hidden>Seleccione un Rol</option>
                      <option value="3">Administrador</option>
                      <option value="1">Vendedor</option>
                      <option value="2">Cajero</option>
                    </select>
                    {errors["rol"] && (<span className="text-sm text-red-500">{errors["rol"]}</span>)}
                  </div>
                  <div>
                    <label className="font-bold text-lg flex-grow text-left" htmlFor="estatus">
                      Estatus
                    </label>
                    <select onChange={handleChange} name="estatus" defaultValue={'Default'} className={`border rounded-md w-full py-2 px-2 ${errors["estatus"] ? "border-red-500" : "border-black"}`}
                    >
                      <option value="Default" disabled hidden>Seleccione un Estatus</option>
                      <option value="1">Activo</option>
                      <option value="3">Suspendido</option>
                    </select>
                    {errors["estatus"] && (<span className="text-sm text-red-500">{errors["estatus"]}</span>)}
                  </div>
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
      )}
    </div>
  );
}

export default AddModal;
