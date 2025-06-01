import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETPEDIDODETALLE(?)", [params.id]);
        return NextResponse.json([response[0][0], response[1][0], response[2], response[3][0], response[4][0], response[5][0], response[7][0]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el detalle del pedido" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_ACTUALIZARPEDIDO(?,?,?,?)", [req.pedido, req.estatus, req.repartidor, params.id]);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el pedido" }, { status: 500 });
    }
}