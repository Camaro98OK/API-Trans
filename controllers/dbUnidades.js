const sql = require('mssql');
const config = require('../config/config');

async function getUnidades() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`SELECT * FROM SAM.cat_unidades;`);
        return result.recordset;
    } catch (error) {
        console.log('Error al tratar de obtener las unidades de la fiscali ' + error);
    }
}

async function getOneUnidad(vUnidad) {
    try {
        //console.log('Entro en la funcion GETONEUNIDA');
        //console.log(vUnidad);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Numeric, vUnidad.id)
            /*         .input("cve", sql.VarChar, vUnidad.cve)
                    .input("nombre", sql.VarChar, vUnidad.nombre)
                    .input("act", sql.VarChar, vUnidad.act)
                    .input("lat", sql.VarChar, vUnidad.lat)
                    .input("lon", sql.VarChar, vUnidad.lon)
                    .input("estado_id", sql.VarChar, vUnidad.estado_id)
                    .input("nombre_min", sql.VarChar, vUnidad.nombre_min)
             */
            .query(`SELECT * FROM SAM.cat_unidades WHERE ID = @id;`);
        return result.recordset;
        //console.log(result);
    } catch (error) {
        console.log('Error al consultar un negistro de unidad. ' + error);
    }
}

async function insUnidad(vUnidad) {
    console.log(vUnidad);
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("cve", sql.VarChar, vUnidad.cve)
            .input("nombre", sql.VarChar, vUnidad.nombre)
            .input("act", sql.Numeric, vUnidad.act)
            .input("lat", sql.VarChar, vUnidad.lat)
            .input("lon", sql.VarChar, vUnidad.lon)
            .input("estado_id", sql.Numeric, vUnidad.estado_id)
            .input("nombre_min", sql.VarChar, vUnidad.nombre_min)
            .query(`INSERT INTO SAM.cat_unidades (cve, nombre, act, lat, lon, estado_id, nombre_min)
                   VALUES (@cve, @nombre, @act, @lat, @lon, @estado_id, @nombre_min);`);
        return result.recordset;
    } catch (error) {
        console.log('Error al consultar un negistro de unidad. ' + error);
    }
}

async function upUnidad(vUnidad) {
    try {
        console.log('Los valores de entrada son')
        console.log(vUnidad);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Numeric, vUnidad.id)
            .input("cve", sql.VarChar, vUnidad.cve)
            .input("nombre", sql.VarChar, vUnidad.nombre)
            .input("act", sql.Numeric, vUnidad.act)
            .input("lat", sql.VarChar, vUnidad.lat)
            .input("lon", sql.VarChar, vUnidad.lon)
            .input("estado_id", sql.Numeric, vUnidad.estado_id)
            .input("nombre_min", sql.VarChar, vUnidad.nombre_min)
            .query(`UPDATE SAM.cat_unidades 
                    SET cve = @cve,
                        nombre = @nombre, 
                        act = @act, 
                        lat = @lat, 
                        lon = @lon, 
                        estado_id = @estado_id, 
                        nombre_min = @nombre_min
                    WHERE id = @id`);
        console.log('tanto amor ');
        console.log(result);
        return result.recordset;
    } catch (error) {
        console.log('Error al actualizar la unidad ' + error);
    }
}

async function delUnidad(vUnidad) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Numeric, vUnidad.id)
            .query(`DELETE FROM SAM.cat_unidades WHERE ID = @id;`);
        return result.recordset;
    } catch (error) {
        console.log('Error al eliminar una unidad ' + error);
    }
}

module.exports = {
    getUnidades: getUnidades,
    getOneUnidad: getOneUnidad,
    insUnidad: insUnidad,
    upUnidad: upUnidad,
    delUnidad: delUnidad,
}