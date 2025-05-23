import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function DELETE(request, { params }) {

    try {

        const [response] = await conn.query("CALL SP_DELETECATEGORIA(?,?)", [params.id, params.user]);
        console.log(response);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al eliminar la categoría" }, { status: 500 });
    }

}