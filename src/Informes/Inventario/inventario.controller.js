import Product from '../../product/product.model.js'
import ExcelJS from 'exceljs';

export const obtenerInformeInventario = async (req, res) => {
    try {
        const productos = await Product.find()

        let valorTotalInventario = 0
        productos.forEach(producto => {
            valorTotalInventario += producto.price * producto.stock
        })

        res.json({
            totalValorInventario: valorTotalInventario,
            productos: productos.map(producto => ({
                nombre: producto.name,
                categoria: producto.category,
                cantidadEnStock: producto.stock,
                precio: producto.price,
                valorTotalProducto: producto.price * producto.stock,
            })),
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el informe de inventario' })
    }
}

export const generarInformeInventario = async (req, res) => {
    try {
        const productos = await Product.find().populate('category') // Corregido

        let totalStock = 0
        let valorInventario = 0

        const data = productos.map(producto => {
            const totalProducto = producto.stock * producto.price
            totalStock += producto.stock
            valorInventario += totalProducto

            return {
                Producto: producto.name,
                Categoría: producto.category?.name || 'Sin categoría',
                Stock: producto.stock,
                Precio: producto.price,
                ValorTotal: totalProducto,
            }
        })

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Informe de Inventario')

        worksheet.columns = [
            { header: 'Producto', key: 'Producto', width: 20 },
            { header: 'Categoría', key: 'Categoría', width: 20 },
            { header: 'Stock', key: 'Stock', width: 10 },
            { header: 'Precio', key: 'Precio', width: 10 },
            { header: 'Valor Total', key: 'ValorTotal', width: 15 },
        ]

        data.forEach(item => {
            worksheet.addRow(item)
        })

        worksheet.addRow({})
        worksheet.addRow({
            Producto: 'Total',
            Stock: totalStock,
            ValorTotal: valorInventario,
        })

        const excelFile = await workbook.xlsx.writeBuffer() // Agregado

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=Informe_Inventario.xlsx')
        res.send(excelFile)
    } catch (error) {
        console.error('Error al generar el informe de inventario:', error)
        res.status(500).json({ error: 'Error al generar el informe de inventario' })
    }
}
