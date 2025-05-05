import Movement from '../../movement/movement.model.js'
import ExcelJS from 'exceljs'

export const obtenerInformeMovimientos = async (req, res) => {
    try {
        const { startDate, endDate } = req.query // Asumimos que se pasan las fechas como query params

        // Validación de fechas
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Debe proporcionar startDate y endDate en el query' })
        }

        const fechaInicio = new Date(startDate)
        const fechaFin = new Date(endDate)

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            return res.status(400).json({ error: 'Fechas inválidas' })
        }

        // Filtrar los movimientos entre las fechas
        const movimientos = await Movement.find(
            {
                date: { $gte: fechaInicio, $lte: fechaFin }
            }
        ).populate('product') // Poblamos el campo `product` para obtener los detalles del producto

        if (!movimientos.length) {
            return res.status(404).json({ error: 'No se encontraron movimientos en el rango de fechas' })
        }

        // Calcular totales de entradas y salidas
        let totalEntradas = 0
        let totalSalidas = 0
        movimientos.forEach(movimiento => {
            if (movimiento.type === 'entry') totalEntradas += movimiento.quantity
            else if (movimiento.type === 'exit') totalSalidas += movimiento.quantity
        })

        // Responder con el informe en formato JSON
        res.json({
            totalEntradas,
            totalSalidas,
            movimientos: movimientos.map(mov => ({
                producto: mov.product.name,
                tipo: mov.type === 'entry' ? 'Entrada' : 'Salida',
                cantidad: mov.quantity,
                fecha: mov.date.toLocaleString('es-ES'),
                razon: mov.reason || 'N/A',
                destino: mov.destination || 'N/A',
            }))
        })
    } catch (error) {
        console.error('Error al obtener el informe de movimientos:', error)
        res.status(500).json({ error: 'Error al obtener el informe de movimientos' })
    }
}

export const generarInformeMovimientos = async (req, res) => {
    try {
        const { startDate, endDate } = req.query

        // Validar fechas
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Debe proporcionar startDate y endDate en el query' })
        }

        const fechaInicio = new Date(startDate)
        const fechaFin = new Date(endDate)

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
            return res.status(400).json({ error: 'Fechas inválidas' })
        }

        // Buscar movimientos entre fechas
        const movimientos = await Movement.find({
            date: { $gte: fechaInicio, $lte: fechaFin }
        }).populate('product')

        if (!movimientos.length) {
            return res.status(404).json({ error: 'No se encontraron movimientos en el rango de fechas' })
        }

        let totalEntradas = 0
        let totalSalidas = 0

        const data = movimientos.map(mov => {
            if (mov.type === 'entry') totalEntradas += mov.quantity
            else if (mov.type === 'exit') totalSalidas += mov.quantity

            return {
                producto: mov.product.name,
                tipo: mov.type === 'entry' ? 'Entrada' : 'Salida',
                cantidad: mov.quantity,
                fecha: mov.date.toLocaleString('es-ES'),
                razon: mov.reason || 'N/A',
                destino: mov.destination || 'N/A',
            }
        })

        // Crear archivo Excel
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Informe Movimientos')

        worksheet.columns = [
            { header: 'Producto', key: 'producto', width: 25 },
            { header: 'Tipo', key: 'tipo', width: 10 },
            { header: 'Cantidad', key: 'cantidad', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 25 },
            { header: 'Razón', key: 'razon', width: 20 },
            { header: 'Destino', key: 'destino', width: 20 },
        ]

        worksheet.addRows(data)

        // Añadir totales al final
        worksheet.addRow({})
        worksheet.addRow({
            producto: 'Totales',
            cantidad: totalEntradas - totalSalidas,
            razon: `Entradas: ${totalEntradas}`,
            destino: `Salidas: ${totalSalidas}`
        })

        const buffer = await workbook.xlsx.writeBuffer()

        // Enviar el archivo Excel como respuesta
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=Informe_Movimientos.xlsx')
        res.send(buffer)

    } catch (error) {
        console.error('Error grave al generar el informe:', error)
        res.status(500).json({ error: 'Error interno al generar el informe de movimientos' })
    }
}
