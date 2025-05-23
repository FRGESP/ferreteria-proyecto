import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_ADDTIPOS(?,?)", [req.nombre, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener registros" }, { status: 500 });
    }
}