-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 24 jan. 2025 à 18:33
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
-- Base de données : `mynajmareservationdatabase`
--

-- --------------------------------------------------------

--
-- Structure de la table `activities`
--

CREATE TABLE `activities` (
  `activity_id` int(11) NOT NULL,
  `owner_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `current_bookings` int(11) DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `reservations_allowed` tinyint(1) NOT NULL DEFAULT 1,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activities`
--

INSERT INTO `activities` (`activity_id`, `owner_id`, `category_id`, `city_id`, `name`, `description`, `address`, `capacity`, `current_bookings`, `active`, `reservations_allowed`, `deleted`, `created_at`, `updated_at`, `deleted_at`, `logo`) VALUES
(1, 2, 5, 2, 'Tetouan', 'Tetouan', 'nbhnhhhh', 2, 0, 1, 1, 0, '2025-01-24 16:14:35', '2025-01-24 16:14:35', NULL, 'http://localhost:3000/uploads/1737735275495-marrakech.png');

-- --------------------------------------------------------

--
-- Structure de la table `activity_faq`
--

CREATE TABLE `activity_faq` (
  `faq_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `activity_hours`
--

CREATE TABLE `activity_hours` (
  `id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `activity_images`
--

CREATE TABLE `activity_images` (
  `image_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `activity_reviews`
--

CREATE TABLE `activity_reviews` (
  `review_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `rating` int(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `amenities`
--

CREATE TABLE `amenities` (
  `amenity_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `type` enum('room','bathroom','kitchen','leisure','child','equipment') NOT NULL,
  `description` text NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `slug` varchar(100) DEFAULT NULL,
  `left` int(11) DEFAULT NULL,
  `right` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`, `image_url`, `created_at`, `slug`, `left`, `right`, `active`, `updated_at`) VALUES
(3, 'Restaurant', 'Explorez une sélection soigneusement choisie des meilleurs restaurants autour de vous. Que vous souhaitiez un café chaleureux, une expérience gastronomique raffinée ou une cuisine locale authentique, notre plateforme vous permet de trouver et de réserver facilement une table parfaite. Réservez en toute simplicité et savourez des repas inoubliables adaptés à vos envies.', 'http://localhost:3000/uploads/1737715299509-Restaurant Marocain.jpg', '2025-01-24 10:41:39', 'restaurant', NULL, NULL, 1, '2025-01-24 10:41:39'),
(4, 'Spas', 'Offrez-vous une pause bien-être avec notre sélection de spas haut de gamme. Des soins luxueux aux cadres apaisants, trouvez l’endroit idéal pour vous relaxer et revitaliser votre corps et votre esprit. Réservez votre expérience spa en toute simplicité et profitez de moments de pur bonheur et de sérénité.', 'http://localhost:3000/uploads/1737715361089-spa.png', '2025-01-24 10:42:41', 'spas', NULL, NULL, 1, '2025-01-24 10:42:41'),
(5, 'Salons de beauté', 'Découvrez les meilleurs salons de beauté offrant des services experts pour rehausser votre style et votre confiance. Des coiffures aux soins de la peau et au maquillage, trouvez des professionnels à l’écoute de vos besoins uniques. Réservez votre rendez-vous en toute simplicité et profitez d’une expérience beauté personnalisée et luxueuse.', 'http://localhost:3000/uploads/1737715405006-salon.png', '2025-01-24 10:43:25', 'salons-de-beaut', NULL, NULL, 1, '2025-01-24 10:43:25'),
(6, 'Piscines', 'Que vous souhaitiez vous rafraîchir, passer une journée en famille ou simplement vous détendre au bord de l\'eau, notre sélection de piscines de premier choix répondra à toutes vos envies. Découvrez des espaces paisibles, des eaux cristallines et des installations de qualité. Réservez facilement votre visite et profitez d’un moment de détente en toute sérénité.', 'http://localhost:3000/uploads/1737715437825-piscine.png', '2025-01-24 10:43:57', 'piscines', NULL, NULL, 1, '2025-01-24 10:43:57'),
(7, 'Villas & Riads privatifs', 'Offrez-vous une escapade unique dans une oasis privée grâce à notre sélection de villas exclusives et de riads traditionnels. Idéal pour des séjours en famille, des escapades romantiques ou des vacances en groupe, ces propriétés allient confort, élégance et charme authentique. Réservez en toute simplicité et profitez d’un séjour où chaque instant est magique.', 'http://localhost:3000/uploads/1737715467533-villa.png', '2025-01-24 10:44:27', 'offrez-vous-une-escapade-unique-dans-une-oasis-priv-e-gr-ce-notre-s-lection-de-villas-exclusives-et-', NULL, NULL, 1, '2025-01-24 10:45:20'),
(8, 'Excursions', 'Découvrez la beauté de votre destination grâce à des excursions soigneusement sélectionnées. Que vous soyez à la recherche d’aventures palpitantes, d’expériences culturelles ou de balades panoramiques, nos excursions sont conçues pour créer des souvenirs mémorables. Réservez en toute simplicité et partez à la découverte de moments uniques.', 'http://localhost:3000/uploads/1737715560532-Excursions.png', '2025-01-24 10:46:00', 'excursions', NULL, NULL, 1, '2025-01-24 10:46:00'),
(9, 'Désert d\'Agafay', 'Évadez-vous dans le magnifique désert d’Agafay, un joyau caché aux portes de Marrakech. Vivez une expérience unique avec des camps luxueux, des balades à dos de chameau et des couchers de soleil inoubliables sur les dunes. Que ce soit pour une escapade romantique ou une aventure entre amis, réservez dès maintenant et plongez dans la magie du désert d’Agafay.', 'http://localhost:3000/uploads/1737715590069-Agafay.png', '2025-01-24 10:46:30', 'd-sert-d-agafay', NULL, NULL, 1, '2025-01-24 10:46:30');

-- --------------------------------------------------------

--
-- Structure de la table `category_translations`
--

CREATE TABLE `category_translations` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `language` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cities`
--

CREATE TABLE `cities` (
  `city_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `left` int(11) DEFAULT NULL,
  `right` int(11) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `region` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cities`
--

INSERT INTO `cities` (`city_id`, `name`, `slug`, `image_url`, `left`, `right`, `active`, `region`, `created_at`, `updated_at`) VALUES
(2, 'Marrakech', 'marrakech', 'http://localhost:3000/uploads/1737717929951-marrakech.png', NULL, NULL, 1, 'Marrakech-Safi', '2025-01-24 11:25:29', '2025-01-24 11:25:29'),
(3, 'Casablanca', 'casablanca', 'http://localhost:3000/uploads/1737717942165-casa.png', NULL, NULL, 1, 'Casablanca-Settat', '2025-01-24 11:25:42', '2025-01-24 11:25:42'),
(4, 'Rabat', 'rabat', 'http://localhost:3000/uploads/1737717954823-rabat.png', NULL, NULL, 1, 'Rabat-Salé-Kénitra', '2025-01-24 11:25:54', '2025-01-24 11:25:54'),
(5, 'Tanger', 'tanger', 'http://localhost:3000/uploads/1737717971617-tanger.png', NULL, NULL, 1, 'Tangier-Tetouan-Al Hoceima', '2025-01-24 11:26:11', '2025-01-24 11:26:11'),
(6, 'Agadir', 'agadir', 'http://localhost:3000/uploads/1737717984951-agadir.png', NULL, NULL, 1, 'Souss-Massa', '2025-01-24 11:26:24', '2025-01-24 11:26:24'),
(7, 'Tetouan', 'tetouan', 'http://localhost:3000/uploads/1737717998899-tetouan.png', NULL, NULL, 1, 'Tangier-Tetouan-Al Hoceima', '2025-01-24 11:26:38', '2025-01-24 11:26:38');

-- --------------------------------------------------------

--
-- Structure de la table `faqs`
--

CREATE TABLE `faqs` (
  `faq_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `order_display` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `menus`
--

CREATE TABLE `menus` (
  `menu_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `professionals`
--

CREATE TABLE `professionals` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `ice` varchar(20) DEFAULT NULL,
  `company_address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `professionals`
--

INSERT INTO `professionals` (`id`, `user_id`, `company_name`, `ice`, `company_address`, `created_at`, `updated_at`) VALUES
(1, 1, 'Doe Enterprises', '123456789', '456 Business Rd', '2025-01-24 11:35:44', '2025-01-24 11:35:44'),
(2, 2, 'Doe Enterprises', '123456789', '456 Business Rd', '2025-01-24 11:35:55', '2025-01-24 11:35:55');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` time NOT NULL,
  `status` enum('pending','accepted','refused') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déclencheurs `reservations`
--
DELIMITER $$
CREATE TRIGGER `check_activity_capacity` BEFORE INSERT ON `reservations` FOR EACH ROW BEGIN
    DECLARE total_capacity INT;
    DECLARE current_bookings INT;

    -- Get activity's capacity and current bookings
    SELECT capacity, current_bookings INTO total_capacity, current_bookings
    FROM activities
    WHERE activity_id = NEW.activity_id;

    -- Check if capacity is exceeded
    IF total_capacity IS NOT NULL AND current_bookings >= total_capacity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No more places available for this activity.';
    END IF;

    -- Increment current bookings
    UPDATE activities
    SET current_bookings = current_bookings + 1
    WHERE activity_id = NEW.activity_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `level` int(11) DEFAULT NULL,
  `user_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `slug`, `active`, `level`, `user_count`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'suadmin', 1, 1, 1, '2025-01-23 12:04:30', '2025-01-23 12:04:30'),
(2, 'Admin', 'admin', 1, 2, 16, '2025-01-23 12:04:30', '2025-01-23 12:04:30'),
(3, 'Utilisateur', 'user', 1, 100, 8, '2025-01-23 12:04:30', '2025-01-23 12:04:30'),
(4, 'Professional', 'professional', 1, 100, 8, '2025-01-23 13:24:23', '2025-01-23 13:24:23');

-- --------------------------------------------------------

--
-- Structure de la table `traffic`
--

CREATE TABLE `traffic` (
  `traffic_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `views` int(11) DEFAULT 0,
  `reservations` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `telephone` varchar(20) NOT NULL,
  `lostpassword` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `activated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `uuid`, `name`, `slug`, `email`, `password`, `role_id`, `last_name`, `first_name`, `telephone`, `lostpassword`, `refresh_token`, `activated_at`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '592733da-da47-11ef-9709-f854f664ad2e', '', '', 'john.doe@example.mas', '$2b$10$QQH/cZpmQ0uawBdTolLi5upNtCZolto4zmHf6KCXy6TzAXC5qTrRm', 4, 'Doe', 'John', '1234567890', NULL, NULL, NULL, NULL, '2025-01-24 11:35:44', '2025-01-24 11:35:44'),
(2, '5fec82dd-da47-11ef-9709-f854f664ad2e', '', '', 'john.doe@example.com', '$2b$10$sKXA9WFpOeCdiKU9JbIn6OyxzR6VSoqNP2IhqYtXYQcAtx.6WuzeS', 4, 'Doe', 'John', '1234567890', NULL, NULL, NULL, NULL, '2025-01-24 11:35:55', '2025-01-24 11:35:55');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Index pour la table `activity_faq`
--
ALTER TABLE `activity_faq`
  ADD PRIMARY KEY (`faq_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Index pour la table `activity_hours`
--
ALTER TABLE `activity_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Index pour la table `activity_images`
--
ALTER TABLE `activity_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Index pour la table `activity_reviews`
--
ALTER TABLE `activity_reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`amenity_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Index pour la table `category_translations`
--
ALTER TABLE `category_translations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Index pour la table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`city_id`);

--
-- Index pour la table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`faq_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Index pour la table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`menu_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Index pour la table `professionals`
--
ALTER TABLE `professionals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Index pour la table `traffic`
--
ALTER TABLE `traffic`
  ADD PRIMARY KEY (`traffic_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activities`
--
ALTER TABLE `activities`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `activity_faq`
--
ALTER TABLE `activity_faq`
  MODIFY `faq_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `activity_hours`
--
ALTER TABLE `activity_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `activity_images`
--
ALTER TABLE `activity_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `activity_reviews`
--
ALTER TABLE `activity_reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `amenity_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `category_translations`
--
ALTER TABLE `category_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `cities`
--
ALTER TABLE `cities`
  MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `faq_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `menus`
--
ALTER TABLE `menus`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `professionals`
--
ALTER TABLE `professionals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `traffic`
--
ALTER TABLE `traffic`
  MODIFY `traffic_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `activities_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `activities_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`);

--
-- Contraintes pour la table `activity_faq`
--
ALTER TABLE `activity_faq`
  ADD CONSTRAINT `activity_faq_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `activity_hours`
--
ALTER TABLE `activity_hours`
  ADD CONSTRAINT `activity_hours_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `activity_images`
--
ALTER TABLE `activity_images`
  ADD CONSTRAINT `activity_images_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `activity_reviews`
--
ALTER TABLE `activity_reviews`
  ADD CONSTRAINT `activity_reviews_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `amenities`
--
ALTER TABLE `amenities`
  ADD CONSTRAINT `amenities_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`);

--
-- Contraintes pour la table `category_translations`
--
ALTER TABLE `category_translations`
  ADD CONSTRAINT `category_translations_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Contraintes pour la table `faqs`
--
ALTER TABLE `faqs`
  ADD CONSTRAINT `faqs_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`);

--
-- Contraintes pour la table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`);

--
-- Contraintes pour la table `professionals`
--
ALTER TABLE `professionals`
  ADD CONSTRAINT `professionals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `traffic`
--
ALTER TABLE `traffic`
  ADD CONSTRAINT `traffic_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
