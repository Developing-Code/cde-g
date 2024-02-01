
const { Router } = require('express');
const express = require ('express');
const router = express.Router();
const multer  = require('multer');
const path = require('path');
const uuid = require('uuid');
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads/'),
    filename:(req, file, cb)=>{
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
})
const upload = multer({ storage, dest: path.join(__dirname, '../public/uploads/') }).single('imagen')
const uploadEF = multer({ storage, dest: path.join(__dirname, '../public/uploads/') }).single('evidencia_foto')
const uploadFotoPerfil = multer({ storage, dest: path.join(__dirname, '../public/uploads/') }).single('foto_perfil')
const uploadF = multer({ storage, dest: path.join(__dirname, '../public/uploads/') }).single('firma')
const customerController=require('../controllers/customerController')


// pus notifi
router.post('/subscription', customerController.subscription);
router.post('/new-message', customerController.newmessage);



//login
router.get('/login', customerController.login);
router.post('/loginAuth', customerController.loginAuth);
router.get('/loginAut', customerController.logAut)
//inicial 
router.get('/', customerController.inicialPage);
router.get('/contact', customerController.inicialPageContact);
//register
router.get('/register', customerController.register)
router.get('/usuario', customerController.registerUsers)
router.post('/sendRegister' , customerController.sendRegister)
router.get('/registerUsersEdit/:id', customerController.registerUEdit)
router.get('/registerUsersDelate/:id', customerController.deleteUser)
router.get('/perfilUsuario/:id', customerController.perfilUsuario)
router.get('/perfilCompost/:id', customerController.perfilCompost)
router.get('/myperfil', customerController.myperfil)
router.post('/actualizarFotoPerfilSend', uploadFotoPerfil ,customerController.actualizarFotoPerfilSend)
router.post('/sendUpdateUser', customerController.sendUpdateUser)
//register de tenicos al sistema 


//update passwore
router.get('/password/:id', customerController.passwordNew)
router.post('/sendPassword', customerController.savePasssword)
//principal menu
router.get('/home', customerController.home)
router.get('/vistamapacomposteras', customerController.vistamapacomposteras)
router.post('/buscarcasamapa', customerController.buscarcasamapa)
router.get('/welcome', customerController.welcome)

//estadisticas
router.get('/pestadisticas', customerController.pestadisticas)
router.get('/graficoCompost/:id', customerController.graficoCompost)



//panel recursos humanos
router.get('/panelSSG', customerController.panelSSG)
//pimasd
//panel Gestion doc
router.get('/pgestiondoc', customerController.panelGestionDocuemntal)


router.post('/QuienMeTieneMailEQ', customerController.sendCorreEQ1)


router.post('/cronogramaBuscarTel', customerController.cronogramaBuscarTel)

router.get('/cronogramaTodo', customerController.cronogramaTodo)
router.get('/configuracion', customerController.configuracion)



//cdeg
router.get('/totalcomposteras', customerController.totalcomposteras)
router.get('/totalcomposteraslist', customerController.totalcomposteraslist)
router.get('/totalcomposterashoy', customerController.totalcomposterashoy)
router.get('/composteraRegistroupdate/:id', customerController.composteraRegistroupdate)


//registros de operacion
router.get('/registrosdeoperacion', customerController.registrosOperacion)
router.post('/filtrarregistrosOperacionsend', customerController.filtrarregistrosOperacion)
router.get('/detallesRegitroOperacion/:id', customerController.detallesRegitroOperacion)
router.get('/imprimirRegitroOperacion/:id', customerController.imprimirRegitroOperacion)

router.get('/agregarNuevaCompostera', customerController.composteraNew)
router.get('/checkcodBenefic', customerController.checkcodBenefic)

router.get('/formCargeBiomasa/:id', customerController.formCargeBiomasa)
router.get('/formDescargeCompost/:id', customerController.formDescargeCompost)
router.get('/formCompostMadurado/:id', customerController.formCompostMadurado)


router.post('/agregarNuevocomposterasSend',uploadEF , customerController.composterasNewSend)

router.post('/agregarBiomasaSend',uploadEF , customerController.agregarBiomasaSend)
router.post('/descargeCompostSend',uploadEF , customerController.descargeCompostSend)
router.post('/compostMaduradoSend',uploadEF , customerController.compostMaduradoSend)


// visita seguimiento formulario
router.get('/formVisitaSeguimiento/:id', customerController.formVisitaSeguimiento)
router.post('/formVisitaSeguimientoSend',uploadEF, customerController.formVisitaSeguimientoSend)
router.get('/seguimientofoto1/:id', customerController.seguimientofoto1)
router.post('/subirFoto',uploadEF, customerController.subirFoto)




router.get('/formAnalisisLaboratorio/:id', customerController.formAnalisisLaboratorio)
router.post('/formAnalisisLaboratorioSend',uploadEF, customerController.formAnalisisLaboratorioSend)


//analisis de laboratorio
router.get('/InformeRegitroLaboratorio/:id', customerController.InformeRegitroLaboratorio)
router.post('/formInformeLaboratorioSend',uploadEF, customerController.formInformeLaboratorioSend)
router.get('/detallesInformeLaboratorio/:id', customerController.detallesInformeLaboratorio)
router.get('/imprimirInformeLaboratorio/:id', customerController.imprimirInformeLaboratorio)






router.get('/cronogramaCompletos', customerController.cronogramaCompletos)
router.get('/cronogramaInconpletos', customerController.cronogramaIncompletos)
router.get('/cronogramaReprogramar', customerController.cronogramaReprogramados)


router.get('/delatecompostera/:id', customerController.delatecompostera)
router.get('/editCompostera/:id', customerController.editCompostera)
router.post('/editarComposterasSend',uploadEF, customerController.editarComposterasSend)
router.post('/actualizarcoordscompost', customerController.actualizarcoordscompost)




router.get('/cronogramaReprogramar/:id', customerController.cronogramaSolidReprogramar)
router.post('/cronogramaReprogramarSend', customerController.cronogramaSolidReprogramarSend)
router.get('/cornogramaReprogramacionRespuesta/:id', customerController.cronogramaReportReprogramar)
router.post('/cornogramaReprogramacionRespuestaSend', customerController.cronogramaReportReprogramarSend)
router.get('/cronogramaFirmaPast/:id', customerController.cronogramaCompletar)

router.get('/cronogamaRadioEnlace', customerController.cronogramaRadioEnlace)
router.get('/cronogamaFibraOptica', customerController.cronogramaFibraOptica)
router.post('/cronogramaOrganizarPorFecha', customerController.cronogramaOrganizarFecha)


//manual de usuario
router.get('/manual', customerController.manualusuario)

module.exports = router; 