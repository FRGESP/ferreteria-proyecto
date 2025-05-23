import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_GETSUBCATEGORIAS(?,?)", [req.nombre, req.pagina]);
        return NextResponse.json([response[0], response[1], response[2][0]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener las subcategorias" }, { status: 500 });
    }
}