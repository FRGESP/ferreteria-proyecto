import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";


export async function POST(request) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_GETCLIENTESVENDEDOR(?,?)", [req.IdEmpleado, req.nombre]);
        return NextResponse.json([response[0], response[1]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener empleados" }, { status: 500 });
    }
}