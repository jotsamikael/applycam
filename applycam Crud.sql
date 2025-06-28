-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 13 juin 2025 à 12:22
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `applycam`
--

-- --------------------------------------------------------

--
-- Structure de la table `application`
--

CREATE TABLE `application` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `end_academic_year` date DEFAULT NULL,
  `start_academic_year` date DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  `speciality` bigint(20) DEFAULT NULL,
  `application_region` varchar(255) DEFAULT NULL,
  `exam_type` varchar(255) DEFAULT NULL,
  `session_id` bigint(20) DEFAULT NULL,
  `status` enum('APPROVED','DRAFT','PENDING_REVIEW','SUBMITTED') NOT NULL,
  `application_year` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `application`
--

INSERT INTO `application` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `end_academic_year`, `start_academic_year`, `candidate_id`, `speciality`, `application_region`, `exam_type`, `session_id`, `status`, `application_year`) VALUES
(2, 1902, '2025-06-12 10:41:29.000000', b'0', b'0', 1902, NULL, NULL, NULL, 1902, 1, 'Ouest', 'CQP', 2, 'SUBMITTED', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `application_seq`
--

CREATE TABLE `application_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `application_seq`
--

INSERT INTO `application_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Structure de la table `course`
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
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `course`
--

INSERT INTO `course` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `code`, `description`, `name`) VALUES
(2, 602, '2025-05-26 11:36:52.000000', b'0', b'1', 602, '2025-05-26 13:05:59.000000', 'GI', 'filière qui forme des ingénieurs spécialisés dans la conception, le développement, l\'implémentation et la maintenance des programmes.  ', 'Genie Informatique'),
(3, 602, '2025-05-26 11:47:29.000000', b'0', b'1', 602, '2025-05-26 12:53:36.000000', 'IS', 'filière qui forme des ingénieurs spécialisés dans la conception, le développement, l\'implémentation et la maintenance des systèmes d\'information.  ', 'Ingénierie des Systèmes d\'Information'),
(52, 1152, '2025-05-28 09:49:08.000000', b'0', b'1', 602, '2025-05-28 09:53:22.000000', 'UF', 'Ceci est une filiere', 'Une filiere');

-- --------------------------------------------------------

--
-- Structure de la table `course_seq`
--

CREATE TABLE `course_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `course_seq`
--

INSERT INTO `course_seq` (`next_val`) VALUES
(151);

-- --------------------------------------------------------

--
-- Structure de la table `has_schooled`
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
-- Déchargement des données de la table `has_schooled`
--

INSERT INTO `has_schooled` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `end_year`, `start_year`, `candidate_id`, `training_center_id`) VALUES
(2, 0, '2025-06-12 10:31:00.000000', b'1', b'0', 0, NULL, NULL, NULL, 1902, 1102);

-- --------------------------------------------------------

--
-- Structure de la table `has_schooled_seq`
--

CREATE TABLE `has_schooled_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `has_schooled_seq`
--

INSERT INTO `has_schooled_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Structure de la table `offers_speciality`
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
-- Déchargement des données de la table `offers_speciality`
--

INSERT INTO `offers_speciality` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `agreement`, `speciality_id`, `training_center_id`) VALUES
(1, 602, '2025-05-16 09:58:21.000000', b'0', b'0', 602, NULL, NULL, 102, 52),
(2, 602, '2025-05-16 10:00:53.000000', b'0', b'0', 602, NULL, NULL, 103, 52),
(52, 602, '2025-05-16 10:35:12.000000', b'0', b'0', 602, NULL, NULL, 152, 52),
(202, 602, '2025-05-16 11:08:34.000000', b'0', b'0', 602, NULL, NULL, 202, 52),
(203, 602, '2025-05-16 11:10:00.000000', b'0', b'0', 602, NULL, NULL, 202, 52),
(204, 602, '2025-05-16 11:10:45.000000', b'0', b'0', 602, NULL, NULL, 252, 52),
(252, 1902, '2025-06-12 12:08:09.000000', b'0', b'0', 1902, NULL, NULL, 302, 1);

-- --------------------------------------------------------

--
-- Structure de la table `offers_speciality_seq`
--

CREATE TABLE `offers_speciality_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offers_speciality_seq`
--

INSERT INTO `offers_speciality_seq` (`next_val`) VALUES
(351);

-- --------------------------------------------------------

--
-- Structure de la table `role_entity`
--

CREATE TABLE `role_entity` (
  `id_role` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `role_entity`
--

INSERT INTO `role_entity` (`id_role`, `created_date`, `last_modified_date`, `name`) VALUES
(1, '2025-05-02 11:40:07.000000', '2025-05-02 11:40:07.000000', 'CANDIDATE'),
(2, '2025-03-10 16:44:01.000000', '2025-03-10 16:44:01.000000', 'STAFF'),
(3, '2025-03-05 15:35:29.000000', '2025-03-05 15:35:29.000000', 'PROMOTER');

-- --------------------------------------------------------

--
-- Structure de la table `role_entity_seq`
--

CREATE TABLE `role_entity_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `role_entity_seq`
--

INSERT INTO `role_entity_seq` (`next_val`) VALUES
(1);

-- --------------------------------------------------------

--
-- Structure de la table `session`
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
  `session_year` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `session`
--

INSERT INTO `session` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `exam_date`, `exam_type`, `session_year`) VALUES
(1, 1303, '2025-06-03 14:56:35.000000', b'1', b'0', 1303, '2025-06-03 15:17:52.000000', '2025-06-03', 'CQP', '2024-2025'),
(2, 1303, '2025-06-03 15:01:07.000000', b'1', b'0', 1152, '2025-06-03 15:07:17.000000', '2025-06-03', 'CQP', '2025-2026');

-- --------------------------------------------------------

--
-- Structure de la table `session_seq`
--

CREATE TABLE `session_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `session_seq`
--

INSERT INTO `session_seq` (`next_val`) VALUES
(101);

-- --------------------------------------------------------

--
-- Structure de la table `speciality`
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
  `name` varchar(255) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `exam_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `speciality`
--

INSERT INTO `speciality` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `code`, `description`, `name`, `course_id`, `exam_type`) VALUES
(1, 602, '2025-05-14 12:33:23.000000', b'1', b'0', 602, '2025-05-28 09:59:05.000000', 'GI', 'les genies', 'genie Informatique', 52, NULL),
(2, 602, '2025-05-14 12:49:39.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'Lettre moderne', NULL, NULL),
(102, 602, '2025-05-16 09:58:21.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'Lettre moderne', NULL, NULL),
(103, 602, '2025-05-16 10:00:53.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'mathematique', NULL, NULL),
(152, 602, '2025-05-16 10:35:12.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'mathematique', NULL, NULL),
(202, 602, '2025-05-16 10:56:23.000000', b'0', b'0', 602, '2025-05-16 11:10:00.000000', 'GI', 'les genies', 'pop', NULL, NULL),
(252, 602, '2025-05-16 11:09:50.000000', b'1', b'0', 602, '2025-05-28 10:10:21.000000', 'GL', 'batiments et autres', 'grnie civil', NULL, NULL),
(302, 1902, '2025-06-12 11:32:26.000000', b'1', b'0', 1902, NULL, NULL, 'string', 'string', NULL, 'string');

-- --------------------------------------------------------

--
-- Structure de la table `speciality_seq`
--

CREATE TABLE `speciality_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `speciality_seq`
--

INSERT INTO `speciality_seq` (`next_val`) VALUES
(451);

-- --------------------------------------------------------

--
-- Structure de la table `speciality_subject`
--

CREATE TABLE `speciality_subject` (
  `speciality_id` bigint(20) NOT NULL,
  `subject_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `speciality_subject`
--

INSERT INTO `speciality_subject` (`speciality_id`, `subject_id`) VALUES
(2, 53),
(1, 52),
(1, 103);

-- --------------------------------------------------------

--
-- Structure de la table `subjects`
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
  `credits` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `subjects`
--

INSERT INTO `subjects` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `code`, `credits`, `description`, `name`) VALUES
(1, 602, '2025-05-14 12:33:47.000000', b'0', b'0', 602, NULL, '123', '12', 'le cours de francais lol', 'francais'),
(2, 602, '2025-05-14 12:34:32.000000', b'0', b'0', 602, NULL, '123', '12', 'le cours de francais lol', 'securite'),
(52, 602, '2025-05-14 12:47:38.000000', b'0', b'0', 602, NULL, '123', '12', 'le cours de francais lol', 'securite'),
(53, 602, '2025-05-14 12:50:23.000000', b'0', b'0', 602, NULL, '123', '12', 'le cours de dissertation', 'dissertation'),
(102, 602, '2025-05-16 16:42:38.000000', b'0', b'0', 602, NULL, '123', NULL, 'apprener l\'anglais en 10 lecons', 'anglais'),
(103, 602, '2025-05-16 16:42:49.000000', b'0', b'0', 602, NULL, '123', NULL, 'apprener l\'anglais en 10 lecons', 'anglais'),
(152, 1303, '2025-06-03 15:45:18.000000', b'0', b'0', 1303, NULL, 'ALCH', NULL, 'transformation d\'element comme vous voulez', 'Alchimie');

-- --------------------------------------------------------

--
-- Structure de la table `subjects_seq`
--

CREATE TABLE `subjects_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `subjects_seq`
--

INSERT INTO `subjects_seq` (`next_val`) VALUES
(251);

-- --------------------------------------------------------

--
-- Structure de la table `token_entity`
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
-- Déchargement des données de la table `token_entity`
--

INSERT INTO `token_entity` (`id_token`, `created_at`, `expires_at`, `token`, `validated_at`, `user_id`) VALUES
(1, '2025-05-04 19:25:21.000000', '2025-05-04 19:40:21.000000', '765501', NULL, 102),
(2, '2025-05-04 19:30:32.000000', '2025-05-04 19:45:32.000000', '876575', NULL, 152),
(52, '2025-05-04 19:34:06.000000', '2025-05-04 19:49:06.000000', '921745', '2025-05-04 19:48:45.000000', 202),
(102, '2025-05-05 16:03:25.000000', '2025-05-05 16:18:25.000000', '182105', NULL, 202),
(152, '2025-05-06 16:13:30.000000', '2025-05-06 16:28:30.000000', '997266', NULL, 252),
(202, '2025-05-06 16:19:11.000000', '2025-05-06 16:34:11.000000', '921297', NULL, 302),
(252, '2025-05-06 16:20:19.000000', '2025-05-06 16:35:19.000000', '717201', NULL, 352),
(302, '2025-05-06 16:34:51.000000', '2025-05-06 16:49:51.000000', '469626', NULL, 402),
(303, '2025-05-06 16:36:17.000000', '2025-05-06 16:51:17.000000', '842029', NULL, 403),
(352, '2025-05-06 16:37:21.000000', '2025-05-06 16:52:21.000000', '564997', NULL, 452),
(402, '2025-05-06 16:43:32.000000', '2025-05-06 16:58:32.000000', '222622', NULL, 502),
(452, '2025-05-06 16:49:47.000000', '2025-05-06 17:04:47.000000', '023355', NULL, 552),
(502, '2025-05-06 16:53:47.000000', '2025-05-06 17:08:47.000000', '145699', '2025-05-06 16:56:21.000000', 602),
(503, '2025-05-06 17:24:39.000000', '2025-05-06 17:39:39.000000', '183118', NULL, 602),
(552, '2025-05-22 12:18:30.000000', '2025-05-22 12:33:30.000000', '065040', NULL, 652),
(602, '2025-05-22 12:21:42.000000', '2025-05-22 12:36:42.000000', '125950', '2025-05-22 12:22:59.000000', 702),
(652, '2025-05-23 17:51:16.000000', '2025-05-23 18:06:16.000000', '753581', NULL, 902),
(752, '2025-05-23 18:54:05.000000', '2025-05-23 19:09:05.000000', '726000', NULL, 1152),
(802, '2025-05-28 11:47:56.000000', '2025-05-28 12:02:56.000000', '682510', NULL, 1202),
(852, '2025-05-31 17:32:51.000000', '2025-05-31 17:47:51.000000', '517172', NULL, 1252),
(902, '2025-06-02 12:50:56.000000', '2025-06-02 13:05:56.000000', '744859', NULL, 1302),
(903, '2025-06-02 13:14:47.000000', '2025-06-02 13:29:47.000000', '045143', NULL, 1303),
(952, '2025-06-04 13:58:22.000000', '2025-06-04 14:13:22.000000', '804549', '2025-06-04 13:59:56.000000', 1352),
(1002, '2025-06-04 14:33:08.000000', '2025-06-04 14:48:08.000000', '199545', NULL, 1402),
(1052, '2025-06-04 17:57:14.000000', '2025-06-04 18:12:14.000000', '696165', NULL, 1452),
(1102, '2025-06-09 09:38:20.000000', '2025-06-09 09:53:20.000000', '597547', NULL, 1502),
(1152, '2025-06-09 17:50:09.000000', '2025-06-09 18:05:09.000000', '498047', NULL, 1602),
(1202, '2025-06-11 20:57:23.000000', '2025-06-11 21:12:23.000000', '792754', '2025-06-11 21:03:38.000000', 1752),
(1252, '2025-06-12 09:39:24.000000', '2025-06-12 09:54:24.000000', '549771', '2025-06-12 09:40:12.000000', 1802),
(1302, '2025-06-12 10:05:26.000000', '2025-06-12 10:20:26.000000', '817734', '2025-06-12 10:06:36.000000', 1852),
(1352, '2025-06-12 10:31:00.000000', '2025-06-12 10:46:00.000000', '040757', '2025-06-12 10:32:04.000000', 1902),
(1402, '2025-06-12 15:23:30.000000', '2025-06-12 15:38:30.000000', '215101', NULL, 1902);

-- --------------------------------------------------------

--
-- Structure de la table `token_entity_seq`
--

CREATE TABLE `token_entity_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `token_entity_seq`
--

INSERT INTO `token_entity_seq` (`next_val`) VALUES
(1501);

-- --------------------------------------------------------

--
-- Structure de la table `training_center`
--

CREATE TABLE `training_center` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `acronym` varchar(255) DEFAULT NULL,
  `agreement_file_url` varchar(255) DEFAULT NULL,
  `agreement_number` varchar(255) DEFAULT NULL,
  `division` varchar(255) DEFAULT NULL,
  `end_date_of_agreement` date DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `is_center_present_candidate_for_cqp` bit(1) NOT NULL,
  `is_center_present_candidate_for_dqp` bit(1) NOT NULL,
  `start_date_of_agreement` date DEFAULT NULL,
  `promoter_id` bigint(20) DEFAULT NULL,
  `agreement_status` varbinary(255) DEFAULT NULL,
  `full_address` varchar(255) DEFAULT NULL,
  `center_email` varchar(255) DEFAULT NULL,
  `center_phone` varchar(255) DEFAULT NULL,
  `center_type` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `center_age` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `training_center`
--

INSERT INTO `training_center` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `acronym`, `agreement_file_url`, `agreement_number`, `division`, `end_date_of_agreement`, `full_name`, `is_center_present_candidate_for_cqp`, `is_center_present_candidate_for_dqp`, `start_date_of_agreement`, `promoter_id`, `agreement_status`, `full_address`, `center_email`, `center_phone`, `center_type`, `city`, `region`, `website`, `center_age`) VALUES
(1, 602, '2025-05-06 17:25:45.000000', b'0', b'0', 602, '2025-06-09 14:26:18.000000', 'jo', './uploads\\users\\602\\1749475578819.pdf', '101n0', 'mo', '2028-10-10', 'jeanTabi', b'0', b'1', '2024-10-10', 602, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
(2, 602, '2025-05-08 18:17:45.000000', b'0', b'0', 602, NULL, 'jo', NULL, '100n0', 'pop', '2025-10-10', 'jeano', b'1', b'0', '2024-10-10', 602, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
(52, 602, '2025-05-16 09:38:12.000000', b'0', b'0', 602, NULL, 'jooo', NULL, '100n00', 'pop', '2025-10-10', 'jeoooono', b'1', b'0', '2024-10-10', 602, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0),
(103, 602, '2025-05-22 11:56:12.000000', b'0', b'0', 602, NULL, 'jooop', NULL, '100n001', 'pop', '2025-10-10', 'jeoopno', b'1', b'0', '2024-10-10', 602, NULL, 'yaounde Mendong', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(152, 652, '2025-05-22 12:18:30.000000', b'0', b'0', 0, NULL, 'IST', NULL, 'AGT-2024-001', 'Littoral', '2029-12-31', 'Institut Supérieur de Technologie', b'1', b'0', '2024-01-01', 652, NULL, 'Bonapriso, Douala', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(202, 702, '2025-05-22 12:21:42.000000', b'0', b'0', 0, NULL, 'ISTY', NULL, 'ISTYT-2034-002', 'Littoral', '2029-12-31', 'Institut Supérieur de Technologie de Yaounde', b'1', b'1', '2024-01-01', 702, NULL, 'Bonapriso, Douala', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(253, 803, '2025-05-23 17:28:53.000000', b'0', b'0', 0, NULL, 'CFA', NULL, 'AGR123', 'Centre', '2025-12-31', 'Centre de Formation A', b'1', b'0', '2023-01-01', 803, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(302, 852, '2025-05-23 17:46:32.000000', b'0', b'0', 0, NULL, 'CFA', NULL, 'AGR122', 'Centre', '2025-12-31', 'Centre de Formation A', b'1', b'0', '2023-01-01', 852, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(352, 902, '2025-05-23 17:51:15.000000', b'0', b'0', 0, '2025-05-23 17:51:16.000000', 'CFA', './uploads\\users\\902\\1748019075896.docx', 'AGR1221', 'Centre', '2025-12-31', 'Centre de Formation A', b'1', b'0', '2023-01-01', 902, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(402, 952, '2025-05-23 17:58:30.000000', b'0', b'0', 0, NULL, 'CFA', NULL, 'AGR12211', 'Centre', '2025-12-31', 'Centre de Formation A', b'1', b'0', '2023-01-01', 952, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(452, 1002, '2025-05-23 18:17:16.000000', b'0', b'0', 0, NULL, 'CFA', NULL, 'AGr567', 'Centre', '2025-12-31', 'Centre de Formation A', b'1', b'0', '2023-01-01', 1002, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(453, 1003, '2025-05-23 18:20:33.000000', b'0', b'0', 0, NULL, 'CFA', NULL, 'AGr5679', 'Centre', '2025-12-31', 'Centre de Formation A', b'1', b'0', '2023-01-01', 1003, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(502, 1052, '2025-05-23 18:41:30.000000', b'0', b'0', 0, NULL, 'CFA', NULL, 'AGr56797', 'Centre', '2025-12-31', 'Centre de Formation A', b'1', b'0', '2023-01-01', 1052, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(503, 1053, '2025-05-23 18:42:43.000000', b'0', b'0', 0, NULL, 'CFA', NULL, 'lolo3456', 'Centre', '2025-12-31', 'Centre de Formation A', b'1', b'0', '2023-01-01', 1053, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(602, 1152, '2025-05-23 18:54:05.000000', b'0', b'0', 0, '2025-05-23 18:54:05.000000', 'CFAFA', './uploads\\users\\1152\\1748022845673.docx', 'ALRT56', 'Centre', '2025-12-31', 'Centre de Formation AFA', b'1', b'0', '2023-01-01', 1152, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(652, 1202, '2025-05-28 11:47:56.000000', b'0', b'0', 0, '2025-05-28 11:47:56.000000', 'CFAFA', './uploads\\users\\1202\\1748429276421.docx', 'ALRT5619', 'Centre', '2025-06-30', 'Centre de Formation AFA', b'1', b'0', '2025-01-01', 1202, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(702, 1252, '2025-05-31 17:32:51.000000', b'0', b'0', 0, '2025-05-31 17:32:51.000000', 'CFAFA', './uploads\\users\\1252\\1748709171288.docx', 'ALRT56198', 'Centre', '2025-06-30', 'Centre de Formation AFA', b'1', b'0', '2025-01-01', 1252, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(752, 1302, '2025-06-02 12:50:56.000000', b'0', b'0', 0, '2025-06-02 12:50:56.000000', 'IPD', './uploads\\users\\1302\\1748865056115.png', 'AG-045', '\"Littoral', '2027-09-14', 'Institut Professionnel de Douala', b'1', b'0', '2024-09-15', 1302, NULL, 'Douala, Boulevard de la République', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(753, 1303, '2025-06-02 13:14:46.000000', b'0', b'0', 0, '2025-06-02 13:14:47.000000', 'CFAFA', './uploads\\users\\1303\\1748866486881.docx', 'ALRT561988', 'Centre', '2025-06-30', 'Centre de Formation AFA', b'1', b'0', '2025-01-01', 1303, NULL, 'BP 123 Yaoundé', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(802, 602, '2025-06-03 16:50:37.000000', b'0', b'0', 602, NULL, 'CFR', NULL, 'CFR19', 'pop', '2029-10-10', 'Centre de Formation la Reussite', b'1', b'1', '2024-10-10', 602, NULL, 'Douala, Yassa', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(803, 1303, '2025-06-03 16:56:15.000000', b'0', b'0', 1303, NULL, 'CFR2', NULL, 'CFR219', 'pop', '2029-10-10', 'Centre de Formation la Reussite 2', b'1', b'1', '2024-10-10', 1303, NULL, 'Douala, Yassa', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(852, 1352, '2025-06-04 13:58:22.000000', b'0', b'0', 0, '2025-06-04 13:58:22.000000', 'CIDev', './uploads\\users\\1352\\1749041902606.png', 'CID56', 'Sud', '2027-11-10', 'Centre InfoDev', b'1', b'0', '2025-01-01', 1352, NULL, 'BP 12 Bafia', 'cidev@gmail.com', '6890349522', 'Public', 'Bafia', 'Sud', 'www.deemsdev.com', 0),
(902, 1402, '2025-06-04 14:33:08.000000', b'0', b'0', 0, '2025-06-04 14:33:08.000000', 'CM', './uploads\\users\\1402\\1749043988486.png', 'CM056', 'Ouest', '2027-11-11', 'Centre Musical', b'1', b'1', '2025-11-01', 1402, NULL, 'BP 10 Loum', 'cmpenja@gmail.com', '6890349233', 'Prive', 'Penja', 'Ouest', 'www.music.com', 0),
(952, 1452, '2025-06-04 17:57:14.000000', b'0', b'0', 0, '2025-06-04 17:57:14.000000', 'CM', './uploads\\users\\1452\\1749056234297.png', 'CM0561', 'Ouest', '2027-11-11', 'Centre Musical', b'1', b'1', '2025-11-01', 1452, NULL, 'BP 10 Loum', 'cmpenji@gmail.com', '6890349233', 'Prive', 'Penja', 'Ouest', 'www.music.com', 24),
(1002, 1502, '2025-06-09 09:38:20.000000', b'0', b'0', 0, '2025-06-09 09:38:20.000000', 'CM', './uploads\\users\\1502\\1749458300187.png', 'CM890', 'Ouest', '2027-11-11', 'Centre Musical', b'1', b'1', '2025-11-01', 1502, NULL, 'BP 10 Loum', 'cmpelji@gmail.com', '6890344444', 'Prive', 'Penja', 'Ouest', 'www.music.com', 24),
(1052, 1552, '2025-06-09 14:22:29.000000', b'0', b'0', 0, NULL, 'CM', NULL, NULL, 'Ouest', '2027-11-11', 'Centre Musical', b'1', b'1', '2025-11-01', 1552, NULL, 'BP 10 Loum', 'cmpeltji@gmail.com', '6890349999', 'Prive', 'Penja', 'Ouest', 'www.music.com', 24),
(1102, 1602, '2025-06-09 14:52:13.000000', b'0', b'0', 0, '2025-06-09 17:50:09.000000', 'string', './uploads\\users\\1602\\1749487809670.png', 'string', 'string', '2029-06-09', 'string', b'1', b'1', '2025-06-09', 1602, NULL, 'string', 'string@gmail.com', '12345642131', 'string', 'string', 'string', 'string', 10);

-- --------------------------------------------------------

--
-- Structure de la table `training_center_seq`
--

CREATE TABLE `training_center_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `training_center_seq`
--

INSERT INTO `training_center_seq` (`next_val`) VALUES
(1201);

-- --------------------------------------------------------

--
-- Structure de la table `_campus`
--

CREATE TABLE `_campus` (
  `id` bigint(20) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `is_actived` bit(1) NOT NULL,
  `is_archived` bit(1) NOT NULL,
  `last_modified_by` bigint(20) DEFAULT NULL,
  `last_modified_date` datetime(6) DEFAULT NULL,
  `capacity` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `quarter` varchar(255) DEFAULT NULL,
  `town` varchar(255) DEFAULT NULL,
  `x_coor` double NOT NULL,
  `y_coor` double NOT NULL,
  `id_training_center` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_campus`
--

INSERT INTO `_campus` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `capacity`, `name`, `quarter`, `town`, `x_coor`, `y_coor`, `id_training_center`) VALUES
(53, 1303, '2025-06-03 17:15:28.000000', b'1', b'0', 1303, '2025-06-03 17:47:56.000000', 200, 'IST de Douala', 'douala,yassa', 'douala', 980, 10, 803),
(102, 1303, '2025-06-03 18:00:08.000000', b'0', b'0', 1303, NULL, 200, 'IST de Yaounde', 'Yaounde-posteCentrale', 'Yaounde', 980, 100, 803),
(103, 1303, '2025-06-03 18:01:15.000000', b'0', b'0', 1303, NULL, 210, 'IST de Adamoua', 'Doukoure', 'Adamoua', 80, 1001, 803);

-- --------------------------------------------------------

--
-- Structure de la table `_campus_seq`
--

CREATE TABLE `_campus_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_campus_seq`
--

INSERT INTO `_campus_seq` (`next_val`) VALUES
(201);

-- --------------------------------------------------------

--
-- Structure de la table `_candidate`
--

CREATE TABLE `_candidate` (
  `birth_certificate_url` varchar(255) DEFAULT NULL,
  `content_status` tinyint(4) DEFAULT NULL,
  `father_full_name` varchar(255) DEFAULT NULL,
  `father_profession` varchar(255) DEFAULT NULL,
  `highest_diplomat_url` varchar(255) DEFAULT NULL,
  `highest_school_level` varchar(255) DEFAULT NULL,
  `mother_full_name` varchar(255) DEFAULT NULL,
  `mother_profession` varchar(255) DEFAULT NULL,
  `national_id_card_url` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `town_of_residence` varchar(255) DEFAULT NULL,
  `id_user` bigint(20) NOT NULL,
  `free_candidate` bit(1) NOT NULL,
  `repeat_candidate` bit(1) NOT NULL,
  `region_origins` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_candidate`
--

INSERT INTO `_candidate` (`birth_certificate_url`, `content_status`, `father_full_name`, `father_profession`, `highest_diplomat_url`, `highest_school_level`, `mother_full_name`, `mother_profession`, `national_id_card_url`, `nationality`, `place_of_birth`, `profile_picture_url`, `sex`, `town_of_residence`, `id_user`, `free_candidate`, `repeat_candidate`, `region_origins`) VALUES
(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'masculin', NULL, 1, b'0', b'0', NULL),
(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'masculin', NULL, 4, b'0', b'0', NULL),
(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'masculin', NULL, 52, b'0', b'0', NULL),
(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'masculin', NULL, 54, b'0', b'0', NULL),
(NULL, NULL, 'mopul', 'dev', NULL, 'Bac', 'opul', 'devL', NULL, NULL, 'BAmin', NULL, NULL, NULL, 1652, b'0', b'0', NULL),
(NULL, NULL, 'Mamadou Traoré', 'Ingénieur', NULL, 'Licence', 'Aïssata Diarra', 'Commerçante', NULL, NULL, 'Bamako', NULL, NULL, NULL, 1702, b'0', b'0', NULL),
(NULL, NULL, 'Youssef El Amrani', 'Comptable', NULL, 'BAC+2', 'Laila Kaddouri', 'Assistante sociale', NULL, NULL, 'Fès', NULL, NULL, NULL, 1752, b'0', b'0', NULL),
(NULL, NULL, 'Michel Ngoma', 'Médecin', NULL, 'Master', 'Claire Mavoungou', 'Secrétaire', NULL, NULL, 'Brazzaville', NULL, 'HOMME', NULL, 1802, b'0', b'0', NULL),
(NULL, NULL, 'Ousmane Sow', 'Pharmacien', NULL, 'BTS', 'Khady Fall', 'Professeure', NULL, 'Senegalais', 'Dakar', NULL, NULL, 'Bafoussam', 1852, b'1', b'0', NULL),
('./uploads\\users\\1902\\1749738210226.png', NULL, 'Amadou', 'pompiste', './uploads\\users\\1902\\1749738210382.png', 'Licence', 'Aminata', 'Directeur general', NULL, 'Senegalais', 'Goma', './uploads\\users\\1902\\1749738210397.png', NULL, 'Garoua', 1902, b'1', b'0', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `_promoter`
--

CREATE TABLE `_promoter` (
  `school_level` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `id_user` bigint(20) NOT NULL,
  `national_id_card_url` varchar(255) DEFAULT NULL,
  `internal_regulation_file_url` varchar(255) DEFAULT NULL,
  `localisation_file_url` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `signature_letter_url` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_promoter`
--

INSERT INTO `_promoter` (`school_level`, `address`, `id_user`, `national_id_card_url`, `internal_regulation_file_url`, `localisation_file_url`, `photo_url`, `signature_letter_url`, `nationality`) VALUES
('master', 'mendong', 152, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'mendong', 202, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 252, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 302, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 352, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 402, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 403, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 452, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 502, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 552, NULL, NULL, NULL, NULL, NULL, NULL),
('master', 'Mendo', 602, './uploads\\users\\602\\1747908417801.png', NULL, NULL, NULL, NULL, NULL),
('BAC+3', 'Douala', 652, NULL, NULL, NULL, NULL, NULL, NULL),
('BAC+3', 'Yaounde', 702, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 802, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 803, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 852, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 902, './uploads\\users\\902\\1748019075856.docx', './uploads\\users\\902\\1748019076006.sql', './uploads\\users\\902\\1748019076001.sql', './uploads\\users\\902\\1748019075931.sql', './uploads\\users\\902\\1748019075967.sql', NULL),
('Master', 'Yaoundé', 952, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 1002, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 1003, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 1052, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 1053, NULL, NULL, NULL, NULL, NULL, NULL),
('Master', 'Yaoundé', 1152, './uploads\\users\\1152\\1748022845628.docx', './uploads\\users\\1152\\1748022845764.png', './uploads\\users\\1152\\1748022845741.png', './uploads\\users\\1152\\1748022845698.png', './uploads\\users\\1152\\1748022845718.png', NULL),
('Master', 'Yaoundé', 1202, './uploads\\users\\1202\\1748429276394.docx', './uploads\\users\\1202\\1748429276505.png', './uploads\\users\\1202\\1748429276484.png', './uploads\\users\\1202\\1748429276444.png', './uploads\\users\\1202\\1748429276464.png', NULL),
('Master', 'Yaoundé', 1252, './uploads\\users\\1252\\1748709171257.docx', './uploads\\users\\1252\\1748709171385.png', './uploads\\users\\1252\\1748709171364.png', './uploads\\users\\1252\\1748709171320.png', './uploads\\users\\1252\\1748709171344.png', NULL),
('Licence', 'Douala, Bonamoussadi', 1302, './uploads\\users\\1302\\1748865056078.png', './uploads\\users\\1302\\1748865056218.png', './uploads\\users\\1302\\1748865056192.png', './uploads\\users\\1302\\1748865056143.png', './uploads\\users\\1302\\1748865056166.png', NULL),
('Master', 'Yaoundé', 1303, './uploads\\users\\1303\\1748866486863.docx', './uploads\\users\\1303\\1748866486982.png', './uploads\\users\\1303\\1748866486957.png', './uploads\\users\\1303\\1748866486901.png', './uploads\\users\\1303\\1748866486935.png', NULL),
('DecMaster', 'Bafia', 1352, './uploads\\users\\1352\\1749041902589.png', './uploads\\users\\1352\\1749041902690.png', './uploads\\users\\1352\\1749041902669.png', './uploads\\users\\1352\\1749041902622.png', './uploads\\users\\1352\\1749041902644.png', 'camerounais'),
('Master', 'Loum', 1402, './uploads\\users\\1402\\1749043988471.png', './uploads\\users\\1402\\1749043988552.png', './uploads\\users\\1402\\1749043988535.png', './uploads\\users\\1402\\1749043988498.png', './uploads\\users\\1402\\1749043988517.png', 'naijaman'),
('Master', 'Loum', 1452, './uploads\\users\\1452\\1749056234265.png', './uploads\\users\\1452\\1749056234396.png', './uploads\\users\\1452\\1749056234376.png', './uploads\\users\\1452\\1749056234318.png', './uploads\\users\\1452\\1749056234355.png', 'naijaman'),
('Master', 'Loum', 1502, './uploads\\users\\1502\\1749458300169.png', './uploads\\users\\1502\\1749458300252.png', './uploads\\users\\1502\\1749458300236.png', './uploads\\users\\1502\\1749458300202.png', './uploads\\users\\1502\\1749458300220.png', 'naijaman'),
('gerant', 'Loum', 1552, NULL, NULL, NULL, NULL, NULL, 'naijaman'),
('string', 'string', 1602, './uploads\\users\\1602\\1749487809629.png', './uploads\\users\\1602\\1749487809734.png', './uploads\\users\\1602\\1749487809717.png', './uploads\\users\\1602\\1749487809685.png', './uploads\\users\\1602\\1749487809701.png', 'string');

-- --------------------------------------------------------

--
-- Structure de la table `_staff`
--

CREATE TABLE `_staff` (
  `position_name` varchar(255) DEFAULT NULL,
  `id_user` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_staff`
--

INSERT INTO `_staff` (`position_name`, `id_user`) VALUES
('Ministre des cabinets', 752),
('Type', 754);

-- --------------------------------------------------------

--
-- Structure de la table `_user`
--

CREATE TABLE `_user` (
  `id_user` bigint(20) NOT NULL,
  `account_locked` bit(1) NOT NULL,
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
  `actived` bit(1) NOT NULL,
  `archived` bit(1) NOT NULL,
  `sex` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_user`
--

INSERT INTO `_user` (`id_user`, `account_locked`, `created_by`, `created_date`, `date_of_birth`, `email`, `enabled`, `firstname`, `last_modified_by`, `last_modified_date`, `lastname`, `national_id_number`, `password`, `phone_number`, `actived`, `archived`, `sex`) VALUES
(1, b'0', 0, '2025-05-02 11:45:48.000000', NULL, 'noupatchankio@gmail.com', b'0', 'noupa', 0, NULL, 'ricardo', '123456789', '$2a$10$xuEXWXv1DuBDgzQ6BOZk4eXR9rvfyz82OjKU6LKgNm1zU/jJnWbzO', '698610517', b'0', b'0', NULL),
(4, b'0', 0, '2025-05-02 12:29:11.000000', NULL, 'noupatchankioo@gmail.com', b'0', 'noupaq', 0, NULL, 'ricardoq', '123456749', '$2a$10$i8ytek9JRI.EM/q3F/Gu4.yIgmGEmHs0s3D9qFlbk3lXdcv4iVkY.', '698610527', b'0', b'0', NULL),
(52, b'0', 0, '2025-05-02 12:30:52.000000', NULL, 'noupatchankiooo@gmail.com', b'0', 'noupal', 0, NULL, 'ricardiq', '123459749', '$2a$10$hadise/Dxd1x4MROxrJ9EOuJa5Z/cxLS1JFXx0WpSYCbvv9ku0WxO', '698610547', b'0', b'0', NULL),
(54, b'0', 0, '2025-05-02 12:32:06.000000', NULL, 'noupatchankioooo@gmail.com', b'0', 'noup', 0, NULL, 'ricardq', '128459749', '$2a$10$tUfL.0t9ABBEg2gOgcnmAe.dtC0If68KWRpXTCK4ItAiY/nyyoyvi', '698613547', b'0', b'0', NULL),
(102, b'0', 0, '2025-05-04 19:25:21.000000', '2000-09-29', 'noupatchankioricardo0junior@gmail.com', b'0', 'noupaq', 0, NULL, 'ricardq', '128409749', '$2a$10$gBYvHen2IOyzwry2YcZJvOzcOdas0YOf/jKCMmd.a8QXsLP9UQhsW', '698613540', b'0', b'0', NULL),
(152, b'0', 0, '2025-05-04 19:30:32.000000', '2000-09-29', 'noupatchankioricardojunio@gmail.com', b'0', 'noupaW', 0, NULL, 'ricardW', '128403749', '$2a$10$2Suu31pt4iUTQtOf76kaV.PXYkk9mlYkbeEQp1C.ZoULLe9EOPK4W', '698313540', b'0', b'0', NULL),
(202, b'0', 0, '2025-05-04 19:34:06.000000', '2000-09-29', 'noupatchankioricardojunior@gmail.com', b'1', 'noupaW', 0, '2025-05-04 19:48:45.000000', 'ricardW', '128463749', '$2a$10$wSkWYY5cjntvGy7FZShdRem2aiughWFkuf7FOPkhoRjOdi0DlJfnO', '698313640', b'0', b'0', NULL),
(252, b'0', 0, '2025-05-06 16:13:30.000000', '2009-09-09', 'noupal@gmail.com', b'0', 'noupa', 0, NULL, 'tchankio', '134678903', '$2a$10$Yh05j88YtFSa7Rn9BwC9k.xsOryCJBYNv1M3NumWtuZq9jYF.w6DC', '677777777', b'0', b'0', NULL),
(302, b'0', 0, '2025-05-06 16:19:11.000000', '2009-09-09', 'noupalo@gmail.com', b'0', 'noupa', 0, NULL, 'tchankio', '133678903', '$2a$10$ZNQfhg7gYC34qX2mazkWQenyo2QDbqb3DdDuYi1uVBzS2ISd4D172', '677977777', b'0', b'0', NULL),
(352, b'0', 0, '2025-05-06 16:20:19.000000', '2009-09-09', 'noupalol@gmail.com', b'0', 'noupa', 0, NULL, 'tchankio', '130678903', '$2a$10$Q8jPWp3RCv5vxj9n50t.cea5EO6Hq3VtKpeN22s2XhOtNl/R2mQ5i', '677997777', b'0', b'0', NULL),
(402, b'0', 0, '2025-05-06 16:34:51.000000', '2009-09-09', 'noupalolo@gmail.com', b'0', 'noupa', 0, NULL, 'tchankio', '100678903', '$2a$10$EsPGLWfgJXb5tM5OUdjmjerX/Jv5LUSaWpDrwQjywNsaqmjRxHFB2', '677997977', b'0', b'0', NULL),
(403, b'0', 0, '2025-05-06 16:36:17.000000', '2009-09-09', 'noupaulolo@gmail.com', b'0', 'noupa', 0, NULL, 'tchankio', '100678703', '$2a$10$q7QAldFZ..DUxxz9bS/2huwaOCKKW.L.DmAC8e/TVkVxp8lCWPK9u', '677997907', b'0', b'0', NULL),
(452, b'0', 0, '2025-05-06 16:37:21.000000', '2009-09-09', 'noupauilolo@gmail.com', b'0', 'noupa', 0, NULL, 'tchankio', '100078703', '$2a$10$glHF2i0i5/EmZRRvFKbeYuGzmvoePS/3tRUUWD/mnT7X5ZWsUW7Fy', '674997907', b'0', b'0', NULL),
(502, b'0', 0, '2025-05-06 16:43:32.000000', '2009-09-09', 'noupauiolo@gmail.com', b'0', 'noupa', 0, NULL, 'tchankio', '100378703', '$2a$10$/AZTDv9FOpxBAoKXhXKPKeNL9TkyvG8zoDkJs7Q.2k5lS61v6yyXa', '674991907', b'0', b'0', NULL),
(552, b'0', 0, '2025-05-06 16:49:47.000000', '2009-09-09', 'noupo@gmail.com', b'0', 'noupa', 0, NULL, 'tchankio', '000378703', '$2a$10$C7sJgISTatgVu1KWzXJcY.S7mL9k80vV2pfB6KWOBaZlfCVoYsk9y', '670991907', b'0', b'0', NULL),
(602, b'0', 0, '2025-05-06 16:53:47.000000', '2009-09-09', 'noup@gmail.com', b'1', 'noupa', 0, '2025-05-22 11:06:57.000000', 'tchankio', '000078703', '$2a$10$QEQ2KtfVge6hBedJtB7PcO.I1329ViH1vMM4U1EWJzHf.rXehGs.q', '670901907', b'1', b'0', NULL),
(652, b'0', 0, '2025-05-22 12:18:30.000000', '1990-01-01', 'jean.dupont@example.com', b'0', 'Jean', 0, NULL, 'Dupont', '1234098909', '$2a$10$4FrRipfD1EhqHAX6muzpEOeSAyRKSDvOiQx0uqvMnpCzGQ8qdIK5u', '690123456', b'0', b'0', 'MALE'),
(702, b'0', 0, '2025-05-22 12:21:42.000000', '1990-01-01', 'ripere.dupont@example.com', b'1', 'Jean', 0, '2025-05-22 12:22:59.000000', 'Dupont', '1230998909', '$2a$10$ZPFdRg144tF/7d.0i8nLeuZvXBlKWRhDbW99.BeY/Quq4nwhd2tcW', '690093456', b'0', b'0', 'MALE'),
(752, b'0', 1, '2025-05-22 14:02:34.000000', '1990-01-15', 'lolita.dupuit@example.com', b'1', 'Jean', 1, '2025-05-22 14:02:34.000000', 'Dupont', '123456788', '$2a$10$QqzOEG3fEbl0X/n1eMYH8eA3d5eYBphAAYmBF3gA00mOjdmJdV5De', '699112233', b'1', b'0', 'M'),
(754, b'0', 602, '2025-05-23 13:47:51.000000', '2025-05-22', 'wilfried.sop@example.com', b'0', 'Wilfried ', 602, '2025-06-03 16:39:49.000000', 'string', '111111111', '$2a$10$pWeHtBy6jTwUfZwT./g0fuaQSFVrmFrk0JPFTFUDi55/8hAlax6Qe', '1111111111', b'0', b'1', NULL),
(802, b'0', 0, '2025-05-23 17:27:27.000000', '1990-01-01', 'john.doe@email.com', b'0', 'John\n', 0, NULL, 'Doe', '123456789012', '$2a$10$9xECKfB6aOtpSBDNGiIBU.eQ4NRRusn86K4LsjMJAUEPK94rQZWce', '620000000', b'0', b'0', 'Male'),
(803, b'0', 0, '2025-05-23 17:28:53.000000', '1990-01-01', 'joeGoelberg@email.com', b'0', 'John\n', 0, NULL, 'Doe', '123456789015', '$2a$10$gzonQ/HVj/Jwcb0ONkv4SeGeQmioN650mHEPTwXdRkrTo8ANJGXSu', '620000001', b'0', b'0', 'Male'),
(852, b'0', 0, '2025-05-23 17:46:31.000000', '1990-01-01', 'joeGoelberge@email.com', b'0', 'John\n', 0, NULL, 'Doe', '123456789016', '$2a$10$lAhnz90T8MQa2Z80J3rZ5Ow2DsiT81G1jJhNXlW90KetxtSQ2USwu', '620000011', b'0', b'0', 'Male'),
(902, b'0', 0, '2025-05-23 17:51:15.000000', '1990-01-01', 'joeGoelbergee@email.com', b'0', 'John\n', 0, '2025-05-23 17:51:16.000000', 'Doe', '1234567890162', '$2a$10$4ICE6gL7i7glNYXkbvZ5F.i28OtcKTshb0qAS33jGhya500WmLjc.', '6200000111', b'0', b'0', 'Male'),
(952, b'0', 0, '2025-05-23 17:58:30.000000', '1990-01-01', 'joeGoelbergeee@email.com', b'0', 'John\n', 0, NULL, 'Doe', '12345678901623', '$2a$10$sVQX4HG4KwANGVavvA9kIuDyff7Hpq6EyohsQilRxpfvrplwUyjTG', '62000001113', b'0', b'0', 'Male'),
(1002, b'0', 0, '2025-05-23 18:17:16.000000', '1990-01-01', 'joeGoelber@email.com', b'0', 'John\n', 0, NULL, 'Doe', '1234567098', '$2a$10$iSB.epT14Yq6V8rMDmC6SuEZTqFS0XVN21ABJo.gCvxf7/4Iagv4m', '6909090909', b'0', b'0', 'Male'),
(1003, b'0', 0, '2025-05-23 18:20:33.000000', '1990-01-01', 'joeGoelbr@email.com', b'0', 'John\n', 0, NULL, 'Doe', '12345670980', '$2a$10$qzMz4TicHAfRuMKX8Ce2C.EamAw9lfULMO8Y4.GtEjm86No2w8kfS', '69090909090', b'0', b'0', 'Male'),
(1052, b'0', 0, '2025-05-23 18:41:30.000000', '1990-01-01', 'joeGoelr@email.com', b'0', 'John\n', 0, NULL, 'Doe', '1234567088', '$2a$10$STbLmSLFYk.pqSh4fgWZS.dJ9gaERPWYaM0Pu1A1Oi2U6gaurRpOu', '690909097', b'0', b'0', 'Male'),
(1053, b'0', 0, '2025-05-23 18:42:43.000000', '1990-01-01', 'jlolitatar@email.com', b'0', 'John\n', 0, NULL, 'Doe', '3939393939', '$2a$10$rHuYEmZmq2ae3mOhEPAFX.jATh1naFL/gVTDCnRr3nHSayAkUWZU6', '8282828282', b'0', b'0', 'Male'),
(1152, b'0', 0, '2025-05-23 18:54:05.000000', '1990-01-01', 'Niskaninho@email.com', b'1', 'Niska\n', 0, '2025-05-26 11:26:44.000000', 'MatuidiCharo', '0101020304', '$2a$10$GPEAKMMNnOikciZWS29p8ug2vtSEEOnpFbaW48e99sqFk2micr.ti', '678787878', b'1', b'0', 'Male'),
(1202, b'0', 0, '2025-05-28 11:47:56.000000', '1990-01-01', 'Niskaninhouo@email.com', b'0', 'Niska\n', 0, '2025-05-28 11:47:56.000000', 'MatuidiCharoo', '010102030420', '$2a$10$0Gi.f5UNBrWRcMJnBH92Z.1z2AsjMdxTrhphZFXhKWQnlk/9qD7Xq', '67878787838', b'0', b'0', 'Male'),
(1252, b'0', 0, '2025-05-31 17:32:51.000000', '1990-01-01', 'Niskanin@email.com', b'0', 'Niska\n', 0, '2025-05-31 17:32:51.000000', 'MatuidiCharoo', '0101020304209', '$2a$10$0wYxCicOZyLOYEb/sV4ItOtBbc82dxtENNb3ncLaMnFY/Se46LyIK', '678787878388', b'0', b'0', 'Male'),
(1302, b'0', 0, '2025-06-02 12:50:55.000000', '1998-03-22', 'jean.ekambi@example.com', b'0', 'Promoter Test', 0, '2025-06-02 12:50:56.000000', '\"Ekambi', '130045676543', '$2a$10$aE.v3WAy6e71jhQWBqKgyOPzhn7rp/cHR/No2ikj3NSy6L/BpzbdG', '699876543', b'0', b'0', 'Féminin'),
(1303, b'0', 0, '2025-06-02 13:14:46.000000', '1990-01-01', 'Niskanion@email.com', b'1', 'Niskal\n', 0, '2025-06-02 13:14:47.000000', 'MatuidiCharoou', '01010203042096', '$2a$10$8suykivmgnQLqiITVFMdwubcg4AF0bJhfHutil4Ql45rRB9FOR9pm', '6787878783887', b'0', b'0', 'Male'),
(1352, b'0', 0, '2025-06-04 13:58:22.000000', '1990-01-01', 'Dems@email.com', b'1', 'Damso', 0, '2025-06-04 13:59:56.000000', 'ReZa', '0978654783', '$2a$10$Ri9F9nHrxo2TzVvbTPmBmuA0iTYKu8IeoHNjdCFR5ZaMCa0uDE0d2', '656789054', b'0', b'0', 'Masculin'),
(1402, b'0', 0, '2025-06-04 14:33:08.000000', '1991-01-10', 'Asake@email.com', b'0', 'Asake', 0, '2025-06-04 14:33:08.000000', 'Amapiano', '0978655672', '$2a$10$1OjhajMoFFVpVdAkSL0R9Ou4//TD7uJHWbhs1KL9.w1nmmsGD4qge', '6567833556', b'0', b'0', 'Feminin'),
(1452, b'0', 0, '2025-06-04 17:57:14.000000', '1991-01-10', 'Asake1@email.com', b'0', 'Asake', 0, '2025-06-04 17:57:14.000000', 'Amapiano', '09786556721', '$2a$10$jYEOnAzRtNK4euldPbmQIeshPnht92JfH57JyA7VOMouyOo8HiG9q', '65678335561', b'0', b'0', 'Feminin'),
(1502, b'0', 0, '2025-06-09 09:38:20.000000', '1991-01-10', 'burnaBoy@email.com', b'0', 'Asake', 0, '2025-06-09 09:38:20.000000', 'Amapiano', '0098656473', '$2a$10$cdMxHWgIXrCtDpYE7hW9J.XTIvmH.MeuC7YT2W.FUveR7cbUS9ZoC', '656890765', b'0', b'0', 'Feminin'),
(1552, b'0', 0, '2025-06-09 14:22:29.000000', '1991-01-10', 'burnaoBoy@email.com', b'0', 'Asake', 0, NULL, 'Amapiano', '00986564734', '$2a$10$T3RXRZKMlcj.8rtmVlKeeeBbEiC6Rid0SRQ3lrpm295TIcBthsGC.', '6568907651', b'0', b'0', 'Feminin'),
(1602, b'0', 0, '2025-06-09 14:52:13.000000', '2000-10-10', 'string@gmail.com', b'0', 'string', 0, '2025-06-09 17:50:09.000000', 'string', '1234321235', '$2a$10$wMy1IG5MCVUYpFDFP3YWj.ASeTTlZM48vHoKwY/VLzoYndLBVltJq', '100936467', b'0', b'0', 'string'),
(1652, b'0', 0, '2025-06-11 19:47:16.000000', '2000-10-10', 'nol@gmail.com', b'0', 'nol', 0, NULL, 'string', '123456123456', '$2a$10$w5oML43ym7qsdcAM0bfhiOG.SKDCdJ0NsoIEKABzkKXYE0Nv2MSAa', '123456123456', b'0', b'0', NULL),
(1702, b'0', 0, '2025-06-11 20:47:34.000000', '2001-09-20', 'aminata.traore@example.com', b'0', 'Aminata', 0, NULL, 'Traoré', '2200547890', '$2a$10$SEFz9Z5lMfn27Px8Rudg9.LQkPxKZJvdItnzzSdzz//v2BoYNntuK', '690445566', b'0', b'0', NULL),
(1752, b'0', 0, '2025-06-11 20:57:23.000000', '1999-01-25', 'mohamed.elamrani@example.com', b'1', 'Mohamed', 0, '2025-06-11 21:03:38.000000', 'El Amrani', '5500668899', '$2a$10$yHiuRd1VkO2fpDC7MQLkvOr7orztR9uC.HRX7LLpLHYCO0qCWNzum', '655443322', b'0', b'0', NULL),
(1802, b'0', 0, '2025-06-12 09:39:24.000000', '1995-12-05', 'lucas.ngoma@example.com', b'1', 'Lucas', 0, '2025-06-12 09:40:12.000000', 'Ngoma', '3300785412', '$2a$10$ZfhKWgJTha568BWYh7ofG.bByYSp7jB.kUDVdk5b9VTtsxg51Ezm.', '678900112', b'0', b'0', NULL),
(1852, b'0', 0, '2025-06-12 10:05:26.000000', '2002-07-12', 'fatou.sow@example.com', b'1', 'Fatou', 0, '2025-06-12 10:23:04.000000', 'Sow', '4400871200', '$2a$10$M0f5hkK6tOtZXoeeGTzPh.MSutsaNVbw76smIaiHDcDt2vfdSH4fO', '699112244', b'0', b'0', 'FEMME'),
(1902, b'0', 0, '2025-06-12 10:30:59.000000', '1998-09-16', 'monemail@gmail.com', b'1', 'haha', 0, '2025-06-12 15:23:30.000000', 'hihi', '12345676543', '$2a$10$tREoBUekMlh..Rn.U8pkj.mscqNyqqwFz72UPupg/4/E6LFCFoG5.', '12345676543', b'0', b'0', 'Masculin');

-- --------------------------------------------------------

--
-- Structure de la table `_user_roles`
--

CREATE TABLE `_user_roles` (
  `users_id_user` bigint(20) NOT NULL,
  `roles_id_role` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_user_roles`
--

INSERT INTO `_user_roles` (`users_id_user`, `roles_id_role`) VALUES
(1, 1),
(4, 1),
(52, 1),
(54, 1),
(102, 3),
(152, 3),
(202, 3),
(252, 3),
(302, 3),
(352, 3),
(402, 3),
(403, 3),
(452, 3),
(502, 3),
(552, 3),
(602, 3),
(652, 3),
(702, 3),
(752, 2),
(754, 2),
(802, 3),
(803, 3),
(852, 3),
(902, 3),
(952, 3),
(1002, 3),
(1003, 3),
(1052, 3),
(1053, 3),
(1152, 3),
(1202, 3),
(1252, 3),
(1302, 3),
(1303, 3),
(1352, 3),
(1402, 3),
(1452, 3),
(1502, 3),
(1552, 3),
(1602, 3),
(1652, 1),
(1702, 1),
(1752, 1),
(1802, 1),
(1852, 1),
(1902, 1);

-- --------------------------------------------------------

--
-- Structure de la table `_user_seq`
--

CREATE TABLE `_user_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_user_seq`
--

INSERT INTO `_user_seq` (`next_val`) VALUES
(2001);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1v8a934gsu7u84hwljoo4deth` (`candidate_id`),
  ADD KEY `FKm55c4lqy005l611lpvtxq0kpw` (`speciality`),
  ADD KEY `FK8rstblo3t5van3irir5siv6km` (`session_id`);

--
-- Index pour la table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `has_schooled`
--
ALTER TABLE `has_schooled`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKklh31b1eq09gpd95gjsfa4mq3` (`candidate_id`),
  ADD KEY `FKcrjkkghsk1hu95vcpd61d5lq8` (`training_center_id`);

--
-- Index pour la table `offers_speciality`
--
ALTER TABLE `offers_speciality`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5c1tx9h1i3lj79vd2akfx335q` (`speciality_id`),
  ADD KEY `FKac9ytcnkqor9vvmnhqdup5efn` (`training_center_id`);

--
-- Index pour la table `role_entity`
--
ALTER TABLE `role_entity`
  ADD PRIMARY KEY (`id_role`),
  ADD UNIQUE KEY `UK_2uqxlfg1dlwv0mtewrokr23ou` (`name`);

--
-- Index pour la table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `speciality`
--
ALTER TABLE `speciality`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK9kb42rotxijan6bpf4hub45ih` (`course_id`);

--
-- Index pour la table `speciality_subject`
--
ALTER TABLE `speciality_subject`
  ADD KEY `FK407i3gbuh690x227thx6c03oe` (`subject_id`),
  ADD KEY `FKi1h4260k9cra32fo5a8u3shpf` (`speciality_id`);

--
-- Index pour la table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `token_entity`
--
ALTER TABLE `token_entity`
  ADD PRIMARY KEY (`id_token`),
  ADD KEY `FKsoupqu80xk7x0qsmdhnla950s` (`user_id`);

--
-- Index pour la table `training_center`
--
ALTER TABLE `training_center`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_nkws0cj37dygqr7tltf5maop1` (`agreement_number`),
  ADD KEY `FKe4h4g0ed9jetvu7lwi9bogpps` (`promoter_id`);

--
-- Index pour la table `_campus`
--
ALTER TABLE `_campus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKkumvr9pu487b976pwvsnhbmvi` (`id_training_center`);

--
-- Index pour la table `_candidate`
--
ALTER TABLE `_candidate`
  ADD PRIMARY KEY (`id_user`);

--
-- Index pour la table `_promoter`
--
ALTER TABLE `_promoter`
  ADD PRIMARY KEY (`id_user`);

--
-- Index pour la table `_staff`
--
ALTER TABLE `_staff`
  ADD PRIMARY KEY (`id_user`);

--
-- Index pour la table `_user`
--
ALTER TABLE `_user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `UK_k11y3pdtsrjgy8w9b6q4bjwrx` (`email`),
  ADD UNIQUE KEY `UK_cwnk11b5hby4hdd4dfo3ppvaq` (`national_id_number`),
  ADD UNIQUE KEY `UK_buoitwamy4goeykc8n0r8b5jd` (`phone_number`);

--
-- Index pour la table `_user_roles`
--
ALTER TABLE `_user_roles`
  ADD KEY `FK4l65f01tr3klo5wj30o4yl4so` (`roles_id_role`),
  ADD KEY `FKtpyt0qjubno38k3k3c6u7dkje` (`users_id_user`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `FK1v8a934gsu7u84hwljoo4deth` FOREIGN KEY (`candidate_id`) REFERENCES `_candidate` (`id_user`),
  ADD CONSTRAINT `FK8rstblo3t5van3irir5siv6km` FOREIGN KEY (`session_id`) REFERENCES `session` (`id`),
  ADD CONSTRAINT `FKm55c4lqy005l611lpvtxq0kpw` FOREIGN KEY (`speciality`) REFERENCES `speciality` (`id`);

--
-- Contraintes pour la table `has_schooled`
--
ALTER TABLE `has_schooled`
  ADD CONSTRAINT `FKcrjkkghsk1hu95vcpd61d5lq8` FOREIGN KEY (`training_center_id`) REFERENCES `training_center` (`id`),
  ADD CONSTRAINT `FKklh31b1eq09gpd95gjsfa4mq3` FOREIGN KEY (`candidate_id`) REFERENCES `_candidate` (`id_user`);

--
-- Contraintes pour la table `offers_speciality`
--
ALTER TABLE `offers_speciality`
  ADD CONSTRAINT `FK5c1tx9h1i3lj79vd2akfx335q` FOREIGN KEY (`speciality_id`) REFERENCES `speciality` (`id`),
  ADD CONSTRAINT `FKac9ytcnkqor9vvmnhqdup5efn` FOREIGN KEY (`training_center_id`) REFERENCES `training_center` (`id`);

--
-- Contraintes pour la table `speciality`
--
ALTER TABLE `speciality`
  ADD CONSTRAINT `FK9kb42rotxijan6bpf4hub45ih` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

--
-- Contraintes pour la table `speciality_subject`
--
ALTER TABLE `speciality_subject`
  ADD CONSTRAINT `FK407i3gbuh690x227thx6c03oe` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  ADD CONSTRAINT `FKi1h4260k9cra32fo5a8u3shpf` FOREIGN KEY (`speciality_id`) REFERENCES `speciality` (`id`);

--
-- Contraintes pour la table `token_entity`
--
ALTER TABLE `token_entity`
  ADD CONSTRAINT `FKsoupqu80xk7x0qsmdhnla950s` FOREIGN KEY (`user_id`) REFERENCES `_user` (`id_user`);

--
-- Contraintes pour la table `training_center`
--
ALTER TABLE `training_center`
  ADD CONSTRAINT `FKe4h4g0ed9jetvu7lwi9bogpps` FOREIGN KEY (`promoter_id`) REFERENCES `_promoter` (`id_user`);

--
-- Contraintes pour la table `_campus`
--
ALTER TABLE `_campus`
  ADD CONSTRAINT `FKkumvr9pu487b976pwvsnhbmvi` FOREIGN KEY (`id_training_center`) REFERENCES `training_center` (`id`);

--
-- Contraintes pour la table `_candidate`
--
ALTER TABLE `_candidate`
  ADD CONSTRAINT `FKevnfjdb4k8i9jq89va8n9wu6g` FOREIGN KEY (`id_user`) REFERENCES `_user` (`id_user`);

--
-- Contraintes pour la table `_promoter`
--
ALTER TABLE `_promoter`
  ADD CONSTRAINT `FK8i0xe3wlmtwk3blvq2cw3j7j6` FOREIGN KEY (`id_user`) REFERENCES `_user` (`id_user`);

--
-- Contraintes pour la table `_staff`
--
ALTER TABLE `_staff`
  ADD CONSTRAINT `FKq7r6hdn463s9vyd9um58p4bhg` FOREIGN KEY (`id_user`) REFERENCES `_user` (`id_user`);

--
-- Contraintes pour la table `_user_roles`
--
ALTER TABLE `_user_roles`
  ADD CONSTRAINT `FK4l65f01tr3klo5wj30o4yl4so` FOREIGN KEY (`roles_id_role`) REFERENCES `role_entity` (`id_role`),
  ADD CONSTRAINT `FKtpyt0qjubno38k3k3c6u7dkje` FOREIGN KEY (`users_id_user`) REFERENCES `_user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
