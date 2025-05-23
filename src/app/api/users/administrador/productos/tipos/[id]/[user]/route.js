import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function DELETE(request, { params }) {

    try {
        console.log(params);
        const [response] = await conn.query("CALL SP_DELETETIPOS(?,?)", [params.id, params.user]);
        console.log(response);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al eliminar el tipo" }, { status: 500 });
    }

}