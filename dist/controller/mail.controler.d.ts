import { Request, Response } from "express";
export declare const sendMail: (req: Request, res: Response) => Promise<void>;
export declare const deleteMail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const markUnread: (req: Request, res: Response) => Promise<void>;
export declare const markRead: (req: Request, res: Response) => Promise<void>;
export declare const moveMail: (req: Request, res: Response) => Promise<void>;
