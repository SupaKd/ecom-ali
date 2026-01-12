-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : lun. 12 jan. 2026 à 18:50
-- Version du serveur : 8.0.40
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('order_manager','product_manager') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password_hash`, `name`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'commandes@ecommerce.com', '$2b$10$AyxyDjmG4JHhYoQ4NjX1eeaKoKMCLu9EQh.Yae6Qoly4kF9g8Rnii', 'Admin Commandes', 'order_manager', 1, '2026-01-12 17:01:26', '2026-01-10 14:46:57', '2026-01-12 17:01:26'),
(2, 'produits@ecommerce.com', '$2b$10$AyxyDjmG4JHhYoQ4NjX1eeaKoKMCLu9EQh.Yae6Qoly4kF9g8Rnii', 'Admin Produits', 'product_manager', 1, '2026-01-12 17:00:51', '2026-01-10 14:46:57', '2026-01-12 17:00:51');

-- --------------------------------------------------------

--
-- Structure de la table `brands`
--

CREATE TABLE `brands` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Chanel', 'chanel', 'Parfums orientaux Chanel', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(2, 'Oud', 'oud', 'Collection Oud authentique', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(3, 'Dior', 'dior', 'Parfums Dior', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(4, 'Maison Francis', 'maison-francis', 'Parfumerie de luxe', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57');

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Parfums', 'parfums', '/images/products/chanel-fraise.jpg\n', 1, 1, '2026-01-10 14:46:57', '2026-01-12 16:37:31'),
(2, 'Vaisselle & Décoration', 'vaisselle-decoration', '/images/products/chanel-fraise.jpg\n', 2, 1, '2026-01-10 14:46:57', '2026-01-12 16:37:33'),
(3, 'Articles Islamiques', 'articles-islamiques', '/images/products/chanel-fraise.jpg\n', 3, 1, '2026-01-10 14:46:57', '2026-01-12 16:37:35'),
(4, 'Alimentation', 'alimentation', '/images/products/chanel-fraise.jpg\n', 4, 1, '2026-01-10 14:46:57', '2026-01-12 16:37:37');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_postal_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_country` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'France',
  `total_amount` decimal(10,2) NOT NULL,
  `stripe_payment_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('pending','paid','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `order_status` enum('pending','processing','shipped','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `customer_email`, `customer_name`, `customer_phone`, `shipping_address`, `shipping_city`, `shipping_postal_code`, `shipping_country`, `total_amount`, `stripe_payment_id`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES
(3, 'ORD-1768068847566-9122', 'supaco.digital@gmail.com', 'Kevin Khek', '0783052412', '1b Rue de la Prairie', 'Saint-Genis-Pouilly', '01630', 'France', 45.00, 'pi_3So6g2IVAdbyXDlk077uWgAK', 'paid', 'shipped', '2026-01-10 18:14:07', '2026-01-10 19:46:32'),
(4, 'ORD-1768096870586-4536', 'supaco.digital@gmail.com', 'kdk', '0783052412', '1b rue de la prairie', 'saint-genis-pouilly', '01630', 'France', 50.00, 'pi_3SoDy5IVAdbyXDlk1xQvgWWt', 'paid', 'delivered', '2026-01-11 02:01:10', '2026-01-11 14:00:35'),
(5, 'ORD-1768243752295-980', 'supaco.digital@gmail.com', 'Kevin Khek', '0783052412', '1b Rue de la Prairie', 'Saint-Genis-Pouilly', '01630', 'France', 68.00, NULL, 'pending', 'pending', '2026-01-12 18:49:12', '2026-01-12 18:49:12');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `unit_price`, `subtotal`, `created_at`) VALUES
(3, 3, 1, 'Chanel Fraise', 1, 45.00, 45.00, '2026-01-10 18:14:07'),
(4, 4, 3, 'Chanel Vanille', 1, 50.00, 50.00, '2026-01-11 02:01:10'),
(5, 5, 8, 'Oud Ambre', 1, 68.00, 68.00, '2026-01-12 18:49:12');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `description`, `price`, `stock_quantity`, `sku`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'Chanel Fraise', 'chanel-fraise', 'Parfum oriental aux notes fruitées de fraise', 45.00, 10, 'CHAN-FRAISE-001', 1, '2026-01-10 14:46:57', '2026-01-11 01:18:45'),
(2, 1, 1, 'Chanel Pomme', 'chanel-pomme', 'Parfum oriental aux notes de pomme verte', 45.00, 15, 'CHAN-POMME-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(3, 1, 1, 'Chanel Vanille', 'chanel-vanille', 'Parfum oriental aux notes douces de vanille', 50.00, 9, 'CHAN-VANILLE-001', 1, '2026-01-10 14:46:57', '2026-01-11 02:01:10'),
(4, 1, 1, 'Chanel Citron', 'chanel-citron', 'Parfum oriental aux notes fraîches de citron', 45.00, 18, 'CHAN-CITRON-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(5, 1, 2, 'Oud Rose', 'oud-rose', 'Oud authentique aux notes délicates de rose', 65.00, 8, 'OUD-ROSE-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(6, 1, 2, 'Oud Jasmin', 'oud-jasmin', 'Oud authentique aux notes de jasmin blanc', 65.00, 12, 'OUD-JASMIN-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(7, 1, 2, 'Oud Musc', 'oud-musc', 'Oud authentique aux notes profondes de musc', 70.00, 6, 'OUD-MUSC-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(8, 1, 2, 'Oud Ambre', 'oud-ambre', 'Oud authentique aux notes chaudes d\'ambre', 68.00, 8, 'OUD-AMBRE-001', 1, '2026-01-10 14:46:57', '2026-01-12 18:49:12'),
(9, 1, 3, 'Dior Floral', 'dior-floral', 'Notes florales délicates et raffinées', 55.00, 18, 'DIOR-FLORAL-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(10, 1, 3, 'Dior Ambre', 'dior-ambre', 'Notes ambrées intenses et envoûtantes', 60.00, 14, 'DIOR-AMBRE-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(11, 1, 3, 'Dior Musc', 'dior-musc', 'Notes musquées élégantes', 58.00, 16, 'DIOR-MUSC-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(12, 1, 4, 'Maison Francis Oud', 'maison-francis-oud', 'Oud de luxe aux notes boisées', 85.00, 5, 'MF-OUD-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57'),
(13, 1, 4, 'Maison Francis Rose', 'maison-francis-rose', 'Rose précieuse aux notes délicates', 80.00, 7, 'MF-ROSE-001', 1, '2026-01-10 14:46:57', '2026-01-10 14:46:57');

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--

CREATE TABLE `product_images` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `created_at`) VALUES
(1, 1, '/images/products/chanel-fraise.jpg', 'Parfum Chanel Fraise', '2026-01-10 14:46:57'),
(2, 2, '/images/products/chanel-fraise.jpg', 'Parfum Chanel Pomme', '2026-01-10 14:46:57'),
(3, 3, '/images/products/chanel-fraise.jpg', 'Parfum Chanel Vanille', '2026-01-10 14:46:57'),
(4, 4, '/images/products/chanel-fraise.jpg', 'Parfum Chanel Citron', '2026-01-10 14:46:57'),
(5, 5, '/images/products/chanel-fraise.jpg', 'Parfum Oud Rose', '2026-01-10 14:46:57'),
(6, 6, '/images/products/chanel-fraise.jpg', 'Parfum Oud Jasmin', '2026-01-10 14:46:57'),
(7, 7, '/images/products/chanel-fraise.jpg', 'Parfum Oud Musc', '2026-01-10 14:46:57'),
(8, 8, '/images/products/chanel-fraise.jpg', 'Parfum Oud Ambre', '2026-01-10 14:46:57'),
(9, 9, '/images/products/chanel-fraise.jpg', 'Parfum Dior Floral', '2026-01-10 14:46:57'),
(10, 10, '/images/products/chanel-fraise.jpg', 'Parfum Dior Ambre', '2026-01-10 14:46:57'),
(11, 11, '/images/products/chanel-fraise.jpg', 'Parfum Dior Musc', '2026-01-10 14:46:57'),
(12, 12, '/images/products/chanel-fraise.jpg', 'Parfum Maison Francis Oud', '2026-01-10 14:46:57'),
(13, 13, '/images/products/chanel-fraise.jpg', 'Parfum Maison Francis Rose', '2026-01-10 14:46:57');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_brands_slug` (`slug`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_categories_slug` (`slug`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_orders_email` (`customer_email`),
  ADD KEY `idx_orders_number` (`order_number`),
  ADD KEY `idx_orders_status` (`order_status`),
  ADD KEY `idx_orders_payment_status` (`payment_status`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_items_order` (`order_id`),
  ADD KEY `idx_order_items_product` (`product_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_brand` (`brand_id`),
  ADD KEY `idx_products_slug` (`slug`),
  ADD KEY `idx_products_sku` (`sku`),
  ADD KEY `idx_products_active` (`is_active`);

--
-- Index pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT;

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE RESTRICT;

--
-- Contraintes pour la table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
