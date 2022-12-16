const sql = require('mssql');
const config = require('../config/config');

async function getAllMunicipio() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM SAM.CAT_MUNICIPIOS;');
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener los municipios ' + error);
    }
}

async function getEstadoMunicipio(parMuni) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            /*.input("id", sql.Int, parMuni.id)
            .input("idOk", sql.Int, parMuni.idOK)
            .input("nombre", sql.VarChar, parMuni.nombre)
            .input("municipio_min", sql.VarChar, parMuni.municipio_min)
            .input("cveINEGI", sql.VarChar, parMuni.cveINEGI) */
            .input("estado_id", sql.Int, parMuni.estado_id)
            .query(`SELECT * FROM SAM.CAT_MUNICIPIOS WHERE ID = @estado_id; `)
        return result.recordset;
    } catch (error) {
        console.log('Error al  obtener los municipios por estado ' + error);
    }
}

module.exports = {
    getAllMunicipio: getAllMunicipio,
    getEstadoMunicipio: getEstadoMunicipio,
}