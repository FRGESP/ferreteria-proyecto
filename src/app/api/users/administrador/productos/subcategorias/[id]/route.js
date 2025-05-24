import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        const [response] = await conn.query("CALL SP_ADDSUBCATEGORIA(?,?,?,?)", [req.nombre, req.tipo, req.costoBase, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al registrar subcategoría" }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETSUBCATEGORIABYID(?)", [params.id]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener la subcategoria" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const req = await request.json();
    const { id } = params;
    try {
        const [response] = await conn.query("CALL SP_UPDATESUBCATEGORIA(?,?,?,?)", [id, req.Nombre, req.Tipo, req.CostoBase]);

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el la subcategoria" }, { status: 500 });
    }
}