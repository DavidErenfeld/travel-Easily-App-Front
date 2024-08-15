// components/TripDetails/index.tsx
import { useEffect, useState } from "react";
import Rating from "../../UIComponents/Rating/index.tsx";
import TripDescription from "../TripDescription/index.tsx";
import UpdateTrip from "../UpdateTrip/index.tsx";
import tripsService, { ITrips } from "../../../services/tripsService.ts";
import { useParams, useSearchParams } from "react-router-dom";
import AddComment from "../../CommentsComponent/AddComment/index.tsx";
import ViewComment from "../../CommentsComponent/ViewComment/index.tsx";
import TripHeader from "../TripHeader/index.tsx";
import "./style.css";

const TripDetails = () => {
  const [viewMode, setViewMode] = useState("main"); // 'main', 'addComment', 'viewComments'
  const [updateMode, setUpdateMode] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [trip, setTrip] = useState<ITrips | null>(null);
  const [loading, setLoading] = useState(true);
  const loggedUserName = localStorage.getItem("userName") || "";
  const loggedUserId = localStorage.getItem("loggedUserId") || "";

  useEffect(() => {
    if (searchParams.get("viewMode") === "viewComments") {
      setViewMode("viewComments");
    }
  }, [searchParams]);

  const loadTrip = async () => {
    try {
      const data = await tripsService.getByTripId(id!);
      setTrip(data);
    } catch (err) {
      console.error("Failed to load trip:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const onClickUpdateMode = () => {
    setUpdateMode(!updateMode);
  };

  const onClickSend = async (
    newCommentText: string,
    stayInViewMode: boolean = false
  ) => {
    setLoading(true);

    const commentToAdd = {
      comment: newCommentText || "",
      owner: loggedUserName || "",
      date: new Date().toISOString(),
    };

    try {
      await tripsService.addComment(trip?._id || "", commentToAdd);
      await loadTrip();
      if (!stayInViewMode) {
        setViewMode("main");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="main-card-section flex-center-column-large-gap">
      {trip && <TripHeader trip={trip} />}
      {!updateMode ? (
        <>
          <section className="details-container flex-center-column">
            {loggedUserId === trip?.owner?._id && (
              <button className="btn-l" onClick={onClickUpdateMode}>
                Editing Mode
              </button>
            )}
            {trip && <TripDescription trip={trip} />}
          </section>
          {viewMode === "main" && (
            <section className="btn-container-gap-m">
              <button
                className="btn-l"
                onClick={() => setViewMode("addComment")}
              >
                Add Comment
              </button>
              {trip?.comments && trip.comments.length > 0 && (
                <button
                  className="btn-l"
                  onClick={() => setViewMode("viewComments")}
                >
                  View Comments
                </button>
              )}
            </section>
          )}
          {viewMode === "addComment" && (
            <AddComment
              onClickCancel={() => setViewMode("main")}
              onSendComment={onClickSend}
            />
          )}
          {viewMode === "viewComments" && trip && (
            <>
              <ViewComment
                comments={trip.comments}
                closeComments={() => setViewMode("main")}
              />
              <AddComment
                onClickCancel={() => setViewMode("main")}
                onSendComment={(text) => onClickSend(text, true)}
              />
            </>
          )}
        </>
      ) : (
        trip && (
          <UpdateTrip
            onClickClose={() => setUpdateMode(false)}
            trip={trip}
            onClickReadMode={onClickUpdateMode}
          />
        )
      )}
      {!updateMode && (
        <section className="rating-section">
          <Rating />
        </section>
      )}
    </section>
  );
};

export default TripDetails;
