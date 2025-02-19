import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import tripsService, { ITrips } from "../../../services/tripsService.ts";
import { useTrips } from "../../../Context/TripContext";
import { useAuth } from "../../../Context/AuthContext.tsx";
import TripDescription from "../TripDescription/index.tsx";
import UpdateTrip from "../UpdateTrip/index.tsx";
import AddComment from "../../CommentsComponent/AddComment/index.tsx";
import ViewComment from "../../CommentsComponent/ViewComment/index.tsx";
import TripHeader from "../TripHeader/index.tsx";
import Header from "../../Header/index.tsx";
import ImageCarousel from "../../UIComponents/ImageCarousel/index.tsx";
import LoadingDots from "../../UIComponents/Loader";
import TripCardIcons from "../TripCardIcons/index.tsx";
import SuccessMessage from "../../UIComponents/SuccessMessage/index.tsx";
import useTripActions from "../../../Hooks/useTripActions.tsx";
import socket from "../../../Hooks/socketInstance.tsx";
import i18n from "../../../i18n.ts";
import "./style.css";

const TripDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState("main");
  const [updateMode, setUpdateMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { trips, setTrips } = useTrips();
  const trip = trips.find((t) => t.slug === slug) || null;
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
      const data = await tripsService.getByTripSlug(slug!);
      setTrips((prevTrips: any) => {
        const existingTrip = prevTrips.find((t: ITrips) => t.slug === slug);
        if (existingTrip) {
          return prevTrips.map((t: ITrips) => (t.slug === slug ? data : t));
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
      setErrorMessage(t("tripDetails.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const loadTrip = () => {
    setLoading(true);

    const savedTrips = localStorage.getItem("trips");
    if (savedTrips) {
      const trips: ITrips[] = JSON.parse(savedTrips);
      const foundTrip = trips.find((t) => t.slug === slug);
      if (foundTrip) {
        setTrips((prevTrips) => {
          const existingTrip = prevTrips.find((t) => t.slug === slug);
          if (existingTrip) {
            return prevTrips.map((t) => (t.slug === slug ? foundTrip : t));
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
  }, [slug, updateMode]);

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
      setErrorMessage(t("tripDetails.errorSendingComment"));
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

  const imageObjects =
    trip?.tripPhotos?.map((photoUrl) => ({
      src: photoUrl,
      alt: t("tripDetails.imageAlt"),
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
                      className={`btn-l ${
                        i18n.language === "he"
                          ? "mode-btn-right"
                          : "mode-btn-left"
                      }`}
                      onClick={onClickUpdateMode}
                    >
                      {t("tripDetails.editingMode")}
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
                      onClick={() =>
                        isAuthenticated
                          ? handleViewModeChange("addComment")
                          : navigate("/login")
                      }
                    >
                      {t("tripDetails.addComment")}
                    </button>
                    <button
                      className="btn-l"
                      onClick={() => handleViewModeChange("viewComments")}
                    >
                      {t("tripDetails.viewComments")}
                    </button>
                  </section>
                )}
                {trip && (
                  <TripCardIcons
                    slug={trip.slug || ""}
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
                    messageKey={
                      isFavorite
                        ? "successMessages.fivoriteAdded"
                        : "successMessages.fivoriteRemoved"
                    }
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
                    (
                    <AddComment
                      isSubmitting={isSubmitting}
                      onClickCancel={() => handleViewModeChange("main")}
                      onSendComment={(text) => onClickSend(text, true)}
                    />
                    )
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
