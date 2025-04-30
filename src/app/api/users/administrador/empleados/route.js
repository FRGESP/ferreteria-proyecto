import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { hashPassword } from "@/libs/hashPassword";

export async function POST(request) {
    const req = await request.json();
    try {
        const hash = await hashPassword(req.password);
        const [response] = await conn.query("CALL SP_REGISTRAREMPLEADO(?,?,?,?,?,?,?,?,?,?)", [hash, req.nombre, req.apellidoPat, req.apellidoMat, req.telefono, req.edad, req.rol, req.estatus, req.sucursal, req.user]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const [response] = await conn.query("CALL SP_GETEMPLEADOS()");

        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener empleados" }, { status: 500 });
    }
}