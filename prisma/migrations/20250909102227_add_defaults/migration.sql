-- CreateTable
CREATE TABLE `address` (
    `address_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NULL,
    `address_type` VARCHAR(255) NULL,
    `recipient_first_name` VARCHAR(255) NULL,
    `recipient_last_name` VARCHAR(255) NULL,
    `company_name` VARCHAR(255) NULL,
    `address_name` VARCHAR(255) NULL,
    `apartment_name` VARCHAR(255) NULL,
    `postal_code` INTEGER NULL,
    `city_name` VARCHAR(255) NULL,
    `region_name` VARCHAR(255) NULL,
    `phone_number` INTEGER NULL,

    INDEX `user_ID`(`user_ID`),
    PRIMARY KEY (`address_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_items` (
    `cart_item_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NULL,
    `product_item_ID` INTEGER NULL,
    `cart_item_image` VARCHAR(255) NULL,
    `cart_item_name` VARCHAR(50) NULL,
    `cart_item_price` DECIMAL(10, 2) NULL,
    `cart_item_size` VARCHAR(255) NULL,
    `cart_item_color` VARCHAR(255) NULL,
    `cart_item_qty` INTEGER NULL,
    `cart_item_total` DECIMAL(10, 2) NULL,
    `cart_item_date` DATETIME(0) NULL,

    INDEX `product_item_ID`(`product_item_ID`),
    INDEX `user_ID`(`user_ID`),
    PRIMARY KEY (`cart_item_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deleted` (
    `deleted_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NULL,
    `deleted_item_ID` INTEGER NULL,
    `deleted_item_table` VARCHAR(50) NULL,
    `deleted_date` DATETIME(0) NULL,

    INDEX `user_ID`(`user_ID`),
    PRIMARY KEY (`deleted_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_details` (
    `order_detail_ID` INTEGER NOT NULL,
    `order_purchased_ID` INTEGER NULL,
    `product_item_ID` INTEGER NULL,
    `order_detail_name` VARCHAR(255) NULL,
    `order_detail_qty` INTEGER NULL,
    `order_detail_price` DECIMAL(10, 2) NULL,
    `order_detail_size` VARCHAR(50) NULL,

    INDEX `order_purchased_ID`(`order_purchased_ID`),
    INDEX `product_item_ID`(`product_item_ID`),
    PRIMARY KEY (`order_detail_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_purchased` (
    `order_purchased_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NULL,
    `delivery_address_ID` INTEGER NULL,
    `billing_address_ID` INTEGER NULL,
    `payment_ID` INTEGER NULL,
    `order_purchased_totalAmount` DECIMAL(10, 2) NULL,
    `order_purchased_date` DATETIME(0) NULL,
    `order_purchased_status` VARCHAR(25) NULL,

    INDEX `billing_address_ID`(`billing_address_ID`),
    INDEX `delivery_address_ID`(`delivery_address_ID`),
    INDEX `payment_ID`(`payment_ID`),
    INDEX `user_ID`(`user_ID`),
    PRIMARY KEY (`order_purchased_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `payment_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NULL,
    `payment_method` VARCHAR(255) NULL,
    `payment_amount` DECIMAL(10, 2) NULL,
    `payment_date` DATETIME(0) NULL,

    INDEX `user_ID`(`user_ID`),
    PRIMARY KEY (`payment_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_items` (
    `product_item_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NULL,
    `product_item_name` VARCHAR(255) NULL,
    `product_item_price` DECIMAL(10, 2) NULL,
    `product_item_image` VARCHAR(255) NULL,
    `product_item_color` VARCHAR(255) NULL,
    `product_item_size` VARCHAR(255) NULL,
    `product_item_material` VARCHAR(255) NULL,
    `product_item_construction` VARCHAR(255) NULL,
    `product_item_design_features` VARCHAR(255) NULL,
    `product_item_stock` INTEGER NULL,
    `product_item_displayDate` DATETIME(0) NULL,
    `product_item_status` VARCHAR(255) NULL,
    `product_item_back_image` VARCHAR(255) NULL,

    INDEX `user_ID`(`user_ID`),
    PRIMARY KEY (`product_item_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `returns` (
    `return_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NULL,
    `return_item_ID` INTEGER NULL,
    `return_status` VARCHAR(50) NULL,
    `return_type_issue` VARCHAR(50) NULL,
    `return_date` DATETIME(0) NULL,

    INDEX `user_ID`(`user_ID`),
    PRIMARY KEY (`return_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_image` VARCHAR(255) NULL,
    `username` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `role` VARCHAR(50) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`user_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_feedback` (
    `feedback_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NULL,
    `order_detail_ID` INTEGER NULL,
    `feedback_comment` VARCHAR(255) NULL,
    `feedback_rating` INTEGER NULL,
    `feedback_date` DATETIME(0) NULL,

    INDEX `order_detail_ID`(`order_detail_ID`),
    INDEX `user_ID`(`user_ID`),
    PRIMARY KEY (`feedback_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_item_ID`) REFERENCES `product_items`(`product_item_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `deleted` ADD CONSTRAINT `deleted_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_purchased_ID`) REFERENCES `order_purchased`(`order_purchased_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_item_ID`) REFERENCES `product_items`(`product_item_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_purchased` ADD CONSTRAINT `order_purchased_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_purchased` ADD CONSTRAINT `order_purchased_ibfk_2` FOREIGN KEY (`delivery_address_ID`) REFERENCES `address`(`address_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_purchased` ADD CONSTRAINT `order_purchased_ibfk_3` FOREIGN KEY (`billing_address_ID`) REFERENCES `address`(`address_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_purchased` ADD CONSTRAINT `order_purchased_ibfk_4` FOREIGN KEY (`payment_ID`) REFERENCES `payments`(`payment_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_items` ADD CONSTRAINT `product_items_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `returns` ADD CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_feedback` ADD CONSTRAINT `users_feedback_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_feedback` ADD CONSTRAINT `users_feedback_ibfk_2` FOREIGN KEY (`order_detail_ID`) REFERENCES `order_details`(`order_detail_ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
