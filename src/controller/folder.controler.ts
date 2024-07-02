import { prisma } from "../lib/db";
import { Request, Response } from "express";

export const createFolder = async (req: Request, res: Response) => {
  const { user_id, name } = req.body;

  try {
    const folder = await prisma.folders.create({
      data: {
        user_id,
        name,
      },
    });
    res.json({ message: "Folder created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while creating the folder",
        error: error.message,
      });
  }
};

export const getFolders = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  try {
    const folders = await prisma.folders.findMany({
      where: {
        user_id,
      },
    });
    console.log("\n\n\n\n", folders, "\n\n\n\n");

    let response=[]
    for(let i = 0; i < folders.length; i++) {
      const folder = folders[i];
      const mails = await prisma.email.findMany({
        where: {
          id: {
            in: folder.mails,
          },
        },
      });
      response.push({ ...folder, mails });
    }
    res.json({ message: "Folders fetched successfully", folders });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while fetching the folders",
        error: error.message,
      });
  }
};
export const saveMailToFolder = async (req: Request, res: Response) => {
  const { folder_id, user_id, mail_id } = req.body;

  try {
    const folder = await prisma.folders.findUnique({
      where: {
        id: folder_id,
      },
    });
    if(!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if(mail_id in folder.mails) {
      return res.status(400).json({ message: "Mail already in folder" });
    }
    await prisma.folders.update({
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
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while saving the mail to the folder",
        error: error.message,
      });
  }
};

export const removeMailFromFolder = async (req: Request, res: Response) => {
  const { folder_id, mail_id } = req.body;

  try {
    const folder = await prisma.folders.findUnique({
      where: {
        id: folder_id,
      },
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const updatedMails = folder.mails.filter((mail) => mail !== mail_id);
    const updatedFolder = await prisma.folders.update({
      where: {
        id: folder_id,
      },
      data: {
        mails: updatedMails,
      },
    });
    res.json({ message: "Mail removed from folder successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while removing the mail from the folder",
      error: error.message,
    });
  }
};

export const getMailsFromFolder = async (req: Request, res: Response) => {
  const { folder_id } = req.body;

  try {
    const folder = await prisma.folders.findUnique({
      where: {
        id: folder_id,
      },
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const mailIds = folder.mails;
    const mails = await prisma.email.findMany({
      where: {
        id: {
          in: mailIds,
        },
      },
    });
    const newPayload= mails.map((m) => {
        return {
          id: m.id,
          name: "...", // You can adjust this as needed
          email: m.sender,
          subject: m.subject,
          text: m.body,
          date: m.email_time_stamp,
          read: m.read,
          star: m.star,}
      })

    res.json({ message: "Mails fetched successfully", mails:newPayload });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while fetching the mails from the folder",
        error: error.message,
      });
  }
};
