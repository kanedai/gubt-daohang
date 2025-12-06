import fs from "fs/promises";
import path from "path";
import { Category } from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "data.json");

export const INITIAL_DATA: Category[] = [
    {
        id: "corp-systems",
        title: "企业核心系统",
        links: [
            {
                id: "oa",
                title: "OA 协同办公",
                url: "https://oa.gubt.com",
                description: "日常审批、考勤、行政流程",
                icon: "Briefcase",
            },
        ],
    },
];

async function ensureDb() {
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    }
}

export async function getCategories(): Promise<Category[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
}

export async function saveCategories(categories: Category[]) {
    await ensureDb();
    await fs.writeFile(DB_PATH, JSON.stringify(categories, null, 2));
}
