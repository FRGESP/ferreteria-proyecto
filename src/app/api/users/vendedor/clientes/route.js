import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request) {
    const req = await request.json();
    try {
        const { vendedor, nombre } = req;
        const [response] = await conn.query("CALL SP_GETCLIENTESVENDEDORPAGE(?,?)", [vendedor, nombre]);
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener los clientes" }, { status: 500 });
    }
}