import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_ADDTIPOS(?,?,?,?,?,?,?,?)", [req.nombre, req.gPublico1, req.gHerrero2, req.gHerrero3, req.gHerrero4, req.gMayoreo1, req.gMayoreo2, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al registrar el tipo de producto" }, { status: 500 });
    }
}