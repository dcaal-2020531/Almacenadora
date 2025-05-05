import Product from '../../product/product.model.js'
import Movement from '../../movement/movement.model.js'
import ExcelJS from 'exceljs'

export const obtenerEstadisticasProductos = async (req, res) => {
    try {
        // Obtener todos los productos
        const productos = await Product.find()

        // Calcular estadísticas de productos más movidos
        let estadisticas = []

        for (const producto of productos) {
        const movimientos = await Movement.find({ product: producto._id })

        const entradas = movimientos.filter(
            movimiento => movimiento.type === 'entry').reduce((acc, mov) => acc + mov.quantity, 0
        )
        const salidas = movimientos.filter(
            movimiento => movimiento.type === 'exit').reduce((acc, mov) => acc + mov.quantity, 0
        )

        estadisticas.push({
            producto: producto.name,
            entradas,
            salidas,
            totalMovimientos: entradas + salidas,
        })
        }

        // Ordenar por productos más movidos
        estadisticas.sort((a, b) => b.totalMovimientos - a.totalMovimientos)

        res.json({ estadisticas })
    } catch (error) {
        res.status(500).json(
            { error: 'Error al obtener las estadísticas de productos' }
        )
    }
}

export const generarEstadisticasProductos = async (req, res) => {
    try {
        const productos = await Product.find()
    
        // Aquí puedes hacer una consulta para calcular los productos más movidos
        const movimientos = await Movement.aggregate([
            {
                $group: {
                    _id: "$product",
                    totalEntradas: { $sum: { $cond: [{ $eq: ["$type", "entry"] }, "$quantity", 0] } },
                    totalSalidas: { $sum: { $cond: [{ $eq: ["$type", "exit"] }, "$quantity", 0] } },
                },
            },
        ])
    
        const data = movimientos.map(item => {
            return {
                Producto: item._id,
                Entradas: item.totalEntradas,
                Salidas: item.totalSalidas,
            }
        })
    
        // Crear archivo Excel
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Estadísticas de Productos')
    
        worksheet.columns = [
            { header: 'Producto', key: 'producto', width: 20 },
            { header: 'Entradas', key: 'entradas', width: 10 },
            { header: 'Salidas', key: 'salidas', width: 10 },
        ]
    
        data.forEach(item => {
            worksheet.addRow(item)
        })
    
        const excelFile = await workbook.xlsx.writeBuffer()
    
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=Estadisticas_Productos.xlsx')
        res.send(excelFile)
    } catch (error) {
        console.error('Error al generar estadísticas de productos:', error)
        res.status(500).json({ error: 'Error al generar las estadísticas de productos' })
    }
}