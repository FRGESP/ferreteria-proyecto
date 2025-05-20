import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";


export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETINFOVENDEDOR(?)", [params.id]);
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener empleado" }, { status: 500 });
    }
}