import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    const req = await request.json();
    try {
        console.log(`CALL SP_ADDCLIENTE(${req.codigo},${req.colonia},'${req.calle}','${req.nombre}','${req.apellidoPat}','${req.apellidoMat}','${req.telefono}','${req.edad}',${req.rango},${req.creditoMaximo},${req.vendedor},${params.id})`)
        const [response] = await conn.query("CALL SP_ADDCLIENTE(?,?,?,?,?,?,?,?,?,?,?,?)", [req.codigo, req.colonia, req.calle, req.nombre, req.apellidoPat, req.apellidoMat, req.telefono, req.edad, req.rango, req.creditoMaximo, req.vendedor, params.id]);

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al regsistrar el empleado" }, { status: 500 });
    }
}

//Esta ruta es para obtener un cliente por id
export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETCLIENTEBYID(?)", [params.id]);
        return NextResponse.json(response[0][0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el cliente" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const req = await request.json();
    const { id } = params;
    try {
        const [response] = await conn.query("CALL SP_UPDATECLIENTE(?,?,?,?,?,?,?,?,?,?,?,?)", [id, req.Nombre, req.ApellidoPaterno, req.ApellidoMaterno, req.Edad, req.Telefono, req.Codigo, req.Calle, req.Colonia, req.Rango, req.CreditoMaximo, req.Vendedor]);
        // if (response.affectedRows === 0) {
        //     return NextResponse.json({ error: "Hubo un error al actualizar un empleado" }, { status: 500 });
        // }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar el cliente" }, { status: 500 });
    }
}