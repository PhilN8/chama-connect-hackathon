/**
 * In-memory data store for registration and chama data
 * Persists during the session; resets on server restart
 */

import { User, Chama, ExistingSacco } from './types';

class ApiStore {
    private users: Map<string, User> = new Map();
    private chamas: Map<string, Chama> = new Map();
    private userIdCounter: number = 1000;
    private chamaIdCounter: number = 1;

    // Mock SACCO data (existing saccos for search)
    private mockSaccos: ExistingSacco[] = [
        { id: 'sacco-1', name: 'Stima SACCO', location: 'Nairobi', memberCount: 45 },
        { id: 'sacco-2', name: 'Teachers SACCO', location: 'Nairobi', memberCount: 120 },
        { id: 'sacco-3', name: 'Equity SACCO', location: 'Mombasa', memberCount: 200 },
        { id: 'sacco-4', name: 'Kenya Power SACCO', location: 'Nairobi', memberCount: 180 },
        { id: 'sacco-5', name: 'Vision SACCO', location: 'Kisumu', memberCount: 95 },
        { id: 'sacco-6', name: 'Ushindi SACCO', location: 'Nakuru', memberCount: 67 },
        { id: 'sacco-7', name: 'Jiamii SACCO', location: 'Eldoret', memberCount: 52 },
        { id: 'sacco-8', name: 'Rafiki SACCO', location: 'Dar es Salaam', memberCount: 78 },
    ];

    /**
     * Register a new user
     */
    registerUser(fullName: string, email: string, phone: string, hashedPassword: string): User {
        // Check if email already exists
        const existingUser = Array.from(this.users.values()).find(u => u.email === email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const userId = `user_${this.userIdCounter++}`;
        const user: User = {
            id: userId,
            fullName,
            email,
            phone,
            password: hashedPassword,
            createdAt: new Date(),
        };

        this.users.set(userId, user);
        return user;
    }

    /**
     * Get user by email
     */
    getUserByEmail(email: string): User | undefined {
        return Array.from(this.users.values()).find(u => u.email === email);
    }

    /**
     * Get user by ID
     */
    getUserById(userId: string): User | undefined {
        return this.users.get(userId);
    }

    /**
     * Create a new chama
     */
    createChama(adminId: string, chamaName: string, chamaType: 'SACCO' | 'TableBanking' | 'MerryGoRound', members: any[], description?: string): Chama {
        const chamaId = `chama_${this.chamaIdCounter++}`;
        const chama: Chama = {
            id: chamaId,
            name: chamaName,
            type: chamaType,
            description,
            adminId,
            members,
            createdAt: new Date(),
        };

        this.chamas.set(chamaId, chama);
        return chama;
    }

    /**
     * Get all chamas for a user (as admin)
     */
    getChamasForUser(userId: string): Chama[] {
        return Array.from(this.chamas.values()).filter(c => c.adminId === userId);
    }

    /**
     * Search existing SACCOs
     */
    searchSaccos(query: string): ExistingSacco[] {
        const lowerQuery = query.toLowerCase().trim();
        if (lowerQuery.length < 2) {
            return [];
        }

        return this.mockSaccos.filter(sacco =>
            sacco.name.toLowerCase().includes(lowerQuery) ||
            sacco.location.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get a specific SACCO by ID
     */
    getSaccoById(saccoId: string): ExistingSacco | undefined {
        return this.mockSaccos.find(s => s.id === saccoId);
    }

    /**
     * Get all users (for debugging/admin purposes)
     */
    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    /**
     * Get all chamas (for debugging/admin purposes)
     */
    getAllChamas(): Chama[] {
        return Array.from(this.chamas.values());
    }

    /**
     * Clear all data (for testing)
     */
    clear(): void {
        this.users.clear();
        this.chamas.clear();
        this.userIdCounter = 1000;
        this.chamaIdCounter = 1;
    }
}

// Export singleton instance
export const apiStore = new ApiStore();
