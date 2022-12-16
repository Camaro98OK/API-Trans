const express = require("express");
const app = express();
let ambito = "HTTPS_REVECO";
let versionMSSQLFGR = "0.0.2";
const sql = require("mssql");
var https = require("https");
const config = require("./config/dbconfig.js");
const router = express.Router();
var fs = require("fs"); //--> Crear directorio
const PORT = 3000;
var bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require('jsonwebtoken');

/* Importar dbuser */
const dbuser = require("./controllers/dbUser");
const dbCarpetaInvestigacion = require('./controllers/dbCarpetaInvestigacion');
const dbCMI = require("./controllers/dbcmi");
const dbCategorias = require('./controllers/dbCategorias');
const dbEstados = require('./controllers/dbEstados');
const dbCI = require('./controllers/dbCI');
const dbCIUni = require('./controllers/dbCIUni');
const dbCatalogos = require('./controllers/dbCombos');
const dbRetrasos = require('./controllers/dbRetrasos');
const dbEntidadFederativa = require('./controllers/dbEntidadFederativa');
const dbUnidades = require('./controllers/dbUnidades');
const dbSedes = require('./controllers/dbSedes');
const dbMunicipio = require('./controllers/dbMunicipio');

//  TRANSPARENCIA
const dbTransparencia = require('./controllers/dbTrasparenciaCombos');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/* Mostramos un mensaje de Success en consola */
sql.connect(config, (err) => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful !");
    new sql.Request().query("select 1 as number", (err, result) => {
        console.dir(result);
    });
});

sql.on("error", (err) => {
    console.log("Sql database connection error ", err);
});

if (ambito.indexOf("HTTPS") > -1) {
    var auxCer = "reveco.fgr.org.mx.crt";
    var auxKey = "reveco.fgr.org.mx.key";
    if (ambito.indexOf("LOCAL") > -1) {
        auxCer = "server.cer";
        auxKey = "server.key";
    }
    https
        .createServer({
                //--> ***HTTPS
                cert: fs.readFileSync("cert/" + auxCer),
                //--> ***HTTPS
                key: fs.readFileSync("cert/" + auxKey),
            },
            app
        )
        .listen(PORT, function() {
            console.log("MSSQL-FGR versión: " + infoVer());
            console.log("HTTPS: > " + auxCer);
            console.log("Express-> Listening on " + PORT);
            console.log(infoDB());
        });
} else {
    app.listen(PORT, function() {
        console.log("MSSQL-FGR versión: " + infoVer());
        console.log("Express-> Listening on " + PORT);
        console.log(infoDB());
    });
}

sql.on("error", (err) => {
    console.log("ERROR: ");
    console.log(err);
});

function infoVer() {
    return versionMSSQLFGR;
}

function infoDB() {
    return "DB: " + config.server + ">" + config.database;
}

/* --------- HTTPS ------------- */

/* ------------------------------ */
const configC = require("./config/config");
const { Console } = require("console");
const dbCombos = require("./controllers/dbCombos");
const { Router } = require("express");
const { serialize } = require("v8");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(configC.server));

/* --------- HTTPS ------------- */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

/* -------------------------            key          ----------------------------- */
app.set("key", config.key);

/* ------------------------- Creacion de Rutas HTTPS ----------------------------- */

/* ---------------------------- Ruta principal ----------------------------------- */
app.use("/admin", router);


/* ------------------------------------------------------------------------------- */
/* ------------------------- Creacion de Rutas Users ----------------------------- */
/* ------------------------------------------------------------------------------- */


/* Obtenermos todos los usuarios */
router.route("/users").get((req, res) => {
    dbuser.getUsers().then((users) => {
        res.json({ users });
    });
});

/* Obtenemos 1 usuario */
router.route("/users/:id").get((req, res) => {
    dbuser.getUserId(req.params.id).then((user) => {
        res.json({ user });
    });
});

/* Insertamos 1 usuario nuevo */
router.route("/users").post((req, res) => {
    const insertUser = {...req.body };
    dbuser.insertUser(insertUser).then((user) => {
        res.setHeader("Content-Type", "application/json");
        res.json({ user });
    });
});

/* Actualizar usuario */
router.route("/update").put((req, res) => {
    const updateUser = {...req.body };
    dbuser.updateUser(updateUser).then((user) => {
        res.json({ user });
    });
});

/* Borrar Usuario */
router.route("/users/:id").delete((req, res) => {
    dbuser.deleteUser(req.params.id).then((user) => {
        res.json({ user });
    });
});

/* Login Usuario */
router.route("/users/login").post((req, res) => {
    const userLogin = {...req.body };
    console.log(req.body);
    console.log(`Usuario: ${userLogin.username} Intentando Conectar a la DB...`);
    dbuser.loginUser(userLogin).then((user) => {
        res.setHeader("Content-Type", "application/json");
        if (res) {
            let dataUser = JSON.stringify(user);
            //console.log("usuario base:  " + user[0].username);
            //console.log("usuario role:  " + user[0].role);
            const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 60 * 60, data: dataUser }, '@FgR@c0M@0rG@mX-Si3R!');
            res.json(token);
            console.log(token);
        } else {
            res.json('usuario incorrecto');
        }
    });
});


/* ------------------------------------------------------------------------------- */
/* --------------- Creacion de Rutas Carpetas de Investigacion ------------------- */
/* ------------------------------------------------------------------------------- */

/* Obtenermos todos los usuarios */
router.route("/users").get((req, res) => {
    dbuser.getUsers().then((users) => {
        res.json({ users });
    });
});

/* Obtenemos todas las carpetas de investigacion del 2019 */
router.route("/carpetas2019").get((req, res) => {
    dbCarpetaInvestigacion.getCarpetasInvestigacion2019().then((carpetas2019) => {
        res.json(carpetas2019);
    });
});

/* Obtenemos todas las carpetas de investigacion del 2020 */
router.route("/carpetas2020").get((req, res) => {
    dbCarpetaInvestigacion.getCarpetasInvestigacion2020().then((carpetas2020) => {
        res.json(carpetas2020);
    });
});

/* Obtenemos todas las capetas de investigacion del 2021 */
router.route("/carpetas2021").get((req, res) => {
    dbCarpetaInvestigacion.getCarpetasInvestigacion2021().then((carpetas2021) => {
        res.json(carpetas2021);
    });
});

/* Obtenemos todas las carpetas de investigacion del 2022 */
router.route("/carpetas2022").get((req, res) => {
    dbCarpetaInvestigacion.getCarpetasInvestigacion2022().then((carpetas2022) => {
        res.json(carpetas2022)
    });
});

/* ------------------------------------------------------------------------------- */
/* ------------------------------- Reportes CMI ---------------------------------- */
/* ------------------------------------------------------------------------------- */


/* ------------------------------- CENAPI ---------------------------------- */

/* Obtenemos todos los registros de CMI_CENAPI */
router.route("/reporteCENAPI").get((req, res) => {
    dbCMI.getAllCenapi().then((reporteCenapi) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reporteCenapi);
    });
});

/* Obtener el reporte de CMI_CENAPI entre rango de días */
router.route("/reporteCENAPI/rango").post((req, res) => {
    const rango = {...req.body };
    dbCMI.getReporteCenapi(rango).then((reporteCENAPIRango) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reporteCENAPIRango);
        console.log("Se Encontraron: " + reporteCENAPIRango.length + " Registros de CMI_CENAPI");
    });
});


/* ------------------------------- CGSP ---------------------------------- */

/* Obtener todos los registros de CMI_CGSP */
router.route("/reporteCGSP").get((req, res) => {
    dbCMI.getAllCGSP().then((reporteCGSP) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reporteCGSP);
    });
});

/* Obtener el reporte de CMI_CGSP entre un rango de dias */
router.route("/reporteCGSP/rango").post((req, res) => {
    const rango = {...req.body };
    dbCMI.getReporteCgsp(rango).then((reporteCGSPRango) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reporteCGSPRango);
        console.log("Se encontraron: " + reporteCGSPRango.length + " Registros de CMI_CGSP");
    });
});


/* ------------------------------- PFM_MM ---------------------------------- */

/* Obtenemos todos los registros de PFM_MM */
router.route("/reportePFM_MM").get((req, res) => {
    dbCMI.getAllPFM_MM().then((reportePFM_MM) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reportePFM_MM);
    });
});

/* Obtener el reporte de CMI_PFM_MM entre un rango de dias */
router.route("/reportePFM_MM/rango").post((req, res) => {
    const rango = {...req.body };
    dbCMI.getReportePFM_MM(rango).then((reportePFM_MMRango) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reportePFM_MMRango);
        console.log("Se encontraron: " + reportePFM_MMRango.length + " Registros de CMI_PFM_MM");
    });
});


/* ------------------------------- PFM_MJ ---------------------------------- */

/* Obtenemos todos los registros de PFM_MJ */
router.route("/reportePFM_MJ").get((req, res) => {
    dbCMI.getAllPFM_MM().then((reportePFM_MJ) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reportePFM_MJ);
    });
});

/* Obtener el reporte de CMI_PFM_MJ entre un rango de dias */
router.route("/reportePFM_MJ/rango").post((req, res) => {
    const rango = {...req.body };
    dbCMI.getReportePFM_MJ(rango).then((reportePFM_MJRango) => {
        res.setHeader("Content-Type", "application/json");
        res.json(reportePFM_MJRango);
        //console.log("Se encontraron: " + reportePFM_MJRango.length + " Registros de CMI_PF_MJ");
    });
});

/* obtenemos el catálogo de unidades */
router.route("/catUnidades").get((req, res) => {
    dbCategorias.getCategoriasUnidad().then((result) => {
        res.json(result);
        //console.log('Termino con exito');
    });
});

router.route("/catUnidadesID").post((req, res) => {
    //console.log('ENTRO EN LA FUNCION');
    const cveUnidad = {...req.body };
    dbCategorias.getCategoriasUnidadID(cveUnidad).then((catSedes) => {
        res.setHeader("Content-Type", "application/json");
        res.json(catSedes);
        //console.log(catSedes);
    });
});


/* Obtener el catalogo de estados */
router.route("/catEstados").get((req, res) => {
    dbEstados.getEstados().then((result) => {
        res.json(result);
        //console.log('Todo bien');
    });
});


/* Obtener el catalogo de estados */

router.route("/catEstados/:id").get((req, res) => {
    dbEstados.getEstadoId(req.params.id).then((result) => {
        res.json(result);
        //console.log('estado encontrado: ' + result);
    });
});

/* Obtener los datos de una carpeta de investigación */
router.route("/ci").post((req, res) => {
    const numeroCar = {...req.body };
    dbCI.getCI(numeroCar).then((numCar) => {
        res.setHeader("Content-Type", "application/json");
        res.json(numCar);
        //console.log(numCar);
    })
})

/*  Obtenemos las carpetas de investigación de Univrso */
router.route("/ciuniverso").post((req, res) => {
    const numeroCar = {...req.body };
    dbCIUni.getCarpetasInvestigacionUni(numeroCar).then((numeroCar) => {
        res.setHeader("Content-Type", "application/json");
        res.json(numeroCar);
        //console.log(numeroCar);
    })
})

/**  OBTENEMOS EL CATALOGO DE FISCALIAS */

router.route("/catComboFiscalia").post((req, res) => {
    dbCatalogos.getFiscalias().then((result) => {
        res.json(result);
        //console.log(result);
    });
});

/**  OBTENEMOS EL CATALOGO ESTADOS */

router.route("/catComboDel/:id").post((req, res) => {
    dbCatalogos.getDelegacionesRetrasos(req.params.id).then((result) => {
        res.json(result);
        console.log(result);
    });
});

/**  OBTENEMOS EL CATALOGO DE ESPECIALIDADES  */

router.route("/catComboEspecialidades").post((req, res) => {
    dbCatalogos.getEspecialidadCMI().then((result) => {
        res.json(result);
        //console.log(result);
    });
});

/**  OBTENEMOS EL CATALOGO DE PRODUCTOS   */
router.route("/catComboProductos").post((req, res) => {
    dbCatalogos.getProductosInvestigacionMI().then((result) => {
        res.json(result);
        //console.log(result);
    })
});

/** OBTENEMOS LOS ACTOS DE INVESTIGACION **/
router.route("/catComboActosInvestigacionCMI").post((req, res) => {
    dbCatalogos.getActosInvestigacionCMI().then((result) => {
        res.json(result);
        //console.log(result);
    });
});

/**  OBTENEMOS LAS AREAS DE CMI */
router.route("/catComboAreasCmi").post((req, res) => {
    dbCatalogos.getAreasCMI().then((result) => {
        res.json(result);
        //console.log(result);
    })
})

/**   INSERTAMOS UN REGISTRO EN LA TABLA DE ATRASOS */
router.route("/insRetrasos").post((req, res) => {
    const retrasosParam = {...req.body };
    //console.log(retrasosParam);
    dbRetrasos.insertRetrasos(retrasosParam).then((retrasoResult) => {
        res.setHeader("Content-Type", "application/json");
        res.json(retrasoResult);
    });
});

/**   OBTENEMOS LOS REGISTROS DE ATRASOS */
router.route("/getRetrasos").post((req, res) => {
    console.log('Obtenemos los registros de retrasos');
    dbRetrasos.getRetrasos().then((retrasoResult) => {
        res.setHeader("Content-Type", "application/json");
        res.json(retrasoResult);
        //console.log(retrasoResult);
    });
});

/*  OBTENEMOS UNA CARPETA DE LA TABLA DE ATRASOS */
router.route("/getAtrasosID").post((req, res) => {
    const numeroCar = {...req.body };
    dbRetrasos.getOneRetrasos(numeroCar).then((resCarpeta) => {
        res.setHeader("Content-Type", "application/json");
        res.json(resCarpeta);
        console.log(resCarpeta);
    });
});

/** ELIMINAMOS UN REGISTRO DE LA TABLA DE ATRASOS */
router.route("/delRetrasos").post((req, res) => {
    const retrasosParam = {...req.body };
    dbRetrasos.delRetrasos(retrasosParam).then((retrasoResult) => {
        res.setHeader("Content-Type", "application/json");
        res.json(retrasoResult);
    });
});

/** ACTUALIZAMOS UN REGISTRO DE LA TABLA DE ATRASOS */
router.route("/updRetrasos").post((req, res) => {
    const retrasosParam = {...req.body };
    dbRetrasos.updateRetrasos(retrasosParam).then((retrasosResult) => {
        res.setHeader("Content-Type", "application/json");
        res.json(retrasosResult);
    });
});

/** OBTIENE LOS DATOS DE ENTIDADES FEDERATIVAS */

router.route("/EntidadFederativa").post((req, res) => {
    dbEntidadFederativa.getEntidadFederativa().then((result) => {
        res.json(result);
    });
});

/** OBTENEMOS LAS UNIDADES */
router.route("/getCatUnidad").post((req, res) => {
    dbUnidades.getUnidades().then((unidadResult) => {
        res.setHeader("Content-Type", "application/json");
        res.json(unidadResult);
        //console.log(unidadResult);
    });
});

/**  OBTENEMOS UNA UNIDA ADMINISTRATIVA */

router.route("/getOneUnidad").post((req, res) => {
    const paramUnidad = {...req.body };
    //console.log(paramUnidad);
    dbUnidades.getOneUnidad(paramUnidad).then((unidadResult) => {
        res.setHeader("Content-Type", "application/json");
        res.json(unidadResult);
        //console.log(unidadResult);
    });
});


/** INSERTAMOS UNA UNIDAD ADMINISTRATIVA EN LA BASE */
router.route("/insunidad").post((req, res) => {
    const paramUnidad = {...req.body };
    dbUnidades.insUnidad(paramUnidad).then((resUnidad) => {
        res.setHeader("Content-Type", "application/json");
        res.json(resUnidad);
    });
});

/** ACTUALIZAMOS LOS DATOS DE LA UNIDAD ADMINISTRATIVA */
router.route("/upUnidad").post((req, res) => {
    const paramUnidad = {...req.body };
    console.log('Los valores iniciales de la API')
    console.log(paramUnidad);
    dbUnidades.upUnidad(paramUnidad).then((resUnidad) => {
        res.setHeader("Content-Type", "application/json");
        res.json(resUnidad);
    });
});

/** ELIMINAMOS UNA UNIDAD */

router.route("/delUnidad").post((req, res) => {
    const paramUnidad = {...req.body };
    dbUnidades.delUnidad(paramUnidad).then((resUnidad) => {
        res.setHeader("Content-Type", "application/json");
        res.json(resUnidad);
    });
});

/** OBTENEMOS LAS SEDES POR UNIDAD */

router.route("/getSedeUnidad").post((req, res) => {
    const paramSedes = {...req.body };
    //console.log('Entro en la funcion de la api');
    //console.log(paramSedes);
    dbSedes.getOneSede(paramSedes).then((resDatosSede) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(resDatosSede);
        //        console.log('El resultado de sedes es ')
        //        console.log(resDatosSede);
    });
});

/**  INSERTA SEDE   */
router.route("/insSedeunidad").post((req, res) => {
    const paramSedes = {...req.body };
    dbSedes.insSede(paramSedes).then((resDatosSede) => {
        res.setHeader('Conten-Type', 'application/json');
        res.json(resDatosSede);
    });
});

/** ACTUALIZA DATOS DE LA SEDE */
router.route("/updSede").post((req, res) => {
    const paramSedes = {...req.body };
    console.log('los datos de entrada son ')
    console.log(paramSedes);

    dbSedes.updSedes(paramSedes).then((resDatosSede) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(resDatosSede);
    });
});

/** ELIMINA SEDE */

router.route("/delSede").post((req, res) => {
    const paramSedes = {...req.body };
    dbSedes.delSedes(paramSedes).then((resDatosSede) => {
        res.setHeader('Content-type', 'application/json');
        res.json(resDatosSede);
    });
});

/** OBTIENE TODOS LOS MUNICIPIOS  */

router.route("/getMunicipios").post((req, res) => {
    dbMunicipio.getAllMunicipio().then((resDatosMuni) => {
        res.setHeader('Conten-Type', 'application/json');
        res.json(resDatosMuni)
    });
});

/** OBTIENE TODOS LOS MUNICIPIOS POR ESTADO */
router.route("/getEstadoMunicipio").post((req, res) => {
    const paramMuni = {...req.body };
    dbMunicipio.getEstadoMunicipio(paramMuni).then((resDatosMuni) => {
        res.setHeader('Content-Type', 'Application/json');
        res.json(resDatosMuni);
    });
});

/**
 *  Inician las funciones de transparencia
 * 
 */

/**  OBTENEMOS EL CATALOGO DE TIPO DE SOLICITUDES   */
router.route("/trans/tipoSolicitudes").post((req, res) => {
    dbTransparencia.getSolicitudTipo().then((result) => {
        res.json(result);
        //console.log(result);
    })
});

/**  OBTENEMOS EL CATALOGO DE ESTATUS DE LA SOLICITUD */

router.route("/trans/estatusSolicitud").post((req, res) => {
    dbTransparencia.getEstatusSolicitud().then((result) => {
        res.json(result);
        //console.log(result);
    })
})

/** ONTIENE LA LISTA DE ASUNTOS PARA LAS SOLICITUDES DE TRANSPARENCIA */

router.route("/trans/asuntoSolicitud").post((req, res) => {
    dbTransparencia.getAsuntoSolicitud().then((result) => {
        res.json(result);
        //console.log(result);
    })
})

/**   INSERTAMOS UN REGISTRO EN LA TABLA DE SOLICITUDES DE TRANSPARENCIA */
router.route("/trans/totalRegistros").post((req, res) => {
    const solicitudParam = {...req.body };
    dbTransparencia.getNumeroRegistros(solicitudParam).then((tot_sol) => {
        res.setHeader('Content-Type', 'application/json');
        //console.log(tot_sol);
        res.json(tot_sol);
    });
})

router.route("/trans/insSolicitud").post((req, res) => {
    const solicitudParam = {...req.body };
    dbTransparencia.putSolicitudTransparencia(solicitudParam).then((solicitudResult) => {
        res.setHeader('Content-Type', 'application/json');
        //console.log(solicitudResult);
        res.json(solicitudResult);
    })
});


/**   ACTUALIZAMOS UN REGISTRO EN LA TABLA DE SOLICITUDES DE TRANSPARENCIA */
router.route("/trans/updSolicitud").post((req, res) => {
    const solicitudParam = {...req.body };
    //console.log(solicitudParam);
    dbTransparencia.upSolicitudTransparencia(solicitudParam).then((solicitudResult) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(solicitudResult);
    })
});

/** OBTIENE TODAS LAS SOLICITUDES DE TRANSPARENCIA */

router.route("/trans/allSolicitudTrans").post((req, res) => {
    dbTransparencia.getAllSolicitudesTrans().then((result) => {
        res.json(result);
        //console.log(result);
    })
})

/**   OBTENEMOS EL ESTADISTICO DE SOLICITUDES */

router.route("/trans/totalSolicitudes").post((req, res) => {
    dbTransparencia.getTotalesPorEstatus().then((result) => {
        //console.log(result);
        res.json(result);
    })
})

/**  OBTENEMOS EL CATÁLOGO DE TIPO DE CORREO */

router.route("/trans/tipoDeCorreo").post((req, res) => {
    dbTransparencia.getTipoCorreo().then((result) => {
        //console.log(result);
        res.json(result);
    })
})

/** OBTENEMOS EL CATALOGO DE REMITENTES */
router.route("/trans/allRemitentes").post((req, res) => {
    dbTransparencia.getAllRemitentes().then((result) => {
        //console.log(result);
        res.json(result);
    })
})

/** OBTENEMOS TODOS LOS ASUNTOS */
router.route("/trans/allAsuntos").post((req, res) => {
    dbTransparencia.getAllAsuntos().then((result) => {
        //console.log(result);
        res.json(result);
    })
})

/** OBTENEMOS TODOS LOS DESTINATARIOS */

router.route("/trans/allDestinatarios").post((req, res) => {
    dbTransparencia.getAllDestinatario().then((result) => {
        //console.log(result);
        res.json(result);
    })
})

router.route("/trans/seguimientoAreas").post((req, res) => {
    dbTransparencia.getAllSeguimientoAreas().then((result) => {
        console.log(result);
        res.json(result);
    })
})

router.route("/trans/areasTransparencia").post((req, res) => {
    dbTransparencia.getAreasTransparencia().then((result) => {
        res.json(result);
    })
})

router.route("/trans/putSolicitudCorreo").post((req, res) => {
    const correoParam = {...req.body };
    //console.log(correoParam);
    dbTransparencia.putSolicitudCorreo(correoParam).then((correoResult) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(correoResult);
    })
})

router.route("/trans/upSolicitudCorreo").post((req, res) => {
    const correoParam = {...req.body };
    //console.log(correoParam);
    dbTransparencia.upSolicitudCoreo(correoParam).then((correoResult) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(correoResult);
    })
})

router.route("/trans/getAllSolicitudCorreoXFolio").post((req, res) => {
    const numFolio = {...req.body };
    dbTransparencia.getAllSolicitudCorreoXFolio(numFolio).then((correoFolioRes) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(correoFolioRes);
    })
})

router.route("/trans/putRemitente").post((req, res) => {
    const datosRemitente = {...req.body };
    //console.log(datosRemitente);
    dbTransparencia.putRemitentes(datosRemitente).then((resRemitente) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(resRemitente);
    })
})

router.route("/trans/updRemitente").post((req, res) => {
    const datosRemitente = {...req.body };
    //console.log(datosRemitente);
    dbTransparencia.updRemitente(datosRemitente).then((resRemitente) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(resRemitente);
    })
})

router.route("/trans/putDestinatario").post((req, res) => {
    const datosDestinatario = {...req.body };
    dbTransparencia.putDestinatario(datosDestinatario).then((resDestinatario) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(resDestinatario);
    })
})

router.route("/trans/updDestinatario").post((req, res) => {
    const datosDestinatario = {...req.body };
    dbTransparencia.updDestinatario(datosDestinatario).then((resDestinatario) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(resDestinatario);
    })
})


router.route("/trans/putAsunto").post((req, res) => {
    const datosAsunto = {...req.body };
    dbTransparencia.putAsuntoSolicitud(datosAsunto).then((resAsunto) => {
        res.setHeader('Content-type', 'application/json');
        res.json(resAsunto);
    })
})

router.route("/trans/updAsunto").post((req, res) => {
    const datosAsunto = {...req.body };
    dbTransparencia.updAsunto(datosAsunto).then((resAsunto) => {
        res.setHeader('Content-type', 'application/json');
        res.json(resAsunto);
    })
})

router.route("/trans/getAllTemas").post((req, res) => {
    dbTransparencia.getAllTemas().then((resTemas) => {
        res.setHeader('Content-type', 'application/json');
        res.json(resTemas);
    })
})

router.route("/trans/getAllSubtemas").post((req, res) => {
    const datosSubtema = {...req.body };
    dbTransparencia.getAllSubtemas(datosSubtema).then((resSubtema) => {
        res.setHeader('Content-type', 'application/json');
        res.json(resSubtema);
    })
})

router.route("/trans/putSeguimientoAreas").post((req, res) => {
    const datosSeguimiento = {...req.body };
    dbTransparencia.putSeguimientoAreas(datosSeguimiento).then((resSeguimiento) => {
        res.setHeader('Content-type', 'application/json');
        res.json(resSeguimiento);
    })
})

router.route("/trans/updSegumientoAreas").post((req, res) => {
    const datosSeguimiento = {...req.body };
    dbTransparencia.updSeguimientoAreas(datosSeguimiento).then((resSeguimiento) => {
        res.setHeader('Content-type', 'application/json');
        res.json(resSeguimiento);
    })
})

router.route("/trans/exportSolicitudes").post((req, res) => {
    dbTransparencia.exportSolicitudes().then((resSolicitudes) => {
        res.setHeader('Content-type', 'application/json');
        res.json(resSolicitudes);
    })
});

router.route("/trans/exportSolicitudesdetalle").post((req, res) => {
    dbTransparencia.exportSolicitudesDetalle().then((resSolDet) => {
        res.setHeader('content-Type', 'application/json');
        res.json(resSolDet);
    })
})