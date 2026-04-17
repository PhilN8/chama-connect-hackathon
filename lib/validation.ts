import { z } from 'zod';

export const chamaTypeSchema = z.enum(['SACCO', 'TableBanking', 'MerryGoRound']);

export const registerRequestSchema = z.object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').optional(),
    email: z.email('Valid email address is required').trim().toLowerCase(),
    phone: z
        .string()
        .trim()
        .regex(/^(?:254|\+254|0)?(7|1)\d{8}$/, 'Invalid Kenyan phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginRequestSchema = z.object({
    email: z.email('Valid email address is required').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

export const chamaMemberSchema = z.object({
    email: z.email('Member email must be a valid email address').trim().toLowerCase(),
    role: z.enum(['admin', 'member']),
});

export const createChamaRequestSchema = z
    .object({
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

export const contactRequestSchema = z.object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').optional(),
    email: z.email('Valid email address is required').trim().toLowerCase(),
    subject: z.string().trim().min(2, 'Subject is required').max(120, 'Subject is too long'),
    message: z.string().trim().min(10, 'Message should be at least 10 characters').max(2000, 'Message is too long'),
});

export const newsletterSubscribeSchema = z.object({
    email: z.email('Valid email address is required').trim().toLowerCase(),
});
