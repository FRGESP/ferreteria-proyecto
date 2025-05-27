import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function PUT(request, { params }) {
    console.log("PUT request received for cargo general");
    const req = await request.json();
    const { id } = params;
    try {
        const [response] = await conn.query("CALL SP_UPDATESTOCKSUCURSAL(?,?,?,?)", [id, req.Sucursal, req.Stock, req.StockMinimo]);

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el inventario" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const req = await request.json();
    console.log(req)
    try {
        const [response] = await conn.query("CALL SP_ADDSTOCK(?,?,?,?)", [req.producto, req.sucursal, req.cantidad ,params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al regsistrar nuevo stock" }, { status: 500 });
    }
}