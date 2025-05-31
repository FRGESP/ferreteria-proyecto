import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request, { params }) {
    const req = await request.json();
    try {
        const {metodo} = params;
        let IdPago = 0;
        if(metodo == 1){
            const [response] = await conn.query("CALL SP_PAGOEFECTIVO(?)", [req.montoPago]);
            IdPago = response[0][0].IdPago;
        } 
        else if(metodo == 2){
            const [response] = await conn.query("CALL SP_PAGOTRANSFERENCIA(?,?,?,?)", [req.titular, req.banco, req.concepto, req.montoPago]);
            IdPago = response[0][0].IdPago;
        } 
        else if(metodo == 3){
            const [response] = await conn.query("CALL SP_PAGOCHEQUE(?,?,?,?)", [req.titular, req.banco, req.numeroCheque, req.montoPago]);
            IdPago = response[0][0].IdPago;
        } 
        else {
            return NextResponse.json({ error: "Método de pago no válido" }, { status: 400 });
        }

        return NextResponse.json(IdPago,{ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al verificar al registrar el pago" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const req = await request.json();
    const { metodo } = params;
    try {
        const [response] = await conn.query("CALL SP_ADDPEDIDO(?,?,?,?,?,?,?)", [req.nota, req.receptor, req.idPago, req.metodoPago, metodo, req.montoCredito, req.monto]);
        return NextResponse.json([response[0][0], response[1][0]],{ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al registrar la venta" }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        const [response] = await conn.query("CALL SP_GETNOTATICKET(?)", [params.metodo]);
        return NextResponse.json([response[0], response[1][0],response[2][0], response[3][0], response[4][0],response[5][0], response[6][0], response[7][0]], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al obtener el cliente" }, { status: 500 });
    }
}