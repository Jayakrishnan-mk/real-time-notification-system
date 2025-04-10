import express from "express";
import { validate } from "../middleware/validate";
import {
    deleteNotificationController,
    getNotifications,
    getUserNotifications,
    markNotificationReadController,
    sendNotification,
    unreadCountController,
} from "../controllers/notificationController";
import {
    CreateNotificationDTO,
    DeleteNotificationDTO,
    GetUserNotificationsDTO,
} from "../dtos/input/notification.input";
import { authMiddleware } from "@/middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification-related APIs
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications (Public)
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get("/", getNotifications);

router.use(authMiddleware);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Send a notification to a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 4
 *               title:
 *                 type: string
 *                 example: "System Alert"
 *               message:
 *                 type: string
 *                 example: "Server will restart at midnight"
 *               type:
 *                 type: string
 *                 enum: [push, email, sms]
 *                 example: "push"
 *     responses:
 *       200:
 *         description: Notification job queued successfully
 */
router.post("/", validate(CreateNotificationDTO), sendNotification);

/**
 * @swagger
 * /api/notifications/user:
 *   get:
 *     summary: Get notifications for a specific user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user whose notifications are to be fetched
 *     responses:
 *       200:
 *         description: User-specific notifications
 */
router.get("/user", validate(GetUserNotificationsDTO, "query"), getUserNotifications);

/**
 * @swagger
 * /api/notifications/mark-read:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as read
 */
router.patch("/mark-read", markNotificationReadController);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count for logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count of unread notifications
 */
router.get("/unread-count", unreadCountController);

/**
 * @swagger
 * /api/notifications:
 *   delete:
 *     summary: Delete a notification for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: 12
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete("/", validate(DeleteNotificationDTO), deleteNotificationController);

export default router;
