import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { hashPassword } from "@/libs/hashPassword";


//Esta ruta es para registrar un empleado
export async function POST(request, { params }) {
    const req = await request.json();
    try {
        const hash = await hashPassword(req.password);
        const [response] = await conn.query("CALL SP_REGISTRAREMPLEADO(?,?,?,?,?,?,?,?,?,?)", [hash, req.nombre, req.apellidoPat, req.apellidoMat, req.telefono, req.edad, req.rol, req.estatus, req.sucursal, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al regsistrar el empleado" }, { status: 500 });
    }
}

//Esta ruta es para obtener un empleado por id
export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETEMPLEADO(?)", [params.id]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener empleado" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const req = await request.json();
    const { id } = params;
    try {
        const [response] = await conn.query("CALL SP_UPDATEEMPLEADO(?,?,?,?,?,?,?,?,?)", [id, req.Nombre, req.ApellidoPaterno, req.ApellidoMaterno, req.Edad, req.Telefono, req.Sucursal, req.Rol, req.Estatus]);
        // if (response.affectedRows === 0) {
        //     return NextResponse.json({ error: "Hubo un error al actualizar un empleado" }, { status: 500 });
        // }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar empleado" }, { status: 500 });
    }
}