"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailsFromFolder = exports.removeMailFromFolder = exports.saveMailToFolder = exports.getFolders = exports.createFolder = void 0;
const db_1 = require("../lib/db");
const createFolder = async (req, res) => {
    const { user_id, name } = req.body;
    try {
        const folder = await db_1.prisma.folders.create({
            data: {
                user_id,
                name,
            },
        });
        res.json({ message: "Folder created successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({
            message: "An error occurred while creating the folder",
            error: error.message,
        });
    }
};
exports.createFolder = createFolder;
const getFolders = async (req, res) => {
    const { user_id } = req.body;
    try {
        const folders = await db_1.prisma.folders.findMany({
            where: {
                user_id,
            },
        });
        console.log("\n\n\n\n", folders, "\n\n\n\n");
        let response = [];
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            const mails = await db_1.prisma.email.findMany({
                where: {
                    id: {
                        in: folder.mails,
                    },
                },
            });
            response.push(Object.assign(Object.assign({}, folder), { mails }));
        }
        res.json({ message: "Folders fetched successfully", folders });
    }
    catch (error) {
        res
            .status(500)
            .json({
            message: "An error occurred while fetching the folders",
            error: error.message,
        });
    }
};
exports.getFolders = getFolders;
const saveMailToFolder = async (req, res) => {
    const { folder_id, user_id, mail_id } = req.body;
    try {
        const folder = await db_1.prisma.folders.findUnique({
            where: {
                id: folder_id,
            },
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        if (mail_id in folder.mails) {
            return res.status(400).json({ message: "Mail already in folder" });
        }
        await db_1.prisma.folders.update({
            where: {
                id: folder_id,
            },
            data: {
                mails: {
                    push: mail_id,
                },
            },
        });
        res.json({ message: "Mail saved to folder successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({
            message: "An error occurred while saving the mail to the folder",
            error: error.message,
        });
    }
};
exports.saveMailToFolder = saveMailToFolder;
const removeMailFromFolder = async (req, res) => {
    const { folder_id, mail_id } = req.body;
    try {
        const folder = await db_1.prisma.folders.findUnique({
            where: {
                id: folder_id,
            },
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        const updatedMails = folder.mails.filter((mail) => mail !== mail_id);
        const updatedFolder = await db_1.prisma.folders.update({
            where: {
                id: folder_id,
            },
            data: {
                mails: updatedMails,
            },
        });
        res.json({ message: "Mail removed from folder successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while removing the mail from the folder",
            error: error.message,
        });
    }
};
exports.removeMailFromFolder = removeMailFromFolder;
const getMailsFromFolder = async (req, res) => {
    const { folder_id } = req.body;
    try {
        const folder = await db_1.prisma.folders.findUnique({
            where: {
                id: folder_id,
            },
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        const mailIds = folder.mails;
        const mails = await db_1.prisma.email.findMany({
            where: {
                id: {
                    in: mailIds,
                },
            },
        });
        const newPayload = [];
        for (const m of mails) {
            const sender = await db_1.prisma.user.findUnique({
                where: { email_id: m.sender },
            });
            const name = sender ? `${sender.first_name} ${sender.last_name}` : "...";
            newPayload.push({
                id: m.id,
                name, // You can adjust this as needed
                email: m.sender,
                subject: m.subject,
                text: m.body,
                date: m.email_time_stamp,
                read: m.read,
                star: m.star,
            });
        }
        res.json({ message: "Mails fetched successfully", mails: newPayload });
    }
    catch (error) {
        res
            .status(500)
            .json({
            message: "An error occurred while fetching the mails from the folder",
            error: error.message,
        });
    }
};
exports.getMailsFromFolder = getMailsFromFolder;
//# sourceMappingURL=folder.controler.js.map