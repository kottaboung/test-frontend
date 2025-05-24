export interface User {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface updateUser {
    name: string;
    email: string;
    profileImage: string | null;
}

export interface selectedImageBase64 {
    base64: string | null;
    fileName: string | null;
    fileType: string | null;
    fileSize: number | null;
}
