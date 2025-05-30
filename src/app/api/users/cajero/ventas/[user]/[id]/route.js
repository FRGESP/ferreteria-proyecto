import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function DELETE(request, { params }) {
    try {
        console.log(params);
        const [response] = await conn.query("CALL SP_CANCELARPEDIDO(?)", [params.id]);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al eliminar el pedido" }, { status: 500 });
    }

}