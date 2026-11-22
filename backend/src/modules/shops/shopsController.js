import { query } from '../../database/db.js';

export const getCurrentShop = async (req, res) => {
  try {
    const shopId = req.shopId;
    if (!shopId) {
      return res.status(400).json({ success: false, message: 'Shop ID context missing' });
    }

    const shopResult = await query(`SELECT * FROM shops WHERE id = $1`, [shopId]);
    if (shopResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const modulesResult = await query(
      `SELECT module_key, module_name, description, icon_name, is_enabled 
       FROM shop_modules 
       WHERE shop_id = $1
       ORDER BY 
         CASE module_key 
           WHEN 'inventory' THEN 1 
           WHEN 'hr' THEN 2 
           WHEN 'accounting' THEN 3 
           WHEN 'ecommerce' THEN 4 
           ELSE 5 
         END`,
      [shopId]
    );

    res.json({
      success: true,
      shop: shopResult.rows[0],
      modules: modulesResult.rows,
    });
  } catch (err) {
    console.error('[getCurrentShop Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve shop profile', error: err.message });
  }
};

export const updateCurrentShop = async (req, res) => {
  try {
    const shopId = req.shopId;
    const {
      name,
      tagline,
      logo_url,
      banner_url,
      address,
      phone,
      email,
      gstin,
      currency,
      currency_symbol,
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Shop name is required' });
    }

    const updateQuery = `
      UPDATE shops 
      SET 
        name = COALESCE($1, name),
        tagline = COALESCE($2, tagline),
        logo_url = COALESCE($3, logo_url),
        banner_url = COALESCE($4, banner_url),
        address = COALESCE($5, address),
        phone = COALESCE($6, phone),
        email = COALESCE($7, email),
        gstin = COALESCE($8, gstin),
        currency = COALESCE($9, currency),
        currency_symbol = COALESCE($10, currency_symbol),
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `;

    const result = await query(updateQuery, [
      name,
      tagline,
      logo_url,
      banner_url,
      address,
      phone,
      email,
      gstin,
      currency,
      currency_symbol,
      shopId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    res.json({
      success: true,
      message: 'Shop profile updated successfully.',
      shop: result.rows[0],
    });
  } catch (err) {
    console.error('[updateCurrentShop Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to update shop profile', error: err.message });
  }
};
