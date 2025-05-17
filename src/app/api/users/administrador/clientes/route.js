import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
    try {
        const [response] = await conn.query("CALL SP_GETCLIENTES()");
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 });
    }
}

export async function POST(request) {
    const req = await request.json();
    try {
        const { nombre } = req;
        const response = await conn.query("CALL SP_FINDCLIENTE(?)", [nombre]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el cliente" }, { status: 500 });
    }
}