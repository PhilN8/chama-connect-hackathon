/**
 * Shared types for API responses and data models
 */

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    createdAt: Date;
}

export interface Chama {
    id: string;
    name: string;
    type: 'SACCO' | 'TableBanking' | 'MerryGoRound';
    description?: string;
    adminId: string;
    members: ChamaMember[];
    createdAt: Date;
}

export interface ChamaMember {
    email: string;
    role: 'admin' | 'member';
}

export interface ExistingSacco {
    id: string;
    name: string;
    location: string;
    memberCount: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
    error?: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export interface RegisterResponse {
    userId: string;
    email: string;
    fullName: string;
}

export interface CreateChamaRequest {
    userId: string;
    chamaName: string;
    chamaType: 'SACCO' | 'TableBanking' | 'MerryGoRound';
    description?: string;
    members: ChamaMember[];
}

export interface CreateChamaResponse {
    chamaId: string;
    chamaName: string;
    memberCount: number;
}
