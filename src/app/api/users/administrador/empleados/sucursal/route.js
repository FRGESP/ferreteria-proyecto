import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
    try {
        const [response] = await conn.query("CALL SP_GETSUCURSALESNOMBRES()");
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener sucursales" }, { status: 500 });
    }
}