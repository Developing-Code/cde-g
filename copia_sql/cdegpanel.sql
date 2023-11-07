SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `cdegpanel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cdegpanel`;

DROP TABLE IF EXISTS `asistencia_dias`;
CREATE TABLE `asistencia_dias` (
  `id` int(11) NOT NULL,
  `nombre_empleado` varchar(255) NOT NULL,
  `hora_ingreso` int(11) NOT NULL DEFAULT 0,
  `hora_salida` int(11) NOT NULL DEFAULT 0,
  `horas_total` int(11) NOT NULL DEFAULT 0,
  `fecha` varchar(11) NOT NULL,
  `id_mes` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `asistencia_dias` (`id`, `nombre_empleado`, `hora_ingreso`, `hora_salida`, `horas_total`, `fecha`, `id_mes`, `id_usuario`) VALUES
(20, 'Alejandro Duque Castrillon', 9, 21, 12, '2023-02-23', 2, 1),
(22, 'Alejandro Duque Castrillon', 8, 21, 13, '2023-02-24', 2, 1);

DROP TABLE IF EXISTS `asistencia_meses`;
CREATE TABLE `asistencia_meses` (
  `id` int(11) NOT NULL,
  `mes` varchar(255) NOT NULL,
  `numero_dias` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `asistencia_meses` (`id`, `mes`, `numero_dias`) VALUES
(1, 'enero', 31),
(2, 'febrero', 29),
(3, 'marzo', 31),
(4, 'abril', 30),
(5, 'mayo', 31),
(6, 'junio', 30),
(7, 'julio', 31),
(8, 'agosto', 31),
(9, 'septiembre', 30),
(10, 'octubre', 31),
(11, 'noviembre', 30),
(12, 'diciembre', 31);

DROP TABLE IF EXISTS `composteras`;
CREATE TABLE `composteras` (
  `id` int(11) NOT NULL,
  `coordenas` varchar(800) NOT NULL,
  `lat` varchar(255) NOT NULL,
  `log` varchar(255) NOT NULL,
  `fecha_inicial` varchar(100) NOT NULL,
  `nombre_institucion` varchar(500) NOT NULL,
  `nombre_responsable` varchar(255) NOT NULL,
  `celular_responsable` varchar(500) NOT NULL,
  `Nota` varchar(800) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `foto1_compostera` varchar(500) DEFAULT NULL,
  `firma` longtext DEFAULT NULL,
  `Direccion_compostera` varchar(500) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre_quientrega` varchar(255) DEFAULT NULL,
  `serial_compostera` varchar(255) NOT NULL,
  `Capacidad_compostera` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `composteras` (`id`, `coordenas`, `lat`, `log`, `fecha_inicial`, `nombre_institucion`, `nombre_responsable`, `celular_responsable`, `Nota`, `estado`, `foto1_compostera`, `firma`, `Direccion_compostera`, `id_usuario`, `nombre_quientrega`, `serial_compostera`, `Capacidad_compostera`) VALUES
(1, '6.278443380278814, -75.44380187988283', '6.278443380278814', '-75.44380187988283', '2023-03-21', 'Jose maria cordova', 'Alfredo martinez', '3022835914', 'se entrega en buen estado', 'INCOMPLETO', 'ea679687-4d3f-4534-8052-210268b66df3.jpeg', 'firma', 'Guarne antioquia', 1, 'Alejandro Duque Castrillon', 'serial', 50);

DROP TABLE IF EXISTS `dispositivos_vendidos`;
CREATE TABLE `dispositivos_vendidos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(500) NOT NULL,
  `tipo_dispositivo` varchar(500) NOT NULL,
  `fecha` varchar(500) NOT NULL,
  `mac` varchar(500) NOT NULL,
  `cereal` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `inventario_referencias`;
CREATE TABLE `inventario_referencias` (
  `id` int(11) NOT NULL,
  `referencia` varchar(255) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `tipo_unidad` varchar(125) NOT NULL DEFAULT 'G',
  `descripcion` varchar(500) NOT NULL,
  `precio` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `cantidad_min` int(11) DEFAULT NULL,
  `precioTotal` int(11) NOT NULL DEFAULT 0,
  `fecha_creacion` varchar(128) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `inventario_referencias` (`id`, `referencia`, `marca`, `tipo_unidad`, `descripcion`, `precio`, `cantidad`, `cantidad_min`, `precioTotal`, `fecha_creacion`) VALUES
(11, 'ZTE F660V2', 'ZTE', 'D', 'ONT', 120, 0, NULL, 120, '2023-01-26 10:25:46'),
(13, 'TENSOR PLASTICO', 'ALT', 'U', 'tensor plastico', 1500, 3, NULL, 15000, '2023-01-26 11:42:37'),
(14, 'FIBRA DROP', 'ALT', 'M', 'Fibra 1 hilo', 0, 1001, NULL, 0, '2023-02-22 11:23:23');

DROP TABLE IF EXISTS `jornadas_laborales`;
CREATE TABLE `jornadas_laborales` (
  `id_jornada` int(11) NOT NULL,
  `nombre_jornada` int(11) NOT NULL,
  `iniciohora_jornada` int(11) NOT NULL,
  `finhora_jornada` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `lista_clientes`;
CREATE TABLE `lista_clientes` (
  `id` int(11) NOT NULL,
  `nombre_user` varchar(255) NOT NULL,
  `apellido_user` varchar(255) NOT NULL,
  `identificacion_user` varchar(255) NOT NULL,
  `correo_user` varchar(255) NOT NULL,
  `direccion_user` varchar(255) NOT NULL,
  `departamento_user` varchar(255) NOT NULL,
  `ciudad_user` varchar(255) NOT NULL,
  `celular_user` varchar(255) NOT NULL,
  `ip_user` varchar(255) NOT NULL,
  `mac_user` varchar(255) NOT NULL,
  `coordenadas_user` varchar(255) NOT NULL,
  `planInternet_user` varchar(255) NOT NULL,
  `fecha_creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `lista_dispositivos`;
CREATE TABLE `lista_dispositivos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(500) NOT NULL,
  `tipo_dispositivo` varchar(500) NOT NULL,
  `SerialModelo` varchar(500) NOT NULL,
  `estado` varchar(500) NOT NULL,
  `mac` varchar(500) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `quienMeTiene` varchar(255) NOT NULL,
  `tipo_unidad` varchar(50) NOT NULL DEFAULT 'G',
  `fecha_ingreso` varchar(500) NOT NULL DEFAULT current_timestamp(),
  `id_referencia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lista_dispositivos` (`id`, `nombre`, `tipo_dispositivo`, `SerialModelo`, `estado`, `mac`, `cantidad`, `quienMeTiene`, `tipo_unidad`, `fecha_ingreso`, `id_referencia`) VALUES
(30, 'TENSOR PLASTICO', 'ALT', 'cc3', 'nuevo', 'cc3', 3, 'bodega', 'U', '2023-01-27 12:46:16', 13),
(43, 'FIBRA DROP', 'ALT', '', 'nuevo', '', 1, 'bodega', 'M', '2023-02-22 11:23:49', 14),
(44, 'FIBRA DROP', 'ALT', '', 'nuevo', '', 1000, 'bodega', 'M', '2023-02-22 11:28:35', 14),
(48, 'ZTE F660V2', 'ZTE', '485754430706CCA6', 'nuevo', '485754430706CCA6', 1, 'Alejandro Duque Castrillon', 'D', '2023-03-04 08:35:53', 11);

DROP TABLE IF EXISTS `lista_ifraestructura_red`;
CREATE TABLE `lista_ifraestructura_red` (
  `id` int(11) NOT NULL,
  `tipoElemento` varchar(255) NOT NULL,
  `Nom_elemento` varchar(255) NOT NULL,
  `num_puertos` int(11) NOT NULL,
  `num_puertos_disponibles` int(11) NOT NULL,
  `num_puertos_defect` int(11) NOT NULL,
  `ubicacion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `lista_inventario_retirados`;
CREATE TABLE `lista_inventario_retirados` (
  `id` int(11) NOT NULL,
  `referencia` varchar(255) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `serial` varchar(255) NOT NULL,
  `catidad` int(11) NOT NULL,
  `quienRetiro` varchar(255) NOT NULL,
  `fehaDeRetiro` date NOT NULL DEFAULT current_timestamp(),
  `id_dispositivo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `lista_tickets_soporte`;
CREATE TABLE `lista_tickets_soporte` (
  `id` int(11) NOT NULL,
  `asunto_ticket` varchar(255) NOT NULL,
  `tecnico_asignado` varchar(255) NOT NULL,
  `reportado_desde` varchar(255) NOT NULL,
  `reportado_por` varchar(255) NOT NULL,
  `email_tecnico` varchar(255) NOT NULL,
  `evidencia1` varchar(500) NOT NULL,
  `descripcion_ticket` text NOT NULL,
  `fecha_inicio_ticket` date NOT NULL,
  `fecha_fin_ticket` date NOT NULL,
  `estado_ticket` varchar(255) NOT NULL,
  `prioridad_ticket` varchar(255) NOT NULL,
  `id_cliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `registrodiarioestadooperacion`;
CREATE TABLE `registrodiarioestadooperacion` (
  `id` int(11) NOT NULL,
  `id_compostera` int(11) NOT NULL,
  `fecha_registro` varchar(100) NOT NULL,
  `clima` varchar(100) NOT NULL,
  `Pinsectos` varchar(100) NOT NULL,
  `Proedores` varchar(100) NOT NULL,
  `Polor` varchar(100) NOT NULL,
  `MaterialEstructurante` varchar(100) NOT NULL,
  `CantidadME` int(11) NOT NULL,
  `Materialorganico` varchar(100) NOT NULL,
  `CantidadMO` int(11) NOT NULL,
  `FotoEstadoActual` varchar(500) NOT NULL,
  `TipoRegistro` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `registrodiarioestadooperacion` (`id`, `id_compostera`, `fecha_registro`, `clima`, `Pinsectos`, `Proedores`, `Polor`, `MaterialEstructurante`, `CantidadME`, `Materialorganico`, `CantidadMO`, `FotoEstadoActual`, `TipoRegistro`) VALUES
(7, 1, '2023-03-21', 'NA', 'NA', 'NA', 'NA', 'NA', 0, 'NA', 0, 'ea679687-4d3f-4534-8052-210268b66df3.jpeg', 'INICIAL'),
(8, 17, '2023-03-21', 'NA', 'NA', 'NA', 'NA', 'NA', 0, 'NA', 0, '18ce22f7-c9f1-4165-9c46-a1a89278393d.jpeg', 'INICIAL');

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(500) NOT NULL,
  `user` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `celular` varchar(60) DEFAULT NULL,
  `identificacion` varchar(255) DEFAULT NULL,
  `Rh` varchar(255) DEFAULT NULL,
  `eps` varchar(255) DEFAULT NULL,
  `arl` varchar(255) DEFAULT NULL,
  `caja_compensacion` varchar(255) DEFAULT NULL,
  `fondo_pensiones` varchar(255) DEFAULT NULL,
  `Nivel_educativo` varchar(255) DEFAULT NULL,
  `contacto_alternativo` varchar(255) DEFAULT NULL,
  `cat_licencia_cond` varchar(255) DEFAULT NULL,
  `registro_ingreso` varchar(255) NOT NULL DEFAULT 'no',
  `cargo` varchar(500) NOT NULL,
  `dependencia` varchar(255) DEFAULT NULL,
  `salarioMes` int(50) DEFAULT NULL,
  `foto_perfil` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuarios` (`id`, `nombre`, `user`, `password`, `email`, `celular`, `identificacion`, `Rh`, `eps`, `arl`, `caja_compensacion`, `fondo_pensiones`, `Nivel_educativo`, `contacto_alternativo`, `cat_licencia_cond`, `registro_ingreso`, `cargo`, `dependencia`, `salarioMes`, `foto_perfil`) VALUES
(1, 'Alejandro Duque Castrillon', 'dev', '$2a$08$DcBFeycAlRnmNsB65zjMWOlgkj4szgbCDU54O2UjMSlZAJ45ZRCja', 'alejodc412@gmail.com', '3022835914', '1216727457', '+A', 'Sura', 'Sura', 'comfama', 'porvenir', NULL, NULL, NULL, 'no', 'admin', NULL, 2000000, '84e243cd-0264-495c-861c-7768ce87c64c.png'),
(61, 'GDSFG', 'alejodc4125704', '$2a$08$3.DrVE4omlEU5moYkAlpkeH1Tj9QvaH5984Md778fN1PKnkDXk9kW', 'redlinecomunications@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', 'admin', 'DIRECCION', 1300000, NULL);


ALTER TABLE `asistencia_dias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mes_fk` (`id_mes`),
  ADD KEY `usuario_fk` (`id_usuario`);

ALTER TABLE `asistencia_meses`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `composteras`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `dispositivos_vendidos`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `inventario_referencias`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `jornadas_laborales`
  ADD PRIMARY KEY (`id_jornada`);

ALTER TABLE `lista_clientes`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `lista_dispositivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `referencia_fk` (`id_referencia`);

ALTER TABLE `lista_ifraestructura_red`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `lista_tickets_soporte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_fk` (`id_cliente`);

ALTER TABLE `registrodiarioestadooperacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_composteras` (`id_compostera`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `asistencia_dias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

ALTER TABLE `asistencia_meses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `composteras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `dispositivos_vendidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `inventario_referencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

ALTER TABLE `jornadas_laborales`
  MODIFY `id_jornada` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `lista_clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `lista_dispositivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

ALTER TABLE `lista_ifraestructura_red`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `lista_tickets_soporte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `registrodiarioestadooperacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;


ALTER TABLE `asistencia_dias`
  ADD CONSTRAINT `mes_fk` FOREIGN KEY (`id_mes`) REFERENCES `asistencia_meses` (`id`),
  ADD CONSTRAINT `usuario_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

ALTER TABLE `lista_dispositivos`
  ADD CONSTRAINT `referencia_fk` FOREIGN KEY (`id_referencia`) REFERENCES `inventario_referencias` (`id`);

ALTER TABLE `lista_tickets_soporte`
  ADD CONSTRAINT `cliente_fk` FOREIGN KEY (`id_cliente`) REFERENCES `lista_clientes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
