import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";


export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETINFOVENDEDOR(?)", [params.id]);
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener empleado" }, { status: 500 });
    }
}


export async function POST(request, { params}){
    try{
    const req = await request.json();
    const {agregar, eliminar, IdVendedor} = req;

    if(Array.isArray(agregar) && agregar.length > 0){
        for(const cliente of agregar){
            const response = await conn.query("CALL SP_UPDATECLIENTEREPARTIDOR(?, ?, ?, ?)", [cliente.IdCliente, IdVendedor, params.id, 1]);
        }
    }

    if(Array.isArray(eliminar) && eliminar.length > 0){
        for(const cliente of eliminar){
            const response = await conn.query("CALL SP_UPDATECLIENTEREPARTIDOR(?, ?, ?, ?)", [cliente.IdCliente, IdVendedor, params.id, 0]);
        }
    }
    return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al registrar la sucursal" }, { status: 500 });
    }
}