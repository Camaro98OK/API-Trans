const config = require('../config/config.js');
const sql = require('mssql');

async function getFiscalias() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT F.id, F.cve fiscalia FROM SAM.CAT_FISCALIA F');
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener las fiscalias fue: ' + error);
    }
}

async function getDelegacionesRetrasos(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().input("id", sql.Int, id).query(`SELECT D.ID id, d.DELEGACION_DSC delegacion_dsc
                                                 FROM SAM.CAT_FISCALIA_DELEGACION FD 
                                                 INNER JOIN SAM.CAT_FISCALIA F        ON FD.FISCALIA_ID = F.ID 
                                                 INNER JOIN SAM.CAT_DELEGACION_FGR D ON FD.DELEGACION_ID = D.ID
                                                 WHERE  @id IN (FD.FISCALIA_ID, '')`);
        return result.recordset;
    } catch (error) {
        console.log('Error para obte');
    }
}

async function getAreasCMI() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT ID, UNIDAD_DSC FROM SAM.CAT_UNIDAD_CMI;');
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener las áreas de CMI ' + error);

    }
}

async function getActosInvestigacionCMI() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT ID, ACTO_DSC FROM SAM.CAT_ACTO_INVESTIGACION_CMI');
        return result.recordset;
    } catch (error) {
        console.log('Error al obteneer los actos de inestigación de CMI' + error);
    }
}

async function getProductosInvestigacionMI() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT ID, TIPOPRODUCTODSC FROM SAM.CAT_TIPO_PRODUCTO_CMI');
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener los produtos de CMI ' + error);
    }
}

async function getEspecialidadCMI() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT ID, ESPECIALIDAD FROM SAM.CAT_ESPECIALIDAD_CMI');
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener la especialidad' + error);
    }
}

module.exports = {
    getFiscalias: getFiscalias,
    getDelegacionesRetrasos: getDelegacionesRetrasos,
    getActosInvestigacionCMI: getActosInvestigacionCMI,
    getProductosInvestigacionMI: getProductosInvestigacionMI,
    getEspecialidadCMI: getEspecialidadCMI,
    getAreasCMI: getAreasCMI,
}