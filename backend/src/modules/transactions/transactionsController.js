import { getClient, query } from '../../database/db.js';

export const getTransactions = async (req, res) => {
  try {
    const shopId = req.shopId;
    const { type, item_id, limit = 50 } = req.query;

    let sql = `
      SELECT t.*, 
        i.name as item_name, 
        i.sku as item_sku, 
        i.category as item_category,
        u.full_name as performer_name
      FROM stock_transactions t
      JOIN inventory_items i ON i.id = t.item_id
      LEFT JOIN users u ON u.id = t.performed_by
      WHERE t.shop_id = $1
    `;
    const params = [shopId];
    let idx = 2;

    if (type && (type === 'PURCHASE' || type === 'SALE' || type === 'ADJUSTMENT')) {
      sql += ` AND t.transaction_type = $${idx}`;
      params.push(type);
      idx++;
    }

    if (item_id) {
      sql += ` AND t.item_id = $${idx}`;
      params.push(item_id);
      idx++;
    }

    sql += ` ORDER BY t.transaction_date DESC LIMIT $${idx}`;
    params.push(parseInt(limit, 10) || 50);

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rowCount,
      transactions: result.rows,
    });
  } catch (err) {
    console.error('[getTransactions Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve transactions', error: err.message });
  }
};

export const recordPurchase = async (req, res) => {
  const client = await getClient();
  try {
    const shopId = req.shopId;
    const userId = req.user?.userId;
    const {
      item_id,
      quantity,
      unit_price,
      party_name,
      party_contact,
      invoice_no,
      payment_method = 'Bank Transfer',
      notes,
    } = req.body;

    const qty = parseFloat(quantity);
    const price = parseFloat(unit_price);

    if (!item_id || isNaN(qty) || qty <= 0 || isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid item_id, positive quantity, and purchase unit_price are required.',
      });
    }

    await client.query('BEGIN');

    const itemResult = await client.query(
      `SELECT id, current_stock, minimum_stock, cost_price FROM inventory_items WHERE id = $1 AND shop_id = $2 FOR UPDATE`,
      [item_id, shopId]
    );

    if (itemResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    const currentStock = parseFloat(itemResult.rows[0].current_stock);
    const minStock = parseFloat(itemResult.rows[0].minimum_stock);
    const newStock = currentStock + qty;

    let newStatus = 'IN_STOCK';
    if (newStock <= 0) {
      newStatus = 'OUT_OF_STOCK';
    } else if (newStock <= minStock) {
      newStatus = 'LOW_STOCK';
    }

    await client.query(
      `UPDATE inventory_items 
       SET current_stock = $1, status = $2, cost_price = $3, updated_at = NOW() 
       WHERE id = $4 AND shop_id = $5`,
      [newStock, newStatus, price, item_id, shopId]
    );

    const totalAmount = qty * price;
    const txnId = `txn-pur-${Date.now()}`;
    const invoiceReference = invoice_no || `PUR-${Date.now().toString().slice(-6)}`;

    const txnResult = await client.query(
      `INSERT INTO stock_transactions (
        id, shop_id, item_id, transaction_type, quantity, unit_price, total_amount,
        party_name, party_contact, invoice_no, payment_method, notes, performed_by
      ) VALUES ($1, $2, $3, 'PURCHASE', $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        txnId,
        shopId,
        item_id,
        qty,
        price,
        totalAmount,
        party_name || 'Vendor / Supplier',
        party_contact || '',
        invoiceReference,
        payment_method,
        notes || '',
        userId,
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: `Purchase entry recorded. Added ${qty} units to stock. New balance: ${newStock}`,
      transaction: txnResult.rows[0],
      new_stock: newStock,
      new_status: newStatus,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[recordPurchase Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to process purchase entry', error: err.message });
  } finally {
    client.release();
  }
};

export const recordSale = async (req, res) => {
  const client = await getClient();
  try {
    const shopId = req.shopId;
    const userId = req.user?.userId;
    const {
      item_id,
      quantity,
      unit_price,
      party_name,
      party_contact,
      invoice_no,
      payment_method = 'CASH',
      notes,
    } = req.body;

    const qty = parseFloat(quantity);
    const price = parseFloat(unit_price);

    if (!item_id || isNaN(qty) || qty <= 0 || isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid item_id, positive quantity, and selling unit_price are required.',
      });
    }

    await client.query('BEGIN');

    const itemResult = await client.query(
      `SELECT id, name, sku, current_stock, minimum_stock FROM inventory_items WHERE id = $1 AND shop_id = $2 FOR UPDATE`,
      [item_id, shopId]
    );

    if (itemResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    const currentStock = parseFloat(itemResult.rows[0].current_stock);
    const minStock = parseFloat(itemResult.rows[0].minimum_stock);

    if (currentStock < qty) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Insufficient stock! Requested: ${qty}, Available in stock: ${currentStock}`,
      });
    }

    const newStock = currentStock - qty;
    let newStatus = 'IN_STOCK';
    if (newStock <= 0) {
      newStatus = 'OUT_OF_STOCK';
    } else if (newStock <= minStock) {
      newStatus = 'LOW_STOCK';
    }

    await client.query(
      `UPDATE inventory_items 
       SET current_stock = $1, status = $2, updated_at = NOW() 
       WHERE id = $3 AND shop_id = $4`,
      [newStock, newStatus, item_id, shopId]
    );

    const totalAmount = qty * price;
    const txnId = `txn-sale-${Date.now()}`;
    const invoiceReference = invoice_no || `INV-${Date.now().toString().slice(-6)}`;

    const txnResult = await client.query(
      `INSERT INTO stock_transactions (
        id, shop_id, item_id, transaction_type, quantity, unit_price, total_amount,
        party_name, party_contact, invoice_no, payment_method, notes, performed_by
      ) VALUES ($1, $2, $3, 'SALE', $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        txnId,
        shopId,
        item_id,
        qty,
        price,
        totalAmount,
        party_name || 'Walk-in Customer',
        party_contact || '',
        invoiceReference,
        payment_method,
        notes || '',
        userId,
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: `Sale recorded successfully! Deducted ${qty} units. Remaining stock: ${newStock}`,
      transaction: txnResult.rows[0],
      new_stock: newStock,
      new_status: newStatus,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[recordSale Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to record sale transaction', error: err.message });
  } finally {
    client.release();
  }
};
