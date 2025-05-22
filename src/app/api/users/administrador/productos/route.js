import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        console.log(req);
        const [response] = await conn.query("CALL SP_GETPRODUCTOS(?,?,?,?,?)", [req.tipo, req.categoria, req.subcategoria, req.rango, req.pagina]);

        return NextResponse.json([response[0], response[1][0]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener registros" }, { status: 500 });
    }
}