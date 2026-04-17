import { z } from 'zod';

export const chamaTypeSchema = z.enum(['SACCO', 'TableBanking', 'MerryGoRound']);

export const registerRequestSchema = z.object({
    fullName: z.string().trim().min(2, 'Full name is required and must be at least 2 characters'),
    email: z.email('Valid email address is required').trim().toLowerCase(),
    phone: z
        .string()
        .trim()
        .regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, 'Invalid Kenyan phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const chamaMemberSchema = z.object({
    email: z.email('Member email must be a valid email address').trim().toLowerCase(),
    role: z.enum(['admin', 'member']),
});

export const createChamaRequestSchema = z
    .object({
        userId: z.string().trim().min(1, 'User ID is required'),
        chamaName: z.string().trim().min(2, 'Chama name is required and must be at least 2 characters'),
        chamaType: chamaTypeSchema,
        members: z.array(chamaMemberSchema).min(1, 'At least one member (admin) is required'),
        description: z.string().trim().max(500, 'Description is too long').optional(),
    })
    .refine((value) => value.members.some((member) => member.role === 'admin'), {
        message: 'At least one member must be an admin',
        path: ['members'],
    });

export const searchQuerySchema = z.object({
    q: z.string().trim().max(100, 'Search query is too long'),
});
