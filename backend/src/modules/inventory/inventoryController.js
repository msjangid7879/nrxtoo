import { query } from '../../database/db.js';

export const getInventoryItems = async (req, res) => {
  try {
    const shopId = req.shopId;
    const { category, search, status, sort_by = 'created_at', sort_dir = 'DESC' } = req.query;

    let sql = `SELECT * FROM inventory_items WHERE shop_id = $1`;
    const params = [shopId];
    let paramIndex = 2;

    if (category && (category === 'Jewellery' || category === 'Stones')) {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (status && ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'].includes(status)) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;
      sql += ` AND (
        sku ILIKE $${paramIndex} OR 
        name ILIKE $${paramIndex} OR 
        huid_hallmark ILIKE $${paramIndex} OR 
        lab_certificate_no ILIKE $${paramIndex} OR
        stone_type ILIKE $${paramIndex} OR
        metal_type ILIKE $${paramIndex}
      )`;
      params.push(term);
      paramIndex++;
    }

    const safeSortCols = ['name', 'sku', 'selling_price', 'current_stock', 'created_at', 'category'];
    const col = safeSortCols.includes(sort_by) ? sort_by : 'created_at';
    const dir = sort_dir === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${col} ${dir}`;

    const result = await query(sql, params);

    res.json({
      success: true,
      count: result.rowCount,
      items: result.rows,
    });
  } catch (err) {
    console.error('[getInventoryItems Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve inventory items', error: err.message });
  }
};

export const getInventoryStats = async (req, res) => {
  try {
    const shopId = req.shopId;

    const statsResult = await query(
      `SELECT 
        COUNT(*) as total_items,
        COUNT(*) FILTER (WHERE category = 'Jewellery') as jewellery_count,
        COUNT(*) FILTER (WHERE category = 'Stones') as stones_count,
        COUNT(*) FILTER (WHERE status = 'LOW_STOCK') as low_stock_count,
        COUNT(*) FILTER (WHERE status = 'OUT_OF_STOCK') as out_of_stock_count,
        COALESCE(SUM(current_stock * selling_price), 0) as total_valuation,
        COALESCE(SUM(current_stock * cost_price), 0) as total_cost_valuation,
        COALESCE(SUM(current_stock), 0) as total_units
       FROM inventory_items 
       WHERE shop_id = $1`,
      [shopId]
    );

    const s = statsResult.rows[0];
    res.json({
      success: true,
      stats: {
        total_items: parseInt(s.total_items, 10),
        jewellery_count: parseInt(s.jewellery_count, 10),
        stones_count: parseInt(s.stones_count, 10),
        low_stock_count: parseInt(s.low_stock_count, 10),
        out_of_stock_count: parseInt(s.out_of_stock_count, 10),
        total_valuation: parseFloat(s.total_valuation),
        total_cost_valuation: parseFloat(s.total_cost_valuation),
        total_units: parseFloat(s.total_units),
      },
    });
  } catch (err) {
    console.error('[getInventoryStats Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to get inventory stats', error: err.message });
  }
};

export const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.shopId;

    const result = await query(`SELECT * FROM inventory_items WHERE id = $1 AND shop_id = $2`, [id, shopId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch item', error: err.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const shopId = req.shopId;
    const {
      sku,
      name,
      category,
      description,
      image_url,
      cost_price,
      selling_price,
      current_stock = 0,
      minimum_stock = 1,
      unit = 'pcs',
      metal_type,
      purity,
      gross_weight,
      net_weight,
      stone_weight,
      making_charges,
      huid_hallmark,
      stone_type,
      shape_cut,
      color,
      clarity,
      carat_weight,
      treatment_origin,
      lab_certificate_no,
    } = req.body;

    if (!sku || !name || !category || selling_price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'SKU, item name, category (Jewellery/Stones), and selling price are required.',
      });
    }

    if (category !== 'Jewellery' && category !== 'Stones') {
      return res.status(400).json({
        success: false,
        message: "Category must be either 'Jewellery' or 'Stones'.",
      });
    }

    const stockNum = parseFloat(current_stock) || 0;
    const minStockNum = parseFloat(minimum_stock) || 1;
    let status = 'IN_STOCK';
    if (stockNum <= 0) {
      status = 'OUT_OF_STOCK';
    } else if (stockNum <= minStockNum) {
      status = 'LOW_STOCK';
    }

    const itemId = `item-${Date.now()}`;

    const insertSql = `
      INSERT INTO inventory_items (
        id, shop_id, sku, name, category, description, image_url,
        cost_price, selling_price, current_stock, minimum_stock, unit, status,
        metal_type, purity, gross_weight, net_weight, stone_weight, making_charges, huid_hallmark,
        stone_type, shape_cut, color, clarity, carat_weight, treatment_origin, lab_certificate_no
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27
      ) RETURNING *
    `;

    const values = [
      itemId,
      shopId,
      sku.toUpperCase().trim(),
      name.trim(),
      category,
      description || null,
      image_url || null,
      parseFloat(cost_price) || 0,
      parseFloat(selling_price) || 0,
      stockNum,
      minStockNum,
      unit,
      status,
      category === 'Jewellery' ? metal_type || null : null,
      category === 'Jewellery' ? purity || null : null,
      category === 'Jewellery' ? (gross_weight ? parseFloat(gross_weight) : null) : null,
      category === 'Jewellery' ? (net_weight ? parseFloat(net_weight) : null) : null,
      category === 'Jewellery' ? (stone_weight ? parseFloat(stone_weight) : null) : null,
      category === 'Jewellery' ? (making_charges ? parseFloat(making_charges) : null) : null,
      category === 'Jewellery' ? (huid_hallmark ? huid_hallmark.toUpperCase().trim() : null) : null,
      category === 'Stones' ? stone_type || null : null,
      category === 'Stones' ? shape_cut || null : null,
      category === 'Stones' ? color || null : null,
      category === 'Stones' ? clarity || null : null,
      category === 'Stones' ? (carat_weight ? parseFloat(carat_weight) : null) : null,
      category === 'Stones' ? treatment_origin || null : null,
      category === 'Stones' ? (lab_certificate_no ? lab_certificate_no.toUpperCase().trim() : null) : null,
    ];

    const result = await query(insertSql, values);

    res.status(201).json({
      success: true,
      message: `${category} item created successfully.`,
      item: result.rows[0],
    });
  } catch (err) {
    console.error('[createInventoryItem Error]:', err);
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'An item with this SKU already exists in this shop.' });
    }
    res.status(500).json({ success: false, message: 'Failed to create item', error: err.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.shopId;
    const {
      name,
      description,
      image_url,
      cost_price,
      selling_price,
      current_stock,
      minimum_stock,
      unit,
      metal_type,
      purity,
      gross_weight,
      net_weight,
      stone_weight,
      making_charges,
      huid_hallmark,
      stone_type,
      shape_cut,
      color,
      clarity,
      carat_weight,
      treatment_origin,
      lab_certificate_no,
    } = req.body;

    const existingResult = await query(`SELECT * FROM inventory_items WHERE id = $1 AND shop_id = $2`, [id, shopId]);
    if (existingResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const curStock = current_stock !== undefined ? parseFloat(current_stock) : parseFloat(existingResult.rows[0].current_stock);
    const minStock = minimum_stock !== undefined ? parseFloat(minimum_stock) : parseFloat(existingResult.rows[0].minimum_stock);
    let status = 'IN_STOCK';
    if (curStock <= 0) {
      status = 'OUT_OF_STOCK';
    } else if (curStock <= minStock) {
      status = 'LOW_STOCK';
    }

    const updateSql = `
      UPDATE inventory_items SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        image_url = COALESCE($3, image_url),
        cost_price = COALESCE($4, cost_price),
        selling_price = COALESCE($5, selling_price),
        current_stock = COALESCE($6, current_stock),
        minimum_stock = COALESCE($7, minimum_stock),
        unit = COALESCE($8, unit),
        status = $9,
        metal_type = COALESCE($10, metal_type),
        purity = COALESCE($11, purity),
        gross_weight = COALESCE($12, gross_weight),
        net_weight = COALESCE($13, net_weight),
        stone_weight = COALESCE($14, stone_weight),
        making_charges = COALESCE($15, making_charges),
        huid_hallmark = COALESCE($16, huid_hallmark),
        stone_type = COALESCE($17, stone_type),
        shape_cut = COALESCE($18, shape_cut),
        color = COALESCE($19, color),
        clarity = COALESCE($20, clarity),
        carat_weight = COALESCE($21, carat_weight),
        treatment_origin = COALESCE($22, treatment_origin),
        lab_certificate_no = COALESCE($23, lab_certificate_no),
        updated_at = NOW()
      WHERE id = $24 AND shop_id = $25
      RETURNING *
    `;

    const values = [
      name,
      description,
      image_url,
      cost_price !== undefined ? parseFloat(cost_price) : null,
      selling_price !== undefined ? parseFloat(selling_price) : null,
      current_stock !== undefined ? curStock : null,
      minimum_stock !== undefined ? minStock : null,
      unit,
      status,
      metal_type,
      purity,
      gross_weight !== undefined ? parseFloat(gross_weight) : null,
      net_weight !== undefined ? parseFloat(net_weight) : null,
      stone_weight !== undefined ? parseFloat(stone_weight) : null,
      making_charges !== undefined ? parseFloat(making_charges) : null,
      huid_hallmark ? huid_hallmark.toUpperCase().trim() : null,
      stone_type,
      shape_cut,
      color,
      clarity,
      carat_weight !== undefined ? parseFloat(carat_weight) : null,
      treatment_origin,
      lab_certificate_no ? lab_certificate_no.toUpperCase().trim() : null,
      id,
      shopId,
    ];

    const result = await query(updateSql, values);

    res.json({
      success: true,
      message: 'Item updated successfully.',
      item: result.rows[0],
    });
  } catch (err) {
    console.error('[updateInventoryItem Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to update item', error: err.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.shopId;

    const result = await query(`DELETE FROM inventory_items WHERE id = $1 AND shop_id = $2 RETURNING id`, [id, shopId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, message: 'Item deleted successfully.' });
  } catch (err) {
    console.error('[deleteInventoryItem Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to delete item', error: err.message });
  }
};
