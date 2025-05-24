import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_ADDCATEGORIA(?,?,?)", [req.nombre, req.tipo, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al registrar categoría" }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETCATEGORIABYID(?)", [params.id]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el tipo" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const req = await request.json();
    const { id } = params;
    try {
        const [response] = await conn.query("CALL SP_UPDATECATEGORIA(?,?,?)", [id, req.Nombre, req.Tipo]);

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el cliente" }, { status: 500 });
    }
}