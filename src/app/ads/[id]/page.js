import { PrismaClient } from '@prisma/client';
import Gallery from '@/components/gallery';

const prisma = new PrismaClient();



export async function generateStaticParams() {
    const posts = await prisma.post.findMany({
        where: { enabled: 'YES' },
        select: { id: true },
    });

    return posts.map((post) => ({ id: post.id.toString() }));
}

export default async function AdDetailPage({ params }) {
    const ad = await prisma.post.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!ad) {
        return <div className="p-6 text-red-600">Ad not found</div>;
    }

    const isValidUrl = (url) => {
        try {
            const clean = url?.trim();
            return typeof clean === "string" && new URL(clean).protocol.startsWith("http");
        } catch {
            return false;
        }
    };

    const images = [ad.image1, ad.image2, ad.image3].filter(
        isValidUrl
    );



    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
            <p className="text-gray-600 mb-2">{ad.category}</p>
            <p className="text-gray-500 mb-4">{ad.email} | {ad.phone}</p>

            <div className="mb-4">
                <p className="text-sm text-gray-700">{ad.description}</p>
                {ad.address && <p className="mt-2 text-sm text-gray-600">📍 {ad.address}, {ad.city}, {ad.district}</p>}
            </div>


            {images.length > 0 && <Gallery images={images} />}
        </div>
    );
}
