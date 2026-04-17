/**
 * In-memory data store for registration and chama data
 * Persists during the session; resets on server restart
 */

import { User, Chama, ExistingSacco } from './types';
import { getMockSaccos } from './mock-saccos';

class ApiStore {
    private users: Map<string, User> = new Map();
    private chamas: Map<string, Chama> = new Map();
    private userIdCounter: number = 1000;
    private chamaIdCounter: number = 1;

    // Parsed from MOCK_SACCO_LIST env var when provided; otherwise fallback set is used.
    private mockSaccos: ExistingSacco[] = getMockSaccos();

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
