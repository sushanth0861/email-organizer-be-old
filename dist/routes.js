"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./controller/user.controller");
const authenticate_1 = require("./middleware/authenticate");
const mail_controler_1 = require("./controller/mail.controler");
const misc_controller_1 = require("./controller/misc.controller");
const folder_controler_1 = require("./controller/folder.controler");
function routes(app) {
    //health check
    app.get("/api/test", async (req, res) => {
        res.send("Server is healthy");
    });
    app.post("/api/register", user_controller_1.register);
    app.post("/api/login", user_controller_1.login);
    app.post("/api/get-user-details", authenticate_1.authenticateJWT, user_controller_1.userDetails);
    app.post("/api/send-mail", mail_controler_1.sendMail); //handel drafts
    app.post("/api/delete-mail", mail_controler_1.deleteMail);
    app.post("/api/get-mail", misc_controller_1.getAllMail);
    // app.post("/api/get-mail-by-category",  getMail)
    app.post("/api/change-category", misc_controller_1.changeCategory);
    app.post("/api/get-mail-by-category", misc_controller_1.getMailsByCategory);
    //folders routes
    app.post("/api/get-folders", folder_controler_1.getFolders);
    app.post("/api/create-folder", folder_controler_1.createFolder);
    app.post("/api/add-mail-to-folder", folder_controler_1.saveMailToFolder);
    app.post("/api/delete-mail-from-folder", folder_controler_1.removeMailFromFolder);
    app.post("/api/fetch-mail-by-folder", folder_controler_1.getMailsFromFolder);
    app.post("/api/mark-unread", mail_controler_1.markUnread);
    app.post("/api/mark-read", mail_controler_1.markRead);
    app.post("/api/add-draft", misc_controller_1.addDraft);
    app.post("/api/get-draft", misc_controller_1.getDrafts);
    app.post("/api/star-mail", misc_controller_1.starMail);
    app.post("/api/move-mail", mail_controler_1.moveMail);
    app.post("/api/sent-mail", misc_controller_1.stenMail);
}
exports.default = routes;
//# sourceMappingURL=routes.js.map