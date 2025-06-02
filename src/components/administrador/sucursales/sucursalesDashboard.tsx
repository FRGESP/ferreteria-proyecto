"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from "dayjs";
import AddSucursal from '@/components/administrador/sucursales/addSucursal';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

function SucursalesDashboard() {
    const router = useRouter();

    //Interface para las sucursales
    interface Sucursal {
        IdSucursal: number;
        Nombre: string;
        Direccion: string;
        Telefono: string;
        FechaRegistro: string;
    }

    //Guarda la informacion de las sucursales
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    //Guarda la informacion de la busqueda
    const [searchValue, setSearchValue] = useState({
        nombre: ""
    })

    const getSucursales = async () => {
        const response = await axios.post(`/api/users/administrador/sucursales`, searchValue);
        const data = response.data;
        console.log(data);
        setSucursales(data);
    }

    const handleChange = (e: any) => {
        setSearchValue({
            ...searchValue,
            [e.target.name]: e.target.value,
        });
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();
        if (searchValue) {
            const response = await axios.post(`/api/users/administrador/sucursales`, searchValue);
            const data = response.data;
            setSucursales(data);
        }
    }

    //Obtiene las sucursales al cargar el componente
    useEffect(() => {
        getSucursales();
    }, []);

    return (
        <div className='flex flex-col h-[91vh] w-full p-[2%] gap-3'>
            <div className='flex items-center justify-center'>
                <div className="w-[70%] flex items-center justify-center mb-[2%] gap-5">
                <form className="w-full" onSubmit={handleSearch}>
                    <input value={searchValue.nombre} onChange={handleChange} type="text" name="nombre" className="w-full border border-solid border-black rounded-xl py-2 px-3 text-lg" placeholder="Ingrese el nombre de la sucursal" />
                </form>
                <button className="hover:bg-gray-100rounded-md"><Search strokeWidth={2} size={45} onClick={handleSearch} /></button>
                <AddSucursal onGuardado={getSucursales} />
            </div>
            </div>
            <div className='flex-[1] rounded-lg overflow-y-auto'>
                {sucursales.length > 0 ? (
                    <div className='grid grid-cols-2 gap-4'>
                    {sucursales.map((sucursal) => (
                        <div onClick={() => router.push(`/users/administrador/sucursales/${sucursal.IdSucursal}`)} key={sucursal.IdSucursal} className='flex flex-col gap-2 border border-black border-solid rounded-lg p-3 cursor-pointer hover:bg-gray-100'>
                            <h1 className='text-xl font-bold'>{sucursal.Nombre}</h1>
                            <p className='text-lg'><span className='font-bold'>Direccion: </span>{sucursal.Direccion}</p>
                            <p className='text-lg'><span className='font-bold'>Teléfono: </span>{sucursal.Telefono}</p>
                            <p className='text-lg'> <span className='font-bold'>Fecha de Registro: </span> {dayjs(sucursal.FechaRegistro).format("DD/MM/YYYY")}</p>
                        </div>
                    ))}
                </div>
                ) : (
                    <div className='flex items-center justify-center h-full'>
                        <p className='text-2xl font-bold'>No existen resultados</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SucursalesDashboard