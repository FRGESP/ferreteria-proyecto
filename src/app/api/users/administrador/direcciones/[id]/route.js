import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request, { params }) {
    try {
        const response = await conn.query("CALL SP_OBTENERCOLONIAS(?)", [params.id]);
        return NextResponse.json([response[0][0],response[0][1], response[0][2]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener las colonias" }, { status: 500 });
    }
}