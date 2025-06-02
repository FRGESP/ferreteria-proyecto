"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import dayjs from "dayjs";
import { getPedidosAction } from '@/actions';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

function PedidosDashboard() {
    const router = useRouter();

    //Interface para las pedidos
    interface Pedido {
        IdPedido: number;
        Fecha: string;
        Sucursal: string;
        Estatus: string;
        Repartidor: string;
        Monto: string;
        MetodoPago: string;
        Cliente: string;
        Direccion: string;
        NombreRepartidor: string;
    }

    //Guarda la informacion de las pedidos
    const [pedidos, setPedido] = useState<Pedido[]>([]);

    //Guarda la informacion de la busqueda
    const [searchValue, setSearchValue] = useState({
        pedido: ""
    })

    const handleChange = (e: any) => {
        setSearchValue({
            ...searchValue,
            [e.target.name]: e.target.value,
        });
    }

    const getPedidos = async () => {
        const data = await getPedidosAction(searchValue.pedido ? searchValue.pedido : "0");
        setPedido(data);
        console.log(data);
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await getPedidos();
    }

    //Obtiene las pedidos al cargar el componente
    useEffect(() => {
        getPedidos();
    }, []);

    return (
        <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
            <div className="w-[70%] flex items-center justify-center mb-[2%]">
                <form className="w-full" onSubmit={handleSearch}>
                    <input onChange={handleChange} type="text" name="pedido" className="w-full border border-solid border-black rounded-xl py-2 px-3 text-lg" placeholder="Ingrese el número de pedido" />
                </form>
                <button className="hover:bg-gray-100 ml-5 rounded-md"><Search strokeWidth={2} size={45} onClick={handleSearch} /></button>
            </div>
            {pedidos.length > 0 ? (
                <div className='w-full flex flex-col items-center justify-center gap-3 '>
                {pedidos.map((pedido) => (
                    <div onClick={() => router.push(`/users/cajero/pedidos/${pedido.IdPedido}`)} key={pedido.IdPedido} className='flex flex-col gap-2 border border-black border-solid rounded-lg cursor-pointer hover:bg-gray-50 w-full'>
                        <div className='grid grid-cols-3 gap-4 bg-[#e8e8e8] rounded-lg p-3 border-b border-black border-solid'>
                            <p>#{pedido.IdPedido}</p>
                            <p>{dayjs(pedido.Fecha).format("DD/MM/YYYY")}</p>
                            <p>${pedido.Monto} MX</p>
                        </div>
                        <div className='grid grid-cols-3 gap-4 p-3'>
                            <p className='text-lg'><span className='font-bold'>Sucursal: </span>{pedido.Sucursal}</p>
                            <p className='text-lg'><span className='font-bold'>Estatus: </span><span className={`px-2 py-1 ${pedido.Estatus === "Pendiente" ? "bg-yellow-300 rounded-lg" : pedido.Estatus === "Entregado" ? "bg-acento rounded-lg" : pedido?.Estatus === "Cancelado" ? "bg-red-500 text-white rounded-lg" : "bg-gray-500 text-white rounded-lg"}`}>{pedido.Estatus}</span></p>
                            <p className='text-lg'><span className='font-bold'>Repartidor: </span>{pedido.Repartidor ? pedido.NombreRepartidor : 'Sin repartidor asignado'}</p>
                        </div>
                        <div className='grid grid-cols-3 gap-4 p-3'>
                            <p className='text-lg'><span className='font-bold'>Cliente: </span>{pedido.Cliente}</p>
                            <p className='text-lg'><span className='font-bold'>Dirección: </span>{pedido.Direccion}</p>
                            <p className='text-lg'><span className='font-bold'>Método de pago: </span>{pedido.MetodoPago}</p>
                        </div>

                    </div>
                ))}
            </div>
            ) : (
                <div className='w-full h-full flex items-center justify-center'>
                    <p className='text-2xl font-bold'>No hay pedidos registrados aún</p>
                </div>
            )}
        </div>
    )
}

export default PedidosDashboard