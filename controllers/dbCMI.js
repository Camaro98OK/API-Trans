/* Importar el archivo de conexión */
const config = require("../config/dbconfig.js");

/* importar dependencias requeridas*/
const sql = require("mssql");
const CENAPI = require("../models/cmi.js");
const CGSP = require("../models/cmi.js");

/* --------------------------------------------- */
/* ------------- Funciones HTTPS --------------- */
/* --------------------------------------------- */

/* ------------- Funciones CENAPI --------------- */

/* GET ALL CMI_CENAPI */
async function getAllCenapi() {
    try {
        let pool = await sql.connect(config);
        let cenapi = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_CENAPI");
        return cenapi.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_CENAPI */
async function getReporteCenapi(rango) {
    try {
        let pool = await sql.connect(config);
        let reporteCENAPI = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.AIC_COPLADII_CENAPI WHERE CONVERT(DATE, FechaHoraRecepcion) BETWEEN @startDate AND @endDate"
            );
        return reporteCENAPI.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* ------------- Funciones CGSP --------------- */

/* GET ALL CMI_CGSP */
async function getAllCGSP() {
    try {
        let pool = await sql.connect(config);
        let cgsp = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_CGSP");
        return cgsp.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_CENAPI */
async function getReporteCgsp(rango) {
    try {
        let pool = await sql.connect(config);
        let reporteCGSP = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.AIC_COPLADII_CGSP WHERE CONVERT(DATE, FechaHoraSolicitud) BETWEEN @startDate AND @endDate"
            );
        return reporteCGSP.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* ------------- Funciones PFM_MM --------------- */

/* GET ALL CMI_CGSP */
async function getAllPFM_MM() {
    try {
        let pool = await sql.connect(config);
        let pfm_mm = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_PFM_MM");
        return pfm_mm.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_PFM_MM */
async function getReportePFM_MM(rango) {
    try {
        let pool = await sql.connect(config);
        let reportePFM_MM = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.AIC_COPLADII_PFM_MM WHERE CONVERT(DATE, FechaHoraRecepcion) BETWEEN @startDate AND @endDate"
            );
        return reportePFM_MM.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* ------------- Funciones PFM_MJ --------------- */

/* GET ALL CMI_PFM_MJ */
async function getAllPFM_MJ() {
    try {
        let pool = await sql.connect(config);
        let pfm_mj = await pool
            .request()
            .query("SELECT TOP(10) * FROM sam.AIC_COPLADII_PFM_MJ");
        return pfm_mj.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

/* GET Reporte entre 2 fechas CMI_PFM_MJ */
async function getReportePFM_MJ(rango) {
    try {
        let pool = await sql.connect(config);
        let reportePFM_MJ = await pool
            .request()
            .input("startDate", sql.Date, rango.startDate)
            .input("endDate", sql.Date, rango.endDate)
            .query(
                "SELECT * FROM sam.AIC_COPLADII_PFM_MJ WHERE CONVERT(DATE, FechaHoraRecepcion) BETWEEN @startDate AND @endDate"
            );
        return reportePFM_MJ.recordset;
    } catch (error) {
        console.log("Error de tipo: " + error);
    }
}

module.exports = {
    getAllCenapi: getAllCenapi,
    getReporteCenapi: getReporteCenapi,
    getAllCGSP: getAllCGSP,
    getReporteCgsp: getReporteCgsp,
    getAllPFM_MM: getAllPFM_MM,
    getReportePFM_MM: getReportePFM_MM,
    getAllPFM_MJ: getAllPFM_MJ,
    getReportePFM_MJ: getReportePFM_MJ,
};