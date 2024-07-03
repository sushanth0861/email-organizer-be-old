import { prisma } from "../lib/db";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/generate-jwt";
import axios from "axios";
import { imapConfig } from "../lib/imapConfig";
import { fetchEmails } from "../utils/fetch-imap";

export const register = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      date_of_birth,
    }: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      phone_number: string;
      date_of_birth: string;
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email_id: email },
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const domain = process.env.DOMAIN;
    const cp_email = email;
    const cp_password = password;
    const url = `https://cpanel.uta1.uta.cloud:2083/execute/Email/add_pop?domain=${domain}&email=${cp_email}&password=${imapConfig.imap.password}`;

    const config = {
      headers: {
        Authorization: "cpanel sxa4991:W25LHC0HK6EIFCT5YP6IMZ4PTU9DY4S2",
      },
    };

    axios
      .get(url, config)
      .then((response) => {
        console.log("Response:", response.data);
        if (response.data.errors) {
          return res.status(400).json({ message: "error from cpanel" });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email_id: `${email}@${domain}`,
        password: hashedPassword,
        phone_number,
        date_of_birth,
      },
    });

    // create mail on cpannel

    // Generate a JWT
    const token = generateToken({ id: user.id, email: user.email_id });

    // Set the JWT as a cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email_id: email } });


    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log(isPasswordValid);

    ///////////////////////////////////////////////
    // Fetch emails from IMAP server
    const emails = await fetchEmails(email, imapConfig.imap.password);
    // console.log(emails)
    // Save fetched emails to the database if they don't already exist
    for (const email of emails) {
      const existingEmail = await prisma.email.findUnique({
        where: { id: email.id },
      });

      if (!existingEmail) {
        await prisma.email.create({
          data: {
            id: email.id,
            sender: email.sender,
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
            user_id: user.id,
          },
          create: {
            user_id: user.id,
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
    //////////////////////////////////////////////
    // Generate a JWT
    const token = await generateToken({ id: user.id, email: user.email_id });

    // Set the JWT as a cookie
    res.cookie("token", token, { httpOnly: true });

    const payload = {
      token,
      name: user.first_name,
      email: user.email_id,
      user_id: user.id,
    };

    return res.json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userDetails = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;

    const user = await prisma.user.findUnique({ where: { email_id: email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const payload = {
      name: user.first_name,
      email: user.email_id,
      user_id: user.id,
    };

    res.json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
