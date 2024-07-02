import { Category } from "@prisma/client";
import { prisma } from "../lib/db";
import { Request, Response } from "express";
import { fetchEmails } from "../utils/fetch-imap";
import { imapConfig } from "../lib/imapConfig";

// export const getAllMail = async (req: Request, res: Response) => {
//   try {
//     const email = req.body.email;

//     const allMails = await prisma.email.findMany({
//       where: {
//         reciver: email,
//       },
//     });
//     // console.log(allMails);

//     const payload = allMails.map((m) => {

//       return {
//         id: m.id,
//         email: m.sender,
//         subject: m.subject,
//         text: m.body,
//         date: m.email_time_stamp,
//         read: m.read,
//         category: // get from category table
//       };
//     });
//     console.log(payload)
//     res.json({ message: "responce is comming", payload });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMail = async (req: Request, res: Response) => {
//   try {
//     const { email, category } = req.body;
//     console.log({ email, category });
//     const allMails = await prisma.email.findMany({
//       where: {
//         email_id: email,
//         category: category as Category,
//       },
//     });

//     const payload = allMails.map((m) => {

//       return {
//         id: m.id,
//         name: "...",
//         email: m.email_id,
//         subject: m.subject,
//         text: m.body,
//         date: "2023-12-01T09:00:00",
//         read: false,
//         labels: [`${m.category}`],
//       };
//     });
//     res.json({ message: "responce is comming", payload });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const extractEmail = (str) => {
  const emailPattern = /<([^>]+)>/;
  const match = str.match(emailPattern);
  return match ? match[1] : null;
};
export const getAllMail = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user_id = req.body.user_id;
    const category = req.body.category;

    //////////////////////////////////////////////////////////
    const emails = await fetchEmails(email, imapConfig.imap.password);
    console.log(emails);
    // Save fetched emails to the database if they don't already exist
    for (const email of emails) {
      const existingEmail = await prisma.email.findUnique({
        where: { id: email.id },
      }); 
      console.log(email)

      if (!existingEmail) {
        await prisma.email.create({
          data: {
            id: email.id,
            sender: extractEmail(email.sender)|| email.sender,
            reciver: email.receiver,
            subject: email.subject,
            body: email.body,
            email_time_stamp: new Date(email.date),
            orignal_email_id: email.receiver,
            read: false,
            star: false,
          },
        });

        await prisma.category.upsert({
          where: {
            user_id: user_id,
          },
          create: {
            user_id: user_id,
            inbox: [email.id],
          },
          update: {
            inbox: {
              push: email.id,
            },
          },
        });
      }
    }
    //////////////////////////////////////////////////////////

    // Step 1: Fetch category data for the user
    const categoryResult = await prisma.category.findFirst({
      where: { user_id },
    });
    console.log(categoryResult);

    if (!categoryResult) {
      return res
        .status(404)
        .json({ message: "User not found or no categories available." });
    }
    let mailIds = [];
    if (category === "inbox") mailIds = categoryResult.inbox;
    else if (category === "trash") mailIds = categoryResult.trash;
    else if (category === "junk") mailIds = categoryResult.junk;
    else mailIds = categoryResult.archive;
    // assuming inbox is an array of mail_id strings

    if (!mailIds || mailIds.length === 0) {
      return res
        .status(200)
        .json({ message: "No mails in the inbox.", payload: [] });
    }
    const mailIdsString = `(${mailIds.map((id) => `'${id}'`).join(",")})`;
    // Step 2: Fetch all mails with the IDs in the inbox
    // const mailsResult:{id:string,sender:string,subject:string,body:string,date:string,read:boolean}[] = await prisma.$queryRaw`
    //   SELECT
    //     e.id,
    //     e.sender,
    //     e.subject,
    //     e.body,
    //     e.email_time_stamp AS date,
    //     e.read
    //   FROM
    //     "Email" e
    //   WHERE
    //     e.id IN ${mailIdsString};
    // `;
    const mailsResult = await prisma.email.findMany({
      where: {
        id: {
          in: mailIds,
        },
      },
    });
    // for (let i = 0; i < mailIds.length; i++) {
    //   const mail = await prisma.email.findFirst({ where: { id: mailIds[i] } });
    //   console.log("mail:", mail);
    //   mailsResult.push(mail);
    // }
    console.log(mailsResult);
    const payload = await Promise.all(
      mailsResult.map(async (m) => {
        const sender = await prisma.user.findUnique({
          where: { email_id: m.sender },
        });
        console.log(mailsResult);
        const payload = mailsResult.map((m) => {
          return {
            id: m.id,
            name: "...", // You can adjust this as needed
            email: m.sender,
            subject: m.subject,
            text: m.body,
            date: m.email_time_stamp,
            read: m.read,
            star: m.star,
          };
        });

        const name = sender
          ? `${sender.first_name} ${sender.last_name}`
          : "...";

        return {
          id: m.id,
          name,
          email: m.sender,
          subject: m.subject,
          text: m.body,
          date: m.email_time_stamp,
          read: m.read,
          category,
          star: m.star,
        };
      })
    );
    console.log(payload);
    res.json({ message: "Response is coming", payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMailsByCategory = async (req: Request, res: Response) => {
  try {
    const { user_id, category } = req.body;
    const categoryData = await prisma.category.findFirst({
      where: { user_id },
    });
    const mailIds = categoryData[category];
    const payload = await prisma.email.findMany({
      where: {
        id: {
          in: mailIds,
        },
      },
    });

//     category
// : 
// "inbox"
// date
// : 
// "2024-07-01T21:08:01.000Z"
// email
// : 
// "yadvendras20@gmail.com"
// id
// : 
// "5poi@sxa4991.uta.cloud"
// name
// : 
// "..."
// read
// : 
// false
// star
// : 
// false
// subject
// : 
// "recived mail 3"
// text
// : 
// "--00000000000


    const newPayload= payload.map((m) => {
      return {
        id: m.id,
        category,
        name: "...", // You can adjust this as needed
        email: m.sender,
        subject: m.subject,
        text: m.body,
        date: m.email_time_stamp,
        read: m.read,
        star: m.star,}
    })
    res.json({ message: "Response is comming", mails: newPayload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const changeCategory = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      mail_id,
      prev_category,
      category,
    }: {
      user_id: string;
      mail_id: string;
      prev_category: string;
      category: string;
    } = req.body;

    const categoryData = await prisma.category.findFirst({
      where: { user_id },
    });
    console.log("hit", {
      user_id,
      mail_id,
      prev_category,
      category,
    });
    let update = {};

    if (prev_category === "Index") {
      categoryData.inbox = categoryData.inbox.filter((id) => id !== mail_id);
      update = { inbox: categoryData.inbox };
    } else if (prev_category === "Trash") {
      categoryData.trash = categoryData.trash.filter((id) => id !== mail_id);
      update = { trash: categoryData.trash };
    } else if (prev_category === "Junk") {
      categoryData.junk = categoryData.junk.filter((id) => id !== mail_id);
      update = { junk: categoryData.junk };
    } else {
      categoryData.archive = categoryData.archive.filter(
        (id) => id !== mail_id
      );
      update = { archive: categoryData.archive };
    }
    console.log(update);
    await prisma.category.update({
      where: { id: categoryData.id },
      data: update,
    });

    if (category === "Junk") update = { junk: [...categoryData.junk, mail_id] };
    else if (category === "Trash")
      update = { trash: [...categoryData.trash, mail_id] };
    else update = { archive: [...categoryData.archive, mail_id] };
    //remove from previous category and add to new category

    console.log(update);

    await prisma.category.update({
      where: { id: categoryData.id },
      data: update,
    });
    res.send("Category updated");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addDraft = async (req: Request, res: Response) => {
  const { user_id, from, to, subject, text } = req.body;

  try {
    const email = await prisma.draft.create({
      data: { user_id, from, to, subject, text },
    });

    res.status(201).json({ message: "Draft saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDrafts = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  try {
    const drafts = await prisma.draft.findMany({
      where: {
        user_id,
      },
    });
    const payload = drafts.map((m) => {
      return {
        id: m.id,
        from: m.from,
        to: m.to,
        subject: m.subject,
        text: m.text,
        draft:true
      };
    });
    
    res.json({ message: "Drafts fetched successfully", mails:payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteDraft = async (req: Request, res: Response) => {
  const { draft_id } = req.body;
  try {
    const deletedDraft = await prisma.draft.delete({
      where: {
        id: draft_id,
      },
    });
    res.json({ message: "Draft deleted successfully", deletedDraft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const starMail = async (req: Request, res: Response) => {
  const { mail_id, status } = req.body;

  try {
    await prisma.email.update({
      where: {
        id: mail_id,
      },
      data: {
        star: status ?? true,
      },
    });

    res.json({ message: "Mail starred successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const stenMail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const mails = await prisma.email.findMany({
      where: {
        sender: email,
      }})

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
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }}