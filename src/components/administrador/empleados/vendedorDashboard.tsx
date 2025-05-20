"use client"
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { addClienteToEmpleado } from '@/actions';

interface VendedorDashboardProps {
  IdEmpleadoProp: string;
}

interface Cliente {
  IdCliente: number;
  IdEmpleado: string;
  NombreCliente: string;
  TelefonoCliente: string;
  DireccionCliente: string;
  RangoCliente: string;
  NombreEmpleado: string;
}

interface Empleado {
  NombreEmpleado: string;
  Sucursal: string;
}


function VendedorDashboard({ IdEmpleadoProp }: VendedorDashboardProps) {

  const router = useRouter();

  //Guarda la informacion de la busqueda
  const [searchValue, setSearchValue] = useState({
    nombre: ""
  })

  //Guarda la informacion del vendedor
  const [vendedor, setVendedor] = useState<Empleado>();

  //Guarda la informacion de los clientes que tiene a este vendedor asignado originalmente
  const [originalMyClientes, setOriginalMyClientes] = useState<Cliente[]>([]);

  //Guarda la informacion de los clientes que tienen a este vendedor asignado
  const [myClientes, setMyClientes] = useState<Cliente[]>([]);

  //Guarda la informacion de los clientes que no tienen a este vendedor asignado
  const [notMyClientes, setNotMyClientes] = useState<Cliente[]>([]);

  //Guarda la informacion de los clientes que tiene a este vendedor asignado de la búsq
  const [myClientesBusqueda, setMyClientesBusqueda] = useState<Cliente[]>([]);

  //Guarda la informacion de los clientes que no tienen a este vendedor asignado de la búsqueda
  const [notMyClientesBusqueda, setNotMyClientesBusqueda] = useState<Cliente[]>([]);

  //Bandera que indicar cuando se hace una búsqueda
  const [search, setSearch] = useState(false);

  const handleChange = (e: any) => {
    setSearchValue({
      ...searchValue,
      [e.target.name]: e.target.value,
    });
  }

  const handleSearch = async (e: any) => {
    e.preventDefault();

    setSearch(true);
    const response = await axios.post(`/api/users/administrador/empleados/clientes`, {
      nombre: searchValue.nombre,
      IdEmpleado: IdEmpleadoProp
    });

    setMyClientesBusqueda([]);
    setNotMyClientesBusqueda([]);

    // Filtrar los clientes que ya están asignados al vendedor
    response.data[0].forEach((cliente: Cliente) => {
      const clienteVar = notMyClientes.find(c => c.IdCliente === cliente.IdCliente);
      if (clienteVar) {
        setNotMyClientesBusqueda(prev => [...prev, clienteVar]);
      } else {
        setMyClientesBusqueda(prev => [...prev, cliente]);
      }
    })

    // Filtrar los clientes que no están asignados al vendedor
    response.data[1].forEach((cliente: Cliente) => {
      const clienteVar = myClientes.find(c => c.IdCliente === cliente.IdCliente);
      if (clienteVar) {
        setMyClientesBusqueda(prev => [...prev, clienteVar]);
      } else {
        setNotMyClientesBusqueda(prev => [...prev, cliente]);
      }
    })

  }

  const getVendedor = async () => {
    const response = await axios.get(`/api/users/administrador/empleados/clientes/${IdEmpleadoProp}`);
    if (response.data.length === 0) {
      router.push("/users/administrador/empleados");
    } else {
      setVendedor(response.data[0]);
      getClientes();
    }
  }

  const getClientes = async () => {
    const response = await axios.post(`/api/users/administrador/empleados/clientes`, {
      nombre: searchValue.nombre,
      IdEmpleado: IdEmpleadoProp
    });
    console.log(response.data);
    setMyClientes(response.data[0]);
    setNotMyClientes(response.data[1]);
    setOriginalMyClientes(response.data[0]);
  }

  useEffect(() => {
    getVendedor();
  }, [])


  const moveToMyClientes = (clienteId: number) => {
    const cliente = notMyClientes.find(c => c.IdCliente === clienteId);
    if (!cliente) return;

    setNotMyClientes(prev => prev.filter(c => c.IdCliente !== clienteId));
    setMyClientes(prev => [...prev, cliente]);
    if (search) {
      setSearchValue({
        nombre: ""
      });
    }
    setSearch(false);
  };

  const moveToNotMyClientes = (clienteId: number) => {
    const cliente = myClientes.find(c => c.IdCliente === clienteId);
    if (!cliente) return;

    setMyClientes(prev => prev.filter(c => c.IdCliente !== clienteId));
    setNotMyClientes(prev => [...prev, cliente]);
    if (search) {
      setSearchValue({
        nombre: ""
      });
    }
    setSearch(false);
  };

  const handleSave = async () => {
    console.log("Clientes Originales:", originalMyClientes);
    console.log("Clientes seleccionados:", myClientes);

    const clientesAAgregar = myClientes.filter(cliente => !originalMyClientes.some(originalCliente => originalCliente.IdCliente === cliente.IdCliente));
    const clientesAEliminar = originalMyClientes.filter(cliente => !myClientes.some(originalCliente => originalCliente.IdCliente === cliente.IdCliente));
    console.log("Clientes a agregar:", clientesAAgregar);
    console.log("Clientes a eliminar:", clientesAEliminar);

    const response = await addClienteToEmpleado(clientesAAgregar, clientesAEliminar, IdEmpleadoProp);

    if(response == 200) {
      router.push("/users/administrador/empleados");
    }
      

  }


  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
      <div className="w-[70%] flex items-center justify-center mb-[2%] gap-5">
        <h1 className='text-2xl text-center'><span className='font-bold '>Vendedor: </span>{vendedor?.NombreEmpleado}</h1>
        <h1 className='text-2xl text-center'><span className='font-bold '>Sucursal: </span>{vendedor?.Sucursal}</h1>
      </div>
      <div className="w-[70%] flex items-center justify-center mb-[2%] gap-5">
        <form className="w-full" onSubmit={handleSearch}>
          <input value={searchValue.nombre} onChange={handleChange} type="text" name="nombre" className="w-full border border-solid border-black rounded-xl py-2 px-3 text-lg" placeholder="Ingrese el nombre del cliente" />
        </form>
        <button className="rounded-md"><Search strokeWidth={2} size={45} onClick={handleSearch} /></button>
        <button className="rounded-md bg-acento hover:bg-acentohover py-2 px-3 text-lg text-white" onClick={handleSave}>Guardar</button>
      </div>
      <div className='w-full h-full grid grid-cols-2 gap-5'>
        <div>
          <h1 className='text-2xl font-bold text-center mb-3'>Clientes No Asignados al Vendedor</h1>
          <div className='shadow-lg w-full h-min bg-white rounded-xl p-4 border border-solid border-black flex flex-col gap-2'>
            {search == false ?
              (notMyClientes.length === 0 ? <p className='text-center'>No hay clientes disponibles</p> : (notMyClientes.map((cliente) => (
                <div key={cliente.IdCliente} className={`flex flex-col gap-2 border border-black border-solid rounded-lg p-3`}>
                  <h1 className='text-xl font-bold'>{cliente.NombreCliente}</h1>
                  <p className='text-lg'><span className='font-bold'>Direccion: </span>{cliente.DireccionCliente}</p>
                  <p className='text-lg'><span className='font-bold'>Teléfono: </span>{cliente.TelefonoCliente}</p>
                  <p className='text-lg'><span className='font-bold'>Rango: </span>{cliente.RangoCliente}</p>
                  <p className='text-lg'><span className='font-bold'>{cliente.NombreEmpleado ? "Vendedor Asignado: " : "Sin vendedor Asignado"}</span>{cliente.NombreEmpleado ? cliente.NombreEmpleado : ""}</p>
                  <button onClick={() => moveToMyClientes(cliente.IdCliente)} className={`${cliente.IdEmpleado ? cliente.IdEmpleado == IdEmpleadoProp ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600" : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg p-2`}>{cliente.IdEmpleado ? cliente.IdEmpleado == IdEmpleadoProp ? "Volver a Asignar" : 'Cambiar' : 'Asignar'}</button>
                </div>
              )))) :
              (notMyClientesBusqueda.length === 0 ? <p className='text-center'>No hay elementos que coincidan con la búsqueda</p> : (notMyClientesBusqueda.map((cliente) => (
                <div key={cliente.IdCliente} className={`flex flex-col gap-2 border border-black border-solid rounded-lg p-3`}>
                  <h1 className='text-xl font-bold'>{cliente.NombreCliente}</h1>
                  <p className='text-lg'><span className='font-bold'>Direccion: </span>{cliente.DireccionCliente}</p>
                  <p className='text-lg'><span className='font-bold'>Teléfono: </span>{cliente.TelefonoCliente}</p>
                  <p className='text-lg'><span className='font-bold'>Rango: </span>{cliente.RangoCliente}</p>
                  <p className='text-lg'><span className='font-bold'>{cliente.NombreEmpleado ? "Vendedor Asignado: " : "Sin vendedor Asignado"}</span>{cliente.NombreEmpleado ? cliente.NombreEmpleado : ""}</p>
                  <button onClick={() => moveToMyClientes(cliente.IdCliente)} className={`${cliente.IdEmpleado ? cliente.IdEmpleado == IdEmpleadoProp ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600" : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg p-2`}>{cliente.IdEmpleado ? cliente.IdEmpleado == IdEmpleadoProp ? "Volver a Asignar" : 'Cambiar' : 'Asignar'}</button>
                </div>
              ))))}
          </div>
        </div>
        <div>
          <h1 className='text-2xl font-bold text-center mb-3'>Clientes Asignados al Vendedor</h1>
          <div className='shadow-lg w-full h-min bg-white rounded-xl p-5 border border-solid border-black flex flex-col gap-2'>
            {search == false ?
              (myClientes.length === 0 ? <p className='text-center'>Sin clientes asignados</p> : (myClientes.map((cliente) => (
                <div key={cliente.IdCliente} className='flex flex-col gap-2 border border-black border-solid rounded-lg p-3'>
                  <h1 className='text-xl font-bold'>{cliente.NombreCliente}</h1>
                  <p className='text-lg'><span className='font-bold'>Direccion: </span>{cliente.DireccionCliente}</p>
                  <p className='text-lg'><span className='font-bold'>Teléfono: </span>{cliente.TelefonoCliente}</p>
                  <p className='text-lg'><span className='font-bold'>Rango: </span>{cliente.RangoCliente}</p>
                  {(cliente.IdEmpleado && cliente.IdEmpleado != IdEmpleadoProp) && (<p className='text-lg bg-blue-500 text-white rounded-lg px-2'><span className=''>Vendedor Previamente Asignado: </span>{cliente.NombreEmpleado}</p>
                  )}
                  <button onClick={() => moveToNotMyClientes(cliente.IdCliente)} className='bg-red-500 text-white rounded-lg p-2 hover:bg-red-600'>Eliminar</button>
                </div>
              )))) :
              (myClientesBusqueda.length === 0 ? <p className='text-center'>No hay elementos que coincidan con la búsqueda</p> : (myClientesBusqueda.map((cliente) => (
                <div key={cliente.IdCliente} className='flex flex-col gap-2 border border-black border-solid rounded-lg p-3'>
                  <h1 className='text-xl font-bold'>{cliente.NombreCliente}</h1>
                  <p className='text-lg'><span className='font-bold'>Direccion: </span>{cliente.DireccionCliente}</p>
                  <p className='text-lg'><span className='font-bold'>Teléfono: </span>{cliente.TelefonoCliente}</p>
                  <p className='text-lg'><span className='font-bold'>Rango: </span>{cliente.RangoCliente}</p>
                  {cliente.IdEmpleado && (<p className='text-lg'><span className='font-bold'>Vendedor Asignado: </span>cliente.NombreEmpleado</p>
                  )}
                  <button onClick={() => moveToNotMyClientes(cliente.IdCliente)} className='bg-red-500 text-white rounded-lg p-2 hover:bg-red-600'>Eliminar</button>
                </div>
              ))))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendedorDashboard