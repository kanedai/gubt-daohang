"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCategories, saveCategories } from "@/lib/data";
import { Category, NavLink } from "@/lib/types";
import { randomUUID } from "crypto";
import path from "path";
import { writeFile } from "fs/promises";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function saveIconFile(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".png"; // Default to png if no ext
    const filename = `${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    try {
        await writeFile(filepath, buffer);
        return `/uploads/${filename}`;
    } catch (error) {
        console.error("Error saving file:", error);
        return null;
    }
}

// @ts-ignore
export async function login(prevState: any, formData: FormData) {
    const password = formData.get("password");

    if (password === ADMIN_PASSWORD) {
        (await cookies()).set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        redirect("/admin");
    } else {
        return { error: "密码错误" };
    }
}

export async function loginInline(prevState: any, formData: FormData) {
    const password = formData.get("password");
    if (password === ADMIN_PASSWORD) {
        (await cookies()).set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        revalidatePath("/");
        return { success: true };
    } else {
        return { error: "密码错误" };
    }
}

export async function logout() {
    (await cookies()).delete("admin_session");
    redirect("/");
}

// @ts-ignore
export async function addLink(categoryId: string, prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;
    const iconUrl = formData.get("iconUrl") as string;
    const iconFile = formData.get("iconFile") as File;

    if (!title || !url) return { error: "缺少必填字段" };

    let icon = "";

    // 1. Try File Upload
    const storedIconPath = await saveIconFile(iconFile);
    if (storedIconPath) {
        icon = storedIconPath;
    }
    // 2. Try Manual URL
    else if (iconUrl) {
        icon = iconUrl;
    }
    // 3. Auto-fetch
    else {
        icon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
    }

    const newLink: NavLink = {
        id: randomUUID(),
        title,
        url,
        description,
        icon: icon
    };

    const categories = await getCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);

    if (categoryIndex === -1) {
        return { error: "未找到分类" };
    }

    categories[categoryIndex].links.push(newLink);
    await saveCategories(categories);

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteLink(categoryId: string, linkId: string) {
    const categories = await getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (category) {
        category.links = category.links.filter(l => l.id !== linkId);
        await saveCategories(categories);
        revalidatePath("/");
        revalidatePath("/admin");
    }
}

// @ts-ignore
export async function createCategory(prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    if (!title) return { error: "如果标题为空则无法创建" };

    const categories = await getCategories();
    categories.push({
        id: randomUUID(),
        title,
        links: []
    });

    await saveCategories(categories);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}

// @ts-ignore
export async function updateLink(categoryId: string, linkId: string, prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;
    const newCategoryId = formData.get("categoryId") as string;
    const iconUrl = formData.get("iconUrl") as string;
    const iconFile = formData.get("iconFile") as File;

    if (!title || !url) return { error: "缺少必填字段" };

    const categories = await getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (!category) return { error: "未找到源分类" };

    const linkIndex = category.links.findIndex(l => l.id === linkId);
    if (linkIndex === -1) return { error: "未找到链接" };

    const oldLink = category.links[linkIndex];
    let icon = oldLink.icon;

    // 1. Try File Upload
    const storedIconPath = await saveIconFile(iconFile);
    if (storedIconPath) {
        icon = storedIconPath;
    }
    // 2. Try Manual URL
    else if (iconUrl) {
        icon = iconUrl;
    }
    // 3. Refetch if URL changed and no other icon provided
    else if (oldLink.url !== url) {
        icon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;
    }

    const updatedLink: NavLink = {
        ...oldLink,
        title,
        url,
        description,
        icon
    };

    // If category changed, move the link
    if (newCategoryId && newCategoryId !== categoryId) {
        const newCategory = categories.find(c => c.id === newCategoryId);
        if (!newCategory) return { error: "未找到目标分类" };

        // Remove from old
        category.links.splice(linkIndex, 1);
        // Add to new
        newCategory.links.push(updatedLink);
    } else {
        // Just update in place
        category.links[linkIndex] = updatedLink;
    }

    await saveCategories(categories);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteCategory(categoryId: string) {
    const categories = await getCategories();
    const newCategories = categories.filter(c => c.id !== categoryId);

    if (newCategories.length !== categories.length) {
        await saveCategories(newCategories);
        revalidatePath("/");
        revalidatePath("/admin");
    }
}

// @ts-ignore
export async function updateCategory(categoryId: string, prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    if (!title) return { error: "标题不能为空" };

    const categories = await getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (!category) return { error: "未找到分类" };

    category.title = title;

    await saveCategories(categories);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}
