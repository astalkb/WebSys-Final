-- CreateTable
CREATE TABLE `PageContent` (
    `id` VARCHAR(191) NOT NULL,
    `page` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PageContent_page_key`(`page`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
