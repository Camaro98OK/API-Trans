const config = require('../config/config');
const sql = require('mssql');
const { request } = require('express');

async function getSolicitudTipo() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM sam.trans_Tipo_Solicitud;');
        return result.recordset;
    } catch (error) {
        console.log('Error par obtener los tipos de solicitudes: ' + error);
    }
}

async function getEstatusSolicitud() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM sam.trans_estatus_solicitud WHERE estatus_id = 1');
        return result.recordset;

    } catch (error) {
        console.log('Error al obtener los estatus de las solicitudes de transparencia. ' + error);
    }
}

async function getAsuntoSolicitud() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM sam.trans_asunto');
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener la lista de asuntos. ' + error)
    }
}

async function putSolicitudTransparencia(datosSolicitudTrans) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("fecha_registro", sql.DateTime, datosSolicitudTrans.fecha_registro)
            .input("fecha_UTAG", sql.DateTime, datosSolicitudTrans.fecha_UTAG)
            .input("folio", sql.VarChar, datosSolicitudTrans.folio)
            .input("tipo_Solicitud_id", sql.Int, datosSolicitudTrans.tipo_Solicitud_id)
            .input("estatus_solicitud_id", sql.Int, datosSolicitudTrans.estatus_solicitud_id)
            .input("tema_id", sql.Int, datosSolicitudTrans.tema_id)
            .input("subtema_id", sql.Int, datosSolicitudTrans.subtema_id)
            .input("solicitud", sql.VarChar, datosSolicitudTrans.solicitud)
            .input("observaciones", sql.VarChar, datosSolicitudTrans.observaciones)
            .query(`INSERT INTO  sam.trans_solicitud (fecha_registro, fecha_UTAG, folio, 
                                tipo_Solicitud_id, estatus_solicitud_id, tema_id,
                                subtema_id, solicitud, observaciones)
                            VALUES (@fecha_registro, @fecha_UTAG, @folio, 
                                    @tipo_Solicitud_id, @estatus_solicitud_id, @tema_id, 
                                    @subtema_id, @solicitud, @observaciones)`);
        //console.log(result.recordset);
        return result.recordset;
    } catch (error) {
        setTimeout(() => {
            console.log(this.result);
        }, 1050);
        console.log('Error al intentar insertar una solicitu de transparencia. ' + error);
    }
}

async function getNumeroRegistros(datos) {
    try {
        //console.log(datos);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("folio", sql.VarChar, datos.folio)
            .input("estatus_solicitud_id", sql.Int, datos.estatus_solicitud_id)
            .query(`SELECT count(*) total 
                    FROM sam.trans_solicitud 
                    WHERE folio = @Folio 
                      and estatus_solicitud_id = @estatus_solicitud_id;`);
        //console.log(result.recordset);
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener la lista de asuntos. ' + error)
    }
}

async function upSolicitudTransparencia(datosSolicitudTrans) {
    try {
        //console.log('Entro en el update');
        //console.log(datosSolicitudTrans);
        let pool = await sql.connect(config);
        let resultIns = await pool.request()
            .input("fecha_registro", sql.DateTime, datosSolicitudTrans.fecha_registro)
            .input("fecha_UTAG", sql.DateTime, datosSolicitudTrans.fecha_UTAG)
            .input("folio", sql.VarChar, datosSolicitudTrans.folio)
            .input("tipo_Solicitud_id", sql.Int, datosSolicitudTrans.tipo_Solicitud_id)
            .input("estatus_solicitud_id", sql.Int, datosSolicitudTrans.estatus_solicitud_id)
            .input("tema_id", sql.Int, datosSolicitudTrans.tema_id)
            .input("subtema_id", sql.Int, datosSolicitudTrans.subtema_id)
            .input("solicitud", sql.VarChar, datosSolicitudTrans.solicitud)
            .input("observaciones", sql.VarChar, datosSolicitudTrans.observaciones)
            .query(`UPDATE sam.trans_solicitud 
                       SET fecha_UTAG = @fecha_UTAG, 
                           tipo_Solicitud_id = @tipo_Solicitud_id,
                           tema_id = @tema_id, 
                           subtema_id = @subtema_id,
                           solicitud = @solicitud, 
                           observaciones = @observaciones
                    WHERE folio = @Folio 
                    and estatus_solicitud_id = @estatus_solicitud_id;`);
        return resultIns.recordset;
    } catch (error) {
        console.log('Error al intentar actualizar una solicitu de transparencia. ' + error);
    }
}

async function getAllSolicitudesTrans() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`SELECT aa.id NO,
                            FORMAT(so.fecha_UTAG, 'dd/MM/yyyy HH:MM') 'UTAG',
                            so.folio Folio,
                            co.recurso_revision 'R-Revisión',
                            so.tipo_Solicitud_id,
                            ts.solicitud 'Solicitud',
                            so.estatus_solicitud_id,
                            CASE WHEN W.ESTATUS IS NULL THEN es.estatus_dsc ELSE W.ESTATUS end 'Estatus',
                            FORMAT(sam.fn_ObtieneFechaHabil(so.fecha_UTAG, 20), 'dd/MM/yyyy') 'Límite',
                            FORMAT(sam.fn_ObtieneFechaHabil(so.fecha_UTAG, 30), 'dd/MM/yyyy') 'Gracia',
                            (SELECT SUM(V.DiaHabil) tot
                            FROM VCALENDARIO V 
                            WHERE V.Fecha BETWEEN so.fecha_UTAG AND (CASE WHEN w.fecha_correo IS NULL THEN GETDATE() ELSE w.fecha_correo END)) 'Transcurridos',
                            CASE WHEN FORMAT(w.fecha_correo, 'dd/MM/yyyy HH:MM') = '01/01/1900 00:01' THEN '-' ELSE FORMAT(w.fecha_correo, 'dd/MM/yyyy') END Solicitud_Terminada,
                            --CASE WHEN DATEDIFF(day,so.fecha_UTAG, w.fecha_correo) IS NULL THEN '-' ELSE DATEDIFF(day,so.fecha_UTAG, w.fecha_correo) END 'Solicitud_terminada_dias',
                            so.tema_id,
                            so.subtema_id,
                            so.solicitud,
                            so.observaciones,
                            '' 'Acciones'
                    FROM sam.trans_solicitud so 
                    INNER JOIN SAM.trans_tipo_solicitud ts ON so.tipo_Solicitud_id = ts.id
                    INNER JOIN SAM.trans_estatus_solicitud es ON so.estatus_solicitud_id = es.id
                --                    LEFT OUTER JOIN (SELECT cs.folio folio_correo, cs.fecha_correo 
                --                                    FROM sam.trans_correo_solicitud cs 
                --                                    WHERE cs.solicitudTer = 1) W ON so.folio = w.folio_correo
                    LEFT OUTER JOIN (SELECT cs.folio folio_correo, cs.recurso_revision, COUNT(*) Tot
                                    FROM sam.trans_correo_solicitud cs 
                                    WHERE cs.recurso_revision <> ''
                                    GROUP BY cs.folio, cs.recurso_revision ) co on so.folio = co.folio_correo
                    INNER JOIN (SELECT ROW_NUMBER() OVER (ORDER BY rr.folio) id, rr.folio 
                                FROM sam.trans_solicitud rr) aa ON so.folio = aa.folio
                    LEFT OUTER JOIN ( SELECT folio, 
                                            MAX(fecha_correo) fecha_correo,
                                            CASE WHEN solicitudTer = 1 THEN 'Terminada'
                                                WHEN sol_Cancelada = 1 THEN 'Cancelada'
                                                WHEN sol_Complementaria = 1 THEN 'Complementaria'
                                                WHEN sol_Duplicada = 1 THEN 'Duplicada' END ESTATUS
                                    FROM sam.trans_correo_solicitud
                                    WHERE sol_duplicada = 1
                                        OR sol_Cancelada = 1
                                        OR sol_Complementaria = 1
                                        OR solicitudTer = 1
                                    GROUP BY folio,
                                            solicitudTer,
                                            sol_Cancelada,
                                            sol_Complementaria,
                                            sol_Duplicada) W ON so.folio = W.folio
                    ORDER BY so.folio, so.estatus_solicitud_id, so.fecha_UTAG;`);
        //console.log(result);
        return result.recordset;
    } catch (error) {
        console.log('Error par obtener los tipos de solicitudes: ' + error);
    }
}

async function getTotalesPorEstatus() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`SELECT R.*, R1.*, R2.*, R3.*
                    FROM 
                    (SELECT COUNT(DISTINCT folio) 'Total de solicitudes'
                    FROM sam.trans_solicitud s 
                        INNER JOIN sam.trans_estatus_solicitud es ON s.estatus_solicitud_id = es.id) R,
                    (SELECT count(s1.estatus_solicitud_id) 'Registrada y en trámite'
                    FROM sam.trans_solicitud s1 
                        INNER JOIN sam.trans_estatus_solicitud es ON s1.estatus_solicitud_id = es.id
                    WHERE s1.estatus_solicitud_id = 1) R1,
                    (SELECT count(*) 'Terminada'
                    FROM sam.trans_solicitud s2 
                        INNER JOIN sam.trans_correo_solicitud cs ON s2.folio = cs.folio
                    WHERE cs.solicitudTer = 1) R2,
                    (SELECT count(*) 'Cancelada'
                    FROM sam.trans_solicitud s3 
                    INNER JOIN sam.trans_correo_solicitud cs ON s3.folio = cs.folio
                    WHERE cs.sol_Cancelada = 1) R3`);
        return result.recordset;
    } catch (error) {
        console.log('Error al tratar de obtener los totales estadisticos' + error);
    }
}

async function getTipoCorreo() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT * FROM sam.trans_tipo_correo");
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener el tipo de correo ' + error);
    }
}

async function getAllRemitentes() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`SELECT re.id,
                    re.nombre 'Nombre',
                    re.area_id,
                    re.estatus_id,
                    CASE WHEN re.estatus_id = 1 THEN 'ACTIVO' ELSE 'BAJA' END 'Estatus',
                    ar.area 'Area'
                FROM sam.trans_remitentes re 
                INNER JOIN sam.trans_areas ar on re.area_id = ar.id
                ORDER BY re.nombre, 
                         ar.area`);
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener todos los remitentes ' + error);
    }
}

async function getAllAsuntos() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT id, asunto 'Asunto' FROM sam.trans_asunto");
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener los todos los asuntos ' + error);
    }
}

async function getAllDestinatario() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`SELECT de.id,
                        de.nombre 'Nombre',
                        de.area_id,
                        de.estatus_id,
                        CASE WHEN de.estatus_id = 1 THEN 'ACTIVO' ELSE 'BAJA' END 'Estatus',
                        ar.area 'Area'
                    FROM sam.trans_destinatarios de
                    INNER JOIN sam.trans_areas ar on de.area_id = ar.id
                    ORDER BY de.nombre,
                             ar.area`);
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener todos los Destinatarios ' + error);
    }
}

async function getAllSeguimientoAreas() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT * FROM sam.trans_seguimiento_solicitud ORDER BY solicitud_dsc");
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener el seguimiento entre áreas' + error);
    }
}

async function getAreasTransparencia() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT * FROM  sam.trans_areas");
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener todas las áreas de transparencia' + error);
    }
}

async function putSolicitudCorreo(datosCorreoSol) {
    try {
        console.log(datosCorreoSol);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("folio", sql.VarChar, datosCorreoSol.folio)
            .input("fecha_correo", sql.DateTime, datosCorreoSol.fecha_correo)
            .input("remitente_id", sql.Int, datosCorreoSol.remitente_id)
            .input("asunto_id", sql.Int, datosCorreoSol.asunto)
            .input("tipo_correo_id", sql.Int, datosCorreoSol.tipo_correo)
            .input("destinatario_id", sql.Int, datosCorreoSol.destinatario_id)
            .input("seguimiento_id", sql.Int, datosCorreoSol.seguimiento_id)
            .input("sol_Duplicada", sql.Int, datosCorreoSol.sol_Duplicada)
            .input("sol_Complementaria", sql.Int, datosCorreoSol.sol_Complementaria)
            .input("recurso_revision", sql.VarChar, datosCorreoSol.recurso_revision)
            .input("diasHabiles", sql.Int, datosCorreoSol.diasHabiles)
            .input("solicitudTer", sql.Int, datosCorreoSol.solicitudTer)
            .input("sol_Cancelada", sql.Int, datosCorreoSol.sol_Cancelada)
            .query(`INSERT INTO sam.trans_correo_solicitud 
                            (folio, fecha_correo, remitente_id, asunto_id, 
                            tipo_correo_id, destinatario_id, seguimiento_id,
                            sol_Duplicada, sol_Complementaria, recurso_revision,
                            dias_habiles, solicitudTer, sol_Cancelada)
                    VALUES (@folio, @fecha_correo, @remitente_id, @asunto_id, 
                            @tipo_correo_id, @destinatario_id, @seguimiento_id, 
                            @sol_Duplicada, @sol_Complementaria, @recurso_revision,
                            @diasHabiles, @solicitudTer, @sol_Cancelada)`);
        return result.recordset;
    } catch (error) {
        console.log('Error al insertar un correo de solicitud de información' + error);
    }
}

async function upSolicitudCoreo(datosCorreoSol) {
    try {
        console.log(datosCorreoSol);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Int, datosCorreoSol.id)
            .input("folio", sql.VarChar, datosCorreoSol.folio)
            .input("fecha_correo", sql.DateTime, datosCorreoSol.fecha_correo)
            .input("remitente_id", sql.Int, datosCorreoSol.remitente_id)
            .input("asunto_id", sql.Int, datosCorreoSol.asunto)
            .input("tipo_correo_id", sql.Int, datosCorreoSol.tipo_correo)
            .input("destinatario_id", sql.Int, datosCorreoSol.destinatario_id)
            .input("seguimiento_id", sql.Int, datosCorreoSol.seguimiento_id)
            .input("sol_Duplicada", sql.Int, datosCorreoSol.sol_Duplicada)
            .input("sol_Complementaria", sql.Int, datosCorreoSol.sol_Complementaria)
            .input("recurso_revision", sql.VarChar, datosCorreoSol.recurso_revision)
            .input("diasHabiles", sql.Int, datosCorreoSol.diasHabiles)
            .input("solicitudTer", sql.Int, datosCorreoSol.solicitudTer)
            .input("sol_Cancelada", sql.Int, datosCorreoSol.sol_Cancelada)
            .query(`update sam.trans_correo_solicitud set
                            fecha_correo = @fecha_correo, 
                            remitente_id = @remitente_id, 
                            asunto_id = @asunto_id, 
                            tipo_correo_id = @tipo_correo_id, 
                            destinatario_id = @destinatario_id, 
                            seguimiento_id = @seguimiento_id, 
                            sol_Duplicada = @sol_Duplicada, 
                            sol_Complementaria = @sol_Complementaria,
                            recurso_revision =  @recurso_revision,
                            dias_habiles = @diasHabiles, 
                            solicitudTer = @solicitudTer,
                            sol_Cancelada = @sol_Cancelada
                    WHERE id = @id`);
        return result.recordset;
    } catch (error) {
        console.log('Error al actualizar el correo de solicitudes ' + error)
    }
}

async function getAllSolicitudCorreoXFolio(numFolio) {
    try {
        console.log(numFolio);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("folio", sql.VarChar, numFolio.folio)
            .query(`SELECT cs.id,
                        cs.folio Folio,
                        FORMAT(cs.fecha_correo, 'dd/MM/yyyy HH:MM') Fecha,
                        cs.remitente_id,
                        cs.asunto_id,
                        cs.tipo_correo_id,
                        cs.destinatario_id,
                        cs.seguimiento_id,
                        asu.asunto Asunto,
                        re.nombre Remitente,
                        co.tipo_correo Correo,
                        de.nombre Destinatario,
                        se.solicitud_dsc,
                        cs.sol_Duplicada,
                        cs.sol_Complementaria,
                        cs.recurso_revision Revisión,
                        cs.dias_habiles,
                        cs.solicitudTer,
                        cs.sol_Cancelada
                FROM sam.trans_correo_solicitud cs
                INNER JOIN sam.trans_remitentes re on cs.remitente_id = re.id
                INNER JOIN sam.trans_asunto asu on cs.asunto_id = asu.id
                INNER JOIN sam.trans_tipo_correo co on cs.tipo_correo_id = co.id
                INNER JOIN sam.trans_destinatarios de on cs.destinatario_id = de.id
                INNER JOIN sam.trans_seguimiento_solicitud se on cs.seguimiento_id = se.id
                WHERE cs.folio = @folio`);
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener todos los correos asociados a un folio ' + error);
    }
}

async function putRemitentes(datosRemitente) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("remitente", sql.VarChar, datosRemitente.nombre)
            .input("area_id", sql.Int, datosRemitente.area_id)
            .input("estatus_id", sql.Int, datosRemitente.estatus_id)
            .query(`INSERT INTO sam.trans_remitentes (nombre, area_id, estatus_id)
                                              VALUES (@remitente, @area_id, @estatus_id)`)
        return result.recordset;
    } catch (error) {
        console.log('Error al insertar un nuevo remitente');
    }
}

async function updRemitente(datosRemitente) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Int, datosRemitente.id)
            .input("remitente", sql.VarChar, datosRemitente.nombre)
            .input("area_id", sql.Int, datosRemitente.area_id)
            .input("estatus_id", sql.Int, datosRemitente.estatus_id)
            .query(`UPDATE sam.trans_remitentes 
                    SET nombre = @remitente, 
                        area_id = @area_id, 
                        estatus_id = @estatus_id 
                    WHERE id = @id;`)
        return result.recordset;
    } catch (error) {
        console.log('Error al actualizar los datos del remitente ' + error);
    }
}

async function putDestinatario(datosDestinatario) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("destinatario", sql.VarChar, datosDestinatario.nombre)
            .input("area_id", sql.Int, datosDestinatario.area_id)
            .input("estatus_id", sql.Int, datosDestinatario.estatus_id)
            .query(`INSERT INTO sam.trans_destinatarios (nombre, area_id, estatus_id)
                                              VALUES (@destinatario, @area_id, @estatus_id)`)
        return result.recordset;
    } catch (error) {
        console.log('Error al insertar un nuevo remitente');
    }
}

async function updDestinatario(datosDestinatario) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Int, datosDestinatario.id)
            .input("destinatario", sql.VarChar, datosDestinatario.nombre)
            .input("area_id", sql.Int, datosDestinatario.area_id)
            .input("estatus_id", sql.Int, datosDestinatario.estatus_id)
            .query(`UPDATE sam.trans_destinatarios 
                    SET nombre = @destinatario, 
                        area_id = @area_id, 
                        estatus_id = @estatus_id
                    WHERE id = @id;`)
        return result.recordset;
    } catch (error) {
        console.log('Error al actualizar el Destinatario ' + error);
    }
}

async function putAsuntoSolicitud(datosAsunto) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("asunto", sql.VarChar, datosAsunto.asunto)
            .query(`INSERT INTO sam.trans_asunto (asunto)
                                                VALUES (@asunto);`);
        return result.recordset;
    } catch (error) {
        console.log('Error al insertar un asunto ' + error)
    }
}

async function updAsunto(datosAsunto) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Int, datosAsunto.id)
            .input("asunto", sql.VarChar, datosAsunto.asunto)
            .query(`UPDATE sam.trans_asunto 
                                    SET asunto = @asunto
                                    WHERE id = @id;`);
        return result.recordset;
    } catch (error) {
        console.log('Error al actualizar el asunto ' + error);
    }
}

async function getAllTemas() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT * FROM sam.trans_Tema");
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener los todos los temas ' + error);
    }
}

async function getAllSubtemas(datos) {
    try {
        console.log(datos);
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("tema_id", sql.Int, datos.tema_id)
            .query("SELECT * FROM sam.trans_Subtema WHERE tema_id = @tema_id");
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener los todos los subtemas ' + error);
    }
}

/******************************************** */


async function putSeguimientoAreas(datosSeguimiento) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("seguimiento", sql.VarChar, datosSeguimiento.seguimiento)
            .input("orden", sql.Int, datosSeguimiento.orden)
            .query(`INSERT INTO sam.trans_seguimiento_solicitud (solicitud_dsc, orden)
                VALUES (@seguimiento, @orden);`);
        return result.recordset;
    } catch (error) {
        console.log('Error al insertar el seguimiento entre áreas ' + error)
    }
}

async function updSeguimientoAreas(datosSeguimiento) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("id", sql.Int, datosSeguimiento.id)
            .input("seguimiento", sql.VarChar, datosSeguimiento.seguimiento)
            .input("orden", sql.Int, datosSeguimiento.orden)
            .query(`UPDATE sam.trans_seguimiento_solicitud
                            SET solicitud_dsc = @seguimiento, 
                                orden = @orden
                        WHERE id = @id;`);
        return result.recordset;
    } catch (error) {
        console.log('Error al actualizar del seguimiento entre áreas ' + error);
    }
}

async function exportSolicitudes() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`SELECT aa.id NO,
                                        FORMAT(so.fecha_UTAG, 'dd/MM/yyyy HH:MM') 'UTAG',
                                        so.folio Folio,
                                        co.recurso_revision 'R-Revisión',
                                        ts.solicitud 'Solicitud',
                                        CASE WHEN W.ESTATUS IS NULL THEN es.estatus_dsc ELSE W.ESTATUS end 'Estatus',
                                        FORMAT(sam.fn_ObtieneFechaHabil(so.fecha_UTAG, 20), 'dd/MM/yyyy') 'Fecha Límite',
                                        FORMAT(sam.fn_ObtieneFechaHabil(so.fecha_UTAG, 30), 'dd/MM/yyyy') 'Fecha Gracia',
                                        CASE WHEN FORMAT(w.fecha_correo, 'dd/MM/yyyy HH:MM') = '01/01/1900 00:01' THEN '-' ELSE FORMAT(w.fecha_correo, 'dd/MM/yyyy') END 'Fecha de Termino',
                                        (SELECT SUM(V.DiaHabil) tot
                                        FROM VCALENDARIO V 
                                        WHERE V.Fecha BETWEEN so.fecha_UTAG 
                                        AND (CASE WHEN w.fecha_correo IS NULL THEN GETDATE() ELSE w.fecha_correo END)) 'Días Hábiles Transcurridos',
                                        so.solicitud,
                                        so.observaciones
                                FROM sam.trans_solicitud so 
                                INNER JOIN SAM.trans_tipo_solicitud ts ON so.tipo_Solicitud_id = ts.id
                                INNER JOIN SAM.trans_estatus_solicitud es ON so.estatus_solicitud_id = es.id
                                --                    LEFT OUTER JOIN (SELECT cs.folio folio_correo, cs.fecha_correo 
                                --                                    FROM sam.trans_correo_solicitud cs 
                                --                                    WHERE cs.solicitudTer = 1) W ON so.folio = w.folio_correo
                                LEFT OUTER JOIN (SELECT cs.folio folio_correo, cs.recurso_revision, COUNT(*) Tot
                                                    FROM sam.trans_correo_solicitud cs 
                                                    WHERE cs.recurso_revision <> ''
                                                    GROUP BY cs.folio, cs.recurso_revision ) co on so.folio = co.folio_correo
                                INNER JOIN (SELECT ROW_NUMBER() OVER (ORDER BY rr.folio) id, rr.folio 
                                            FROM sam.trans_solicitud rr) aa ON so.folio = aa.folio
                                LEFT OUTER JOIN ( SELECT folio, 
                                                        MAX(fecha_correo) fecha_correo,
                                                        CASE WHEN solicitudTer = 1 THEN 'Terminada'
                                                                WHEN sol_Cancelada = 1 THEN 'Cancelada'
                                                                WHEN sol_Complementaria = 1 THEN 'Complementaria'
                                                                WHEN sol_Duplicada = 1 THEN 'Duplicada' END ESTATUS
                                                    FROM sam.trans_correo_solicitud
                                                    WHERE sol_duplicada = 1
                                                    OR sol_Cancelada = 1
                                                    OR sol_Complementaria = 1
                                                    OR solicitudTer = 1
                                                    GROUP BY folio,
                                                        solicitudTer,
                                                        sol_Cancelada,
                                                        sol_Complementaria,
                                                        sol_Duplicada) W ON so.folio = W.folio
                                ORDER BY so.folio, so.estatus_solicitud_id, so.fecha_UTAG;`);
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener todas las solicitudes a exportar ' + error);
    }
}

async function exportSolicitudesDetalle() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query(`SELECT  ROW_NUMBER() OVER (ORDER BY so.folio) 'NO',
                                                FORMAT(so.fecha_UTAG, 'dd/MM/yyyy HH:MM') 'UTAG',
                                                so.folio Folio,
                                                cs.recurso_revision 'R-Revisión',
                                                ts.solicitud 'Solicitud',
                                                CASE WHEN W.ESTATUS IS NULL THEN es.estatus_dsc ELSE W.ESTATUS end 'Estatus',
                                                FORMAT(sam.fn_ObtieneFechaHabil(so.fecha_UTAG, 20), 'dd/MM/yyyy') 'Fecha Límite',
                                                FORMAT(sam.fn_ObtieneFechaHabil(so.fecha_UTAG, 30), 'dd/MM/yyyy') 'Fecha Gracia',
                                                CASE WHEN FORMAT(w.fecha_correo, 'dd/MM/yyyy HH:MM') = '01/01/1900 00:01' THEN '-' ELSE FORMAT(w.fecha_correo, 'dd/MM/yyyy') END 'Fecha de Termino',
                                                (SELECT SUM(V.DiaHabil) tot
                                                FROM VCALENDARIO V 
                                                WHERE V.Fecha BETWEEN so.fecha_UTAG 
                                                AND (CASE WHEN w.fecha_correo IS NULL THEN GETDATE() ELSE w.fecha_correo END)) 'Días Hábiles Transcurridos',
                                                te.Tema,
                                                ste.Subtema,
                                                so.solicitud,
                                                so.observaciones,
                                                FORMAT(cs.fecha_correo, 'dd/MM/yyyy HH:MM') Fecha,
                                                asu.asunto Asunto,
                                                re.nombre Remitente,
                                                co.tipo_correo Correo,
                                                de.nombre Destinatario,
                                                se.solicitud_dsc,
                                                cs.sol_Duplicada,
                                                cs.sol_Complementaria,
                                                --cs.recurso_revision,
                                                cs.dias_habiles,
                                                cs.solicitudTer
                                        FROM sam.trans_solicitud so 
                                        INNER JOIN SAM.trans_tipo_solicitud			ts ON so.tipo_Solicitud_id = ts.id
                                        INNER JOIN SAM.trans_estatus_solicitud		es ON so.estatus_solicitud_id = es.id
                                        INNER JOIN SAM.trans_Tema					te on so.tema_id = te.id
                                        INNER JOIN SAM.trans_Subtema				ste on so.subtema_id = ste.id
                                        INNER JOIN sam.trans_correo_solicitud		cs on so.folio = cs.folio
                                        INNER JOIN sam.trans_remitentes				re on cs.remitente_id = re.id
                                        INNER JOIN sam.trans_asunto					asu on cs.asunto_id = asu.id
                                        INNER JOIN sam.trans_tipo_correo			co on cs.tipo_correo_id = co.id
                                        INNER JOIN sam.trans_destinatarios			de on cs.destinatario_id = de.id
                                        INNER JOIN sam.trans_seguimiento_solicitud	se on cs.seguimiento_id = se.id
                                        LEFT OUTER JOIN ( SELECT xx.folio,
                                                                xx.recurso_revision,
                                                                MAX(xx.fecha_correo) fecha_correo,
                                                                CASE WHEN xx.solicitudTer = 1 THEN 'Terminada'
                                                                    WHEN xx.sol_Cancelada = 1 THEN 'Cancelada'
                                                                    WHEN xx.sol_Complementaria = 1 THEN 'Complementaria'
                                                                    WHEN xx.sol_Duplicada = 1 THEN 'Duplicada' END ESTATUS
                                                            FROM sam.trans_correo_solicitud xx
                                                            WHERE xx.sol_duplicada = 1
                                                            OR xx.sol_Cancelada = 1
                                                            OR xx.sol_Complementaria = 1
                                                            OR xx.solicitudTer = 1
                                                            GROUP BY xx.folio,
                                                                xx.recurso_revision,
                                                                xx.solicitudTer,
                                                                xx.sol_Cancelada,
                                                                xx.sol_Complementaria,
                                                                xx.sol_Duplicada) W ON cs.folio = W.folio 
                                                                                    AND cs.fecha_correo = W.fecha_correo 
                                                                                    AND so.folio = W.folio 
                                                                                    AND W.recurso_revision = cs.recurso_revision
                                        ORDER BY so.folio, so.estatus_solicitud_id, so.fecha_UTAG;`);
        return result.recordset;
    } catch (error) {
        console.log('Error al obtener el detalle de las solicitudes a exportar' + error);
    }

}

module.exports = {
    getSolicitudTipo: getSolicitudTipo,
    getEstatusSolicitud: getEstatusSolicitud,
    getAsuntoSolicitud: getAsuntoSolicitud,
    putSolicitudTransparencia: putSolicitudTransparencia,
    upSolicitudTransparencia: upSolicitudTransparencia,
    getAllSolicitudesTrans: getAllSolicitudesTrans,
    getNumeroRegistros: getNumeroRegistros,
    getTotalesPorEstatus: getTotalesPorEstatus,
    getTipoCorreo: getTipoCorreo,
    getAllRemitentes: getAllRemitentes,
    getAllAsuntos: getAllAsuntos,
    getAllDestinatario: getAllDestinatario,
    getAllSeguimientoAreas: getAllSeguimientoAreas,
    getAreasTransparencia: getAreasTransparencia,
    putSolicitudCorreo: putSolicitudCorreo,
    upSolicitudCoreo: upSolicitudCoreo,
    getAllSolicitudCorreoXFolio: getAllSolicitudCorreoXFolio,
    putRemitentes: putRemitentes,
    putDestinatario: putDestinatario,
    putAsuntoSolicitud: putAsuntoSolicitud,
    updAsunto: updAsunto,
    updDestinatario: updDestinatario,
    updRemitente: updRemitente,
    getAllTemas: getAllTemas,
    getAllSubtemas: getAllSubtemas,
    putSeguimientoAreas: putSeguimientoAreas,
    updSeguimientoAreas: updSeguimientoAreas,
    exportSolicitudes: exportSolicitudes,
    exportSolicitudesDetalle: exportSolicitudesDetalle,
}