import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_ADDTIPOS(?,?,?,?,?,?,?,?)", [req.nombre, req.gPublico1, req.gHerrero2, req.gHerrero3, req.gHerrero4, req.gMayoreo1, req.gMayoreo2, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al registrar el tipo de producto" }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETTIPOBYID(?)", [params.id]);
        return NextResponse.json([response[0][0],response[1][0],response[2][0],response[3][0],response[4][0],response[5][0], response[6][0]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const req = await request.json();
    const { id } = params;
    try {
        const [response] = await conn.query("CALL SP_UPDATETIPO(?,?,?,?,?,?,?,?)", [id, req.Nombre, req.GananciaPublico1, req.GananciaHerrero2, req.GananciaHerrero3, req.GananciaHerrero4, req.GananciaMayoreo1, req.GananciaMayoreo2]);

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el cliente" }, { status: 500 });
    }
}