import Cliente from './cliente.model.js'

/* GESTIÓN DE CLIENTES */

// Ver todos los clientes activos
export const getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find({ status: true });
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ver cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente || !cliente.status) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo cliente
export const createCliente = async (req, res) => {
  try {
    const { name, contact, company } = req.body;

    const cliente = new Cliente({
      name,
      contact,
      company
    });

    await cliente.save();

    res.status(201).json({ mensaje: 'Cliente creado exitosamente', cliente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, company } = req.body;

    const cliente = await Cliente.findById(id);
    if (!cliente || !cliente.status) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    cliente.name = name || cliente.name;
    cliente.contact = contact || cliente.contact;
    cliente.company = company || cliente.company;

    await cliente.save();

    res.status(200).json({ mensaje: 'Cliente actualizado con éxito', cliente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dar de baja a un cliente
export const deactivateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmation } = req.body;

    const cliente = await Cliente.findById(id);
    if (!cliente || !cliente.status) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    if (!confirmation || confirmation !== 'CONFIRM') {
      return res.status(400).json({ mensaje: 'Se requiere confirmación para dar de baja al cliente' });
    }

    cliente.status = false;
    await cliente.save();

    res.status(200).json({ mensaje: 'Cliente dado de baja con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
