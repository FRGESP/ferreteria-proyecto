"use server"
import { sessionOptions, SessionData, defaultSession } from "@/lib"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import axios from "axios"
import { Bitacora } from "@/components/administrador/empleados/updateModal";

//Interface para la sesion
interface Credentials {
    user: string;
    password: string;
}

//Interface para el empleado
interface empleado {
    nombre: string;
    apellidoPat: string;
    apellidoMat: string;
    edad: string;
    telefono: string;
    sucursal: string;
    rol: string;
    estatus: string;
}

//Interface para la sucursal
interface Sucursal {
    nombre: string;
    telefono: string;
    codigo: string;
    calle: string;
    colonia: string;
}

//Interface para la relacion cliente-empleado
interface ClienteEmpleado {
    IdCliente: number;
    IdEmpleado: string;
    NombreCliente: string;
    TelefonoCliente: string;
    DireccionCliente: string;
    RangoCliente: string;
    NombreEmpleado: string;
}

//Interface para el cliente
interface Cliente {
    apellidoPat: string;
    apellidoMat: string;
    edad: string;
    telefono: string;
    codigo: string;
    calle: string;
    colonia: string;
    rango: string;
    creditoMaximo: string;
    vendedor: string;
}

//Interface para los productos
interface Producto {
    nombre: string;
    tipo: string;
    categoria: string;
    subcategoria: string;
    pesoInicial: string;
    pesoFinal: string;
    costoExtra: string;
    costoBase: string;
}

//Interface para los tipos de productos
interface Tipo {
    nombre: string;
    gPublico1: string;
    gHerrero2: string;
    gHerrero3: string;
    gHerrero4: string;
    gMayoreo1: string;
    gMayoreo2: string;
}

//Interface para la categoria de productos
interface Categoria {
    nombre: string;
    tipo: string;
}

//Interface para la subcategoria de productos
interface Subcategoria {
    nombre: string;
    tipo: string;
    costoBase: string;
}

//Interface para los cargos
interface Cargo {
    nombre: string;
    cargo: string;
    tipo: string;
}

//Interface para el stock
interface Stock {
    producto: number;
    cantidad: string;
    sucursal: string;
}

//Interface para el producto de venta
interface ProductoVenta {
    producto: string;
    cliente: string;
    piezas: string;
}

//Interface para el pedido
interface Pedido {
    receptor: string;
    idPago: number;
    metodoPago: string;
    montoCredito: number;
    monto: number;
}

//Interface para actualizar pedidos
interface ActualizarPedido {
    pedido: string;
    estatus: string;
    repartidor: string;
}

//Interface para el abono del credito
interface AbonoCredito {
    IdCliente: number;
    Monto: string;
}

export const getSession = async () => {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn;
    }

    return session;
}
export const login = async (credentials: Credentials) => {
    const session = await getSession();

    const response = await axios.post(`${process.env.URL}/api/login`, credentials);

    const datos = response.data;

    if (datos.RES !== undefined) {
        return { "RES": datos.RES };
    } else {
        session.userId = datos.IdUsuario;
        session.rol = datos.IdRol;
        session.isLoggedIn = true;
        session.name = datos.Nombre;
        session.lastname = datos.Apellido;
        session.sucursal = datos.Sucursal;
        session.nota = 0;
        session.isAdmin = false;

        if (datos.IdRol === 3) {
            session.isAdmin = true;
        }

        await session.save();
        await roles();
    }
}

export const roles = async () => {
    const session = await getSession();
    switch (session.rol) {
        case 1:
            redirect("/users/vendedor/clientes");
            break;
        case 2:
            redirect("/users/cajero/ventas");
            break;
        case 3:
            redirect("/users/administrador/empleados");
            break;
        default:
            console.log("No se encontró el rol");
            redirect("/");
    }
};

export const checkRole = async (rol: number) => {
    const session = await getSession();
    if (session.rol != rol) {
        redirect('/');
    }
}

export const logout = async () => {
    const session = await getSession();
    session.destroy();
    redirect("/");
};

export const islogged = async () => {
    const session = await getSession();

    if (!session.isLoggedIn) {
        redirect("/");
    }
}

//Funciones que requieren el el usuario logueado

export const getSucursalSession = async () => {
    const session = await getSession();
    return session.sucursal;
}

//Administrador/Session

export const changeSucursal = async (sucursal: number) => {
    const session = await getSession();
    session.sucursal = sucursal;
    await session.save();
    console.log("Sucursal cambiada a: " + session.sucursal);

}

//Administrador/Empleados

export const getEmpleadosAction = async () => {
    const session = await getSession();
    const response = await axios.get(`${process.env.URL}/api/users/administrador/empleados/${session.sucursal}/${session.userId}`);
    const data = response.data;
    return data;
}

export const deleteEmpleado = async (id: number) => {
    const session = await getSession();
    const response = await axios.delete(`${process.env.URL}/api/users/administrador/empleados/${id}/${session.userId}`);
    const data = response.data;
    return data;
}

export const addEmpleado = async (empleado: empleado) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/administrador/empleados/${session.userId}`, empleado)
    const status = response.status;
    return status;
}

export const updateBitacoraEmpleado = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/empleados/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })
}

export const addClienteToEmpleado = async (clientesAsignar: ClienteEmpleado[], clientesEliminar: ClienteEmpleado[], IdVendedor: string) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/administrador/empleados/clientes/${session.userId}`, { "agregar": clientesAsignar, "eliminar": clientesEliminar, "IdVendedor": IdVendedor })
    const status = response.status;
    return status;
}

//Administradoe/Sucursales

export const addSucursal = async (sucursal: Sucursal) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/administrador/sucursales/${session.userId}`, sucursal)
    const status = response.status;
    return status;
}

//Administrador/Clientes
export const addCliente = async (cliente: Cliente) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/administrador/clientes/${session.userId}`, cliente)
    const status = response.status;
    return status;
}

export const deleteCliente = async (id: number) => {
    const session = await getSession();
    const response = await axios.delete(`${process.env.URL}/api/users/administrador/clientes/${id}/${session.userId}`);
    const data = response.data;
    return data;
}

export const updateBitacoraCliente = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/clientes/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })

}

//Administrador/Productos/Productos

export const addProducto = async (producto: Producto, metodo: number) => {
    const session = await getSession();
    console.log(producto)
    const response = await axios.post(`${process.env.URL}/api/users/administrador/productos/${metodo}/${session.userId}`, producto)
    const status = response.status;
    return status;
}

export const deleteProducto = async (id: number) => {
    const session = await getSession();
    const response = await axios.delete(`${process.env.URL}/api/users/administrador/productos/${id}/${session.userId}`);
    const data = response.data;
    return data;
}

export const updateBitacoraProducto = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/productos/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })

}


//Administrador/Productos/Tipos

export const addTipo = async (tipo: Tipo) => {
    const session = await getSession();
    console.log(tipo)
    const response = await axios.post(`${process.env.URL}/api/users/administrador/productos/tipos/${session.userId}`, tipo)
    const status = response.status;
    return status;
}

export const deleteTipo = async (id: number) => {
    const session = await getSession();
    const response = await axios.delete(`${process.env.URL}/api/users/administrador/productos/tipos/${id}/${session.userId}`);
    const data = response.data;
    return data;
}

export const updateBitacoraTipo = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/productos/tipos/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })

}

//Administrador/Productos/Categorias

export const addCategoria = async (categoria: Categoria) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/administrador/productos/categorias/${session.userId}`, categoria)
    const status = response.status;
    return status;
}

export const deleteCategoria = async (id: number) => {
    const session = await getSession();
    const response = await axios.delete(`${process.env.URL}/api/users/administrador/productos/categorias/${id}/${session.userId}`);
    const data = response.data;
    return data;
}

export const updateBitacoraCategoria = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/productos/categorias/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })

}

//Administrador/Productos/Subcategorias

export const addSubcategoria = async (subcategoria: Subcategoria) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/administrador/productos/subcategorias/${session.userId}`, subcategoria)
    const status = response.status;
    return status;
}

export const deleteSubcategoria = async (id: number) => {
    const session = await getSession();
    const response = await axios.delete(`${process.env.URL}/api/users/administrador/productos/subcategorias/${id}/${session.userId}`);
    const data = response.data;
    return data;
}

export const updateBitacoraSubcategoria = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/productos/subcategorias/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })
}

//Administrador/Cargos

export const addCargo = async (cargo: Cargo) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/administrador/cargos/${session.userId}`, cargo)
    const status = response.status;
    return status;
}

export const deleteCargos = async (id: number) => {
    const session = await getSession();
    const response = await axios.delete(`${process.env.URL}/api/users/administrador/cargos/${id}/${session.userId}`);
    const data = response.data;
    return data;
}
export const updateBitacoraCargo = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/cargos/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })
}

//Administrador/Cargos/General

export const updateBitacoraCargoGeneral = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/cargos/general/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })
}

//Administrador/Sucursales/Productos

export const addStock = async (producto: Stock) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/administrador/sucursales/sucursalid/productos/${session.userId}`, producto)
    const status = response.status;
    return status;
}

export const updateBitacoraInventarioSucursal = async (id: number, bitacora: Bitacora[]) => {
    const session = await getSession();
    bitacora.map(async (item) => {
        console.log(item)
        const response = await axios.put(`${process.env.URL}/api/users/administrador/sucursales/sucursalid/productos/${id}/${session.userId}`, item)
        const status = response.status;
        if (status !== 200) {
            return { status: status, message: response }
        }
    })
}

//Cajero/Ventas
export const addProductoVenta = async (producto: ProductoVenta) => {
    const session = await getSession();
    const response = await axios.put(`${process.env.URL}/api/users/cajero/ventas/${session.userId}`, {
        "producto": producto.producto,
        "cliente": producto.cliente,
        "piezas": producto.piezas,
        "nota": session.nota
    })
    if (response.data[0].Nota !== 0) {
        session.nota = response.data[0].Nota;
        await session.save();
    };
    return response.data[1].Error;
}

export const getNotaVenta = async () => {
    const session = await getSession();
    const response = await axios.get(`${process.env.URL}/api/users/cajero/ventas/${session.nota}`);
    const data = response.data;
    return data;
}

export const getNotaNumber = async () => {
    const session = await getSession();
    return session.nota;
}

export const deleteVenta = async (id: number) => {
    const session = await getSession();
    const response = await axios.delete(`${process.env.URL}/api/users/cajero/ventas/${session.userId}/${id}`);
    session.nota = 0;
    await session.save();
    return response.status;
}

export const pago = async (pago: any, metodo: number) => {
    const response = await axios.post(`${process.env.URL}/api/users/cajero/ventas/pedidos/${metodo}`, pago)
    const data = response.data;
    return data;
}

export const addPedido = async (pedido: Pedido) => {
    const session = await getSession();
    const response = await axios.put(`${process.env.URL}/api/users/cajero/ventas/pedidos/${session.userId}`, {
        "receptor": pedido.receptor,
        "idPago": pedido.idPago,
        "metodoPago": pedido.metodoPago,
        "montoCredito": pedido.montoCredito,
        "monto": pedido.monto,
        "nota": session.nota
    })
    const status = response.status;
    return status;
}

export const getTicket = async () => {
    const session = await getSession();
    console.log("Obteniendo ticket de la nota: " + session.nota);

    const response = await axios.get(`${process.env.URL}/api/users/cajero/ventas/pedidos/${String(session.nota)}`)
    console.log("Respuesta del ticket: ", response.data);
    const data = response.data;
    const status = response.status;
    if (status === 200) {
        session.nota = 0;
        await session.save();
    }
    return data;
}

//Cajero/Pedidos
export const getPedidosAction = async (pedido: string, sucursalProp?:string) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/cajero/pedidos`,
        {
            "sucursal": sucursalProp ? sucursalProp : session.sucursal,
            "pedido": pedido
        }
    );
    const data = response.data;
    return data;
}

export const actualizarPedido = async (pedido: ActualizarPedido) => {
    const session = await getSession();
    const response = await axios.put(`${process.env.URL}/api/users/cajero/pedidos/${session.userId}`, pedido)
    const status = response.status;
    return status;
}

//Vendedor/Clientes

export const getClientesAction = async (nombre: string, cajas?:number) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/vendedor/clientes`, {
        vendedor: cajas == 0 ? 0 : session.userId,
        nombre: nombre
    });
    const data = response.data;
    return data;
}

export const addAbonoCredito = async (credito: AbonoCredito) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/vendedor/clientes/deuda/${session.userId}`, credito)
    const status = response.status;
    return status;
}


//Vendedor/Pedidos
export const getPedidosVendedorAction = async (pedido: string) => {
    const session = await getSession();
    const response = await axios.post(`${process.env.URL}/api/users/vendedor/pedidos`,
        {
            "empleado": session.userId,
            "pedido": pedido
        }
    );
    const data = response.data;
    return data;
}