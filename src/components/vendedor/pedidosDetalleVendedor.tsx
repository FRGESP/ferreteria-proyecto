"use client"
import React, { use } from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from "dayjs";
import { actualizarPedido } from '@/actions';
import { useToast } from "@/hooks/use-toast";


interface PedidosDetalleVendedorProps {
  IdPedidoProp: string;
}

function PedidosDetalleVendedor({ IdPedidoProp }: PedidosDetalleVendedorProps) {

  const { toast } = useToast();

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
    Receptor: string;
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

  //Controla el estado de los errores
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  const [estatus, setEstatus] = useState<number>(0);

  //Guarda la informacion del estatus seleccionado
  const [estatusSeleccionado, setEstatusSeleccionado] = useState<number>(0);

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
    setEstatus(data[0].Estatus === "Pendiente" ? 1 : data[0].Estatus === "Pagado" ? 2 : data[0].Estatus === "Enviado" ? 3 : data[0].Estatus === "Entregado" ? 4 : 0);

    if(data[0].Repartidor) {
      setRepartidorSeleccionado(String(data[0].Repartidor));
    }

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
    const response = await axios.put("/api/users/cajero/pedidos", {
      pedido: IdPedidoProp
    });
    setVendedores(response.data);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vendedorId = e.target.value;
    const value = e.target.value;
    const name = e.target.name;

    setRepartidorSeleccionado(vendedorId);
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
  }

  const handleSubmit = async () => {
    if (estatusSeleccionado == 2 || estatusSeleccionado == 3 || estatusSeleccionado == 4) {

      const newErrors: Record<string, string> = {};

      if (repartidorSeleccionado.trim() === "" || (repartidorSeleccionado == "0" && estatusSeleccionado == 3)) {
        newErrors["Vendedor"] = "Seleccione un repartidor";
      }
      setErrors(newErrors);

      if (Object.keys(newErrors).length == 0) {

        const response = await actualizarPedido({
          pedido: IdPedidoProp,
          estatus: estatusSeleccionado == 2 ? "Pagado" : estatusSeleccionado == 3 ? "Enviado" : "Entregado",
          repartidor: repartidorSeleccionado
        })

        if (response === 200) {
          toast({
            title: "Pedido actualizado",
            description: `El pedido ha sido actualizado a ${estatusSeleccionado == 2 ? "Pagado" : estatusSeleccionado == 3 ? "Enviado" : "Entregado"}`,
            variant: "success",
          });
          setEstatusSeleccionado(0);
          getDetallePedido();
          getVendedores();
        } else {
          toast({
            title: "Error",
            description: "No se pudo actualizar el pedido",
            variant: "destructive",
          });
        }
      }
    } else if (estatusSeleccionado == 1) {
      const response = await actualizarPedido({
        pedido: IdPedidoProp,
        estatus: "Pendiente",
        repartidor: "0"
      });

      if (response === 200) {
        toast({
          title: "Pedido actualizado",
          description: "El pedido ha sido actualizado a Pendiente",
          variant: "success",
        });
        setEstatusSeleccionado(0);
        getDetallePedido();
        getVendedores();
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el pedido",
          variant: "destructive",
        });
      }
    } else if (repartidorSeleccionado != pedido?.Repartidor && repartidorSeleccionado != "") {
      const response = await actualizarPedido({
        pedido: IdPedidoProp,
        estatus: pedido?.Estatus ? pedido.Estatus : "Pendiente",
        repartidor: repartidorSeleccionado
      });
      if (response === 200) {
        toast({
          title: "Pedido actualizado",
          description: "El repartidor ha sido actualizado correctamente",
          variant: "success",
        });
        setEstatusSeleccionado(0);
        getDetallePedido();
        getVendedores();
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el pedido",
          variant: "destructive",
        });
      }
    }
  }

  const handleCancelarPedido = async () => {
    if (confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
      const response = await actualizarPedido({
        pedido: IdPedidoProp,
        estatus: "Cancelado",
        repartidor: "0"
      });
      if (response === 200) {
        toast({
          title: "Pedido cancelado",
          description: "El pedido ha sido cancelado correctamente",
          variant: "success",
        });
        setEstatusSeleccionado(0);
        getDetallePedido();
        getVendedores();
      }
    }
  }

  useEffect(() => {
    getDetallePedido();
    getVendedores();
  }, [])

  useEffect(() => {
    if (estatusSeleccionado == 1) {
      setRepartidorSeleccionado("");
    }
  }, [estatusSeleccionado]);

  return (
    <div className='w-full h-full flex flex-col items-center justify-center p-[2%]'>
      <div className='w-full grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-2 border border-black border-solid rounded-lg p-3 w-full h-fit'>
          <div className='grid grid-cols-2 mb-3'>
            <div className='flex flex-col justify-start'>
              <h1 className='text-2xl font-bold mb-2'>Pedido #{pedido?.IdPedido}</h1>
              <p className='text-lg'><span className='font-bold'>Fecha del pedido: </span>{dayjs(pedido?.Fecha).format("DD/MM/YYYY")}</p>
            </div>
            <div className='flex flex-col justify-center items-end'>
              {(((estatus < estatusSeleccionado && estatusSeleccionado != 0) || (pedido?.Repartidor == null && repartidorSeleccionado == "" ? false : repartidorSeleccionado ? repartidorSeleccionado != pedido?.Repartidor : false)) && estatus != 0) && (
                <button onClick={handleSubmit} className={`mt-2 w-1/2 bg-acento hover:bg-acentohover text-white rounded-xl py-3 font-semibold transition duration-200`}>
                  Guardar
                </button>
              )}
              
            </div>
          </div>
          {estatus != 0 ? (
            <div className='grid grid-cols-7 gap-4 my-5'>
            <div className='flex flex-col justify-center items-center gap-2'>
              <img src={`${estatus >= 1 ? "/assets/cajero/pedidos/pendiente3.png" : "/assets/cajero/pedidos/pendiente2.png"}`} alt="pendiente" width={55} />
              <p>Pendiente</p>
            </div>
            <div className='flex flex-col justify-center items-center '>
              <img src={`${estatus > 1 ? "/assets/cajero/pedidos/flecha3.png" : estatusSeleccionado > 1 ? "/assets/cajero/pedidos/flecha2.png" : "/assets/cajero/pedidos/flecha1.png"}`} alt="flecha" width={55} />
            </div>
            <div className='flex flex-col justify-center items-center gap-2'>
              <img src={`${estatus >= 2 ? "/assets/cajero/pedidos/pagado3.png" : estatusSeleccionado >= 2 ? "/assets/cajero/pedidos/pagado2.png" : "/assets/cajero/pedidos/pagado1.png"}`} alt="pagado" width={55} />
              <p>Pagado</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <img src={`${estatus > 2 ? "/assets/cajero/pedidos/flecha3.png" : estatusSeleccionado > 2 ? "/assets/cajero/pedidos/flecha2.png" : "/assets/cajero/pedidos/flecha1.png"}`} alt="flecha" width={55} />
            </div>
            <div className='flex flex-col justify-center items-center gap-2 cursor-pointer hover:bg-gray-50' onClick={() => setEstatusSeleccionado(3)}>
              <img src={`${estatus >= 3 ? "/assets/cajero/pedidos/enviado3.png" : estatusSeleccionado >= 3 ? "/assets/cajero/pedidos/enviado2.png" : "/assets/cajero/pedidos/enviado1.png"}`} alt="enviado" width={55} />
              <p>Enviado</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <img src={`${estatus > 3 ? "/assets/cajero/pedidos/flecha3.png" : estatusSeleccionado > 3 ? "/assets/cajero/pedidos/flecha2.png" : "/assets/cajero/pedidos/flecha1.png"}`} alt="flecha" width={55} />
            </div>
            <div className='flex flex-col justify-center items-center gap-2 cursor-pointer hover:bg-gray-50' onClick={() => setEstatusSeleccionado(4)}>
              <img src={`${estatus == 4 ? "/assets/cajero/pedidos/entregado3.png" : estatusSeleccionado == 4 ? "/assets/cajero/pedidos/entregado2.png" : "/assets/cajero/pedidos/entregado1.png"}`} alt="entregado" width={55} />
              <p>Entregado</p>
            </div>
          </div>
          ) : (
            <div className='flex items-center justify-center w-full'>
              <div className='flex flex-col justify-center items-center gap-2'>
              <img src="/assets/cajero/pedidos/cancelado.png" alt="cancelado" width={55} />
              <p>Pedido Cancelado</p>
            </div>
          </div>
          )}
          <p className='text-lg'><span className='font-bold'>Sucursal: </span>{pedido?.Sucursal}</p>
          <p className='text-lg'><span className='font-bold'>Estatus: </span><span className={`px-2 py-1 ${pedido?.Estatus === "Pendiente" ? "bg-yellow-300 rounded-lg" : pedido?.Estatus === "Entregado" ? "bg-acento rounded-lg" : pedido?.Estatus === "Cancelado" ? "bg-red-500 text-white rounded-lg" : "bg-gray-500 text-white rounded-lg" }`}>{pedido?.Estatus}</span></p>
          <p className='text-lg'><span className='font-bold'>Vendido por: </span>{empleado?.Nombre} ({empleado?.Rol})</p>
          <div className='flex flex-col mb-8 gap-2'>
            <p className='text-lg'><span className='font-bold'>Repartidor: </span>{pedido?.Repartidor ? pedido.NombreRepartidor : "Sin repartidor asignado"}</p>
            
          </div>

          <p className='text-lg'><span className='font-bold'>Cliente: </span>{pedido?.Cliente}</p>
          <p className='text-lg'><span className='font-bold'>Dirección: </span>{pedido?.Direccion}</p>
          <p className='text-lg mb-8'><span className='font-bold'>Receptor: </span>{pedido?.Receptor}</p>


          <p className='text-lg'><span className='font-bold'>Método de pago: </span>{pedido?.MetodoPago}</p>
          
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

export default PedidosDetalleVendedor