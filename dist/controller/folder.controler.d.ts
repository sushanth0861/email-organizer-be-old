import { Request, Response } from "express";
export declare const createFolder: (req: Request, res: Response) => Promise<void>;
export declare const getFolders: (req: Request, res: Response) => Promise<void>;
export declare const saveMailToFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const removeMailFromFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMailsFromFolder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
