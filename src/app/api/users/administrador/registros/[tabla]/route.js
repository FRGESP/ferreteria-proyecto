import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_GETREGISTROS(?,?)", [params.tabla, req.nombre]);
        if (response[0].length === 0) {
            return NextResponse.json({ message: "No hay registros" }, { status: 200 });
        }
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener registros" }, { status: 500 });
    }
}