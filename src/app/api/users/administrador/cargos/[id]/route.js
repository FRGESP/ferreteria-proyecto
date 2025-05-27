import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const req = await request.json();
        const { nombre } = req;
        const [response] = await conn.query("CALL SP_GETCARGOS(?,?)", [id, nombre]);
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const req = await request.json();
    console.log(req)
    try {
        const [response] = await conn.query("CALL SP_ADDCARGO(?,?,?,?)", [req.nombre, req.cargo, req.tipo ,params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al regsistrar el cargo" }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETCARGOBYID(?)", [params.id]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el cargo" }, { status: 500 });
    }
}