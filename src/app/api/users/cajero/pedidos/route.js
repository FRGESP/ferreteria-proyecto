import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_GETPEDIDOS(?,?)", [req.sucursal, req.pedido]);
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener los pedidos" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_GETVENDEDORESSUCURSAL(?)", [req.pedido]);
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener vendedores" }, { status: 500 });
    }
}