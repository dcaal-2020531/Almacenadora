import Movement from '../../movement/movement.model.js'
import ExcelJS from 'exceljs'

export const obtenerInformeMovimientos = async (req, res) => {
    try {
        const { startDate, endDate } = req.query // Asumimos que se pasan las fechas como query params

        // Filtrar los movimientos entre las fechas
        const movimientos = await Movement.find(
            {
                date: { $gte: new Date(startDate), $lte: new Date(endDate) }
            }
        ).populate('product') // Poblamos el campo `product` para obtener los detalles del producto

        // Calcular totales de entradas y salidas
        let totalEntradas = 0
        let totalSalidas = 0
        movimientos.forEach(
            movimiento => {
            if (movimiento.type === 'entry') {
                totalEntradas += movimiento.quantity
            } else if (movimiento.type === 'exit') {
                totalSalidas += movimiento.quantity
            }
            
            }
        )

        res.json({
            totalEntradas,
            totalSalidas,
            movimientos,
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el informe de movimientos' })
    }
}

export const generarInformeMovimientos = async (req, res) => {
    try {
        const { startDate, endDate } = req.query
    
        // Filtrar movimientos por fechas
        const movimientos = await Movement.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }).populate('product')
    
        // Calcular totales de entradas y salidas
        let totalEntradas = 0
        let totalSalidas = 0
    
        const data = movimientos.map(movimiento => {
            if (movimiento.type === 'entry') {
            totalEntradas += movimiento.quantity
            } else if (movimiento.type === 'exit') {
            totalSalidas += movimiento.quantity
            }
    
            return {
                Producto: movimiento.product.name,
                Tipo: movimiento.type === 'entry' ? 'Entrada' : 'Salida',
                Cantidad: movimiento.quantity,
                Fecha: movimiento.date.toISOString(),
                Razón: movimiento.reason || 'N/A',
                Destino: movimiento.destination || 'N/A',
            }
        })
    
        // Crear archivo Excel
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Informe Movimientos')
    
        worksheet.columns = [
            { header: 'Producto', key: 'producto', width: 20 },
            { header: 'Tipo', key: 'tipo', width: 10 },
            { header: 'Cantidad', key: 'cantidad', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 25 },
            { header: 'Razón', key: 'razon', width: 20 },
            { header: 'Destino', key: 'destino', width: 20 },
        ]
    
        data.forEach(item => {
            worksheet.addRow(item)
        })
    
        // Añadir totales
        worksheet.addRow({})
        worksheet.addRow({
            producto: 'Total',
            cantidad: totalEntradas - totalSalidas,
            razon: 'Entradas: ' + totalEntradas,
            destino: 'Salidas: ' + totalSalidas,
        })
    
        const excelFile = await workbook.xlsx.writeBuffer()
    
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=Informe_Movimientos.xlsx')
        res.send(excelFile)
    } catch (error) {
        console.error('Error al generar el informe de movimientos:', error)
        res.status(500).json({ error: 'Error al generar el informe de movimientos' })
    }
}