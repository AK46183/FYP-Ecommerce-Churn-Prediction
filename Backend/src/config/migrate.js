// Safe "migration": nayi tables sequelize.sync() banata hai,
// aur purani tables mein sirf MISSING columns add hote hain.
// (sync({ alter: true }) har restart pe duplicate unique constraints bana deta hai — is liye woh use nahi karte)
const syncDatabase = async (sequelize) => {
  await sequelize.sync();

  const qi = sequelize.getQueryInterface();
  const added = [];

  for (const model of Object.values(sequelize.models)) {
    const table = model.getTableName();
    let existing;
    try {
      existing = await qi.describeTable(table);
    } catch {
      continue;
    }

    for (const [name, attr] of Object.entries(model.rawAttributes)) {
      const field = attr.field || name;
      if (existing[field]) continue;

      const isJson = /JSON/i.test(attr.type?.key || '');
      await qi.addColumn(table, field, {
        type: attr.type,
        allowNull: true, // purani rows ke liye
        ...(attr.defaultValue !== undefined && !isJson && { defaultValue: attr.defaultValue }),
        unique: attr.unique || false,
      });
      added.push(`${typeof table === 'string' ? table : table.tableName}.${field}`);
    }
  }

  if (added.length) console.log(`DB updated — new columns: ${added.join(', ')}`);
};

module.exports = { syncDatabase };
