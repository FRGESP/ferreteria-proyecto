import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETCARGOGENERALBYID(?)", [params.id]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el cargo general" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    console.log("PUT request received for cargo general");
    const req = await request.json();
    const { id } = params;
    try {
        const [response] = await conn.query("CALL SP_UPDATECARGOGENERAL(?,?,?,?)", [id, req.Nombre, req.Cargo, req.Parametro]);

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el cargo general" }, { status: 500 });
    }
}
