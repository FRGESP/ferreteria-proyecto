"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from "dayjs";
import AddSucursal from '@/components/administrador/sucursales/addSucursal';

function SucursalesDashboard() {

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

    const getSucursales = async () => {
        const respose = await axios.get(`/api/users/administrador/sucursales`);
        const data = respose.data;
        console.log(data);
        setSucursales(data);
    }

    //Obtiene las sucursales al cargar el componente
    useEffect(() => {
        getSucursales();
    }, []);
    
  return (
    <div className='flex flex-col h-[91vh] w-full p-[1%] gap-3'>
        <div className='flex-1 flex flex-col gap-2'>
            <div className='flex-[1] rounded-lg border border-black border-solid]'>
                <div className='flex justify-center items-center h-full'>
                    <AddSucursal onGuardado={() => console.log("SIUU")}/>
                </div>
            </div>
            <div className='flex-[2] rounded-lg border border-black border-solid] '>
                Gráfica de ventas
            </div>
        </div>
        <div className='flex-[1] rounded-lg'>
            <div className='grid grid-cols-2 gap-4'>
                {sucursales.map((sucursal) => (
                    <div key={sucursal.IdSucursal} className='flex flex-col gap-2 border border-black border-solid rounded-lg p-3'>
                        <h1 className='text-xl font-bold'>{sucursal.Nombre}</h1>
                        <p className='text-lg'><span className='font-bold'>Direccion: </span>{sucursal.Direccion}</p>
                        <p className='text-lg'><span className='font-bold'>Teléfono: </span>{sucursal.Telefono}</p>
                        <p className='text-lg'> <span className='font-bold'>Fecha de Registro: </span> {dayjs(sucursal.FechaRegistro).format("DD/MM/YYYY")}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default SucursalesDashboard