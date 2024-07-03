import { Express, Request, Response } from "express";
import { login, register, userDetails } from "../src/controller/user.controller";
import { authenticateJWT } from "../src/middleware/authenticate";
import {
  deleteMail,
  markRead,
  markUnread,
  moveMail,
  sendMail,
} from "../src/controller/mail.controler";
import {
  addDraft,
  changeCategory,
  getAllMail,
  getDrafts,
  getMailsByCategory,
  starMail,
  stenMail,
} from "../src/controller/misc.controller";
import {
  createFolder,
  getFolders,
  getMailsFromFolder,
  removeMailFromFolder,
  saveMailToFolder,
} from "../src/controller/folder.controler";

function routes(app: Express) {
  //health check
  app.get("/api/test", async (req: Request, res: Response) => {
    res.send("Server is healthy");
  });

  app.post("/api/register", register);
  app.post("/api/login", login);
  app.post("/api/get-user-details", authenticateJWT, userDetails);

  app.post("/api/send-mail", sendMail); // handle drafts
  app.post("/api/delete-mail", deleteMail);

  app.post("/api/get-mail", getAllMail);
  app.post("/api/change-category", changeCategory);
  app.post("/api/get-mail-by-category", getMailsByCategory);

  // folders routes
  app.post("/api/get-folders", getFolders);
  app.post("/api/create-folder", createFolder);
  app.post("/api/add-mail-to-folder", saveMailToFolder);
  app.post("/api/delete-mail-from-folder", removeMailFromFolder);
  app.post("/api/fetch-mail-by-folder", getMailsFromFolder);

  app.post("/api/mark-unread", markUnread);
  app.post("/api/mark-read", markRead);

  app.post("/api/add-draft", addDraft);
  app.post("/api/get-draft", getDrafts);

  app.post("/api/star-mail", starMail);

  app.post("/api/move-mail", moveMail);

  app.post("/api/sent-mail", stenMail);
}

export default routes;
