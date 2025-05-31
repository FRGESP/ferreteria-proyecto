import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    const req = await request.json();
    try {
        console.log(req);
        const [response] = await conn.query("CALL SP_CONSULTARCREDITO(?,?)", [req.cliente, req.montoCredito]);
        console.log(response);
        return NextResponse.json(response[0][0],{ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al verificar el credito" }, { status: 500 });
    }
}