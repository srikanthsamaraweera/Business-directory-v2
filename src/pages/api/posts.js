import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { page = 1 } = req.query;
    const pageSize = 9;
    const skip = (page - 1) * pageSize;

    try {
        const posts = await prisma.post.findMany({
            where: { enabled: "YES" },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                image1: true,
                enabled: true,
            },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' },
        });

        const totalPosts = await prisma.post.count({
            where: { enabled: "YES" },
        });

        res.status(200).json({
            posts,
            totalPages: Math.ceil(totalPosts / pageSize),
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}
