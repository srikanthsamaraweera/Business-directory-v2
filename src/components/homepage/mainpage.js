import { useEffect, useState } from "react";
import Link from "next/link";

export default function MainPage() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false); // Added loading state

    useEffect(() => {
        setLoading(true); // Set loading to true before fetching data

        fetch(`/api/posts?page=${currentPage}`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.posts);
                setTotalPages(data.totalPages);
            })
            .catch((error) => console.error("Error fetching posts:", error))
            .finally(() => setLoading(false)); // Set loading to false after request is complete
    }, [currentPage]);



    return (
        <div className="container mx-auto p-4">
            {loading &&
                <div className="border p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mt-2">Loading Posts...</h2>
                </div>

            }




            {!loading && posts.length > 0 && <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {posts.map((post) => (
                    <div key={post.id} className="border p-4 rounded shadow">
                        <img src={post.image1 || "/placeholder.jpg"} alt={post.title} className="w-full h-40 object-cover" />
                        <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
                        <p className="text-gray-600">{post.category}</p>
                        <p className="mt-2 text-sm">{post.description}</p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span>Page {currentPage} of {totalPages}</span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
