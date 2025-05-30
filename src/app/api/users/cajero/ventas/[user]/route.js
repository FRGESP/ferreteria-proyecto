import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function PUT(request, { params }) {
    const req = await request.json();
    const { user } = params;
    try {
        const [response] = await conn.query("CALL SP_ADDPRODUCTOVENTA(?,?,?,?,?)", [req.producto, req.cliente, user, req.piezas, req.nota]);
        return NextResponse.json(response[0][0],{ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al registrar la venta" }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const response = await conn.query("CALL SP_GETNOTA(?)", [params.user]);
        return NextResponse.json([response[0][0], response[0][1], response[0][2], response[0][3]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener las ventas" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        console.log(params);
        const [response] = await conn.query("CALL SP_DELETENOTAPRODUCTO(?)", [params.user]);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
    }

}