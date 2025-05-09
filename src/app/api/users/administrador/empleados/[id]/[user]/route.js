import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function DELETE(request, { params }) {

    try {
        console.log(params);
        const [response] = await conn.query("CALL SP_DELETEEMPLEADO(?,?)", [params.id, params.user]);
        console.log(response);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al eliminar empleado" }, { status: 500 });
    }

}

export async function PUT(request, { params }) {
    // console.trace("ENTRANDO A RUTA PUT2", params)
    const req = await request.json();
    const { id, user } = params;

    try {
        const [response] = await conn.query("CALL SP_REGISTRARACTUZALICACION(?,?,?,?,?,?)", [user, 'Empleado', id, req.Campo, req.ValorAnterior, req.ValorNuevo]);
        // if (response[0].affectedRows === 0) {
        //     return NextResponse.json({ error: "Hubo un error al registrar los cambios" }, { status: 500 });
        // }
        console.log("Affected ROWSSSS:", response.affectedRows)
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar empleado" }, { status: 500 });
    }
}

export async function GET(request, { params}){
    try {
        const [response] = await conn.query("CALL SP_GETEMPLEADOS(?)", [params.id]);
        return NextResponse.json(response[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener empleado" }, { status: 500 });
    }
}
