import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import {comparePassword} from "@/libs/hashPassword";

export async function POST(request) {
    const req = await request.json();
    try{
        let [response] = await conn.query("CALL LOGIN_ESTATUS(?,?)", [req.user, 0]);

        if (response[0][0].RES !== 2) {
            return NextResponse.json(response[0][0], { status: 200 });
        }

        [response] = await conn.query("CALL LOGIN_ESTATUS(?,?)", [req.user, 1]);
        
        const boolCompare = await comparePassword(req.password, response[0][0].Contraseña);
        if (!boolCompare) {
            return NextResponse.json({"RES":3}, { status: 200 });
        }

        [response] = await conn.query("CALL SP_GETUSERINFO(?)", [req.user]);
        return NextResponse.json(response[0][0], { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
    }
}