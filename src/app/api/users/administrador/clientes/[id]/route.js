import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    const req = await request.json();
    try {
        const [response] = await conn.query("CALL SP_ADDCLIENTE(?,?,?,?,?,?,?,?,?,?,?)", [req.codigo, req.colonia, req.calle, req.nombre, req.apellidoPat, req.apellidoMat, req.telefono, req.edad, req.rango, req.creditoMaximo, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al regsistrar el empleado" }, { status: 500 });
    }
}