-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: sakura_database
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorie_service`
--

DROP TABLE IF EXISTS `categorie_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorie_service` (
  `categorie_service_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`categorie_service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorie_service`
--

LOCK TABLES `categorie_service` WRITE;
/*!40000 ALTER TABLE `categorie_service` DISABLE KEYS */;
INSERT INTO `categorie_service` VALUES (1,'Servicios de diagnóstico dental','Diagnóstico',_binary ''),(2,'Servicios restaurativos','Restaurativo',_binary ''),(3,'Servicios preventivos','Preventivo',_binary ''),(4,'Servicios de rehabilitación','Rehabilitación',_binary ''),(5,'Servicios de endodoncia','Endodoncia',_binary ''),(6,'Servicios para niños','Odontopediatría',_binary ''),(7,'Servicios quirúrgicos','Cirugía',_binary ''),(8,'Servicios estéticos','Estética',_binary ''),(9,'Servicios periodontales','Periodoncia',_binary ''),(10,'Servicios Otros','Otros',_binary '');
/*!40000 ALTER TABLE `categorie_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinical_histories`
--

DROP TABLE IF EXISTS `clinical_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinical_histories` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `notes` text,
  `patient_id` int NOT NULL,
  PRIMARY KEY (`history_id`),
  KEY `FK8o2oyyv912ckomq03bl3fslvq` (`patient_id`),
  CONSTRAINT `FK8o2oyyv912ckomq03bl3fslvq` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinical_histories`
--

LOCK TABLES `clinical_histories` WRITE;
/*!40000 ALTER TABLE `clinical_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `clinical_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `district`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `district` (
  `district_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`district_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `district`
--

LOCK TABLES `district` WRITE;
/*!40000 ALTER TABLE `district` DISABLE KEYS */;
/*!40000 ALTER TABLE `district` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_type`
--

DROP TABLE IF EXISTS `document_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_type` (
  `document_type_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`document_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_type`
--

LOCK TABLES `document_type` WRITE;
/*!40000 ALTER TABLE `document_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `hired_at` datetime(6) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `district_id` int NOT NULL,
  `gender_id` int NOT NULL,
  `job_title_id` int NOT NULL,
  `document_type_id` int NOT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `FKckh7umfgmvx1yh9plcx9w6kg6` (`district_id`),
  KEY `FKe0w26qjedr99vwno4pqauw9i9` (`gender_id`),
  KEY `FK285wbocjxmn29cknw65t5v022` (`job_title_id`),
  KEY `FKb0s9epj6lpl1t72eknd40cwgv` (`document_type_id`),
  CONSTRAINT `FK285wbocjxmn29cknw65t5v022` FOREIGN KEY (`job_title_id`) REFERENCES `job_titles` (`job_title_id`),
  CONSTRAINT `FKb0s9epj6lpl1t72eknd40cwgv` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`document_type_id`),
  CONSTRAINT `FKckh7umfgmvx1yh9plcx9w6kg6` FOREIGN KEY (`district_id`) REFERENCES `district` (`district_id`),
  CONSTRAINT `FKe0w26qjedr99vwno4pqauw9i9` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`gender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender` (
  `gender_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`gender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_titles`
--

DROP TABLE IF EXISTS `job_titles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_titles` (
  `job_title_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`job_title_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_titles`
--

LOCK TABLES `job_titles` WRITE;
/*!40000 ALTER TABLE `job_titles` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_titles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `birth_date` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `doc_number` varchar(8) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `district_id` int NOT NULL,
  `gender_id` int NOT NULL,
  `document_type_id` int NOT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `UKtnlyf9idb13k7kwfqjkv39453` (`doc_number`),
  KEY `FK9i0ttwt09mhnnpykm4i8qqri2` (`district_id`),
  KEY `FKag2vysva6dc2ipr11plk86hap` (`gender_id`),
  KEY `FK9ncdwti8i340p53klkws8jq5e` (`document_type_id`),
  CONSTRAINT `FK9i0ttwt09mhnnpykm4i8qqri2` FOREIGN KEY (`district_id`) REFERENCES `district` (`district_id`),
  CONSTRAINT `FK9ncdwti8i340p53klkws8jq5e` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`document_type_id`),
  CONSTRAINT `FKag2vysva6dc2ipr11plk86hap` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`gender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `method_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`method_id`),
  UNIQUE KEY `UKkxvufx13wi6icen4i2wltdj02` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'Efectivo'),(6,'Plin'),(2,'Tarjeta de Crédito'),(3,'Tarjeta de Débito'),(4,'Transferencia Bancaria'),(5,'Yape');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `balance_remaining` decimal(10,2) NOT NULL,
  `payment_date` datetime(6) DEFAULT NULL,
  `status` enum('ANULADO','CONFIRMADO','PENDIENTE') DEFAULT NULL,
  `canceled_by` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `method_id` int NOT NULL,
  `quotation_id` int NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `FK28xqkdxwpumtw428apwxy9qv` (`canceled_by`),
  KEY `FK44957q7sogi6mtk6hs19kgycu` (`created_by`),
  KEY `FKed69k88woxxuf1aqm261l3x0f` (`method_id`),
  KEY `FKgc04drcec6r7iev5crm1ucsf` (`quotation_id`),
  CONSTRAINT `FK28xqkdxwpumtw428apwxy9qv` FOREIGN KEY (`canceled_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK44957q7sogi6mtk6hs19kgycu` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKed69k88woxxuf1aqm261l3x0f` FOREIGN KEY (`method_id`) REFERENCES `payment_methods` (`method_id`),
  CONSTRAINT `FKgc04drcec6r7iev5crm1ucsf` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`quotation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `permission_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotation_items`
--

DROP TABLE IF EXISTS `quotation_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotation_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quotation_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`item_id`),
  KEY `FK7y587hckcncga8qtka1i06cbp` (`quotation_id`),
  KEY `FK1oiuonlon56ixltsh6uuujf04` (`service_id`),
  CONSTRAINT `FK1oiuonlon56ixltsh6uuujf04` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`),
  CONSTRAINT `FK7y587hckcncga8qtka1i06cbp` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`quotation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotation_items`
--

LOCK TABLES `quotation_items` WRITE;
/*!40000 ALTER TABLE `quotation_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotation_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotations` (
  `quotation_id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('ACEPTADA','ANULADA','PAGADA','PENDIENTE') DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `history_id` int DEFAULT NULL,
  `patient_id` int NOT NULL,
  PRIMARY KEY (`quotation_id`),
  KEY `FKpoeydll8h360utdh5hk1254b4` (`history_id`),
  KEY `FK1608n33b86r64nle951wtmr1m` (`patient_id`),
  CONSTRAINT `FK1608n33b86r64nle951wtmr1m` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`),
  CONSTRAINT `FKpoeydll8h360utdh5hk1254b4` FOREIGN KEY (`history_id`) REFERENCES `clinical_histories` (`history_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotations`
--

LOCK TABLES `quotations` WRITE;
/*!40000 ALTER TABLE `quotations` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipts` (
  `receipt_id` bigint NOT NULL AUTO_INCREMENT,
  `generated_at` datetime(6) DEFAULT NULL,
  `receipt_number` varchar(30) NOT NULL,
  `receipt_type` enum('BOLETA','FACTURA') NOT NULL,
  `payment_id` bigint NOT NULL,
  PRIMARY KEY (`receipt_id`),
  UNIQUE KEY `UKsehtr7fmqdjw4f4n3xys7x19l` (`receipt_number`),
  KEY `FKecr3sh9ed2cda7v8n3gyy7530` (`payment_id`),
  CONSTRAINT `FKecr3sh9ed2cda7v8n3gyy7530` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id`),
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`),
  CONSTRAINT `FKn5fotdgk8d1xvo8nav9uv3muc` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador','ADMIN',_binary '');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `base_price` decimal(10,2) NOT NULL,
  `description` text,
  `name` varchar(100) NOT NULL,
  `status` bit(1) NOT NULL,
  `categorie_service_id` int NOT NULL,
  PRIMARY KEY (`service_id`),
  KEY `FKkcd9p3yq8uetb4clki5f4m9ki` (`categorie_service_id`),
  CONSTRAINT `FKkcd9p3yq8uetb4clki5f4m9ki` FOREIGN KEY (`categorie_service_id`) REFERENCES `categorie_service` (`categorie_service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,25.00,'Prueba estética temporal para visualizar cambios.','Mock Up',_binary '',1),(2,500.00,'Planificación digital de la sonrisa.','Diseño Digital',_binary '',1),(3,140.00,'Empaste básico para caries superficiales.','Resina Simple',_binary '',2),(4,220.00,'Restauración de daño moderado con resina estética.','Resina Compuesta',_binary '',2),(5,330.00,'Reconstrucción dental con múltiples superficies.','Resina Compleja',_binary '',2),(6,150.00,'Relleno dental con liberación de flúor.','Ionómero Simple',_binary '',2),(7,220.00,'Empaste resistente con componentes de ionómero.','Ionómero Compuesto',_binary '',2),(8,55.00,'Barreras protectoras en molares para prevenir caries.','Sellantes',_binary '',3),(9,150.00,'Limpieza dental para remover sarro leve.','Profilaxis y Destartraje Simple',_binary '',3),(10,220.00,'Limpieza dental profunda en dos sesiones.','Profilaxis y destartraje Moderado (2 citas)',_binary '',3),(11,550.00,'Limpieza intensiva en tres citas.','Profilaxis y destartraje Moderado (3citas)',_binary '',3),(12,80.00,'Detención de caries activas en dientes temporales.','Aplicación de cloruro de amino de plata',_binary '',3),(13,90.00,'Refuerzo del esmalte dental con barniz fluorado.','Flúor Barniz',_binary '',3),(14,350.00,'Refuerzo interno estético para dientes tratados.','Perno Fibra de Vidrio',_binary '',4),(15,280.00,'Refuerzo interno metálico para dientes debilitados.','Perno Metálico',_binary '',4),(16,150.00,'Acceso al interior dental para tratamiento.','Apertura Cameral',_binary '',5),(17,1350.00,'Cirugía para remover raíz infectada en dientes frontales.','Apiceptomía de Dientes Anteriores',_binary '',5),(18,1350.00,'Cirugía para remover raíz en molares afectados.','Apiceptomía de Dientes posteriores',_binary '',5),(19,470.00,'Tratamiento de conducto en incisivos y caninos.','5 anterior',_binary '',5),(20,600.00,'Tratamiento de conducto en premolares.','5 Premolar',_binary '',5),(21,650.00,'Tratamiento de conducto en molares.','5 Molar',_binary '',5),(22,650.00,'Repetición del tratamiento de conducto en dientes frontales.','Retratamiento Anterior',_binary '',5),(23,720.00,'Repetición del tratamiento de conducto en premolares.','Retratamiento premolar',_binary '',5),(24,820.00,'Repetición del tratamiento de conducto en molares.','Retratamiento Molar',_binary '',5),(25,380.00,'Eliminación de pulpa dental infectada en niños.','Pulpectomía',_binary '',6),(26,280.00,'Remoción parcial de la pulpa dental en niños.','Pulpotomía',_binary '',6),(27,470.00,'Restauración estética incrustada con resina.','Incrustación Resina',_binary '',2),(28,720.00,'Restauración estética con material cerómero.','Incrustación Cerómero',_binary '',2),(29,1320.00,'Restauración altamente estética y resistente.','Incrustación Zirconio',_binary '',2),(30,350.00,'Extracción de quiste mucoso en la boca.','Mucocele',_binary '',7),(31,200.00,'Limpieza del alveolo tras extracción dental.','Curetaje de Alveolo',_binary '',7),(32,220.00,'Extracción sin complicaciones de una pieza dental.','Exodoncia Simple',_binary '',7),(33,100.00,'Extracción de diente temporal en niños.','Exodoncia diente deciduo',_binary '',7),(34,300.00,'Extracción quirúrgica con apertura de encía.','Exodoncia con Colgajo',_binary '',7),(35,380.00,'Extracción de diente parcialmente cubierto.','Exodoncia Semi impactada',_binary '',7),(36,660.00,'Extracción de diente totalmente cubierto o inclinado.','Exodoncia Impactada',_binary '',7),(37,450.00,'Aclaramiento de un solo diente.','Blanqueamiento unitario',_binary '',8),(38,350.00,'Aclaramiento con férulas en casa.','Blanqueamiento con Cubetas',_binary '',8),(39,500.00,'Aclaramiento profesional en dos citas.','Blanqueamiento consultorio(2 sesiones)',_binary '',8),(40,660.00,'Combinación de blanqueamiento en casa y consultorio.','Blanqueamiento Mixto',_binary '',8),(41,380.00,'Lámina estética aplicada directamente en clínica.','Carilla Resina Directa',_binary '',2),(42,660.00,'Carilla elaborada en laboratorio y luego adherida.','Carilla Resina Indirecta',_binary '',2),(43,950.00,'Carilla estética con cerómero de alta calidad.','Carilla Cerómero',_binary '',8),(44,1350.00,'Carilla estética de cerámica altamente resistente.','Carilla Cerámica Emax',_binary '',8),(45,150.00,'Corona provisional rápida en acrílico.','Corona Acrílico Rápido',_binary '',4),(46,250.00,'Corona provisional de mejor calidad.','Corona Acrílico Lento',_binary '',4),(47,530.00,'Corona estética con mínima reducción dental.','Corona Veener',_binary '',4),(48,850.00,'Corona resistente con estructura metálica.','Corona Metal Cerámica',_binary '',4),(49,1250.00,'Corona con sistema de retención adicional.','Corona Metal Cerámica con atache',_binary '',4),(50,1550.00,'Corona estética sin metal de alta resistencia.','Corona Zirconio',_binary '',4),(51,630.00,'Prótesis removible de uso inmediato tras extracciones.','Prótesis Parcial Removible Wipla o Inmediata',_binary '',4),(52,1200.00,'Prótesis parcial metálica con dientes acrílicos.','Prótesis Parcial Removible Cromo cobalto con dientes de Acrilico',_binary '',4),(53,1600.00,'Prótesis parcial metálica con dientes de resina estética.','Prótesis Parcial Removible Cromo cobalto con dientes de Resina',_binary '',2),(54,1980.00,'Prótesis parcial con sistema de retención tipo atache.','Prótesis Parcial Removible Cromo cobalto con dientes de Atache',_binary '',4),(55,1980.00,'Prótesis removible sin metal, flexible y estética.','Prótesis Parcial Removible Flexible',_binary '',4),(56,1200.00,'Prótesis completa de acrílico para ambas arcadas.','Prótesis Total de Acrílico',_binary '',4),(57,1600.00,'Prótesis total con mayor estética y resistencia.','Prótesis Total de Resina',_binary '',2),(58,1980.00,'Prótesis total reforzada con malla y dientes estéticos.','Prótesis Total Acrílico triplex, Dientes de Resina y Malla',_binary '',2),(59,550.00,'Ajuste interno de prótesis para mejor adaptación.','Prótesis Total Rebase de Prótesis',_binary '',4),(60,2000.00,'Prótesis total anclada a implantes.','Prótesis Total Overdent',_binary '',4),(61,350.00,'Férula para aliviar tensión mandibular leve.','Férula Miorrelajante Láminas',_binary '',4),(62,500.00,'Férula rígida para trastornos de ATM.','Férula Miorrelajante Acrílico',_binary '',4),(63,550.00,'Cirugía para exponer más superficie dental.','Alargamiento de Corona Clínica con Osteotomía por pieza',_binary '',4),(64,900.00,'Cirugía periodontal para cubrir recesiones.','Colgajo Desplazado Coronal (por diente)',_binary '',4),(65,900.00,'Técnica quirúrgica para corregir encías retraídas.','Colgajo Desplazado Lateral (por diente)',_binary '',9),(66,900.00,'Acceso quirúrgico para limpieza profunda.','Colgajo Periodontal',_binary '',9),(67,550.00,'Control periódico para pacientes periodontales.','Fase de Mantenimiento periodontal',_binary '',9),(68,700.00,'Unión de dientes móviles con resina.','Ferulizaciones con Resina (por arcada)',_binary '',2),(69,700.00,'Remodelación de encía en un diente.','Gingivectomía/Gingivoplastía por pieza',_binary '',9),(70,2000.00,'Remodelación de encía en un grupo dental.','Gingivectomía/Gingivoplastía por Sextante',_binary '',9),(71,1200.00,'Trasplante de encía para cubrir raíces.','Injerto Gingival',_binary '',9),(72,1500.00,'Limpieza profunda de encías en un sector.','Raspado y Alisado por cuadrante',_binary '',9),(73,2000.00,'Técnica para recuperar tejido óseo o encía.','Regeneración Tisular Guiada',_binary '',10),(74,350.00,'Cirugía para restablecer el espacio encía-hueso.','Recuperación de espacio biológico',_binary '',9);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(120) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `password_hash` varchar(95) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(60) NOT NULL,
  `employee_id` int DEFAULT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UKd1s31g1a7ilra77m65xmka3ei` (`employee_id`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKfndbe67uw6silwqnlyudtwqmo` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025-07-12 17:34:53.205650','admin@sakura.com',_binary '',NULL,'$2a$10$7DWKJItEZYid0co.8241eOH2fWnPCw6paMMaLZN9uaoIF4hD4T4Ca','2025-07-12 17:34:53.205650','admin',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-12 14:06:25
