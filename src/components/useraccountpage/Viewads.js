import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import TrafficLight from "../trafficlight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Paginator from "../pagination/paginator";
import { fetchAds } from "@/functions/adfetch/fetchAds";
import EditBusiness from "./EditBusiness";

export default function Viewads() {
  const { data: session, status } = useSession();
  const [records, setRecords] = useState([]);
  const [titleval, setTitleVal] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editAdData, setEditAdData] = useState(null);
  const [loading, setLoading] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [enteredNumber, setEnteredNumber] = useState("");
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const handlePageChange = (page) => setCurrentPage(page);

  const fetchData = async () => {
    if (!session) return;
    setLoading("Loading...");
    const data = await fetchAds(currentPage, 4, session.user.email, searchTerm);
    // console.log("query data", currentPage, " ", 4, " ", session.user.email, " ", searchTerm);
    setLoading('');
    setRecords(data.records);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    if (session) fetchData();
  }, [currentPage, searchTerm, session]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(titleval);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setTitleVal('');
    setRecords([]);
    fetchData();
  };

  const handleEditClick = (ad) => {
    setEditAdData(ad);
  };

  const handleBackToList = () => {
    setEditAdData(null);
    fetchData();
  };

  const handleDeleteClick = (postId) => {
    setRandomNumber(Math.floor(Math.random() * 1000000));
    setPostIdToDelete(postId);
    setShowDeleteDialog(true);
  };

  const confirmDeletePost = async () => {
    try {
      const response = await fetch("/api/deletePost", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postIdToDelete }),
      });
      if (response.ok) {
        setRecords(records.filter((record) => record.id !== postIdToDelete));
        setShowDeleteDialog(false);
        setEnteredNumber("");
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (editAdData) {
    return (
      <EditBusiness
        id={editAdData?.id || ""}
        title={editAdData?.title || ""}
        type={editAdData?.category || ""}
        map={editAdData?.map || ""}
        description={editAdData?.description || ""}
        contact_number={editAdData?.phone || ""}
        contact_email={editAdData?.email || ""}
        address={editAdData?.address || ""}
        addistrict={editAdData?.district || ""}
        adcity={editAdData?.city || ""}
        image1={editAdData?.image1 || ""}
        image2={editAdData?.image2 || ""}
        simplefilename1={editAdData?.filename1 || ""}
        simplefilename2={editAdData?.filename2 || ""}
        randno={Math.floor(Math.random() * 1000000)}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="p-5">
      <div className="w-[95%] grid gap-2 grid-cols-[5%,95%] m-auto">
        <div className="flex items-center text-center">
          <FontAwesomeIcon
            title="Refresh"
            className="cursor-pointer size-5 hover:opacity-50"
            icon={faArrowRotateRight}
            onClick={handleRefresh}
          />
        </div>
        <div>
          <form onSubmit={handleSearchSubmit} className="w-full flex items-center">
            <div className="grid w-full grid-cols-[90%,10%]">
              <div className="pr-2">
                <input
                  type="text"
                  value={titleval}
                  onChange={(e) => setTitleVal(e.target.value)}
                  placeholder="Search by title"
                  className="w-full h-full border border-black border-opacity-50 rounded-md p-1 italic focus:outline-none focus:ring-2 focus:ring-[#E429A9]"
                />
              </div>
              <div className="text-center">
                <Button type="submit" className="bg-[#E429A9] text-white hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-[#E429A9]">
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mb-10 mt-10">
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <div className="w-full italic font-khandbold text-large text-center">{loading}</div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading === '' ? records.map((rec) => (
          <div className="border-black border-opacity-50 border-1 rounded-xl font-khand m-2" key={rec.id}>
            <div className="grid gap-4 bg-white rounded-xl">
              <div className="bg-blue-200-100 p-4 h-[200px] overflow-hidden relative">
                <Image
                  src={rec.image1 ? rec.image1 : "/no_image.webp"}
                  alt="Description of the image"
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full rounded-t-xl"
                />
              </div>
              <div className="bg-blue-200-100 p-4">
                <h1 className="font-khand font-semibold text-[18pt] text-center">{rec.id} - {rec.title}</h1>
              </div>
              <div className="grid gap-2 grid-cols-2">
                <div className="pl-2 text-center">
                  <p>Approved: {rec.enabled}</p>
                  <p>{new Date(rec.date).toISOString().split('T')[0]}</p>
                </div>
                <div className="flex justify-end pr-5 items-start">
                  <TrafficLight status={rec.enabled} />
                </div>
              </div>
              <div className="grid gap-2 grid-cols-2 pr-5 pl-5 pb-5">
                <div className="text-left">
                  <FontAwesomeIcon
                    title="Delete"
                    className="cursor-pointer size-5 hover:opacity-50"
                    icon={faTrash}
                    onClick={() => handleDeleteClick(rec.id)}
                  />
                </div>
                <div className="text-right">
                  <FontAwesomeIcon
                    title="Edit"
                    className="cursor-pointer size-5 hover:opacity-50"
                    icon={faEdit}
                    onClick={() => handleEditClick(rec)}
                  />
                </div>
              </div>
            </div>
          </div>
        )) : ''}
      </div>

      <div className="mt-10">
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Confirm Delete</h2>
            <p>Please enter this number to confirm: <strong>{randomNumber}</strong></p>
            <input
              type="text"
              value={enteredNumber}
              onChange={(e) => setEnteredNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
              placeholder="Enter the number shown above"
            />
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => {
                  if (parseInt(enteredNumber) === randomNumber) confirmDeletePost();
                }}
                className="bg-[#E429A9] text-white rounded px-4 py-2 hover:opacity-50"
              >
                Yes
              </Button>
              <Button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-300 rounded px-4 py-2 hover:bg-gray-400"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
