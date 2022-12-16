const config = require('../config/config');
const sql = require('mssql');

async function getEntidadFederativa() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM SAM.cat_estado');
        return result.recordset;
    } catch (error) {
        console.log('Error en el catalogo de entidad federativa' + error);
    }
}

module.exports = {
    getEntidadFederativa: getEntidadFederativa,
}