import { db } from "./lib/db";
import {
  users,
  chamas,
  chamaMemberships,
  contributions,
} from "./lib/db/schema";
import { hashSync } from "bcryptjs";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomPhone(): string {
  const prefixes = ["071", "072", "073", "074", "010", "011"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");
  return prefix + suffix;
}

const CONTRIBUTION_STATUSES = ["VERIFIED", "VERIFIED", "VERIFIED", "VERIFIED", "PENDING", "SELF_VERIFIED"] as const;
const PAYMENT_METHODS = ["MPESA", "MPESA", "MPESA", "CASH"] as const;

interface SeedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface SeedMember {
  userId: string;
  email: string;
  name: string;
  role: (typeof MEMBER_ROLES)[number];
}

interface SeedChama {
  id: string;
  name: string;
  description: string;
  minContribution: number;
  members: SeedMember[];
}

async function seed() {
  console.log("🌱 Starting seed...\n");

  const now = new Date();
  const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());

  console.log("Creating users...");

  const seedUsers: SeedUser[] = [
    {
      id: generateId("usr"),
      name: "Wanjiru Kamau",
      email: "wanjiru.kamau@chamaconnect.io",
      phone: "0712345678",
      password: hashSync("Password@123", 10),
    },
    {
      id: generateId("usr"),
      name: "Odhiambo Okoth",
      email: "odhiambo.okoth@chamaconnect.io",
      phone: "0723456789",
      password: hashSync("Password@456", 10),
    },
  ];

  await db.insert(users).values(
    seedUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: true,
      phoneNumber: u.phone,
      globalRole: "USER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );

  console.log(`✓ Created ${seedUsers.length} users\n`);

  console.log("Creating chamas and memberships...");

  const seedChamas: SeedChama[] = [
    {
      id: generateId("cha"),
      name: "Twende Mbele SACCO",
      description:
        "A vibrant savings cooperative for Nairobi tech workers, focused on wealth creation and sustainable financial growth.",
      minContribution: 5000,
      members: [
        { userId: seedUsers[0].id, email: seedUsers[0].email, name: seedUsers[0].name, role: "ADMIN" },
        { userId: "", email: "amin.wanjiku@techhub.co.ke", name: "Amina Wanjiku", role: "TREASURER" },
        { userId: "", email: "brian.otieno@outlook.com", name: "Brian Otieno", role: "SECRETARY" },
        { userId: "", email: "carol.njeri@gmail.com", name: "Carol Njeri", role: "MEMBER" },
        { userId: "", email: "david.kipngeno@yahoo.com", name: "David Kipng'eno", role: "MEMBER" },
        { userId: "", email: "esther.awuor@company.co.ke", name: "Esther Awuor", role: "MEMBER" },
        { userId: "", email: "fredrick.omondi@mail.com", name: "Fredrick Omondi", role: "MEMBER" },
        { userId: "", email: "grace.atieno@business.co.ke", name: "Grace Atieno", role: "MEMBER" },
        { userId: "", email: "hassan.ali@startup.io", name: "Hassan Ali", role: "MEMBER" },
        { userId: "", email: "irene.akinyi@tech.co.ke", name: "Irene Akinyi", role: "MEMBER" },
        { userId: "", email: "john.kimani@enterprise.com", name: "John Kimani", role: "MEMBER" },
        { userId: "", email: "kelly.nahda@corp.co.ke", name: "Kelly Nahda", role: "MEMBER" },
        { userId: "", email: "lawrence.mutua@digital.co.ke", name: "Lawrence Mutua", role: "MEMBER" },
        { userId: "", email: "maryanne.chiroma@mail.com", name: "Maryanne Chiroma", role: "MEMBER" },
        { userId: "", email: "noah.kibet@software.dev", name: "Noah Kibet", role: "MEMBER" },
        { userId: "", email: "peter.mwangi@dev.co.ke", name: "Peter Mwangi", role: "MEMBER" },
      ],
    },
    {
      id: generateId("cha"),
      name: "Risidio Table Banking",
      description:
        "Community-based savings group meeting weekly to pool resources and support local entrepreneurship.",
      minContribution: 2000,
      members: [
        { userId: seedUsers[0].id, email: seedUsers[0].email, name: seedUsers[0].name, role: "ADMIN" },
        { userId: "", email: "faith.koech@group.ke", name: "Faith Koech", role: "TREASURER" },
        { userId: "", email: "george.muthoni@members.co.ke", name: "George Muthoni", role: "SECRETARY" },
        { userId: "", email: "hellen.nyakundi@tablebank.ke", name: "Hellen Nyakundi", role: "MEMBER" },
        { userId: "", email: "ian.kariuki@savings.org", name: "Ian Kariuki", role: "MEMBER" },
        { userId: "", email: "janet.owino@local.co.ke", name: "Janet Owino", role: "MEMBER" },
        { userId: "", email: "kennedy.osewe@community.ke", name: "Kennedy Osewe", role: "MEMBER" },
        { userId: "", email: "lilian.mokaya@tablegroup.co", name: "Lilian Mokaya", role: "MEMBER" },
        { userId: "", email: "moses.njoroge@jointoday.io", name: "Moses Njoroge", role: "MEMBER" },
        { userId: "", email: "nancy.wambui@member.co.ke", name: "Nancy Wambui", role: "MEMBER" },
        { userId: "", email: "oscar.onyango@savemore.ke", name: "Oscar Onyango", role: "MEMBER" },
        { userId: "", email: "patricia.nzioka@poolfund.co", name: "Patricia Nzioka", role: "MEMBER" },
        { userId: "", email: "robert.mbuva@weekly.co.ke", name: "Robert Mbuva", role: "MEMBER" },
      ],
    },
    {
      id: generateId("cha"),
      name: "Mali Shule Women Group",
      description:
        "Women-led chama focusing on education savings and small business financing for rural communities.",
      minContribution: 1000,
      members: [
        { userId: seedUsers[1].id, email: seedUsers[1].email, name: seedUsers[1].name, role: "ADMIN" },
        { userId: "", email: "agnes.mwende@womengroup.ke", name: "Agnes Mwende", role: "TREASURER" },
        { userId: "", email: "beatrice.nahasha@rural.co.ke", name: "Beatrice Nahasha", role: "SECRETARY" },
        { userId: "", email: "cynthia.jelimo@savwomen.ke", name: "Cynthia Jelimo", role: "MEMBER" },
        { userId: "", email: "dorothy.chelangat@womenpower.org", name: "Dorothy Chelangat", role: "MEMBER" },
        { userId: "", email: "evans.oyier@communities.ke", name: "Evans Oyier", role: "MEMBER" },
        { userId: "", email: "florence.namisi@chama.co.ke", name: "Florence Namisi", role: "MEMBER" },
        { userId: "", email: "gladys.namwaya@groupfinance.ke", name: "Gladys Namwaya", role: "MEMBER" },
        { userId: "", email: "harriet.akinyi@ruraloutreach.io", name: "Harriet Akinyi", role: "MEMBER" },
        { userId: "", email: "ivy.chepchirchir@savings.club", name: "Ivy Chepchirchir", role: "MEMBER" },
        { userId: "", email: "jacklinechemutai@womenbiz.ke", name: "Jackline Chemutai", role: "MEMBER" },
        { userId: "", email: "kate.kerongo@groupfinance.co", name: "Kate Kerongo", role: "MEMBER" },
        { userId: "", email: "lenah.naliaka@womensavings.ke", name: "Lenah Naliaka", role: "MEMBER" },
        { userId: "", email: "margaret.wangui@savcircles.org", name: "Margaret Wangui", role: "MEMBER" },
        { userId: "", email: "nancy.jepchirchir@fundcircle.ke", name: "Nancy Jepchirchir", role: "MEMBER" },
        { userId: "", email: "olga.chepngeno@communitybank.ke", name: "Olga Chepng'eno", role: "MEMBER" },
        { userId: "", email: "phyllis.jepkorir@joinnow.co.ke", name: "Phyllis Jepkorir", role: "MEMBER" },
        { userId: "", email: "queenter.adhiambo@savetogether.io", name: "Queenter Adhiambo", role: "MEMBER" },
        { userId: "", email: "ruth.njeri@womensave.ke", name: "Ruth Njeri", role: "MEMBER" },
      ],
    },
    {
      id: generateId("cha"),
      name: "Kibwezi Merry-Go-Round",
      description:
        "Traditional rotating savings group for small-scale traders and farmers in the Kibwezi region.",
      minContribution: 500,
      members: [
        { userId: seedUsers[1].id, email: seedUsers[1].email, name: seedUsers[1].name, role: "ADMIN" },
        { userId: "", email: "ali.hassan@traders.co.ke", name: "Ali Hassan", role: "TREASURER" },
        { userId: "", email: "bakari.rauf@farmersgroup.ke", name: "Bakari Rauf", role: "SECRETARY" },
        { userId: "", email: "charles.mwenda@smallbiz.ke", name: "Charles Mwenda", role: "MEMBER" },
        { userId: "", email: "diana.mutindi@traders.org", name: "Diana Mutindi", role: "MEMBER" },
        { userId: "", email: "emaan.sheikh@localmarket.co", name: "Emaan Sheikh", role: "MEMBER" },
        { userId: "", email: "fatima.hassan@marketwomen.ke", name: "Fatima Hassan", role: "MEMBER" },
        { userId: "", email: "godfrey.kyalo@sma11traders.io", name: "Godfrey Kyalo", role: "MEMBER" },
        { userId: "", email: "halima.ali@seasonalfarm.ke", name: "Halima Ali", role: "MEMBER" },
        { userId: "", email: "isaac.mutua@agripreneurs.co", name: "Isaac Mutua", role: "MEMBER" },
        { userId: "", email: "jane.nduku@smallscale.ke", name: "Jane Nduku", role: "MEMBER" },
      ],
    },
  ];

  const allMemberUsers: { id: string; name: string; email: string }[] = [];

  for (const chama of seedChamas) {
    await db.insert(chamas).values({
      id: chama.id,
      name: chama.name,
      description: chama.description,
      minContributionAmount: chama.minContribution,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (const member of chama.members) {
      let memberUserId = member.userId;

      if (!memberUserId) {
        memberUserId = generateId("usr");
        const newUser = {
          id: memberUserId,
          name: member.name,
          email: member.email,
          emailVerified: true,
          phoneNumber: randomPhone(),
          globalRole: "USER" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.insert(users).values(newUser);
        allMemberUsers.push({ id: memberUserId, name: member.name, email: member.email });
      } else {
        allMemberUsers.push({ id: memberUserId, name: member.name, email: member.email });
      }

      await db.insert(chamaMemberships).values({
        id: generateId("mem"),
        chamaId: chama.id,
        userId: memberUserId,
        role: member.role,
        status: "ACTIVE",
        joinedAt: randomDate(new Date(now.getFullYear() - 2, 0, 1), now),
        updatedAt: new Date(),
      });
    }

    console.log(
      `  ✓ ${chama.name}: ${chama.members.length} members`
    );
  }

  console.log("");

  console.log("Creating contributions (targeting 2M+ KES total)...");

  let totalContributions = 0;
  const targetTotal = 2_000_000;

  for (const chama of seedChamas) {
    const treasurerMember = chama.members.find((m) => m.role === "TREASURER");

    let chamaTotal = 0;
    let monthCount = 0;
    const maxMonths = 36;

    while (chamaTotal < targetTotal / 4 && monthCount < maxMonths) {
      monthCount++;
      const contributionDate = new Date(threeYearsAgo);
      contributionDate.setMonth(contributionDate.getMonth() + monthCount);

      const memberIndex = monthCount % chama.members.length;
      const contributor = chama.members[memberIndex];

      const baseAmount = chama.minContribution;
      const variance = Math.floor(Math.random() * (baseAmount * 3));
      const amount = baseAmount + variance;

      const status =
        monthCount < maxMonths - 2
          ? "VERIFIED"
          : CONTRIBUTION_STATUSES[
              Math.floor(Math.random() * CONTRIBUTION_STATUSES.length)
            ];

      let verifiedById: string | null = null;
      if (status === "VERIFIED" && treasurerMember) {
        verifiedById = treasurerMember.userId || null;
      }

      const mpesaRef = `MPESA${contributionDate.getFullYear()}${String(
        contributionDate.getMonth() + 1
      ).padStart(2, "0")}-${String(monthCount * 100 + memberIndex).padStart(
        5,
        "0"
      )}`;

      await db.insert(contributions).values({
        id: generateId("ctr"),
        chamaId: chama.id,
        memberId: contributor.userId || allMemberUsers.find((u) => u.email === contributor.email)?.id || "",
        amount,
        paymentMethod:
          PAYMENT_METHODS[
            Math.floor(Math.random() * PAYMENT_METHODS.length)
          ],
        status,
        description: `Monthly contribution ref: ${mpesaRef}`,
        verifiedById,
        createdAt: contributionDate,
        updatedAt: contributionDate,
      });

      chamaTotal += amount;
    }

    totalContributions += chamaTotal;
    console.log(
      `  ✓ ${chama.name}: KES ${chamaTotal.toLocaleString()} (${monthCount} contributions)`
    );
  }

  console.log("");
  console.log(
    `✓ Total seeded: KES ${totalContributions.toLocaleString()} across ${seedChamas.length} chamas`
  );
  console.log("✓ Seed completed successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});