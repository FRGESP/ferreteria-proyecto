import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETDEUDACLIENTE(?)", [params.id]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el detalle del pedido" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const req = await request.json();
    try {
        const [response] = await conn.query("CALL SP_PAGARDEUDA(?,?,?)", [req.IdCliente, req.Monto, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al regsistrar el empleado" }, { status: 500 });
    }
}