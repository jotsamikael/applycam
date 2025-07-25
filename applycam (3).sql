-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 20, 2025 at 05:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `applycam`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_sector`
--

CREATE TABLE `activity_sector` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_sector`
--

INSERT INTO `activity_sector` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `code`, `description`, `name`) VALUES
(1, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 1'),
(2, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 2'),
(3, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 3'),
(4, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 4'),
(5, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 5'),
(6, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 6'),
(7, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 7'),
(8, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 8'),
(9, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 9'),
(10, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 10'),
(11, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 11'),
(12, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 12'),
(13, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 13'),
(14, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 14'),
(15, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 15'),
(16, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 16'),
(17, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 17'),
(18, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 18'),
(19, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 19'),
(20, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Sector 20');

-- --------------------------------------------------------

--
-- Table structure for table `activity_sector_seq`
--

CREATE TABLE `activity_sector_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_sector_seq`
--

INSERT INTO `activity_sector_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `application_region` varchar(255) DEFAULT NULL,
  `application_year` varchar(255) DEFAULT NULL,
  `payment_receipt_url` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','DRAFT','INCOMPLETED','PAID','PENDING','READYTOPAY','REJECTED','VALIDATED') NOT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `speciality` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `application_region`, `application_year`, `payment_receipt_url`, `status`, `candidate_id`, `payment_id`, `session_id`, `speciality`) VALUES
(1, 0, '2025-07-20 14:04:06.000000', b'1', b'0', 0, '2025-07-20 15:23:02.000000', 'Region1', '2021', NULL, 'VALIDATED', 61, NULL, 1, 1),
(2, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region2', '2022', NULL, 'PAID', 62, NULL, 2, 2),
(3, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region3', '2023', NULL, 'PAID', 63, NULL, 3, 3),
(4, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region4', '2021', NULL, 'PAID', 64, NULL, 4, 4),
(5, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region5', '2022', NULL, 'PAID', 65, NULL, 5, 5),
(6, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region1', '2023', NULL, 'PAID', 66, NULL, 6, 6),
(7, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region2', '2021', NULL, 'PAID', 67, NULL, 7, 7),
(8, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region3', '2022', NULL, 'PAID', 68, NULL, 8, 8),
(9, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region4', '2023', NULL, 'PAID', 69, NULL, 9, 9),
(10, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region5', '2021', NULL, 'PAID', 70, NULL, 10, 10),
(11, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region1', '2022', NULL, 'PAID', 71, NULL, 11, 11),
(12, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region2', '2023', NULL, 'PAID', 72, NULL, 12, 12),
(13, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region3', '2021', NULL, 'PAID', 73, NULL, 13, 13),
(14, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region4', '2022', NULL, 'PAID', 74, NULL, 14, 14),
(15, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region5', '2023', NULL, 'PAID', 75, NULL, 15, 15),
(16, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region1', '2021', NULL, 'PAID', 76, NULL, 16, 16),
(17, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region2', '2022', NULL, 'PAID', 77, NULL, 17, 17),
(18, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region3', '2023', NULL, 'PAID', 78, NULL, 18, 18),
(19, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region4', '2021', NULL, 'PAID', 79, NULL, 19, 19),
(20, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Region5', '2022', NULL, 'PAID', 80, NULL, 20, 20);

-- --------------------------------------------------------

--
-- Table structure for table `application_seq`
--

CREATE TABLE `application_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application_seq`
--

INSERT INTO `application_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `center_course`
--

CREATE TABLE `center_course` (
  `trainin_center_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `center_history`
--

CREATE TABLE `center_history` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','DRAFT','INCOMPLETED','PAID','PENDING','READYTOPAY','REJECTED','VALIDATED') DEFAULT NULL,
  `training_center_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `center_history`
--

INSERT INTO `center_history` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `comment`, `status`, `training_center_id`) VALUES
(1, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 0', 'APPROVED', 1),
(2, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 1', 'APPROVED', 2),
(3, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 2', 'APPROVED', 3),
(4, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 3', 'APPROVED', 4),
(5, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 4', 'APPROVED', 5),
(6, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 5', 'APPROVED', 6),
(7, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 6', 'APPROVED', 7),
(8, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 7', 'APPROVED', 8),
(9, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 8', 'APPROVED', 9),
(10, 0, '2025-07-20 14:04:06.000000', b'1', b'0', 2, '2025-07-20 14:11:05.000000', '', 'DRAFT', 10),
(11, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 10', 'APPROVED', 11),
(12, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 11', 'APPROVED', 12),
(13, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 12', 'APPROVED', 13),
(14, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 13', 'APPROVED', 14),
(15, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 14', 'APPROVED', 15),
(16, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 15', 'APPROVED', 16),
(17, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 16', 'APPROVED', 17),
(18, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 17', 'APPROVED', 18),
(19, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 18', 'APPROVED', 19),
(20, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 'Historique validé 19', 'APPROVED', 20);

-- --------------------------------------------------------

--
-- Table structure for table `center_history_seq`
--

CREATE TABLE `center_history_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `center_history_seq`
--

INSERT INTO `center_history_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price_for_cqp` double NOT NULL,
  `activity_sector_id` bigint(20) DEFAULT NULL,
  `session_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `code`, `description`, `name`, `price_for_cqp`, `activity_sector_id`, `session_id`) VALUES
(1, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE1', 'Description for course 1', 'Course 1', 11000, NULL, NULL),
(2, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE2', 'Description for course 2', 'Course 2', 12000, NULL, NULL),
(3, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE3', 'Description for course 3', 'Course 3', 13000, NULL, NULL),
(4, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE4', 'Description for course 4', 'Course 4', 14000, NULL, NULL),
(5, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE5', 'Description for course 5', 'Course 5', 15000, NULL, NULL),
(6, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE6', 'Description for course 6', 'Course 6', 16000, NULL, NULL),
(7, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE7', 'Description for course 7', 'Course 7', 17000, NULL, NULL),
(8, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE8', 'Description for course 8', 'Course 8', 18000, NULL, NULL),
(9, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE9', 'Description for course 9', 'Course 9', 19000, NULL, NULL),
(10, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE10', 'Description for course 10', 'Course 10', 20000, NULL, NULL),
(11, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE11', 'Description for course 11', 'Course 11', 21000, NULL, NULL),
(12, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE12', 'Description for course 12', 'Course 12', 22000, NULL, NULL),
(13, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE13', 'Description for course 13', 'Course 13', 23000, NULL, NULL),
(14, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE14', 'Description for course 14', 'Course 14', 24000, NULL, NULL),
(15, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE15', 'Description for course 15', 'Course 15', 25000, NULL, NULL),
(16, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE16', 'Description for course 16', 'Course 16', 26000, NULL, NULL),
(17, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE17', 'Description for course 17', 'Course 17', 27000, NULL, NULL),
(18, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE18', 'Description for course 18', 'Course 18', 28000, NULL, NULL),
(19, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE19', 'Description for course 19', 'Course 19', 29000, NULL, NULL),
(20, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'CODE20', 'Description for course 20', 'Course 20', 30000, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `course_seq`
--

CREATE TABLE `course_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_seq`
--

INSERT INTO `course_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `exam_center`
--

CREATE TABLE `exam_center` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `division` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_center`
--

INSERT INTO `exam_center` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `capacity`, `division`, `name`, `region`) VALUES
(1, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 101, 'Division2', 'ExamCenter 1', 'Region2'),
(2, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 102, 'Division3', 'ExamCenter 2', 'Region3'),
(3, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 103, 'Division1', 'ExamCenter 3', 'Region4'),
(4, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 104, 'Division2', 'ExamCenter 4', 'Region5'),
(5, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 105, 'Division3', 'ExamCenter 5', 'Region1'),
(6, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 106, 'Division1', 'ExamCenter 6', 'Region2'),
(7, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 107, 'Division2', 'ExamCenter 7', 'Region3'),
(8, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 108, 'Division3', 'ExamCenter 8', 'Region4'),
(9, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 109, 'Division1', 'ExamCenter 9', 'Region5'),
(10, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 110, 'Division2', 'ExamCenter 10', 'Region1'),
(11, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 111, 'Division3', 'ExamCenter 11', 'Region2'),
(12, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 112, 'Division1', 'ExamCenter 12', 'Region3'),
(13, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 113, 'Division2', 'ExamCenter 13', 'Region4'),
(14, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 114, 'Division3', 'ExamCenter 14', 'Region5'),
(15, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 115, 'Division1', 'ExamCenter 15', 'Region1'),
(16, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 116, 'Division2', 'ExamCenter 16', 'Region2'),
(17, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 117, 'Division3', 'ExamCenter 17', 'Region3'),
(18, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 118, 'Division1', 'ExamCenter 18', 'Region4'),
(19, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 119, 'Division2', 'ExamCenter 19', 'Region5'),
(20, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, 120, 'Division3', 'ExamCenter 20', 'Region1');

-- --------------------------------------------------------

--
-- Table structure for table `exam_center_seq`
--

CREATE TABLE `exam_center_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_center_seq`
--

INSERT INTO `exam_center_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `has_schooled`
--

CREATE TABLE `has_schooled` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `end_year` date DEFAULT NULL,
  `start_year` date DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  `training_center_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `has_schooled`
--

INSERT INTO `has_schooled` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `end_year`, `start_year`, `candidate_id`, `training_center_id`) VALUES
(1, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2011-06-30', '2010-09-01', 61, 1),
(2, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2012-06-30', '2011-09-01', 62, 2),
(3, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2013-06-30', '2012-09-01', 63, 3),
(4, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2014-06-30', '2013-09-01', 64, 4),
(5, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2015-06-30', '2014-09-01', 65, 5),
(6, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2016-06-30', '2015-09-01', 66, 6),
(7, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2017-06-30', '2016-09-01', 67, 7),
(8, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2018-06-30', '2017-09-01', 68, 8),
(9, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2019-06-30', '2018-09-01', 69, 9),
(10, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2020-06-30', '2019-09-01', 70, 10),
(11, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2011-06-30', '2010-09-01', 71, 11),
(12, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2012-06-30', '2011-09-01', 72, 12),
(13, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2013-06-30', '2012-09-01', 73, 13),
(14, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2014-06-30', '2013-09-01', 74, 14),
(15, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2015-06-30', '2014-09-01', 75, 15),
(16, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2016-06-30', '2015-09-01', 76, 16),
(17, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2017-06-30', '2016-09-01', 77, 17),
(18, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2018-06-30', '2017-09-01', 78, 18),
(19, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2019-06-30', '2018-09-01', 79, 19),
(20, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, '2020-06-30', '2019-09-01', 80, 20);

-- --------------------------------------------------------

--
-- Table structure for table `has_schooled_seq`
--

CREATE TABLE `has_schooled_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `has_schooled_seq`
--

INSERT INTO `has_schooled_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `offers_speciality`
--

CREATE TABLE `offers_speciality` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `agreement` varchar(255) DEFAULT NULL,
  `speciality_id` bigint(20) DEFAULT NULL,
  `training_center_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offers_speciality`
--

INSERT INTO `offers_speciality` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `agreement`, `speciality_id`, `training_center_id`) VALUES
(1, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 1, 1),
(2, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 2, 2),
(3, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 3, 3),
(4, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 4, 4),
(5, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 5, 5),
(6, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 6, 6),
(7, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 7, 7),
(8, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 8, 8),
(9, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 9, 9),
(10, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 10, 10),
(11, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 11, 11),
(12, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 12, 12),
(13, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 13, 13),
(14, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 14, 14),
(15, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 15, 15),
(16, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 16, 16),
(17, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 17, 17),
(18, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 18, 18),
(19, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 19, 19),
(20, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 20, 20),
(21, 0, '2025-07-20 15:11:53.000000', b'0', b'0', 0, NULL, NULL, 21, 20);

-- --------------------------------------------------------

--
-- Table structure for table `offers_speciality_seq`
--

CREATE TABLE `offers_speciality_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offers_speciality_seq`
--

INSERT INTO `offers_speciality_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `amount` double NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `secret_code` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `amount`, `payment_method`, `secret_code`) VALUES
(1, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 10000, 'CASH', 100000),
(2, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 11000, 'CASH', 100001),
(3, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 12000, 'CASH', 100002),
(4, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 13000, 'CASH', 100003),
(5, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 14000, 'CASH', 100004),
(6, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 15000, 'CASH', 100005),
(7, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 16000, 'CASH', 100006),
(8, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 17000, 'CASH', 100007),
(9, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 18000, 'CASH', 100008),
(10, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 19000, 'CASH', 100009),
(11, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 20000, 'CASH', 100010),
(12, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 21000, 'CASH', 100011),
(13, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 22000, 'CASH', 100012),
(14, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 23000, 'CASH', 100013),
(15, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 24000, 'CASH', 100014),
(16, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 25000, 'CASH', 100015),
(17, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 26000, 'CASH', 100016),
(18, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 27000, 'CASH', 100017),
(19, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 28000, 'CASH', 100018),
(20, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, 29000, 'CASH', 100019);

-- --------------------------------------------------------

--
-- Table structure for table `payment_seq`
--

CREATE TABLE `payment_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_seq`
--

INSERT INTO `payment_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `role_entity`
--

CREATE TABLE `role_entity` (
  `id_role` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_entity`
--

INSERT INTO `role_entity` (`id_role`, `created_date`, `last_modified_date`, `name`) VALUES
(1, '2025-07-20 14:03:58.000000', NULL, 'ADMIN'),
(2, '2025-07-20 14:03:58.000000', NULL, 'PROMOTER'),
(3, '2025-07-20 14:03:58.000000', NULL, 'STAFF'),
(4, '2025-07-20 14:03:58.000000', NULL, 'USER'),
(5, '2025-07-20 14:03:58.000000', NULL, 'CANDIDATE');

-- --------------------------------------------------------

--
-- Table structure for table `role_entity_seq`
--

CREATE TABLE `role_entity_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_entity_seq`
--

INSERT INTO `role_entity_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `exam_type` varchar(255) DEFAULT NULL,
  `registration_end_date` date DEFAULT NULL,
  `registration_start_date` date DEFAULT NULL,
  `session_year` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `exam_date`, `exam_type`, `registration_end_date`, `registration_start_date`, `session_year`) VALUES
(1, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-21', 'DQP', '2025-08-20', '2025-07-20', '2022'),
(2, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-22', 'CQP', '2025-08-20', '2025-07-20', '2023'),
(3, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-23', 'DQP', '2025-08-20', '2025-07-20', '2021'),
(4, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-24', 'CQP', '2025-08-20', '2025-07-20', '2022'),
(5, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-25', 'DQP', '2025-08-20', '2025-07-20', '2023'),
(6, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-26', 'CQP', '2025-08-20', '2025-07-20', '2021'),
(7, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-27', 'DQP', '2025-08-20', '2025-07-20', '2022'),
(8, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-28', 'CQP', '2025-08-20', '2025-07-20', '2023'),
(9, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 41, '2025-07-20 16:00:39.000000', '2025-07-29', 'CQP', '2025-07-27', '2025-07-20', '2021'),
(10, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-30', 'CQP', '2025-08-20', '2025-07-20', '2022'),
(11, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-07-31', 'DQP', '2025-08-20', '2025-07-20', '2023'),
(12, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-01', 'CQP', '2025-08-20', '2025-07-20', '2021'),
(13, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-02', 'DQP', '2025-08-20', '2025-07-20', '2022'),
(14, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-03', 'CQP', '2025-08-20', '2025-07-20', '2023'),
(15, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-04', 'DQP', '2025-08-20', '2025-07-20', '2021'),
(16, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-05', 'CQP', '2025-08-20', '2025-07-20', '2022'),
(17, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-06', 'DQP', '2025-08-20', '2025-07-20', '2023'),
(18, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-07', 'CQP', '2025-08-20', '2025-07-20', '2021'),
(19, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-08', 'DQP', '2025-08-20', '2025-07-20', '2022'),
(20, 0, '2025-07-20 14:04:04.000000', b'1', b'0', 0, NULL, '2025-08-09', 'CQP', '2025-08-20', '2025-07-20', '2023');

-- --------------------------------------------------------

--
-- Table structure for table `session_seq`
--

CREATE TABLE `session_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session_seq`
--

INSERT INTO `session_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `speciality`
--

CREATE TABLE `speciality` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `dqp_price` double NOT NULL,
  `exam_type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `session_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `speciality`
--

INSERT INTO `speciality` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `code`, `description`, `dqp_price`, `exam_type`, `name`, `course_id`, `payment_id`, `session_id`) VALUES
(1, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP1', 'Description for speciality 1', 0, 'DQP', 'Speciality 1', NULL, NULL, NULL),
(2, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP2', 'Description for speciality 2', 0, 'CQP', 'Speciality 2', NULL, NULL, NULL),
(3, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP3', 'Description for speciality 3', 0, 'DQP', 'Speciality 3', NULL, NULL, NULL),
(4, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP4', 'Description for speciality 4', 0, 'CQP', 'Speciality 4', NULL, NULL, NULL),
(5, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP5', 'Description for speciality 5', 0, 'DQP', 'Speciality 5', NULL, NULL, NULL),
(6, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP6', 'Description for speciality 6', 0, 'CQP', 'Speciality 6', NULL, NULL, NULL),
(7, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP7', 'Description for speciality 7', 0, 'DQP', 'Speciality 7', NULL, NULL, NULL),
(8, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP8', 'Description for speciality 8', 0, 'CQP', 'Speciality 8', NULL, NULL, NULL),
(9, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP9', 'Description for speciality 9', 0, 'DQP', 'Speciality 9', NULL, NULL, NULL),
(10, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP10', 'Description for speciality 10', 0, 'CQP', 'Speciality 10', NULL, NULL, NULL),
(11, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP11', 'Description for speciality 11', 0, 'DQP', 'Speciality 11', NULL, NULL, NULL),
(12, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP12', 'Description for speciality 12', 0, 'CQP', 'Speciality 12', NULL, NULL, NULL),
(13, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP13', 'Description for speciality 13', 0, 'DQP', 'Speciality 13', NULL, NULL, NULL),
(14, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP14', 'Description for speciality 14', 0, 'CQP', 'Speciality 14', NULL, NULL, NULL),
(15, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP15', 'Description for speciality 15', 0, 'DQP', 'Speciality 15', NULL, NULL, NULL),
(16, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP16', 'Description for speciality 16', 0, 'CQP', 'Speciality 16', NULL, NULL, NULL),
(17, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP17', 'Description for speciality 17', 0, 'DQP', 'Speciality 17', NULL, NULL, NULL),
(18, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP18', 'Description for speciality 18', 0, 'CQP', 'Speciality 18', NULL, NULL, NULL),
(19, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP19', 'Description for speciality 19', 0, 'DQP', 'Speciality 19', NULL, NULL, NULL),
(20, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, 'SP20', 'Description for speciality 20', 0, 'CQP', 'Speciality 20', NULL, NULL, NULL),
(21, 1, '2025-07-20 15:11:53.000000', b'0', b'1', 0, '2025-07-20 15:11:53.000000', NULL, 'sdfsdf', 0, 'CQP', 'Info', 11, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `speciality_seq`
--

CREATE TABLE `speciality_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `speciality_seq`
--

INSERT INTO `speciality_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `speciality_subject`
--

CREATE TABLE `speciality_subject` (
  `speciality_id` bigint(20) NOT NULL,
  `subject_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `code`, `description`, `name`) VALUES
(1, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 1'),
(2, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 2'),
(3, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 3'),
(4, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 4'),
(5, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 5'),
(6, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 6'),
(7, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 7'),
(8, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 8'),
(9, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 9'),
(10, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 10'),
(11, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 11'),
(12, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 12'),
(13, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 13'),
(14, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 14'),
(15, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 15'),
(16, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 16'),
(17, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 17'),
(18, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 18'),
(19, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 19'),
(20, 0, '2025-07-20 14:04:06.000000', b'0', b'0', 0, NULL, NULL, NULL, 'Subject 20');

-- --------------------------------------------------------

--
-- Table structure for table `subjects_seq`
--

CREATE TABLE `subjects_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects_seq`
--

INSERT INTO `subjects_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `token_entity`
--

CREATE TABLE `token_entity` (
  `id_token` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `validated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `token_entity`
--

INSERT INTO `token_entity` (`id_token`, `created_at`, `expires_at`, `token`, `validated_at`, `user_id`) VALUES
(1, NULL, NULL, 'token1', NULL, 2),
(2, NULL, NULL, 'token2', NULL, 3),
(3, NULL, NULL, 'token3', NULL, 4),
(4, NULL, NULL, 'token4', NULL, 5),
(5, NULL, NULL, 'token5', NULL, 6),
(6, NULL, NULL, 'token6', NULL, 7),
(7, NULL, NULL, 'token7', NULL, 8),
(8, NULL, NULL, 'token8', NULL, 9),
(9, NULL, NULL, 'token9', NULL, 10),
(10, NULL, NULL, 'token10', NULL, 11),
(11, NULL, NULL, 'token11', NULL, 12),
(12, NULL, NULL, 'token12', NULL, 13),
(13, NULL, NULL, 'token13', NULL, 14),
(14, NULL, NULL, 'token14', NULL, 15),
(15, NULL, NULL, 'token15', NULL, 16),
(16, NULL, NULL, 'token16', NULL, 17),
(17, NULL, NULL, 'token17', NULL, 18),
(18, NULL, NULL, 'token18', NULL, 19),
(19, NULL, NULL, 'token19', NULL, 20),
(20, NULL, NULL, 'token20', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `token_entity_seq`
--

CREATE TABLE `token_entity_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `token_entity_seq`
--

INSERT INTO `token_entity_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `training_center`
--

CREATE TABLE `training_center` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `internal_regulation_file_url` varchar(255) DEFAULT NULL,
  `localisation_file_url` varchar(255) DEFAULT NULL,
  `signature_letter_url` varchar(255) DEFAULT NULL,
  `acronym` varchar(255) DEFAULT NULL,
  `agreement_file_url` varchar(255) DEFAULT NULL,
  `agreement_number` varchar(255) DEFAULT NULL,
  `agreement_status` varbinary(255) DEFAULT NULL,
  `center_age` double NOT NULL,
  `center_email` varchar(255) DEFAULT NULL,
  `center_phone` varchar(255) DEFAULT NULL,
  `center_type` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `division` varchar(255) DEFAULT NULL,
  `end_date_of_agreement` date DEFAULT NULL,
  `full_address` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `is_center_present_candidate_for_cqp` bit(1) DEFAULT NULL,
  `is_center_present_candidate_for_dqp` bit(1) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `start_date_of_agreement` date DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `promoter_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training_center`
--

INSERT INTO `training_center` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `internal_regulation_file_url`, `localisation_file_url`, `signature_letter_url`, `acronym`, `agreement_file_url`, `agreement_number`, `agreement_status`, `center_age`, `center_email`, `center_phone`, `center_type`, `city`, `division`, `end_date_of_agreement`, `full_address`, `full_name`, `is_center_present_candidate_for_cqp`, `is_center_present_candidate_for_dqp`, `region`, `start_date_of_agreement`, `website`, `promoter_id`) VALUES
(1, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement1.pdf', '/uploads/centers/localisation1.pdf', '/uploads/centers/signature1.pdf', 'C1', '/uploads/centers/agreement1.pdf', 'AG3001', NULL, 6, 'center1@test.com', '67700001', 'Public', 'Ville2', 'Division2', '2025-12-31', NULL, 'Center 1', b'0', b'1', 'Region2', '2015-01-01', 'https://center1.com', 22),
(2, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement2.pdf', '/uploads/centers/localisation2.pdf', '/uploads/centers/signature2.pdf', 'C2', '/uploads/centers/agreement2.pdf', 'AG3002', NULL, 7, 'center2@test.com', '67700002', 'Privé', 'Ville3', 'Division3', '2025-12-31', NULL, 'Center 2', b'1', b'0', 'Region3', '2015-01-01', 'https://center2.com', 23),
(3, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement3.pdf', '/uploads/centers/localisation3.pdf', '/uploads/centers/signature3.pdf', 'C3', '/uploads/centers/agreement3.pdf', 'AG3003', NULL, 8, 'center3@test.com', '67700003', 'Public', 'Ville4', 'Division1', '2025-12-31', NULL, 'Center 3', b'0', b'1', 'Region4', '2015-01-01', 'https://center3.com', 24),
(4, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement4.pdf', '/uploads/centers/localisation4.pdf', '/uploads/centers/signature4.pdf', 'C4', '/uploads/centers/agreement4.pdf', 'AG3004', NULL, 9, 'center4@test.com', '67700004', 'Privé', 'Ville5', 'Division2', '2025-12-31', NULL, 'Center 4', b'1', b'0', 'Region5', '2015-01-01', 'https://center4.com', 25),
(5, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement5.pdf', '/uploads/centers/localisation5.pdf', '/uploads/centers/signature5.pdf', 'C5', '/uploads/centers/agreement5.pdf', 'AG3005', NULL, 10, 'center5@test.com', '67700005', 'Public', 'Ville1', 'Division3', '2025-12-31', NULL, 'Center 5', b'0', b'1', 'Region1', '2015-01-01', 'https://center5.com', 26),
(6, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement6.pdf', '/uploads/centers/localisation6.pdf', '/uploads/centers/signature6.pdf', 'C6', '/uploads/centers/agreement6.pdf', 'AG3006', NULL, 11, 'center6@test.com', '67700006', 'Privé', 'Ville2', 'Division1', '2025-12-31', NULL, 'Center 6', b'1', b'0', 'Region2', '2015-01-01', 'https://center6.com', 27),
(7, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement7.pdf', '/uploads/centers/localisation7.pdf', '/uploads/centers/signature7.pdf', 'C7', '/uploads/centers/agreement7.pdf', 'AG3007', NULL, 12, 'center7@test.com', '67700007', 'Public', 'Ville3', 'Division2', '2025-12-31', NULL, 'Center 7', b'0', b'1', 'Region3', '2015-01-01', 'https://center7.com', 28),
(8, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement8.pdf', '/uploads/centers/localisation8.pdf', '/uploads/centers/signature8.pdf', 'C8', '/uploads/centers/agreement8.pdf', 'AG3008', NULL, 13, 'center8@test.com', '67700008', 'Privé', 'Ville4', 'Division3', '2025-12-31', NULL, 'Center 8', b'1', b'0', 'Region4', '2015-01-01', 'https://center8.com', 29),
(9, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement9.pdf', '/uploads/centers/localisation9.pdf', '/uploads/centers/signature9.pdf', 'C9', '/uploads/centers/agreement9.pdf', 'AG3009', NULL, 14, 'center9@test.com', '67700009', 'Public', 'Ville5', 'Division1', '2025-12-31', NULL, 'Center 9', b'0', b'1', 'Region5', '2015-01-01', 'https://center9.com', 30),
(10, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement10.pdf', '/uploads/centers/localisation10.pdf', '/uploads/centers/signature10.pdf', 'C10', '/uploads/centers/agreement10.pdf', 'AG3010', NULL, 15, 'center10@test.com', '677000010', 'Privé', 'Ville1', 'Division2', '2025-12-31', NULL, 'Center 10', b'1', b'0', 'Region1', '2015-01-01', 'https://center10.com', 31),
(11, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement11.pdf', '/uploads/centers/localisation11.pdf', '/uploads/centers/signature11.pdf', 'C11', '/uploads/centers/agreement11.pdf', 'AG3011', NULL, 16, 'center11@test.com', '677000011', 'Public', 'Ville2', 'Division3', '2025-12-31', NULL, 'Center 11', b'0', b'1', 'Region2', '2015-01-01', 'https://center11.com', 32),
(12, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement12.pdf', '/uploads/centers/localisation12.pdf', '/uploads/centers/signature12.pdf', 'C12', '/uploads/centers/agreement12.pdf', 'AG3012', NULL, 17, 'center12@test.com', '677000012', 'Privé', 'Ville3', 'Division1', '2025-12-31', NULL, 'Center 12', b'1', b'0', 'Region3', '2015-01-01', 'https://center12.com', 33),
(13, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement13.pdf', '/uploads/centers/localisation13.pdf', '/uploads/centers/signature13.pdf', 'C13', '/uploads/centers/agreement13.pdf', 'AG3013', NULL, 18, 'center13@test.com', '677000013', 'Public', 'Ville4', 'Division2', '2025-12-31', NULL, 'Center 13', b'0', b'1', 'Region4', '2015-01-01', 'https://center13.com', 34),
(14, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement14.pdf', '/uploads/centers/localisation14.pdf', '/uploads/centers/signature14.pdf', 'C14', '/uploads/centers/agreement14.pdf', 'AG3014', NULL, 19, 'center14@test.com', '677000014', 'Privé', 'Ville5', 'Division3', '2025-12-31', NULL, 'Center 14', b'1', b'0', 'Region5', '2015-01-01', 'https://center14.com', 35),
(15, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement15.pdf', '/uploads/centers/localisation15.pdf', '/uploads/centers/signature15.pdf', 'C15', '/uploads/centers/agreement15.pdf', 'AG3015', NULL, 20, 'center15@test.com', '677000015', 'Public', 'Ville1', 'Division1', '2025-12-31', NULL, 'Center 15', b'0', b'1', 'Region1', '2015-01-01', 'https://center15.com', 36),
(16, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement16.pdf', '/uploads/centers/localisation16.pdf', '/uploads/centers/signature16.pdf', 'C16', '/uploads/centers/agreement16.pdf', 'AG3016', NULL, 21, 'center16@test.com', '677000016', 'Privé', 'Ville2', 'Division2', '2025-12-31', NULL, 'Center 16', b'1', b'0', 'Region2', '2015-01-01', 'https://center16.com', 37),
(17, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement17.pdf', '/uploads/centers/localisation17.pdf', '/uploads/centers/signature17.pdf', 'C17', '/uploads/centers/agreement17.pdf', 'AG3017', NULL, 22, 'center17@test.com', '677000017', 'Public', 'Ville3', 'Division3', '2025-12-31', NULL, 'Center 17', b'0', b'1', 'Region3', '2015-01-01', 'https://center17.com', 38),
(18, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement18.pdf', '/uploads/centers/localisation18.pdf', '/uploads/centers/signature18.pdf', 'C18', '/uploads/centers/agreement18.pdf', 'AG3018', NULL, 23, 'center18@test.com', '677000018', 'Privé', 'Ville4', 'Division1', '2025-12-31', NULL, 'Center 18', b'1', b'0', 'Region4', '2015-01-01', 'https://center18.com', 39),
(19, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement19.pdf', '/uploads/centers/localisation19.pdf', '/uploads/centers/signature19.pdf', 'C19', '/uploads/centers/agreement19.pdf', 'AG3019', NULL, 24, 'center19@test.com', '677000019', 'Public', 'Ville5', 'Division2', '2025-12-31', NULL, 'Center 19', b'0', b'1', 'Region5', '2015-01-01', 'https://center19.com', 40),
(20, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, '/uploads/centers/reglement20.pdf', '/uploads/centers/localisation20.pdf', '/uploads/centers/signature20.pdf', 'C20', '/uploads/centers/agreement20.pdf', 'AG3020', NULL, 25, 'center20@test.com', '677000020', 'Privé', 'Ville1', 'Division3', '2025-12-31', NULL, 'Center 20', b'1', b'0', 'Region1', '2015-01-01', 'https://center20.com', 21);

-- --------------------------------------------------------

--
-- Table structure for table `training_center_seq`
--

CREATE TABLE `training_center_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training_center_seq`
--

INSERT INTO `training_center_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `_campus`
--

CREATE TABLE `_campus` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `quarter` varchar(255) DEFAULT NULL,
  `town` varchar(255) DEFAULT NULL,
  `x_coor` double DEFAULT NULL,
  `y_coor` double DEFAULT NULL,
  `id_training_center` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_campus`
--

INSERT INTO `_campus` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `capacity`, `name`, `quarter`, `town`, `x_coor`, `y_coor`, `id_training_center`) VALUES
(1, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 1', NULL, NULL, NULL, NULL, 2),
(2, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 2', NULL, NULL, NULL, NULL, 3),
(3, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 3', NULL, NULL, NULL, NULL, 4),
(4, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 4', NULL, NULL, NULL, NULL, 5),
(5, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 5', NULL, NULL, NULL, NULL, 6),
(6, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 6', NULL, NULL, NULL, NULL, 7),
(7, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 7', NULL, NULL, NULL, NULL, 8),
(8, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 8', NULL, NULL, NULL, NULL, 9),
(9, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 9', NULL, NULL, NULL, NULL, 10),
(10, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 10', NULL, NULL, NULL, NULL, 11),
(11, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 11', NULL, NULL, NULL, NULL, 12),
(12, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 12', NULL, NULL, NULL, NULL, 13),
(13, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 13', NULL, NULL, NULL, NULL, 14),
(14, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 14', NULL, NULL, NULL, NULL, 15),
(15, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 15', NULL, NULL, NULL, NULL, 16),
(16, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 16', NULL, NULL, NULL, NULL, 17),
(17, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 17', NULL, NULL, NULL, NULL, 18),
(18, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 18', NULL, NULL, NULL, NULL, 19),
(19, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 19', NULL, NULL, NULL, NULL, 20),
(20, 0, '2025-07-20 14:04:04.000000', b'0', b'0', 0, NULL, NULL, 'Campus 20', NULL, NULL, NULL, NULL, 1),
(21, 21, '2025-07-20 15:11:02.000000', b'0', b'0', 21, NULL, 345, 'Etok koss', 'SIMBOCK', 'Yaounde', 0, 0, 20);

-- --------------------------------------------------------

--
-- Table structure for table `_campus_seq`
--

CREATE TABLE `_campus_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_campus_seq`
--

INSERT INTO `_campus_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Table structure for table `_candidate`
--

CREATE TABLE `_candidate` (
  `birth_certificate_url` varchar(255) DEFAULT NULL,
  `content_status` tinyint(4) DEFAULT NULL,
  `cv_url` varchar(255) DEFAULT NULL,
  `department_of_origin` varchar(255) DEFAULT NULL,
  `father_full_name` varchar(255) DEFAULT NULL,
  `father_profession` varchar(255) DEFAULT NULL,
  `financial_justification_url` varchar(255) DEFAULT NULL,
  `financial_ressource` varchar(255) DEFAULT NULL,
  `formation_mode` varchar(255) DEFAULT NULL,
  `free_candidate` bit(1) NOT NULL,
  `highest_diplomat_url` varchar(255) DEFAULT NULL,
  `highest_school_level` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `learning_language` varchar(255) DEFAULT NULL,
  `letter_url` varchar(255) DEFAULT NULL,
  `matrimonial_situation` varchar(255) DEFAULT NULL,
  `mother_full_name` varchar(255) DEFAULT NULL,
  `mother_profession` varchar(255) DEFAULT NULL,
  `national_id_card_url` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `number_of_kid` int(11) NOT NULL,
  `old_applyance_url` varchar(255) DEFAULT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `region_origins` varchar(255) DEFAULT NULL,
  `repeat_candidate` bit(1) NOT NULL,
  `stage_certificate_url` varchar(255) DEFAULT NULL,
  `town_of_residence` varchar(255) DEFAULT NULL,
  `id_user` bigint(20) NOT NULL,
  `exam_center_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_candidate`
--

INSERT INTO `_candidate` (`birth_certificate_url`, `content_status`, `cv_url`, `department_of_origin`, `father_full_name`, `father_profession`, `financial_justification_url`, `financial_ressource`, `formation_mode`, `free_candidate`, `highest_diplomat_url`, `highest_school_level`, `language`, `learning_language`, `letter_url`, `matrimonial_situation`, `mother_full_name`, `mother_profession`, `national_id_card_url`, `nationality`, `number_of_kid`, `old_applyance_url`, `place_of_birth`, `profile_picture_url`, `region_origins`, `repeat_candidate`, `stage_certificate_url`, `town_of_residence`, `id_user`, `exam_center_id`) VALUES
('/uploads/users/1002/birth1.pdf', 3, '/uploads/users/1002/cv1.pdf', 'Département2', 'Père1', 'ProfessionPère1', '/uploads/users/1002/justif1.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome1.pdf', 'Bac+1', 'Anglais', 'Anglais', '/uploads/users/1002/lettre1.pdf', 'Marié', 'Mère1', 'ProfessionMère1', '/uploads/users/1002/cni1.pdf', 'Camerounaise', 1, '/uploads/users/1002/old1.pdf', 'Ville2', '/uploads/users/1002/photo1.png', 'Region2', b'0', '/uploads/users/1002/stage1.pdf', 'Ville2', 61, 1),
('/uploads/users/1002/birth2.pdf', 3, '/uploads/users/1002/cv2.pdf', 'Département3', 'Père2', 'ProfessionPère2', '/uploads/users/1002/justif2.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome2.pdf', 'Bac+2', 'Français', 'Français', '/uploads/users/1002/lettre2.pdf', 'Célibataire', 'Mère2', 'ProfessionMère2', '/uploads/users/1002/cni2.pdf', 'Camerounaise', 2, '/uploads/users/1002/old2.pdf', 'Ville3', '/uploads/users/1002/photo2.png', 'Region3', b'0', '/uploads/users/1002/stage2.pdf', 'Ville3', 62, 3),
('/uploads/users/1002/birth3.pdf', 3, '/uploads/users/1002/cv3.pdf', 'Département4', 'Père3', 'ProfessionPère3', '/uploads/users/1002/justif3.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome3.pdf', 'Bac+3', 'Anglais', 'Anglais', '/uploads/users/1002/lettre3.pdf', 'Marié', 'Mère3', 'ProfessionMère3', '/uploads/users/1002/cni3.pdf', 'Camerounaise', 3, '/uploads/users/1002/old3.pdf', 'Ville4', '/uploads/users/1002/photo3.png', 'Region4', b'1', '/uploads/users/1002/stage3.pdf', 'Ville4', 63, 4),
('/uploads/users/1002/birth4.pdf', 3, '/uploads/users/1002/cv4.pdf', 'Département5', 'Père4', 'ProfessionPère4', '/uploads/users/1002/justif4.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome4.pdf', 'Bac+4', 'Français', 'Français', '/uploads/users/1002/lettre4.pdf', 'Célibataire', 'Mère4', 'ProfessionMère4', '/uploads/users/1002/cni4.pdf', 'Camerounaise', 0, '/uploads/users/1002/old4.pdf', 'Ville5', '/uploads/users/1002/photo4.png', 'Region5', b'0', '/uploads/users/1002/stage4.pdf', 'Ville5', 64, 5),
('/uploads/users/1002/birth5.pdf', 3, '/uploads/users/1002/cv5.pdf', 'Département6', 'Père5', 'ProfessionPère5', '/uploads/users/1002/justif5.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome5.pdf', 'Bac+0', 'Anglais', 'Anglais', '/uploads/users/1002/lettre5.pdf', 'Marié', 'Mère5', 'ProfessionMère5', '/uploads/users/1002/cni5.pdf', 'Camerounaise', 1, '/uploads/users/1002/old5.pdf', 'Ville1', '/uploads/users/1002/photo5.png', 'Region1', b'0', '/uploads/users/1002/stage5.pdf', 'Ville1', 65, 6),
('/uploads/users/1002/birth6.pdf', 3, '/uploads/users/1002/cv6.pdf', 'Département7', 'Père6', 'ProfessionPère6', '/uploads/users/1002/justif6.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome6.pdf', 'Bac+1', 'Français', 'Français', '/uploads/users/1002/lettre6.pdf', 'Célibataire', 'Mère6', 'ProfessionMère6', '/uploads/users/1002/cni6.pdf', 'Camerounaise', 2, '/uploads/users/1002/old6.pdf', 'Ville2', '/uploads/users/1002/photo6.png', 'Region2', b'1', '/uploads/users/1002/stage6.pdf', 'Ville2', 66, 7),
('/uploads/users/1002/birth7.pdf', 3, '/uploads/users/1002/cv7.pdf', 'Département8', 'Père7', 'ProfessionPère7', '/uploads/users/1002/justif7.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome7.pdf', 'Bac+2', 'Anglais', 'Anglais', '/uploads/users/1002/lettre7.pdf', 'Marié', 'Mère7', 'ProfessionMère7', '/uploads/users/1002/cni7.pdf', 'Camerounaise', 3, '/uploads/users/1002/old7.pdf', 'Ville3', '/uploads/users/1002/photo7.png', 'Region3', b'0', '/uploads/users/1002/stage7.pdf', 'Ville3', 67, 8),
('/uploads/users/1002/birth8.pdf', 3, '/uploads/users/1002/cv8.pdf', 'Département9', 'Père8', 'ProfessionPère8', '/uploads/users/1002/justif8.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome8.pdf', 'Bac+3', 'Français', 'Français', '/uploads/users/1002/lettre8.pdf', 'Célibataire', 'Mère8', 'ProfessionMère8', '/uploads/users/1002/cni8.pdf', 'Camerounaise', 0, '/uploads/users/1002/old8.pdf', 'Ville4', '/uploads/users/1002/photo8.png', 'Region4', b'0', '/uploads/users/1002/stage8.pdf', 'Ville4', 68, 9),
('/uploads/users/1002/birth9.pdf', 3, '/uploads/users/1002/cv9.pdf', 'Département10', 'Père9', 'ProfessionPère9', '/uploads/users/1002/justif9.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome9.pdf', 'Bac+4', 'Anglais', 'Anglais', '/uploads/users/1002/lettre9.pdf', 'Marié', 'Mère9', 'ProfessionMère9', '/uploads/users/1002/cni9.pdf', 'Camerounaise', 1, '/uploads/users/1002/old9.pdf', 'Ville5', '/uploads/users/1002/photo9.png', 'Region5', b'1', '/uploads/users/1002/stage9.pdf', 'Ville5', 69, 10),
('/uploads/users/1002/birth10.pdf', 3, '/uploads/users/1002/cv10.pdf', 'Département1', 'Père10', 'ProfessionPère10', '/uploads/users/1002/justif10.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome10.pdf', 'Bac+0', 'Français', 'Français', '/uploads/users/1002/lettre10.pdf', 'Célibataire', 'Mère10', 'ProfessionMère10', '/uploads/users/1002/cni10.pdf', 'Camerounaise', 2, '/uploads/users/1002/old10.pdf', 'Ville1', '/uploads/users/1002/photo10.png', 'Region1', b'0', '/uploads/users/1002/stage10.pdf', 'Ville1', 70, 11),
('/uploads/users/1002/birth11.pdf', 3, '/uploads/users/1002/cv11.pdf', 'Département2', 'Père11', 'ProfessionPère11', '/uploads/users/1002/justif11.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome11.pdf', 'Bac+1', 'Anglais', 'Anglais', '/uploads/users/1002/lettre11.pdf', 'Marié', 'Mère11', 'ProfessionMère11', '/uploads/users/1002/cni11.pdf', 'Camerounaise', 3, '/uploads/users/1002/old11.pdf', 'Ville2', '/uploads/users/1002/photo11.png', 'Region2', b'0', '/uploads/users/1002/stage11.pdf', 'Ville2', 71, 12),
('/uploads/users/1002/birth12.pdf', 3, '/uploads/users/1002/cv12.pdf', 'Département3', 'Père12', 'ProfessionPère12', '/uploads/users/1002/justif12.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome12.pdf', 'Bac+2', 'Français', 'Français', '/uploads/users/1002/lettre12.pdf', 'Célibataire', 'Mère12', 'ProfessionMère12', '/uploads/users/1002/cni12.pdf', 'Camerounaise', 0, '/uploads/users/1002/old12.pdf', 'Ville3', '/uploads/users/1002/photo12.png', 'Region3', b'1', '/uploads/users/1002/stage12.pdf', 'Ville3', 72, 13),
('/uploads/users/1002/birth13.pdf', 3, '/uploads/users/1002/cv13.pdf', 'Département4', 'Père13', 'ProfessionPère13', '/uploads/users/1002/justif13.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome13.pdf', 'Bac+3', 'Anglais', 'Anglais', '/uploads/users/1002/lettre13.pdf', 'Marié', 'Mère13', 'ProfessionMère13', '/uploads/users/1002/cni13.pdf', 'Camerounaise', 1, '/uploads/users/1002/old13.pdf', 'Ville4', '/uploads/users/1002/photo13.png', 'Region4', b'0', '/uploads/users/1002/stage13.pdf', 'Ville4', 73, 14),
('/uploads/users/1002/birth14.pdf', 3, '/uploads/users/1002/cv14.pdf', 'Département5', 'Père14', 'ProfessionPère14', '/uploads/users/1002/justif14.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome14.pdf', 'Bac+4', 'Français', 'Français', '/uploads/users/1002/lettre14.pdf', 'Célibataire', 'Mère14', 'ProfessionMère14', '/uploads/users/1002/cni14.pdf', 'Camerounaise', 2, '/uploads/users/1002/old14.pdf', 'Ville5', '/uploads/users/1002/photo14.png', 'Region5', b'0', '/uploads/users/1002/stage14.pdf', 'Ville5', 74, 15),
('/uploads/users/1002/birth15.pdf', 3, '/uploads/users/1002/cv15.pdf', 'Département6', 'Père15', 'ProfessionPère15', '/uploads/users/1002/justif15.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome15.pdf', 'Bac+0', 'Anglais', 'Anglais', '/uploads/users/1002/lettre15.pdf', 'Marié', 'Mère15', 'ProfessionMère15', '/uploads/users/1002/cni15.pdf', 'Camerounaise', 3, '/uploads/users/1002/old15.pdf', 'Ville1', '/uploads/users/1002/photo15.png', 'Region1', b'1', '/uploads/users/1002/stage15.pdf', 'Ville1', 75, 16),
('/uploads/users/1002/birth16.pdf', 3, '/uploads/users/1002/cv16.pdf', 'Département7', 'Père16', 'ProfessionPère16', '/uploads/users/1002/justif16.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome16.pdf', 'Bac+1', 'Français', 'Français', '/uploads/users/1002/lettre16.pdf', 'Célibataire', 'Mère16', 'ProfessionMère16', '/uploads/users/1002/cni16.pdf', 'Camerounaise', 0, '/uploads/users/1002/old16.pdf', 'Ville2', '/uploads/users/1002/photo16.png', 'Region2', b'0', '/uploads/users/1002/stage16.pdf', 'Ville2', 76, 17),
('/uploads/users/1002/birth17.pdf', 3, '/uploads/users/1002/cv17.pdf', 'Département8', 'Père17', 'ProfessionPère17', '/uploads/users/1002/justif17.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome17.pdf', 'Bac+2', 'Anglais', 'Anglais', '/uploads/users/1002/lettre17.pdf', 'Marié', 'Mère17', 'ProfessionMère17', '/uploads/users/1002/cni17.pdf', 'Camerounaise', 1, '/uploads/users/1002/old17.pdf', 'Ville3', '/uploads/users/1002/photo17.png', 'Region3', b'0', '/uploads/users/1002/stage17.pdf', 'Ville3', 77, 18),
('/uploads/users/1002/birth18.pdf', 3, '/uploads/users/1002/cv18.pdf', 'Département9', 'Père18', 'ProfessionPère18', '/uploads/users/1002/justif18.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome18.pdf', 'Bac+3', 'Français', 'Français', '/uploads/users/1002/lettre18.pdf', 'Célibataire', 'Mère18', 'ProfessionMère18', '/uploads/users/1002/cni18.pdf', 'Camerounaise', 2, '/uploads/users/1002/old18.pdf', 'Ville4', '/uploads/users/1002/photo18.png', 'Region4', b'1', '/uploads/users/1002/stage18.pdf', 'Ville4', 78, 19),
('/uploads/users/1002/birth19.pdf', 3, '/uploads/users/1002/cv19.pdf', 'Département10', 'Père19', 'ProfessionPère19', '/uploads/users/1002/justif19.pdf', 'Parent', 'Distanciel', b'0', '/uploads/users/1002/diplome19.pdf', 'Bac+4', 'Anglais', 'Anglais', '/uploads/users/1002/lettre19.pdf', 'Marié', 'Mère19', 'ProfessionMère19', '/uploads/users/1002/cni19.pdf', 'Camerounaise', 3, '/uploads/users/1002/old19.pdf', 'Ville5', '/uploads/users/1002/photo19.png', 'Region5', b'0', '/uploads/users/1002/stage19.pdf', 'Ville5', 79, 20),
('/uploads/users/1002/birth20.pdf', 3, '/uploads/users/1002/cv20.pdf', 'Département1', 'Père20', 'ProfessionPère20', '/uploads/users/1002/justif20.pdf', 'Parent', 'Présentiel', b'1', '/uploads/users/1002/diplome20.pdf', 'Bac+0', 'Français', 'Français', '/uploads/users/1002/lettre20.pdf', 'Célibataire', 'Mère20', 'ProfessionMère20', '/uploads/users/1002/cni20.pdf', 'Camerounaise', 0, '/uploads/users/1002/old20.pdf', 'Ville1', '/uploads/users/1002/photo20.png', 'Region1', b'0', '/uploads/users/1002/stage20.pdf', 'Ville1', 80, 1);

-- --------------------------------------------------------

--
-- Table structure for table `_promoter`
--

CREATE TABLE `_promoter` (
  `photo_url` varchar(255) DEFAULT NULL,
  `school_level` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `national_id_card_url` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `id_user` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_promoter`
--

INSERT INTO `_promoter` (`photo_url`, `school_level`, `address`, `national_id_card_url`, `nationality`, `id_user`) VALUES
('/uploads/users/1002/photo1.png', NULL, NULL, NULL, NULL, 21),
('/uploads/users/1002/photo2.png', NULL, NULL, NULL, NULL, 22),
('/uploads/users/1002/photo3.png', NULL, NULL, NULL, NULL, 23),
('/uploads/users/1002/photo4.png', NULL, NULL, NULL, NULL, 24),
('/uploads/users/1002/photo5.png', NULL, NULL, NULL, NULL, 25),
('/uploads/users/1002/photo6.png', NULL, NULL, NULL, NULL, 26),
('/uploads/users/1002/photo7.png', NULL, NULL, NULL, NULL, 27),
('/uploads/users/1002/photo8.png', NULL, NULL, NULL, NULL, 28),
('/uploads/users/1002/photo9.png', NULL, NULL, NULL, NULL, 29),
('/uploads/users/1002/photo10.png', NULL, NULL, NULL, NULL, 30),
('/uploads/users/1002/photo11.png', NULL, NULL, NULL, NULL, 31),
('/uploads/users/1002/photo12.png', NULL, NULL, NULL, NULL, 32),
('/uploads/users/1002/photo13.png', NULL, NULL, NULL, NULL, 33),
('/uploads/users/1002/photo14.png', NULL, NULL, NULL, NULL, 34),
('/uploads/users/1002/photo15.png', NULL, NULL, NULL, NULL, 35),
('/uploads/users/1002/photo16.png', NULL, NULL, NULL, NULL, 36),
('/uploads/users/1002/photo17.png', NULL, NULL, NULL, NULL, 37),
('/uploads/users/1002/photo18.png', NULL, NULL, NULL, NULL, 38),
('/uploads/users/1002/photo19.png', NULL, NULL, NULL, NULL, 39),
('/uploads/users/1002/photo20.png', NULL, NULL, NULL, NULL, 40);

-- --------------------------------------------------------

--
-- Table structure for table `_staff`
--

CREATE TABLE `_staff` (
  `position_name` varchar(255) DEFAULT NULL,
  `id_user` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_staff`
--

INSERT INTO `_staff` (`position_name`, `id_user`) VALUES
(NULL, 41),
(NULL, 42),
(NULL, 43),
(NULL, 44),
(NULL, 45),
(NULL, 46),
(NULL, 47),
(NULL, 48),
(NULL, 49),
(NULL, 50),
(NULL, 51),
(NULL, 52),
(NULL, 53),
(NULL, 54),
(NULL, 55),
(NULL, 56),
(NULL, 57),
(NULL, 58),
(NULL, 59),
(NULL, 60);

-- --------------------------------------------------------

--
-- Table structure for table `_user`
--

CREATE TABLE `_user` (
  `id_user` bigint(20) NOT NULL,
  `account_locked` bit(1) NOT NULL,
  `actived` bit(1) NOT NULL,
  `archived` bit(1) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `last_modified_by` bigint(20) NOT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `national_id_number` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_user`
--

INSERT INTO `_user` (`id_user`, `account_locked`, `actived`, `archived`, `created_by`, `created_date`, `date_of_birth`, `email`, `enabled`, `firstname`, `last_modified_by`, `last_modified_date`, `lastname`, `national_id_number`, `password`, `phone_number`, `sex`) VALUES
(1, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1991-02-02', 'user1@test.com', b'1', 'User1', 0, NULL, 'Test1', 'ID1001', '$2a$10$T3l3d1aspRElfA4du4kGu.kfVUpD8oeNAbO.xwtvNpVYWr3C71LDi', '69000001', 'F'),
(2, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1992-03-03', 'user2@test.com', b'1', 'User2', 0, NULL, 'Test2', 'ID1002', '$2a$10$BgGgCNChg4yzLwOVW559Z.zeRvEvUy27WClGVDcxPvXTrj29PeOwi', '69000002', 'M'),
(3, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1993-04-04', 'user3@test.com', b'1', 'User3', 0, NULL, 'Test3', 'ID1003', '$2a$10$0iCLKVkWqb2UzCcku7W2ju7b6ic5TU/Lrch4Kx7NjJu3SFivYBVle', '69000003', 'F'),
(4, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1994-05-05', 'user4@test.com', b'1', 'User4', 0, NULL, 'Test4', 'ID1004', '$2a$10$a.cS6YTGX/dNcmYv1YpdQOM1DxLJ/Hg/CK5yN7pEFjXdpR7MHxfSG', '69000004', 'M'),
(5, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1995-06-06', 'user5@test.com', b'1', 'User5', 0, NULL, 'Test5', 'ID1005', '$2a$10$uDGKqSYZgTsbiJqqd/CKtOp9qknqxjpThqZTXaB02D5SemIl7VLh6', '69000005', 'F'),
(6, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1996-07-07', 'user6@test.com', b'1', 'User6', 0, NULL, 'Test6', 'ID1006', '$2a$10$v3flMsv.ehF2tV2xY28L6udbn5F8yXJt9VCRzsL59HZ.u4dd1BzUK', '69000006', 'M'),
(7, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1997-08-08', 'user7@test.com', b'1', 'User7', 0, NULL, 'Test7', 'ID1007', '$2a$10$r.0YxsJUjyYT0NF5AG6qwOTRbNJnGUGHLC63ABvJKJZcliINbvYvq', '69000007', 'F'),
(8, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1998-09-09', 'user8@test.com', b'1', 'User8', 0, NULL, 'Test8', 'ID1008', '$2a$10$VW2Msdak5uHJYY8CkejLieBaI.3buFcMXcyOhAYtfcU1nqXVxqU8e', '69000008', 'M'),
(9, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1999-10-10', 'user9@test.com', b'1', 'User9', 0, NULL, 'Test9', 'ID1009', '$2a$10$Zh78N14hkh3IfPnp/9GpceEwjTZ7yWmTdrpPEzccJFhw.1xY.h1aW', '69000009', 'F'),
(10, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1990-11-11', 'user10@test.com', b'1', 'User10', 0, NULL, 'Test10', 'ID1010', '$2a$10$P3MFHffswm4iLHEyu/FBF.dv50t0Z3bVJ3iYYTAXBanJP5yAhwQd.', '690000010', 'M'),
(11, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1991-12-12', 'user11@test.com', b'1', 'User11', 0, NULL, 'Test11', 'ID1011', '$2a$10$m7BLXJGB8bT8UeDs.dc7U.neupWWyV8gpvnYxIb1xKs/mjsf114iW', '690000011', 'F'),
(12, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1992-01-13', 'user12@test.com', b'1', 'User12', 0, NULL, 'Test12', 'ID1012', '$2a$10$c1bt/.wj/IAGNgieALJZt.XG/FBQ5djOxOeP7ll9qSesCev4ilFa2', '690000012', 'M'),
(13, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1993-02-14', 'user13@test.com', b'1', 'User13', 0, NULL, 'Test13', 'ID1013', '$2a$10$DpuHlO95bR3H9hTVoM6yUuiICi/EjzF52CMl2Bw4KA3ZujeKvg5uG', '690000013', 'F'),
(14, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1994-03-15', 'user14@test.com', b'1', 'User14', 0, NULL, 'Test14', 'ID1014', '$2a$10$kFOBLWM6NGXAlPFgPfYFyuip./sLjodJwY67P8qBlGDAlUWQs//I6', '690000014', 'M'),
(15, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1995-04-16', 'user15@test.com', b'1', 'User15', 0, NULL, 'Test15', 'ID1015', '$2a$10$xKLtMTpyLUruEF4LTxbtYOEVvMQboFWaomGNKt3hBYqOw0io/xNz6', '690000015', 'F'),
(16, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1996-05-17', 'user16@test.com', b'1', 'User16', 0, NULL, 'Test16', 'ID1016', '$2a$10$BoUXcpu.Mvu7TkiGEFozG.SSsv6ORi5FMA.VNdPLLDn6H4QKgUXvW', '690000016', 'M'),
(17, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1997-06-18', 'user17@test.com', b'1', 'User17', 0, NULL, 'Test17', 'ID1017', '$2a$10$TtFMRk8Mh/HphVKOi3u1DOhXLttfzYYvG5elFq1GsV3Nvl6mKkqgy', '690000017', 'F'),
(18, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1998-07-19', 'user18@test.com', b'1', 'User18', 0, NULL, 'Test18', 'ID1018', '$2a$10$PgTSPh6TQPyLp/c.hcj6G.GaBxC53bwT6DDy3.V2pgbQs/9kaK4V2', '690000018', 'M'),
(19, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1999-08-20', 'user19@test.com', b'1', 'User19', 0, NULL, 'Test19', 'ID1019', '$2a$10$iPmcSMkqcUXz1BC0Iv0ld.yYBMgMv4gCjlvr.D7M.ENQlC7.zg2H.', '690000019', 'F'),
(20, b'0', b'1', b'0', 0, '2025-07-20 14:04:00.000000', '1990-09-21', 'user20@test.com', b'1', 'User20', 0, NULL, 'Test20', 'ID1020', '$2a$10$39oqCEn6oBjENMdfsQ2FwuggCjdRBTY0/CTnPOcAs26pfvdszqUcK', '690000020', 'M'),
(21, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1981-02-02', 'promoter1@test.com', b'1', 'Promoter1', 0, NULL, 'Lastname1', 'PID2001', '$2a$10$Q1s13QJap4hmNUxoIxTDhuNyxRxCSuwk3KXYh7BvsOlFWX8yr2Iea', '69900001', 'F'),
(22, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1982-03-03', 'promoter2@test.com', b'1', 'Promoter2', 0, NULL, 'Lastname2', 'PID2002', '$2a$10$rKyAfJcIqC5ZfO4FoL/rVenzkWyMigzXGdJVPhQZey31FVr7PvlPa', '69900002', 'M'),
(23, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1983-04-04', 'promoter3@test.com', b'1', 'Promoter3', 0, NULL, 'Lastname3', 'PID2003', '$2a$10$ddLGtI4oXRN27uaqzn4Wh.f/.ElGqMpjsiEUAY.H.gpYnCEC4EPYG', '69900003', 'F'),
(24, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1984-05-05', 'promoter4@test.com', b'1', 'Promoter4', 0, NULL, 'Lastname4', 'PID2004', '$2a$10$Q0OtqUxmw6pDzvCvDdhX4OIvzuVE79W.AMejoZCiRhghLovcaPlla', '69900004', 'M'),
(25, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1985-06-06', 'promoter5@test.com', b'1', 'Promoter5', 0, NULL, 'Lastname5', 'PID2005', '$2a$10$0MlNoMRJvjFs.E2H1iz5I.3IrsMwdz9yPp/CsperUnBSOMowuhG4i', '69900005', 'F'),
(26, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1986-07-07', 'promoter6@test.com', b'1', 'Promoter6', 0, NULL, 'Lastname6', 'PID2006', '$2a$10$Bx08U6Qit6IfKOD/OSynuuiHC.vhEYzl40nWLDfENwZKRjR/mto6i', '69900006', 'M'),
(27, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1987-08-08', 'promoter7@test.com', b'1', 'Promoter7', 0, NULL, 'Lastname7', 'PID2007', '$2a$10$40v0XxvahyttE7XyXWjmLe/Cu1wrd6E1TL1ls/rfKd2d6CMpA6EC.', '69900007', 'F'),
(28, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1988-09-09', 'promoter8@test.com', b'1', 'Promoter8', 0, NULL, 'Lastname8', 'PID2008', '$2a$10$PPr01AsW4fC4OxcH/BfvPO.z7PeTh52XAnIidKgq19RxhWdZVciva', '69900008', 'M'),
(29, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1989-10-10', 'promoter9@test.com', b'1', 'Promoter9', 0, NULL, 'Lastname9', 'PID2009', '$2a$10$hHwUUDjgl208bdTHiRu..eWeeIWvqgd0Y3XXV2Oa09BqnRLKEyOzq', '69900009', 'F'),
(30, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1980-11-11', 'promoter10@test.com', b'1', 'Promoter10', 0, NULL, 'Lastname10', 'PID2010', '$2a$10$HwICgJLXzMN3AdswtT/jWuhG9JLx2CZsBVS3cuLa8ysDhUXfUv.ya', '699000010', 'M'),
(31, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1981-12-12', 'promoter11@test.com', b'1', 'Promoter11', 0, NULL, 'Lastname11', 'PID2011', '$2a$10$iCfRYLCl6wW1jn.YdmEqiutrE7nG5rxiCpJaLtJ6fPX5Q30juew2y', '699000011', 'F'),
(32, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1982-01-13', 'promoter12@test.com', b'1', 'Promoter12', 0, NULL, 'Lastname12', 'PID2012', '$2a$10$z2J5GELSFqxOaNCKdtl7Du3wpPpNksropVQOSTp9iHDP/tz.WxAM2', '699000012', 'M'),
(33, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1983-02-14', 'promoter13@test.com', b'1', 'Promoter13', 0, NULL, 'Lastname13', 'PID2013', '$2a$10$Uici6wn9B87irJgrH0IbQuE250MJ66G2VCs67XNpF/zNRlG3s7IDe', '699000013', 'F'),
(34, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1984-03-15', 'promoter14@test.com', b'1', 'Promoter14', 0, NULL, 'Lastname14', 'PID2014', '$2a$10$gg62v8tKXNluJ66BZTVG6eFNTPEQF49otGnr7vxsT1G/.cmVUoSJ6', '699000014', 'M'),
(35, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1985-04-16', 'promoter15@test.com', b'1', 'Promoter15', 0, NULL, 'Lastname15', 'PID2015', '$2a$10$WbwHLaT.7xhjZrVRQibKTeBfj.u.zGziAlBF11cqUXhrExRPku5Ka', '699000015', 'F'),
(36, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1986-05-17', 'promoter16@test.com', b'1', 'Promoter16', 0, NULL, 'Lastname16', 'PID2016', '$2a$10$0Mc1BA0glPjiEsnMlcQcPuG4MNFHcWGdb61IGliMarldsC1fgHGV2', '699000016', 'M'),
(37, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1987-06-18', 'promoter17@test.com', b'1', 'Promoter17', 0, NULL, 'Lastname17', 'PID2017', '$2a$10$IZtKAxK97W40c57069c1s.BPQ9rM1ffEB0344PaDWZ1UZrENf0i1q', '699000017', 'F'),
(38, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1988-07-19', 'promoter18@test.com', b'1', 'Promoter18', 0, NULL, 'Lastname18', 'PID2018', '$2a$10$p6MJTulBOjQ4sxzp3XxLd.lQOzaYu1RLcho4OY90Zv1iyqthmQ9BG', '699000018', 'M'),
(39, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1989-08-20', 'promoter19@test.com', b'1', 'Promoter19', 0, NULL, 'Lastname19', 'PID2019', '$2a$10$FJcWwlw2BKdCwq0IOJZ3uuvVrXfWwfhBV85v9uDk7EIjWstCfsH.6', '699000019', 'F'),
(40, b'0', b'1', b'0', 0, '2025-07-20 14:04:02.000000', '1980-09-21', 'promoter20@test.com', b'1', 'Promoter20', 0, NULL, 'Lastname20', 'PID2020', '$2a$10$R3RmRejpD0D.bzam/s6n4uvGxTpRfmvqPfg92Xmy/DWiIiah28sGy', '699000020', 'M'),
(41, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1986-02-02', 'staff1@test.com', b'1', 'Staff1', 0, NULL, 'Lastname1', 'SID3001', '$2a$10$C4iOsfJ1ipf5OrrXfj6Gq.zJ6za9ogmfoIyLS7CVL0K1A6CCnDqoa', '68800001', 'F'),
(42, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1987-03-03', 'staff2@test.com', b'1', 'Staff2', 0, NULL, 'Lastname2', 'SID3002', '$2a$10$i6FmQRrBExgmTZJnoHdqWuB/eDELrXcEZwJvx6l90Qiy9cm.Y4Df6', '68800002', 'M'),
(43, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1988-04-04', 'staff3@test.com', b'1', 'Staff3', 0, NULL, 'Lastname3', 'SID3003', '$2a$10$e8ESPusgTZzC7fa6i57vP.gGpfkwpGrRLpcsd.tf.Ha/CiLHj8lFS', '68800003', 'F'),
(44, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1989-05-05', 'staff4@test.com', b'1', 'Staff4', 0, NULL, 'Lastname4', 'SID3004', '$2a$10$sjpxEijOaoFglvFOiA5yoeiTn0cQMuE42NxMJ87BZCk0d/HWs8WCK', '68800004', 'M'),
(45, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1990-06-06', 'staff5@test.com', b'1', 'Staff5', 0, NULL, 'Lastname5', 'SID3005', '$2a$10$UIbLeWm7LfUTrPfsA68UK.FCQ3DtvMlzJNB59TnXULJkF208U2laO', '68800005', 'F'),
(46, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1991-07-07', 'staff6@test.com', b'1', 'Staff6', 0, NULL, 'Lastname6', 'SID3006', '$2a$10$gU7PXj3jbmwp1hMjl2Wkne2vfTfDX7MLDVFmMwguwcuz0tHcrpKCa', '68800006', 'M'),
(47, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1992-08-08', 'staff7@test.com', b'1', 'Staff7', 0, NULL, 'Lastname7', 'SID3007', '$2a$10$ijkUmYNWWoc6cGxxOuK0I.N8tJIOd.ILuLHBNVANjbGpq1/SnRRPq', '68800007', 'F'),
(48, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1993-09-09', 'staff8@test.com', b'1', 'Staff8', 0, NULL, 'Lastname8', 'SID3008', '$2a$10$cR2FLbfPnhgw7BZ5tbLS4eKxBS90QQlyUjuoSiKg.zKgQwsoJjABO', '68800008', 'M'),
(49, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1994-10-10', 'staff9@test.com', b'1', 'Staff9', 0, NULL, 'Lastname9', 'SID3009', '$2a$10$2ke16ecEMruNqqbr.whOyeHguLfueyxmSidDKJd2JcPoHMva49pma', '68800009', 'F'),
(50, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1985-11-11', 'staff10@test.com', b'1', 'Staff10', 0, NULL, 'Lastname10', 'SID3010', '$2a$10$eGsw.1ZaSOfWoE02dsGjZeqbeusxxYbYSV0.03OPNZV/iiXgLtFWm', '688000010', 'M'),
(51, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1986-12-12', 'staff11@test.com', b'1', 'Staff11', 0, NULL, 'Lastname11', 'SID3011', '$2a$10$C90T6O3mfvZmahwKr5lUS.OCs7smXQYRS4Uu4OzMoAEpniDQoTADm', '688000011', 'F'),
(52, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1987-01-13', 'staff12@test.com', b'1', 'Staff12', 0, NULL, 'Lastname12', 'SID3012', '$2a$10$KscgT33FQfbueLb8Bhj/UOtKWyWYgxPErUARmDtxCEnqtnKeqC6XC', '688000012', 'M'),
(53, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1988-02-14', 'staff13@test.com', b'1', 'Staff13', 0, NULL, 'Lastname13', 'SID3013', '$2a$10$DJrgJ9PdS9a3.EvTwfVUuua.5j2fPIL7ARUALvpxUQazlTERcTvlC', '688000013', 'F'),
(54, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1989-03-15', 'staff14@test.com', b'1', 'Staff14', 0, NULL, 'Lastname14', 'SID3014', '$2a$10$.2./juw.kX3FLibJe37fge8jXV7ZgO04Tz90hGdIo.aDKa2ZmXX7a', '688000014', 'M'),
(55, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1990-04-16', 'staff15@test.com', b'1', 'Staff15', 0, NULL, 'Lastname15', 'SID3015', '$2a$10$kaKz0VAf7V8dExzcskDxguXA2WqIXqiSGKTPlANNxYPvltKqg.m/O', '688000015', 'F'),
(56, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1991-05-17', 'staff16@test.com', b'1', 'Staff16', 0, NULL, 'Lastname16', 'SID3016', '$2a$10$JmZl68YYBTtXdzU8U5adVuKNB2lzt9vJ4eQ/3r8TKDUeY/jArzwZe', '688000016', 'M'),
(57, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1992-06-18', 'staff17@test.com', b'1', 'Staff17', 0, NULL, 'Lastname17', 'SID3017', '$2a$10$UF2ly4Jk5hA7z3ikzENgNeXyueR8xAIX6KGZX4PllhFPDvkLXE1.6', '688000017', 'F'),
(58, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1993-07-19', 'staff18@test.com', b'1', 'Staff18', 0, NULL, 'Lastname18', 'SID3018', '$2a$10$ZZLql0BcLTblQGFXXxlouet5gCrg4tKYS.pkDu3JXdeucTUGihiGm', '688000018', 'M'),
(59, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1994-08-20', 'staff19@test.com', b'1', 'Staff19', 0, NULL, 'Lastname19', 'SID3019', '$2a$10$UpZBDJpJpscNlPX1RiSzq.iN8I6bHTDDVJjkhSFBjognFNAgXYtby', '688000019', 'F'),
(60, b'0', b'1', b'0', 0, '2025-07-20 14:04:04.000000', '1985-09-21', 'staff20@test.com', b'1', 'Staff20', 0, NULL, 'Lastname20', 'SID3020', '$2a$10$a4h3ovsbAKyt5rzyAKb.I.W2554t08qTGWHIm8hR4hO9NtHP.Qlwy', '688000020', 'M'),
(61, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1996-02-02', 'candidate1@test.com', b'1', 'Candidate1', 0, '2025-07-20 15:23:02.000000', 'Lastname1', 'CID4001', '$2a$10$8K2Uthk1iSNNirQ1Z28yAOKq1ay7D93AdhGSIKJQH7JHbey/3ujhS', '65500001', 'F'),
(62, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1997-03-03', 'candidate2@test.com', b'1', 'Candidate2', 0, NULL, 'Lastname2', 'CID4002', '$2a$10$ciU9nQRVI.62tdoGDCN6g.C8CKY6S.WKr1NNc7gBSdPfafH1gahQq', '65500002', 'M'),
(63, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1998-04-04', 'candidate3@test.com', b'1', 'Candidate3', 0, NULL, 'Lastname3', 'CID4003', '$2a$10$kmUrSAw2UwohOYIUqCu2POAZOgIQjl2HvYT4lnOzLdf9KsNARjOCa', '65500003', 'F'),
(64, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1999-05-05', 'candidate4@test.com', b'1', 'Candidate4', 0, NULL, 'Lastname4', 'CID4004', '$2a$10$N8vOZOEtm/vP8wsfaFEhZ.dbHdNJBwTT27Cdx7pLDFXFOtCurU3iG', '65500004', 'M'),
(65, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2000-06-06', 'candidate5@test.com', b'1', 'Candidate5', 0, NULL, 'Lastname5', 'CID4005', '$2a$10$GMPJgS1GNg2m2/KluHwRLOqrCg9tYHYX2vgacZL.rZIVvnRjQzq/6', '65500005', 'F'),
(66, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2001-07-07', 'candidate6@test.com', b'1', 'Candidate6', 0, NULL, 'Lastname6', 'CID4006', '$2a$10$AJG5AD12xvN/NA7Xp8Svq.iOvuMEsBq8ENtytfzBwekzKZ22jG9Gi', '65500006', 'M'),
(67, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2002-08-08', 'candidate7@test.com', b'1', 'Candidate7', 0, NULL, 'Lastname7', 'CID4007', '$2a$10$18qK8TBQse.Nzojdgm2v5.wE9jKa3so6ozw3Z/ihQa.cYPBd8ecdW', '65500007', 'F'),
(68, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2003-09-09', 'candidate8@test.com', b'1', 'Candidate8', 0, NULL, 'Lastname8', 'CID4008', '$2a$10$H.AQTpVnNz.B7bNtmUC.g.cNo7si232fVG70qMgdSc65qusR5Yn5i', '65500008', 'M'),
(69, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2004-10-10', 'candidate9@test.com', b'1', 'Candidate9', 0, NULL, 'Lastname9', 'CID4009', '$2a$10$gCKFo8o.97vgzaeIWTwM1.keNgDw.DU0QJjonQPz/Sm6nKLkq0VkK', '65500009', 'F'),
(70, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1995-11-11', 'candidate10@test.com', b'1', 'Candidate10', 0, NULL, 'Lastname10', 'CID4010', '$2a$10$eWCrwpeSRWYbo2BzrIBrCODciCz32GaM7C3BLA4tRwnqitXTIwoZO', '655000010', 'M'),
(71, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1996-12-12', 'candidate11@test.com', b'1', 'Candidate11', 0, NULL, 'Lastname11', 'CID4011', '$2a$10$BBZcGjYPz77IpT6LyGM.2uyWYOKI4HScQixtTaLjlXBgBtYOLXNIS', '655000011', 'F'),
(72, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1997-01-13', 'candidate12@test.com', b'1', 'Candidate12', 0, NULL, 'Lastname12', 'CID4012', '$2a$10$0u2FOJISPXe8Dl5pnek2EO3CqBwN0AZb4xCYvLqp7rGF/32HMlNty', '655000012', 'M'),
(73, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1998-02-14', 'candidate13@test.com', b'1', 'Candidate13', 0, NULL, 'Lastname13', 'CID4013', '$2a$10$2iNlKMy5ysA5vbjpzQQYK.3SPoXYeq7gFvrNCuaQwNqZQLfSohECy', '655000013', 'F'),
(74, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1999-03-15', 'candidate14@test.com', b'1', 'Candidate14', 0, NULL, 'Lastname14', 'CID4014', '$2a$10$uMmtw9eRBKGW0XI.Z1pi8OHnHryx/jur/4Ck/us7iERoUtoEtec6u', '655000014', 'M'),
(75, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2000-04-16', 'candidate15@test.com', b'1', 'Candidate15', 0, NULL, 'Lastname15', 'CID4015', '$2a$10$cTZE0wqsBEpnwlR7UyIKpefsUiEaaMnZKhWSvTFPvjYiw4Aymbhsy', '655000015', 'F'),
(76, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2001-05-17', 'candidate16@test.com', b'1', 'Candidate16', 0, NULL, 'Lastname16', 'CID4016', '$2a$10$GZ9BFIgLsur7RTYSDcVOAedmnAEXdjWogHW81JGo8VJmfJ.zRXH5S', '655000016', 'M'),
(77, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2002-06-18', 'candidate17@test.com', b'1', 'Candidate17', 0, NULL, 'Lastname17', 'CID4017', '$2a$10$Fj7P935RCjDzlcIWHVdwxur8gRKyN1mQT8pwQEVpRBgf6xEbv5SGm', '655000017', 'F'),
(78, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2003-07-19', 'candidate18@test.com', b'1', 'Candidate18', 0, NULL, 'Lastname18', 'CID4018', '$2a$10$s8RgED544c/PMU3Plw0Kk.iwRM42PuW3giS703RakWmF5rUsQs3gu', '655000018', 'M'),
(79, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '2004-08-20', 'candidate19@test.com', b'1', 'Candidate19', 0, NULL, 'Lastname19', 'CID4019', '$2a$10$puyjjtTFpwJRQ6PY6F2Rq.d17pN8qPaDFQoyAtbP0.0MYKxyQ4Q8C', '655000019', 'F'),
(80, b'0', b'1', b'0', 0, '2025-07-20 14:04:06.000000', '1995-09-21', 'candidate20@test.com', b'1', 'Candidate20', 0, NULL, 'Lastname20', 'CID4020', '$2a$10$whSP6lGLtQAGs2nBVEBS/.LMjAyq2qvEL9UAoSAk8pMT/kXFjpvFC', '655000020', 'M');

-- --------------------------------------------------------

--
-- Table structure for table `_user_roles`
--

CREATE TABLE `_user_roles` (
  `users_id_user` bigint(20) NOT NULL,
  `roles_id_role` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_user_roles`
--

INSERT INTO `_user_roles` (`users_id_user`, `roles_id_role`) VALUES
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1),
(6, 2),
(7, 3),
(8, 4),
(9, 5),
(10, 1),
(11, 2),
(12, 3),
(13, 4),
(14, 5),
(15, 1),
(16, 2),
(17, 3),
(18, 4),
(19, 5),
(20, 1),
(21, 2),
(22, 2),
(23, 2),
(24, 2),
(25, 2),
(26, 2),
(27, 2),
(28, 2),
(29, 2),
(30, 2),
(31, 2),
(32, 2),
(33, 2),
(34, 2),
(35, 2),
(36, 2),
(37, 2),
(38, 2),
(39, 2),
(40, 2),
(41, 3),
(42, 3),
(43, 3),
(44, 3),
(45, 3),
(46, 3),
(47, 3),
(48, 3),
(49, 3),
(50, 3),
(51, 3),
(52, 3),
(53, 3),
(54, 3),
(55, 3),
(56, 3),
(57, 3),
(58, 3),
(59, 3),
(60, 3);

-- --------------------------------------------------------

--
-- Table structure for table `_user_seq`
--

CREATE TABLE `_user_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `_user_seq`
--

INSERT INTO `_user_seq` (`next_val`) VALUES
(151);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_sector`
--
ALTER TABLE `activity_sector`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_53guewf2nppgo5dmwkm6teski` (`name`);

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_j3eaaryl35wbfvoofy3o4w9sg` (`payment_id`),
  ADD KEY `FK1v8a934gsu7u84hwljoo4deth` (`candidate_id`),
  ADD KEY `FK8rstblo3t5van3irir5siv6km` (`session_id`),
  ADD KEY `FKm55c4lqy005l611lpvtxq0kpw` (`speciality`);

--
-- Indexes for table `center_course`
--
ALTER TABLE `center_course`
  ADD KEY `FK4sauk5ku6s1dky1pqjqks629f` (`course_id`),
  ADD KEY `FKqx4xyx075taisqxec1ytrpitx` (`trainin_center_id`);

--
-- Indexes for table `center_history`
--
ALTER TABLE `center_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_dik0wsd2lc4u2npx8yd9gj3ku` (`training_center_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_4xqvdpkafb91tt3hsb67ga3fj` (`name`),
  ADD KEY `FKewdq24tkef57o22a5tl32m7dn` (`activity_sector_id`),
  ADD KEY `FKlake7yd6w21k9r7qd45r65lyg` (`session_id`);

--
-- Indexes for table `exam_center`
--
ALTER TABLE `exam_center`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_a1wto9517qcj701xt7s14n9dm` (`name`);

--
-- Indexes for table `has_schooled`
--
ALTER TABLE `has_schooled`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKklh31b1eq09gpd95gjsfa4mq3` (`candidate_id`),
  ADD KEY `FKcrjkkghsk1hu95vcpd61d5lq8` (`training_center_id`);

--
-- Indexes for table `offers_speciality`
--
ALTER TABLE `offers_speciality`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5c1tx9h1i3lj79vd2akfx335q` (`speciality_id`),
  ADD KEY `FKac9ytcnkqor9vvmnhqdup5efn` (`training_center_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_entity`
--
ALTER TABLE `role_entity`
  ADD PRIMARY KEY (`id_role`),
  ADD UNIQUE KEY `UK_2uqxlfg1dlwv0mtewrokr23ou` (`name`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `speciality`
--
ALTER TABLE `speciality`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_8qj7x0ghabtyv3102vy037tg5` (`name`),
  ADD UNIQUE KEY `UK_mqtpo6pmhj7320fdp9eetjq4m` (`payment_id`),
  ADD KEY `FK9kb42rotxijan6bpf4hub45ih` (`course_id`),
  ADD KEY `FKi6v5f7thgi314uywaelqdd3rg` (`session_id`);

--
-- Indexes for table `speciality_subject`
--
ALTER TABLE `speciality_subject`
  ADD KEY `FK407i3gbuh690x227thx6c03oe` (`subject_id`),
  ADD KEY `FKi1h4260k9cra32fo5a8u3shpf` (`speciality_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_rg7x1lyii7kdyycw98d45vep5` (`code`),
  ADD UNIQUE KEY `UK_aodt3utnw0lsov4k9ta88dbpr` (`name`);

--
-- Indexes for table `token_entity`
--
ALTER TABLE `token_entity`
  ADD PRIMARY KEY (`id_token`),
  ADD KEY `FKsoupqu80xk7x0qsmdhnla950s` (`user_id`);

--
-- Indexes for table `training_center`
--
ALTER TABLE `training_center`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_torod3lkshpme5guoj2xwgdrx` (`acronym`),
  ADD UNIQUE KEY `UK_nkws0cj37dygqr7tltf5maop1` (`agreement_number`),
  ADD UNIQUE KEY `UK_439wu540jlajft5are2ko2cwe` (`center_email`),
  ADD KEY `FKe4h4g0ed9jetvu7lwi9bogpps` (`promoter_id`);

--
-- Indexes for table `_campus`
--
ALTER TABLE `_campus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKkumvr9pu487b976pwvsnhbmvi` (`id_training_center`);

--
-- Indexes for table `_candidate`
--
ALTER TABLE `_candidate`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `FK2c23m266b42mg1g5b69fdf72o` (`exam_center_id`);

--
-- Indexes for table `_promoter`
--
ALTER TABLE `_promoter`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `_staff`
--
ALTER TABLE `_staff`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `_user`
--
ALTER TABLE `_user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `UK_k11y3pdtsrjgy8w9b6q4bjwrx` (`email`),
  ADD UNIQUE KEY `UK_cwnk11b5hby4hdd4dfo3ppvaq` (`national_id_number`),
  ADD UNIQUE KEY `UK_buoitwamy4goeykc8n0r8b5jd` (`phone_number`);

--
-- Indexes for table `_user_roles`
--
ALTER TABLE `_user_roles`
  ADD KEY `FK4l65f01tr3klo5wj30o4yl4so` (`roles_id_role`),
  ADD KEY `FKtpyt0qjubno38k3k3c6u7dkje` (`users_id_user`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `FK1v8a934gsu7u84hwljoo4deth` FOREIGN KEY (`candidate_id`) REFERENCES `_candidate` (`id_user`),
  ADD CONSTRAINT `FK8rstblo3t5van3irir5siv6km` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FKgaf7vjcic425k30jb6i8h4sg9` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`),
  ADD CONSTRAINT `FKm55c4lqy005l611lpvtxq0kpw` FOREIGN KEY (`speciality`) REFERENCES `speciality` (`id`);

--
-- Constraints for table `center_course`
--
ALTER TABLE `center_course`
  ADD CONSTRAINT `FK4sauk5ku6s1dky1pqjqks629f` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FKqx4xyx075taisqxec1ytrpitx` FOREIGN KEY (`trainin_center_id`) REFERENCES `training_center` (`id`);

--
-- Constraints for table `center_history`
--
ALTER TABLE `center_history`
  ADD CONSTRAINT `FK9eyvc20pojvtlmqkl3bxr6u9e` FOREIGN KEY (`training_center_id`) REFERENCES `training_center` (`id`);

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `FKewdq24tkef57o22a5tl32m7dn` FOREIGN KEY (`activity_sector_id`) REFERENCES `activity_sector` (`id`),
  ADD CONSTRAINT `FKlake7yd6w21k9r7qd45r65lyg` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Constraints for table `has_schooled`
--
ALTER TABLE `has_schooled`
  ADD CONSTRAINT `FKcrjkkghsk1hu95vcpd61d5lq8` FOREIGN KEY (`training_center_id`) REFERENCES `training_center` (`id`),
  ADD CONSTRAINT `FKklh31b1eq09gpd95gjsfa4mq3` FOREIGN KEY (`candidate_id`) REFERENCES `_candidate` (`id_user`);

--
-- Constraints for table `offers_speciality`
--
ALTER TABLE `offers_speciality`
  ADD CONSTRAINT `FK5c1tx9h1i3lj79vd2akfx335q` FOREIGN KEY (`speciality_id`) REFERENCES `speciality` (`id`),
  ADD CONSTRAINT `FKac9ytcnkqor9vvmnhqdup5efn` FOREIGN KEY (`training_center_id`) REFERENCES `training_center` (`id`);

--
-- Constraints for table `speciality`
--
ALTER TABLE `speciality`
  ADD CONSTRAINT `FK98t1a8vgqe29lw5vmw2snlrm9` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`),
  ADD CONSTRAINT `FK9kb42rotxijan6bpf4hub45ih` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FKi6v5f7thgi314uywaelqdd3rg` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`);

--
-- Constraints for table `speciality_subject`
--
ALTER TABLE `speciality_subject`
  ADD CONSTRAINT `FK407i3gbuh690x227thx6c03oe` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `FKi1h4260k9cra32fo5a8u3shpf` FOREIGN KEY (`speciality_id`) REFERENCES `speciality` (`id`);

--
-- Constraints for table `token_entity`
--
ALTER TABLE `token_entity`
  ADD CONSTRAINT `FKsoupqu80xk7x0qsmdhnla950s` FOREIGN KEY (`user_id`) REFERENCES `_user` (`id_user`);

--
-- Constraints for table `training_center`
--
ALTER TABLE `training_center`
  ADD CONSTRAINT `FKe4h4g0ed9jetvu7lwi9bogpps` FOREIGN KEY (`promoter_id`) REFERENCES `_promoter` (`id_user`);

--
-- Constraints for table `_campus`
--
ALTER TABLE `_campus`
  ADD CONSTRAINT `FKkumvr9pu487b976pwvsnhbmvi` FOREIGN KEY (`id_training_center`) REFERENCES `training_center` (`id`);

--
-- Constraints for table `_candidate`
--
ALTER TABLE `_candidate`
  ADD CONSTRAINT `FK2c23m266b42mg1g5b69fdf72o` FOREIGN KEY (`exam_center_id`) REFERENCES `exam_center` (`id`),
  ADD CONSTRAINT `FKevnfjdb4k8i9jq89va8n9wu6g` FOREIGN KEY (`id_user`) REFERENCES `_user` (`id_user`);

--
-- Constraints for table `_promoter`
--
ALTER TABLE `_promoter`
  ADD CONSTRAINT `FK8i0xe3wlmtwk3blvq2cw3j7j6` FOREIGN KEY (`id_user`) REFERENCES `_user` (`id_user`);

--
-- Constraints for table `_staff`
--
ALTER TABLE `_staff`
  ADD CONSTRAINT `FKq7r6hdn463s9vyd9um58p4bhg` FOREIGN KEY (`id_user`) REFERENCES `_user` (`id_user`);

--
-- Constraints for table `_user_roles`
--
ALTER TABLE `_user_roles`
  ADD CONSTRAINT `FK4l65f01tr3klo5wj30o4yl4so` FOREIGN KEY (`roles_id_role`) REFERENCES `role_entity` (`id_role`),
  ADD CONSTRAINT `FKtpyt0qjubno38k3k3c6u7dkje` FOREIGN KEY (`users_id_user`) REFERENCES `_user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
