"use client"
import React, { use } from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from "dayjs";
import { get } from 'http';

interface PedidoDetallePageProps {
  IdPedidoProp: string;
}

function PedidoDetallePage({ IdPedidoProp }: PedidoDetallePageProps) {
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
  }

  interface Transferencia {
    IdTransferencia: number;
    NombreTitular: string;
    BancoOrigen: string;
    Concepto: string;
    Monto: string;
    Fecha: string;
  }

  interface Efectivo {
    IdEfectivo: number;
    Monto: string;
    Fecha: string;
  }

  interface Cheque {
    IdCheque: number;
    NombreEmisor: string;
    BancoEmisor: string;
    NumeroCheque: string;
    Monto: string;
    Fecha: string;
  }

  //Interface para los productos
  interface Producto {
    IdNotaProducto: number;
    IdProducto: number;
    Descripcion: string;
    PrecioUnitario: string;
    Piezas: string;
    Importe: string
  }

  interface Envio {
    Cargo: string;
    Distancia: string;
  }

  interface Empleado {
    Nombre: string;
    Rol: string;
  }

  interface Vendedor {
    IdEmpleado: number;
    Nombre: string;
  }

  //Guarda la informacion del pedido
  const [pedido, setPedido] = useState<Pedido | null>(null);

  //Guarda la informacion de los productos
  const [productos, setProductos] = useState<Producto[]>([]);

  //Guarda la informacion de la transferencia
  const [transferencia, setTransferencia] = useState<Transferencia | null>(null);

  //Guarda la informacion del efectivo
  const [efectivo, setEfectivo] = useState<Efectivo | null>(null);

  //Guarda la informacion del cheque
  const [cheque, setCheque] = useState<Cheque | null>(null);

  //Guarda la informacion del envio
  const [envio, setEnvio] = useState<Envio | null>(null);

  //Guarda la informacion del empleado
  const [empleado, setEmpleado] = useState<Empleado | null>(null);

  //Guarda la informacion del Total
  const [total, setTotal] = useState<string>("0");

  //Guarda la informacion del número de productos
  const [numeroProductos, setNumeroProductos] = useState<number>(0);

  //Guarda que metodo de pago se utilizó
  const [metodoPago, setMetodoPago] = useState<string>("");

  //Guarda el estatus del pedido
  const [estatus, setEstatus] = useState<string>("");

  //Guarda la informacion de los vendedores
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  //Guarda el repartidor seleccionado
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState<string>("");

  const getDetallePedido = async () => {
    const response = await axios.get(`/api/users/cajero/pedidos/${IdPedidoProp}`);
    console.log(response.data);
    const data = response.data;
    const metodoPago = data[0].MetodoPago;
    setMetodoPago(metodoPago);
    setPedido(data[0])
    setEstatus(data[0].Estatus);
    if (metodoPago === "Transferencia") {
      setTransferencia(data[1]);
    } else if (metodoPago === "Efectivo") {
      setEfectivo(data[1]);
    }
    else if (metodoPago === "Cheque") {
      setCheque(data[1]);
    }
    setProductos(data[2]);
    setTotal(data[3].Total);
    setNumeroProductos(data[4].NumeroProductos);
    setEnvio({
      Cargo: data[5].Cargo,
      Distancia: data[5].Distancia ? data[4].Distancia : "0"
    });
    setEmpleado(data[6])
  }

  //Funcion para obtener a los vendedores
  const getVendedores = async () => {
    const response = await axios.put("/api/users/cajero/pedidos",{
      pedido: IdPedidoProp
    });
    setVendedores(response.data);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vendedorId = e.target.value;
    setRepartidorSeleccionado(vendedorId);
  }

  useEffect(() => {
    getDetallePedido();
    getVendedores();
  }, [])

  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
      <div className='w-full grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-2 border border-black border-solid rounded-lg p-3 w-full h-fit'>
          <h1 className='text-2xl font-bold mb-2'>Pedido #{pedido?.IdPedido}</h1>
          <p className='text-lg'><span className='font-bold mb-3'>Fecha del pedido: </span>{dayjs(pedido?.Fecha).format("DD/MM/YYYY")}</p>
          <div className='grid grid-cols-7 gap-4 my-5'>
            <div className='flex flex-col justify-center items-center gap-2'>
              <img src={`${estatus == "Pendiente" ? "/assets/cajero/pedidos/pendiente3.png" : "/assets/cajero/pedidos/pendiente2.png"}`} alt="pendiente" width={55} />
              <p>Pendiente</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <img src={`${estatus == "Pendiente" ? "/assets/cajero/pedidos/flecha1.png" : "/assets/cajero/pedidos/flecha2.png"}`} alt="flecha" width={55} />
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
              <img src={`${estatus == "Pendiente" ? "/assets/cajero/pedidos/pagado1.png" : "/assets/cajero/pedidos/pagado2.png"}`} alt="pendiente" width={55} />
              <p>Pagado</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <img src={`${estatus == "Pendiente" ? "/assets/cajero/pedidos/flecha1.png" : "/assets/cajero/pedidos/flecha2.png"}`} alt="flecha" width={55} />
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
              <img src={`${estatus == "Pendiente" ? "/assets/cajero/pedidos/enviado1.png" : "/assets/cajero/pedidos/enviado2.png"}`} alt="pendiente" width={55} />
              <p>Enviado</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <img src={`${estatus == "Pendiente" ? "/assets/cajero/pedidos/flecha1.png" : "/assets/cajero/pedidos/flecha2.png"}`} alt="flecha" width={55} />
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
              <img src={`${estatus == "Pendiente" ? "/assets/cajero/pedidos/entregado1.png" : "/assets/cajero/pedidos/entregado2.png"}`} alt="pendiente" width={55} />
              <p>Entregado</p>
            </div>
          </div>
          <p className='text-lg'><span className='font-bold'>Sucursal: </span>{pedido?.Sucursal}</p>
          <p className='text-lg'><span className='font-bold'>Estatus: </span><span className={`px-2 py-1 ${estatus === "Pendiente" ? "bg-yellow-300 rounded-lg" : estatus === "Entregado" ? "bg-acento rounded-lg" : "bg-red-600 text-white rounded-lg"}`}>{pedido?.Estatus}</span></p>
          <p className='text-lg'><span className='font-bold'>Vendido por: </span>{empleado?.Nombre} ({empleado?.Rol})</p>
          <div className='flex flex-col mb-8 gap-2'>
            <p className='text-lg'><span className='font-bold'>Repartidor: </span></p>
            <select onChange={handleChange} name="Vendedor" defaultValue={String(pedido?.Repartidor ? pedido.Repartidor : 0)} className={`border rounded-md w-full py-2 px-2 border-black`}>
              <option value="0">Sin Repartidor Asignado</option>
              {vendedores.map((vendedor: Vendedor) => (
                <option key={vendedor.IdEmpleado} value={vendedor.IdEmpleado}>
                  {vendedor.Nombre}
                </option>
              ))}
            </select>
          </div>

          <p className='text-lg'><span className='font-bold'>Cliente: </span>{pedido?.Cliente}</p>
          <p className='text-lg mb-8'><span className='font-bold'>Dirección: </span>{pedido?.Direccion}</p>
          <p className='text-lg'><span className='font-bold'>Método de pago: </span>{pedido?.MetodoPago}</p>

          {metodoPago === "Transferencia" && (
            <>
              <p className='text-lg'><span className='font-bold'>Titular</span>: {transferencia?.NombreTitular}</p>
              <p className='text-lg'><span className='font-bold'>Banco:</span> {transferencia?.BancoOrigen}</p>
              <p className='text-lg'><span className='font-bold'>Concepto:</span> {transferencia?.Concepto}</p>
              <p className='text-lg'><span className='font-bold'>Monto:</span> ${transferencia?.Monto}</p>
            </>
          )}
          {metodoPago === "Efectivo" && (
            <>
              <p className='text-lg'><span className='font-bold'>Monto:</span> ${efectivo?.Monto}</p>
              <p className='text-lg'><span className='font-bold'>Fecha:</span> {dayjs(efectivo?.Fecha).format("DD/MM/YYYY")}</p>
            </>
          )}
          {metodoPago === "Cheque" && (
            <>
              <p className='text-lg'><span className='font-bold'>Emisor:</span> {cheque?.NombreEmisor}</p>
              <p className='text-lg'><span className='font-bold'>Banco:</span> {cheque?.BancoEmisor}</p>
              <p className='text-lg'><span className='font-bold'>Número:</span> {cheque?.NumeroCheque}</p>
              <p className='text-lg'><span className='font-bold'>Monto:</span> ${cheque?.Monto}</p>
            </>
          )}
        </div>
        <div className='flex flex-col gap-2 border border-black border-solid rounded-lg p-3 w-full h-fit'>
          <h3 className='font-bold text-xl mb-3'>Resumen del pedido:</h3>
          <div className='grid grid-cols-5 gap-2 w-full border-b border-black border-solid pb-2'>
            <p className='font-bold text-lg'>Id</p>
            <p className='font-bold text-lg'>Descripción</p>
            <p className='font-bold text-lg'>Precio Unitario</p>
            <p className='font-bold text-lg'>Piezas</p>
            <p className='font-bold text-lg'>Importe</p>
          </div>
          {productos.map((producto) => (
            <div key={producto.IdNotaProducto} className='grid grid-cols-5 gap-2 w-full border-b border-gray-400 border-solid py-2'>
              <p>{producto.IdProducto}</p>
              <p>{producto.Descripcion}</p>
              <p>${producto.PrecioUnitario}</p>
              <p>{producto.Piezas}</p>
              <p>${producto.Importe}</p>
            </div>
          ))}
          <div className='grid grid-cols-5 gap-2 w-full mt-3'>
            <div></div>
            <div></div>
            <div></div>
            <div className='flex items-center justify-end'>
              <p className='text-lg'>Subtotal: </p>
            </div>
            <div className='flex items-center justify-start '>
              <p className='text-lg'>${(Number(total) - Number(envio?.Cargo)).toFixed(2)}</p>
            </div>
          </div>
          <div className='grid grid-cols-5 gap-2 w-full mt-3'>
            <div></div>
            <div></div>
            <div></div>
            <div className='flex items-center justify-end'>
              <p className='text-lg'>Envío: </p>
            </div>
            <div className='flex items-center justify-start '>
              <p className='text-lg'>${envio?.Cargo}</p>
            </div>
          </div>
          <div className='grid grid-cols-5 gap-2 w-full'>
            <div></div>
            <div></div>
            <div></div>
            <div className='flex items-center justify-end'>
              <p className='font-bold text-xl'>Total: </p>
            </div>
            <div className='flex items-center justify-start '>
              <p className='text-lg'>${total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PedidoDetallePage