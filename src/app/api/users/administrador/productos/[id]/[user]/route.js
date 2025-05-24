import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function DELETE(request, { params }) {

    try {
        console.log(params);
        const [response] = await conn.query("CALL SP_DELETEPRODUCTO(?,?)", [params.id, params.user]);
        console.log(response);
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
    }

}

export async function POST(request, { params }) {
    try {
        const req = await request.json();
        console.log("REQ", req);
        console.log(params);
        const metodos = ["SP_INSERTARPRODUCTO", "SP_INSERTARPRODUCTO_NUEVOTIPO", "SP_INSERTARPRODUCTO_NUEVACATEGORIA_SUBCATEGORIA", "SP_INSERTARPRODUCTO_NUEVACATEGORIA", "SP_INSERTARPRODUCTO_NUEVASUBCATEGORIA"]

        if (params.id == '0') {
            const [response] = await conn.query("CALL SP_INSERTARPRODUCTO(?,?,?,?,?,?,?)", [req.nombre, req.categoria, req.pesoInicial, req.pesoFinal, req.subcategoria, req.costoExtra, params.user]);
            console.log("EntrAAAA", params.id);
            return NextResponse.json(response, { status: 200 });
        } else {
            const [response] = await conn.query(`CALL ${metodos[Number(params.id)]}(?,?,?,?,?,?,?,?,?)`, [req.nombre, req.tipo, req.categoria, req.pesoInicial, req.pesoFinal, req.subcategoria, req.costoBase, req.costoExtra, params.user]);
            return NextResponse.json(response, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener registros" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    // console.trace("ENTRANDO A RUTA PUT2", params)
    const req = await request.json();
    const { id, user } = params;

    try {
        const [response] = await conn.query("CALL SP_REGISTRARACTUZALICACION(?,?,?,?,?,?)", [user, 'Producto', id, req.Campo, req.ValorAnterior, req.ValorNuevo]);
        // if (response[0].affectedRows === 0) {
        //     return NextResponse.json({ error: "Hubo un error al registrar los cambios" }, { status: 500 });
        // }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al actualizar empleado" }, { status: 500 });
    }
}