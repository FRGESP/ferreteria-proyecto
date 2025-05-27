import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";


export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETPRODUCTOSUCURSALBYID(?,?)", [params.id, params.user]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const req = await request.json();
    const { id, user } = params;

    try {
        const [response] = await conn.query("CALL SP_REGISTRARACTUZALICACIONINVENTARIO(?,?,?,?,?,?)", [user, req.Sucursal, id, req.Campo, req.ValorAnterior, req.ValorNuevo]);
        // if (response[0].affectedRows === 0) {
        //     return NextResponse.json({ error: "Hubo un error al registrar los cambios" }, { status: 500 });
        // }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el inventario" }, { status: 500 });
    }
}