import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(req) {
    try {
        const { nombre } = await req.json();
        const [response] = await conn.query("CALL SP_GETSUCURSALES(?)", [nombre]);
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener sucursales" }, { status: 500 });
    }
}