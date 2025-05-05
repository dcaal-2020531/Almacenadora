import Product from '../../product/product.model.js'
import ExcelJS from 'exceljs';


export const obtenerInformeInventario = async (req, res) => {
    try {
        // Obtener todos los productos
        const productos = await Product.find()

        // Calcular el valor total del inventario
        let valorTotalInventario = 0
        productos.forEach(
            producto => {
                valorTotalInventario += producto.price * producto.stock
            }
        )

        // Responder con los datos del inventario
        res.json({
        totalValorInventario: valorTotalInventario,
        productos: productos.map(
            producto => (
                {
                    nombre: producto.name,
                    categoria: producto.category,
                    cantidadEnStock: producto.stock,
                    precio: producto.price,
                    valorTotalProducto: producto.price * producto.stock,
                }
            )
        ),})

    } catch (error) {
        res.status(500).json(
            { error: 'Error al obtener el informe de inventario' }
        )
    }
}

export const generarInformeInventario = async (req, res) => {
    try {
        // 1. Obtener todos los productos
        const productos = await Product.find().populate('category supplier')
    
        // 2. Calcular el total de stock y valor del inventario
        let totalStock = 0
        let valorInventario = 0
    
        const data = productos.map(producto => {
            const totalProducto = producto.stock * producto.price
            totalStock += producto.stock
            valorInventario += totalProducto
    
            return {
                Producto: producto.name,
                Categoría: producto.category.name,
                Stock: producto.stock,
                Precio: producto.price,
                ValorTotal: totalProducto,
            }
        })
    
        // 3. Crear un archivo Excel con la información
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Informe de Inventario')
    
        worksheet.columns = [
            { header: 'Producto', key: 'producto', width: 20 },
            { header: 'Categoría', key: 'categoria', width: 20 },
            { header: 'Stock', key: 'stock', width: 10 },
            { header: 'Precio', key: 'precio', width: 10 },
            { header: 'Valor Total', key: 'valorTotal', width: 15 },
        ]
    
        // Añadir las filas de productos
        data.forEach(item => {
            worksheet.addRow(item)
        })
    
        // 4. Añadir resumen al final
        worksheet.addRow({})
        worksheet.addRow({
            producto: 'Total',
            stock: totalStock,
            valorTotal: valorInventario,
        })
        // Generar archivo Excel
        // const excelFile = await workbook.xlsx.writeBuffer()
  
        // Enviar archivo como respuesta
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=Informe_Inventario.xlsx')
        res.send(excelFile);
    } catch (error) {
        console.error('Error al generar el informe de inventario:', error)
        res.status(500).json({ error: 'Error al generar el informe de inventario' })
    }
}