import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request, { params }) {
    try {
        const response = await conn.query("CALL SP_GETNOMBRESVENTAS()");
        return NextResponse.json([response[0][0],response[0][1]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener las colonias" }, { status: 500 });
    }
}