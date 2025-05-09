"use client"
import { useState } from "react"
function SucursalesPage() {

    // Guarda que boton se han seleccionado
    const [selectedButton, setSelectedButton] = useState("Ventas");

    //Actualiza el estado del boton seleccionado
    const handleButtonClick = (button: string) => {
        setSelectedButton(button);
    };
    
  return (
    <div className='flex gap-4 h-[91vh] w-full p-[2%] '>
        <div className='rounded-lg shadow-lg border border-black border-solid h-full flex-grow-[2.5]'>
            <div className='w-full h-[7%] flex justify-center items-center gap-3 mt-[1.5%]'>
                <button onClick={() => handleButtonClick("Ventas")} className={`font-bold border border-black border-solid px-3 py-2 rounded-lg ${selectedButton === "Ventas" ? "bg-acento text-white" : "bg-white hover:bg-gray-200"}`}>
                    Ventas
                </button>
                <button onClick={() => handleButtonClick("Pedidos")} className={`font-bold border border-black border-solid px-3 py-2 rounded-lg ${selectedButton === "Pedidos" ? "bg-acento text-white" : "bg-white hover:bg-gray-200"}`}>
                    Pedidos
                </button>
                <button onClick={() => handleButtonClick("Empleados")} className={`font-bold border border-black border-solid px-3 py-2 rounded-lg ${selectedButton === "Empleados" ? "bg-acento text-white" : "bg-white hover:bg-gray-200"}`}>
                    Empleados
                </button>
            </div>
        </div>
        <div className='border border-black border-solid h-full flex-grow-[1.5]'></div>
    </div>
  )
}

export default SucursalesPage