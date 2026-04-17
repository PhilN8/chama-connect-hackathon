/**
 * In-memory data store for registration and chama data
 * Persists during the session; resets on server restart
 */

import { hashSync } from 'bcryptjs';
import { User, Chama, ExistingSacco, ContributionRecord } from './types';
import { getMockSaccos } from './mock-saccos';
import { DEMO_USER_EMAIL, DEMO_USER_FULL_NAME, DEMO_USER_PASSWORD } from './demo-auth';

const DEMO_MEMBERS = [
    { fullName: 'Amina Wanjiru', email: 'amina.wanjiru@chamaconnect.io', role: 'admin', contributionKes: 42000, joinedAt: '2025-02-12', status: 'active' },
    { fullName: 'Brian Otieno', email: 'brian.otieno@chamaconnect.io', role: 'treasurer', contributionKes: 39000, joinedAt: '2025-02-15', status: 'active' },
    { fullName: 'Caroline Njeri', email: 'caroline.njeri@chamaconnect.io', role: 'member', contributionKes: 31000, joinedAt: '2025-02-20', status: 'active' },
    { fullName: 'David Kiptoo', email: 'david.kiptoo@chamaconnect.io', role: 'member', contributionKes: 27500, joinedAt: '2025-02-27', status: 'active' },
    { fullName: 'Esther Mwende', email: 'esther.mwende@chamaconnect.io', role: 'member', contributionKes: 33200, joinedAt: '2025-03-02', status: 'active' },
    { fullName: 'Felix Ochieng', email: 'felix.ochieng@chamaconnect.io', role: 'member', contributionKes: 24800, joinedAt: '2025-03-08', status: 'active' },
    { fullName: 'Grace Wambui', email: 'grace.wambui@chamaconnect.io', role: 'member', contributionKes: 28900, joinedAt: '2025-03-14', status: 'active' },
    { fullName: 'Hassan Abdi', email: 'hassan.abdi@chamaconnect.io', role: 'member', contributionKes: 22100, joinedAt: '2025-03-18', status: 'active' },
    { fullName: 'Irene Atieno', email: 'irene.atieno@chamaconnect.io', role: 'treasurer', contributionKes: 36400, joinedAt: '2025-03-24', status: 'active' },
    { fullName: 'John Kamau', email: 'john.kamau@chamaconnect.io', role: 'member', contributionKes: 24500, joinedAt: '2025-03-30', status: 'active' },
    { fullName: 'Kevin Maina', email: 'kevin.maina@chamaconnect.io', role: 'member', contributionKes: 25800, joinedAt: '2025-04-06', status: 'active' },
    { fullName: 'Linet Chebet', email: 'linet.chebet@chamaconnect.io', role: 'member', contributionKes: 23400, joinedAt: '2025-04-13', status: 'active' },
    { fullName: 'Mercy Akinyi', email: 'mercy.akinyi@chamaconnect.io', role: 'member', contributionKes: 30100, joinedAt: '2025-04-22', status: 'active' },
    { fullName: 'Noah Kiplagat', email: 'noah.kiplagat@chamaconnect.io', role: 'member', contributionKes: 21900, joinedAt: '2025-05-01', status: 'active' },
    { fullName: 'Olive Wanjala', email: 'olive.wanjala@chamaconnect.io', role: 'member', contributionKes: 19700, joinedAt: '2025-05-08', status: 'active' },
    { fullName: 'Peter Mwangi', email: 'peter.mwangi@chamaconnect.io', role: 'member', contributionKes: 26600, joinedAt: '2025-05-14', status: 'active' },
    { fullName: 'Queenter Auma', email: 'queenter.auma@chamaconnect.io', role: 'member', contributionKes: 23900, joinedAt: '2025-05-21', status: 'active' },
    { fullName: 'Ruth Jepkoech', email: 'ruth.jepkoech@chamaconnect.io', role: 'member', contributionKes: 25100, joinedAt: '2025-05-28', status: 'active' },
    { fullName: 'Samuel Ndegwa', email: 'samuel.ndegwa@chamaconnect.io', role: 'member', contributionKes: 18200, joinedAt: '2025-06-03', status: 'active' },
    { fullName: 'Tabitha Naliaka', email: 'tabitha.naliaka@chamaconnect.io', role: 'member', contributionKes: 17400, joinedAt: '2025-06-10', status: 'active' },
    { fullName: 'Umar Yusuf', email: 'umar.yusuf@chamaconnect.io', role: 'member', contributionKes: 16300, joinedAt: '2025-06-19', status: 'invited' },
    { fullName: 'Valentine Moraa', email: 'valentine.moraa@chamaconnect.io', role: 'member', contributionKes: 15600, joinedAt: '2025-06-26', status: 'invited' },
    { fullName: 'Wycliffe Mutua', email: 'wycliffe.mutua@chamaconnect.io', role: 'member', contributionKes: 20800, joinedAt: '2025-07-04', status: 'active' },
    { fullName: 'Zainab Noor', email: 'zainab.noor@chamaconnect.io', role: 'member', contributionKes: 19100, joinedAt: '2025-07-12', status: 'active' },
] as const;

class ApiStore {
    private users: Map<string, User> = new Map();
    private chamas: Map<string, Chama> = new Map();
    private contributionsByChama: Map<string, ContributionRecord[]> = new Map();
    private userIdCounter: number = 1000;
    private chamaIdCounter: number = 1;

    // Parsed from MOCK_SACCO_LIST env var when provided; otherwise fallback set is used.
    private mockSaccos: ExistingSacco[] = getMockSaccos();

    constructor() {
        this.seedDemoData();
    }

    private deriveDisplayNameFromEmail(email: string): string {
        const localPart = email.split('@')[0] ?? 'Member';
        return localPart
            .replace(/[._-]+/g, ' ')
            .trim()
            .split(' ')
            .filter(Boolean)
            .map((part) => part[0].toUpperCase() + part.slice(1))
            .join(' ');
    }

    private seedDemoData(): void {
        const demoUserId = 'user_demo_001';
        const demoChamaId = 'chama_1';

        const demoUser: User = {
            id: demoUserId,
            fullName: DEMO_USER_FULL_NAME,
            email: DEMO_USER_EMAIL,
            phone: '0712345678',
            password: hashSync(DEMO_USER_PASSWORD, 10),
            createdAt: new Date('2025-02-01T08:00:00.000Z'),
        };

        this.users.set(demoUserId, demoUser);

        const members = DEMO_MEMBERS.map((member, index) => ({
            id: `DM-${String(index + 1).padStart(3, '0')}`,
            fullName: member.fullName,
            email: member.email,
            role: member.role,
            contributionKes: member.contributionKes,
            joinedAt: member.joinedAt,
            status: member.status,
        }));

        const demoChama: Chama = {
            id: demoChamaId,
            name: 'Twende Mbele Chama',
            type: 'TableBanking',
            description: 'Demo chama preloaded for judge walkthroughs',
            adminId: demoUserId,
            members,
            createdAt: new Date('2025-02-10T09:00:00.000Z'),
        };

        this.chamas.set(demoChamaId, demoChama);

        const demoContributions = this.buildDemoContributions(demoChamaId, members);
        this.contributionsByChama.set(demoChamaId, demoContributions);

        this.userIdCounter = 1001;
        this.chamaIdCounter = 2;
    }

    private buildDemoContributions(chamaId: string, members: Chama['members']): ContributionRecord[] {
        const entries: ContributionRecord[] = [];
        const timelineStart = new Date('2023-04-01T00:00:00.000Z');

        for (let monthOffset = 0; monthOffset < 36; monthOffset++) {
            for (let contributionIndex = 0; contributionIndex < 2; contributionIndex++) {
                const sequence = monthOffset * 2 + contributionIndex;
                const member = members[sequence % members.length];
                const contributionDate = new Date(timelineStart);
                contributionDate.setMonth(timelineStart.getMonth() + monthOffset);
                contributionDate.setDate(contributionIndex === 0 ? 7 : 22);

                const baseAmount = 18000;
                const variance = (monthOffset * 1975 + contributionIndex * 4325) % 42000;
                const amountKes = baseAmount + variance;

                entries.push({
                    id: `CTR-${String(sequence + 1).padStart(4, '0')}`,
                    chamaId,
                    contributorName: member.fullName ?? this.deriveDisplayNameFromEmail(member.email),
                    contributorEmail: member.email,
                    amountKes,
                    contributedAt: contributionDate.toISOString().slice(0, 10),
                    reference: `MPESA-${contributionDate.getFullYear()}${String(contributionDate.getMonth() + 1).padStart(2, '0')}-${String(sequence + 1001).padStart(5, '0')}`,
                });
            }
        }

        return entries;
    }

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
        const normalizedMembers = members.map((member, index) => ({
            id: `${chamaId}-M-${String(index + 1).padStart(3, '0')}`,
            fullName: member.fullName?.trim() || this.deriveDisplayNameFromEmail(member.email),
            email: member.email,
            role: member.role,
            contributionKes: Number(member.contributionKes ?? 0),
            joinedAt: member.joinedAt ?? new Date().toISOString().slice(0, 10),
            status: member.status ?? 'active',
        }));

        const chama: Chama = {
            id: chamaId,
            name: chamaName,
            type: chamaType,
            description,
            adminId,
            members: normalizedMembers,
            createdAt: new Date(),
        };

        this.chamas.set(chamaId, chama);
        this.contributionsByChama.set(chamaId, []);
        return chama;
    }

    /**
     * Get all chamas for a user (as admin)
     */
    getChamasForUser(userId: string): Chama[] {
        return Array.from(this.chamas.values()).filter(c => c.adminId === userId);
    }

    getMembersForUser(userId: string) {
        const primaryChama = this.getChamasForUser(userId)[0];
        return primaryChama?.members ?? [];
    }

    getContributionsForChama(chamaId: string): ContributionRecord[] {
        return this.contributionsByChama.get(chamaId) ?? [];
    }

    getContributionsForUser(userId: string): ContributionRecord[] {
        const primaryChama = this.getChamasForUser(userId)[0];
        if (!primaryChama) {
            return [];
        }

        return this.getContributionsForChama(primaryChama.id);
    }

    getTotalContributionsForUser(userId: string): number {
        return this.getContributionsForUser(userId).reduce(
            (sum, contribution) => sum + contribution.amountKes,
            0
        );
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
        this.contributionsByChama.clear();
        this.userIdCounter = 1000;
        this.chamaIdCounter = 1;
    }
}

// Export singleton instance
export const apiStore = new ApiStore();
