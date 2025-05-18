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

        if(datos.IdRol === 3) {
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
            redirect("/users/vendedor");
            break;
        case 2:
            redirect("/users/cajero");
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

//Administradoe/Empleados

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