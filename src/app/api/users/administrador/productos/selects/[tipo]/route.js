import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GET_PRODUCTOS_SELECT(?)", [params.tipo]);
        return NextResponse.json([response[0],response[1],response[2], response[3], response[4]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener los selects" }, { status: 500 });
    }
}