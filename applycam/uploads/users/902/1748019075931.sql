-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 22 mai 2025 à 15:09
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
  `exam_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1);

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
(1);

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
(1);

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
(204, 602, '2025-05-16 11:10:45.000000', b'0', b'0', 602, NULL, NULL, 252, 52);

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
(301);

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
  `course_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `speciality`
--

INSERT INTO `speciality` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `code`, `description`, `name`, `course_id`) VALUES
(1, 602, '2025-05-14 12:33:23.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'genie Informatique', NULL),
(2, 602, '2025-05-14 12:49:39.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'Lettre moderne', NULL),
(102, 602, '2025-05-16 09:58:21.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'Lettre moderne', NULL),
(103, 602, '2025-05-16 10:00:53.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'mathematique', NULL),
(152, 602, '2025-05-16 10:35:12.000000', b'0', b'0', 602, NULL, 'GI', 'les genies', 'mathematique', NULL),
(202, 602, '2025-05-16 10:56:23.000000', b'0', b'0', 602, '2025-05-16 11:10:00.000000', 'GI', 'les genies', 'pop', NULL),
(252, 602, '2025-05-16 11:09:50.000000', b'0', b'0', 602, '2025-05-16 11:10:45.000000', 'GL', 'batiments et autres', 'grnie civil', NULL);

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
(351);

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
(103, 602, '2025-05-16 16:42:49.000000', b'0', b'0', 602, NULL, '123', NULL, 'apprener l\'anglais en 10 lecons', 'anglais');

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
(201);

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
(602, '2025-05-22 12:21:42.000000', '2025-05-22 12:36:42.000000', '125950', '2025-05-22 12:22:59.000000', 702);

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
(701);

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
  `full_address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `training_center`
--

INSERT INTO `training_center` (`id`, `created_by`, `created_date`, `is_actived`, `is_archived`, `last_modified_by`, `last_modified_date`, `acronym`, `agreement_file_url`, `agreement_number`, `division`, `end_date_of_agreement`, `full_name`, `is_center_present_candidate_for_cqp`, `is_center_present_candidate_for_dqp`, `start_date_of_agreement`, `promoter_id`, `agreement_status`, `full_address`) VALUES
(1, 602, '2025-05-06 17:25:45.000000', b'0', b'0', 602, '2025-05-12 11:20:03.000000', 'jo', './uploads\\users\\602\\1747045203414.pdf', '101n0', 'mo', '2028-10-10', 'jeanTabi', b'0', b'1', '2024-10-10', 602, NULL, NULL),
(2, 602, '2025-05-08 18:17:45.000000', b'0', b'0', 602, NULL, 'jo', NULL, '100n0', 'pop', '2025-10-10', 'jeano', b'1', b'0', '2024-10-10', 602, NULL, NULL),
(52, 602, '2025-05-16 09:38:12.000000', b'0', b'0', 602, NULL, 'jooo', NULL, '100n00', 'pop', '2025-10-10', 'jeoooono', b'1', b'0', '2024-10-10', 602, NULL, NULL),
(103, 602, '2025-05-22 11:56:12.000000', b'0', b'0', 602, NULL, 'jooop', NULL, '100n001', 'pop', '2025-10-10', 'jeoopno', b'1', b'0', '2024-10-10', 602, NULL, 'yaounde Mendong'),
(152, 652, '2025-05-22 12:18:30.000000', b'0', b'0', 0, NULL, 'IST', NULL, 'AGT-2024-001', 'Littoral', '2029-12-31', 'Institut Supérieur de Technologie', b'1', b'0', '2024-01-01', 652, NULL, 'Bonapriso, Douala'),
(202, 702, '2025-05-22 12:21:42.000000', b'0', b'0', 0, NULL, 'ISTY', NULL, 'ISTYT-2034-002', 'Littoral', '2029-12-31', 'Institut Supérieur de Technologie de Yaounde', b'1', b'1', '2024-01-01', 702, NULL, 'Bonapriso, Douala');

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
(301);

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
(1);

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
  `repeat_candidate` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_candidate`
--

INSERT INTO `_candidate` (`birth_certificate_url`, `content_status`, `father_full_name`, `father_profession`, `highest_diplomat_url`, `highest_school_level`, `mother_full_name`, `mother_profession`, `national_id_card_url`, `nationality`, `place_of_birth`, `profile_picture_url`, `sex`, `town_of_residence`, `id_user`, `free_candidate`, `repeat_candidate`) VALUES
(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'masculin', NULL, 1, b'0', b'0'),
(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'masculin', NULL, 4, b'0', b'0'),
(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'masculin', NULL, 52, b'0', b'0'),
(NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'masculin', NULL, 54, b'0', b'0');

-- --------------------------------------------------------

--
-- Structure de la table `_promoter`
--

CREATE TABLE `_promoter` (
  `school_level` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `id_user` bigint(20) NOT NULL,
  `national_id_card_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `_promoter`
--

INSERT INTO `_promoter` (`school_level`, `address`, `id_user`, `national_id_card_url`) VALUES
('master', 'mendong', 152, NULL),
('master', 'mendong', 202, NULL),
('master', 'Mendo', 252, NULL),
('master', 'Mendo', 302, NULL),
('master', 'Mendo', 352, NULL),
('master', 'Mendo', 402, NULL),
('master', 'Mendo', 403, NULL),
('master', 'Mendo', 452, NULL),
('master', 'Mendo', 502, NULL),
('master', 'Mendo', 552, NULL),
('master', 'Mendo', 602, './uploads\\users\\602\\1747908417801.png'),
('BAC+3', 'Douala', 652, NULL),
('BAC+3', 'Yaounde', 702, NULL);

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
('Ministre des cabinets', 752);

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
(752, b'0', 1, '2025-05-22 14:02:34.000000', '1990-01-15', 'lolita.dupuit@example.com', b'1', 'Jean', 1, '2025-05-22 14:02:34.000000', 'Dupont', '123456788', '$2a$10$QqzOEG3fEbl0X/n1eMYH8eA3d5eYBphAAYmBF3gA00mOjdmJdV5De', '699112233', b'1', b'0', 'M');

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
(752, 2);

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
(801);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1v8a934gsu7u84hwljoo4deth` (`candidate_id`),
  ADD KEY `FKm55c4lqy005l611lpvtxq0kpw` (`speciality`);

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
