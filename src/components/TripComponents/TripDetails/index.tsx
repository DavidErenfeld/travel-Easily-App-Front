// TripDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Share2 } from "lucide-react";
import tripsService, { ITrips } from "../../../services/tripsService.ts";
import { useTrips } from "../../../Context/TripContext";
import TripDescription from "../TripDescription/index.tsx";
import UpdateTrip from "../UpdateTrip/index.tsx";
import AddComment from "../../CommentsComponent/AddComment/index.tsx";
import ViewComment from "../../CommentsComponent/ViewComment/index.tsx";
import TripHeader from "../TripHeader/index.tsx";
import Header from "../../Header/index.tsx";
import ImageCarousel from "../../UIComponents/ImageCarousel/index.tsx";
import LoadingDots from "../../UIComponents/Loader";
import ShareButtons from "../../UIComponents/ShareButtons/index.tsx";
import TripCardIcons from "../TripCardIcons/index.tsx";
import SuccessMessage from "../../UIComponents/SuccessMessage/index.tsx";
import useTripActions from "../../../Hooks/useTripActions.tsx";
import socket from "../../../Hooks/socketInstance.tsx";
import "./style.css";

interface Images {
  src: string;
  alt: string;
}

const TripDetails = () => {
  const [viewMode, setViewMode] = useState("main");
  const [updateMode, setUpdateMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { trips, setTrips } = useTrips(); // Access TripContext
  const trip = trips.find((t) => t._id === id) || null;
  const [loading, setLoading] = useState(true);
  const loggedUserName = localStorage.getItem("userName") || "";
  const loggedUserId = localStorage.getItem("loggedUserId") || "";
  const isThisTheOwner = loggedUserId === trip?.owner?._id;

  const [mMargin, setMMargin] = useState("");
  const {
    isLiked,
    numOfLikes,
    numOfComments,
    isFavorite,
    isShareClicked,
    isExiting,
    successMessage,
    likesDetails,
    showLikesDetails,
    modalRef,
    handleLikeClick,
    handleFavoriteClick,
    handleShareClick,
    handleLikesClick,
    handleModalClose,
    setShowLikesDetails,
    setSuccessMessage,
  } = useTripActions(trip);

  useEffect(() => {
    if (searchParams.get("viewMode") === "viewComments") {
      setViewMode("viewComments");
    }
  }, [searchParams]);

  const loadTripFromServer = async () => {
    try {
      const data = await tripsService.getByTripId(id!);
      setTrips((prevTrips) => {
        const existingTrip = prevTrips.find((t) => t._id === id);
        if (existingTrip) {
          return prevTrips.map((t) => (t._id === id ? data : t));
        } else {
          return [...prevTrips, data];
        }
      });

      setMMargin(
        data.tripPhotos && data.tripPhotos.length > 0 ? "" : "m-margin"
      );
      setErrorMessage("");
    } catch (err) {
      console.error("Failed to load trip:", err);
      setErrorMessage(
        "An error occurred while loading the data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadTrip = () => {
    setLoading(true);

    const savedTrips = localStorage.getItem("trips");
    if (savedTrips) {
      const trips: ITrips[] = JSON.parse(savedTrips);
      const foundTrip = trips.find((t) => t._id === id);
      if (foundTrip) {
        setTrips((prevTrips) => {
          const existingTrip = prevTrips.find((t) => t._id === id);
          if (existingTrip) {
            return prevTrips.map((t) => (t._id === id ? foundTrip : t));
          } else {
            return [...prevTrips, foundTrip];
          }
        });
        setMMargin(
          foundTrip.tripPhotos && foundTrip.tripPhotos.length > 0
            ? ""
            : "m-margin"
        );
      }
    }

    loadTripFromServer();
  };

  useEffect(() => {
    loadTrip();
    return () => {};
  }, [id, updateMode]);

  const onClickUpdateMode = () => {
    setUpdateMode(!updateMode);
  };

  const onClickSend = async (
    newCommentText: string,
    stayInViewMode: boolean = false
  ) => {
    const commentToAdd = {
      comment: newCommentText || "",
      owner: loggedUserName || "",
      date: new Date().toISOString(),
      imgUrl: localStorage.getItem("imgUrl") || "",
      userId: loggedUserId,
    };

    setIsSubmitting(true);
    try {
      await tripsService.addComment(trip?._id || "", commentToAdd);
      setErrorMessage("");
      socket.emit("commentAdded", {
        tripId: trip?._id,
        newComment: commentToAdd,
      });

      if (!stayInViewMode) {
        setViewMode("main");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      setErrorMessage("Failed to send the comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentDeleted = async () => {
    loadTripFromServer();
  };

  const handleViewModeChange = (newMode: any) => {
    setViewMode(newMode);
    setErrorMessage("");
  };

  const imageObjects: Images[] =
    trip?.tripPhotos?.map((photoUrl) => ({
      src: photoUrl,
      alt: "Trip Photo",
    })) || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowLikesDetails(false);
      }
    };

    if (showLikesDetails) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLikesDetails, modalRef, setShowLikesDetails]);

  return (
    <>
      <Header />
      {loading ? (
        <div className="trips-loader main-loader-section">
          <LoadingDots />
        </div>
      ) : (
        <>
          {trip?.tripPhotos && trip?.tripPhotos?.length > 0 && !updateMode && (
            <div className="imeges-section">
              <ImageCarousel
                images={imageObjects}
                showDeleteButton={isThisTheOwner}
              />
            </div>
          )}
          <section className="flex-center-column-large-gap section main-card">
            {!updateMode ? (
              <div
                className={`${mMargin} main-card-section flex-center-column-large-gap`}
              >
                {trip && <TripHeader trip={trip} />}
                <section className="details-container flex-center-column">
                  {loggedUserId === trip?.owner?._id && (
                    <button
                      className="btn-l mode-btn"
                      onClick={onClickUpdateMode}
                    >
                      Editing Mode
                    </button>
                  )}
                  {trip && <TripDescription trip={trip} />}
                </section>

                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}

                {viewMode === "main" && (
                  <section className="btn-container-gap-m">
                    <button
                      className="btn-cta-l"
                      onClick={() => handleViewModeChange("addComment")}
                    >
                      Add Comment
                    </button>
                    <button
                      className="btn-l"
                      onClick={() => handleViewModeChange("viewComments")}
                    >
                      View Comments
                    </button>
                  </section>
                )}
                {trip && (
                  <TripCardIcons
                    tripId={trip._id || ""}
                    country={trip.country}
                    numOfComments={numOfComments}
                    numOfLikes={numOfLikes}
                    isLiked={isLiked}
                    isFavorite={isFavorite}
                    isShareClicked={isShareClicked}
                    isExiting={isExiting}
                    likesDetails={likesDetails}
                    showLikesDetails={showLikesDetails}
                    handleLikeClick={handleLikeClick}
                    handleFavoriteClick={handleFavoriteClick}
                    handleShareClick={handleShareClick}
                    handleLikesClick={handleLikesClick}
                    setShowLikesDetails={setShowLikesDetails}
                    modalRef={modalRef}
                  />
                )}
                {successMessage && (
                  <SuccessMessage
                    message={successMessage}
                    onAnimationEnd={() => setSuccessMessage(null)}
                  />
                )}
                {viewMode === "addComment" && (
                  <AddComment
                    onClickCancel={() => handleViewModeChange("main")}
                    onSendComment={(text) => !isSubmitting && onClickSend(text)}
                    isSubmitting={isSubmitting}
                  />
                )}
                {viewMode === "viewComments" && trip && (
                  <>
                    {trip.comments.length > 0 && (
                      <ViewComment
                        comments={trip.comments}
                        closeComments={() => handleViewModeChange("main")}
                        tripId={trip._id || ""}
                        onCommentDeleted={handleCommentDeleted}
                      />
                    )}
                    <AddComment
                      isSubmitting={isSubmitting}
                      onClickCancel={() => handleViewModeChange("main")}
                      onSendComment={(text) => onClickSend(text, true)}
                    />
                  </>
                )}
              </div>
            ) : (
              trip && (
                <UpdateTrip
                  onClickClose={() => setUpdateMode(false)}
                  trip={trip}
                  onClickReadMode={onClickUpdateMode}
                />
              )
            )}
          </section>
        </>
      )}
    </>
  );
};

export default TripDetails;
