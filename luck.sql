-- MySQL dump 10.17  Distrib 10.3.22-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: luck
-- ------------------------------------------------------
-- Server version	10.3.22-MariaDB-1ubuntu1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `pic` varchar(999) DEFAULT 'profilepic.png',
  `banner` varchar(999) DEFAULT 'profilebanner.png',
  `password` varchar(999) NOT NULL,
  `type` varchar(999) DEFAULT NULL,
  `description` varchar(9999) DEFAULT 'Hello, i''m using Luck!',
  PRIMARY KEY (`id`,`email`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (12,'email@gmail.com','asdasdasd','profilepic.png','profilebanner.png','$2a$15$q2g6hc/A/whWuXzvLB14GeduV36EB8dSBe6m8.6VJdocD8lxxByHm',NULL,'Hello, i\'m using Luck!'),(16,'email2@gmail.com','asdasdasd','profilepic.png','profilebanner.png','$2a$15$9bKpoK3IbNdbLi.A1D1JDONU5XsJdu2gGKClxDsBBGUpoqaFbfG.e',NULL,'Hello, i\'m using Luck!'),(17,'asdas@gmail.com','asdasdasd','profilepic.png','profilebanner.png','$2a$15$aAH2RkSrXFNzrMCsb5ObTOQ/Ub.ZIBhYCyN8AMtryocFlk4o20dX6',NULL,'Hello, i\'m using Luck!'),(18,'test@gmail.com','test tes test','1661632059066_luck_WhatsApp Image 2022-07-14 at 10.24.42 PM.jpeg','1661632046347_luck_s2b1ImYR05z4PYEz8SNcUYHBVu2DVu18YFce4niO0vwUw0bmwbqVAJrckMMKgTfkzebapn4SATs12D1ekj073Hv0nTO3VF0dz3Mi.jpg','$2a$15$/NAvubN.f06m4.FvTMb7TOkbrQgxeM7tte39fe7vQtuPr5T2zVxpm','normal','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non ultricies nibh. Donec sit amet purus faucibus, tempor lorem nec, pharetra tellus. Praesent id tortor ligula. Proin mattis dui quis turpis pharetra dapibus. Aliquam ornare sodales dui vel volutpat. Ut tincidunt nec ante et suscipit. Donec nec pulvinar tortor. Aliquam tem'),(19,'everitjhon@gmail.com','Everit Jhon','1661547122154_luck_WhatsApp Image 2022-07-17 at 5.45.54 PM.jpeg','1661546786705_luck_wallpaperflare.com_wallpaper (6).jpg','$2a$15$I841DllJUTyp1xNYKiqqyez4VW2SQwWCwXYWPRuCqwF4MP7XEtPS6','creator','Loremipsun aa aa s impsum kags.<br>loremaaa a a a a ap imspsun.<br>aaaasds.'),(20,'everitjhon2@gmail.com','aasdsdasd','profilepic.png','profilebanner.png','$2a$15$rT7XXi3YwXSBQOMl5xQCBuKvCCrNbZX9x7gYNe8/PfiUW0z0Q7M9O','creator','Hello, i\'m using Luck!'),(21,'testin@gmail.com','jackson','profilepic.png','profilebanner.png','$2a$15$lCLRXH0NrFBDWmI6U8DzWuxPos9xOJuNMH88utVs2rP6/sYIyHf9q','normal','Hello, i\'m using Luck!'),(22,'testin2@gmail.com','testin2','profilepic.png','profilebanner.png','$2a$15$7hHcjvpwfdurCYd9d/Zw/Ooa7kEcu2FXcgzedMVQC2Hj1I69sVGNa','creator','Hello, i\'m using Luck!'),(23,'testin3@gmail.com','asdasd','profilepic.png','profilebanner.png','$2a$15$19RNLQXZhpc861M4lBE8ouu69xc7Ybh77Rf4HtZOh/Q9p0/MMMUei','creator','Hello, i\'m using Luck!'),(24,'testin4@gmail.com','asdasd','profilepic.png','profilebanner.png','$2a$15$VJU8Y8AX9snKFMFx6QRaO.Np4/J2dR7uqAQWahlK0SKi7QlgNgz8q','normal','Hello, i\'m using Luck!'),(25,'asdasdasd@gmail.com','asdasdsad','profilepic.png','profilebanner.png','$2a$15$Trz960KdLcNgv03aT6tVeeNImKd2knV9hZH7TontWXd0ib2jqN/3O',NULL,'Hello, i\'m using Luck!');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts_stats`
--

DROP TABLE IF EXISTS `accounts_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `total_raffles` int(11) DEFAULT 0,
  `accs` int(11) DEFAULT 0,
  `my_total_raffles` int(11) DEFAULT 0,
  `hidden_total_raffles` tinyint(1) DEFAULT 0,
  `hidden_my_total_raffles` tinyint(1) DEFAULT 0,
  `hidden_accs` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts_stats`
--

LOCK TABLES `accounts_stats` WRITE;
/*!40000 ALTER TABLE `accounts_stats` DISABLE KEYS */;
INSERT INTO `accounts_stats` VALUES (12,0,0,0,0,0,0),(16,0,0,0,0,0,0),(17,0,0,0,0,0,0),(18,0,0,0,0,0,0),(19,0,0,0,0,0,0),(20,0,0,0,0,0,0),(21,0,0,0,0,0,0),(22,0,0,0,0,0,0),(23,0,0,0,0,0,0),(24,0,0,0,0,0,0),(25,0,0,0,0,0,0);
/*!40000 ALTER TABLE `accounts_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rafflep`
--

DROP TABLE IF EXISTS `rafflep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rafflep` (
  `userId` int(11) NOT NULL,
  `code` varchar(999) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rafflep`
--

LOCK TABLES `rafflep` WRITE;
/*!40000 ALTER TABLE `rafflep` DISABLE KEYS */;
INSERT INTO `rafflep` VALUES (18,'Everit-Jhon/99694108',4),(18,'test-tes test/87645475',6),(19,'Everit-Jhon/127545611',17),(19,'test-tes test/87645475',18),(19,'Everit-Jhon/103378096',19),(19,'Everit-Jhon/106412717',20),(19,'Everit-Jhon/114433123',21),(19,'test-tes test/122000956',22),(18,'test-tes test/18893851',23);
/*!40000 ALTER TABLE `rafflep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raffles`
--

DROP TABLE IF EXISTS `raffles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `raffles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(999) NOT NULL,
  `main_pic` varchar(999) DEFAULT 'profilebanner.png',
  `title` varchar(999) NOT NULL,
  `pic1` varchar(999) DEFAULT NULL,
  `pic2` varchar(999) DEFAULT NULL,
  `pic3` varchar(999) DEFAULT NULL,
  `description` varchar(999) NOT NULL,
  `max_participants` int(11) NOT NULL,
  `prizeIsMoney` tinyint(1) NOT NULL,
  `max_winners` int(11) NOT NULL,
  `first_winner` int(11) DEFAULT NULL,
  `second_winner` int(11) DEFAULT NULL,
  `third_winner` int(11) DEFAULT NULL,
  `raffleIsActive` tinyint(1) DEFAULT 1,
  `prize` int(11) DEFAULT 0,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raffles`
--

LOCK TABLES `raffles` WRITE;
/*!40000 ALTER TABLE `raffles` DISABLE KEYS */;
INSERT INTO `raffles` VALUES (41,'test-tes test/122000956','profilebanner.png','Raffle by test','','','','this raffle consists in lorem ipsum im this raffle consists in lorem ipsum im this raffle consists in lorem ipsum im this raffle consists in lorem ipsum im .',2,1,1,19,NULL,NULL,1,300,18),(42,'test-tes test/87645475','profilebanner.png','ok title','','','','ok desc ok descok desc ok descok desc ok descok desc ok desc.',2,1,1,NULL,NULL,NULL,1,2588,18),(43,'Everit-Jhon/127545611','1662503867502_luck_favicon.png','Title','','','','description text texttext text text text text text texttext text text text text texttexttext text text text text texttexttext text text text text text',200,1,1,NULL,NULL,NULL,1,2500,19),(44,'Everit-Jhon/103378096','1662504227670_luck_wallpapersden.com_hd-cool-linux-terminal-hd_2560x1440.jpg','asdsdfg','','','','asfsdgsfsdgsdfasfsdgdfgsdfdsfsdgdgfsdfdsfgsdfsdgsdfgsdgbdgsdgfgsadbsdfgsdfbsdgfxcgsdgf',2,1,1,NULL,NULL,NULL,0,0,19),(45,'Everit-Jhon/106412717','1662504351713_luck_b931f2c8-4dd6-46cd-87f7-a2b69e052079b931f2c8-4dd6-46cd-87f7-a2b69e052079profile.webp','asdasfsfasdaf','','','','asjdklsdjgklsdjfklsdjgklsj asdalksjdkljas aslkdjasklfjklajfdklqwjfklsdjklfjaklfjkl askdj',2,1,1,NULL,NULL,NULL,1,0,19),(46,'Everit-Jhon/114433123','1662504722743_luck_kisspng-timer-clock-animation-clip-art-cartoon-microphone-5adaad32e8df44.3274375715242806269539.png','adasd','','','','asdasda',2,1,1,NULL,NULL,NULL,0,0,19),(47,'test-tes test/18893851','1665352401271_luck_ps0 (1).webp','Fasfu','','','','el ganador se gana una malteada fasfu',5,1,1,NULL,NULL,NULL,1,50,18);
/*!40000 ALTER TABLE `raffles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-10 15:33:41
