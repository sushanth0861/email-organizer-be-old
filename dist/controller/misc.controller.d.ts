import { Request, Response } from "express";
export declare const getAllMail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMailsByCategory: (req: Request, res: Response) => Promise<void>;
export declare const changeCategory: (req: Request, res: Response) => Promise<void>;
export declare const addDraft: (req: Request, res: Response) => Promise<void>;
export declare const getDrafts: (req: Request, res: Response) => Promise<void>;
export declare const deleteDraft: (req: Request, res: Response) => Promise<void>;
export declare const starMail: (req: Request, res: Response) => Promise<void>;
export declare const stenMail: (req: Request, res: Response) => Promise<void>;
