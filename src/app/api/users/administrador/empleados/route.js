import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";


export async function GET(request) {
    try {
        const [response] = await conn.query("CALL SP_GETEMPLEADOS()");

        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener empleados" }, { status: 500 });
    }
}

export async function POST(request) {
    const req = await request.json();
    try {
        const { nombre } = req;
        const response = await conn.query("CALL SP_FINDEMPLEADO(?)", [nombre]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el empleado" }, { status: 500 });
    }
}