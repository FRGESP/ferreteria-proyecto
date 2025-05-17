import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params}){
    try{
    const req = await request.json();
    const response = await conn.query('CALL SP_REGISTRARSUCURSAL(?,?,?,?,?,?)',[req.codigo, req.colonia, req.calle, req.nombre, req.telefono, params.id]);
    return NextResponse.json(response[0][0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al registrar la sucursal" }, { status: 500 });
    }
}