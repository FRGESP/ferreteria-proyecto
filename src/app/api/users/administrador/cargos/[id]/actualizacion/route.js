import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";


export async function PUT(request, { params }) {
    const req = await request.json();
    const { id } = params;
    try {
        const [response] = await conn.query("CALL SP_UPDATECARGO(?,?,?)", [id, req.Nombre, req.Cargo]);

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el cargo" }, { status: 500 });
    }
}
