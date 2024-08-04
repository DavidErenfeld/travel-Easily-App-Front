import "./style.css";
import { useState } from "react";
import Rating from "../Rating";
import TripDescription from "../TripDescription/index.tsx";
import ImageCarousel from "../ImageCarousel/index.tsx";
import AddComment from "../Comments/AddComment/index.tsx";
import ViewComment from "../Comments/ViewComment/index.tsx";
import tripsArr from "../../Data/tripsArr.ts";
import comments from "../../Data/commentsArr.ts";
import images from "../../Data/imagesArr.ts";
import UpdateTrip from "../UpdateTrip/index.tsx";

interface Comment {
  content: string;
  owner: string;
  date: Date;
}

const MainCard = () => {
  const [viewMode, setViewMode] = useState("main"); // 'main', 'addComment', 'viewComments'
  const [newComment, setNewComment] = useState<Comment | null>(null);
  const [postOwner, setPostOwner] = useState(1);
  const [updateMode, setUpdateMode] = useState(false);

  const onClickDetails = () => {
    postOwner === 1 ? setPostOwner(2) : setPostOwner(1);
  };
  const onClickUpdateMode = () => {
    !updateMode ? setUpdateMode(true) : setUpdateMode(false);
  };

  const onClickAddComment = () => {
    setViewMode("addComment");
  };

  const onClickViewComments = () => {
    setViewMode("viewComments");
  };

  const onClickClose = () => {
    console.log("ss");
  };

  const onClickCancel = () => {
    setViewMode("main");
  };

  const onClickSend = (newCommentText: string) => {
    const commentToAdd = {
      content: newCommentText,
      owner: "User",
      date: new Date(),
    };
    setNewComment(commentToAdd);
    setViewMode("main");
    console.log(commentToAdd);
  };

  return (
    <section className="main-card-section flex-center-column-large-gap">
      <button onClick={onClickDetails} className="btn-l">
        details
      </button>
      <div className="card-nav">
        <h1 className="card-title">My Trip</h1>
      </div>
      <section className="images-container">
        <ImageCarousel images={images} />
      </section>
      {!updateMode ? (
        <>
          <section className="details-container flex-center-column">
            {postOwner === 1 && (
              <button className="btn-l" onClick={onClickUpdateMode}>
                editing mode
              </button>
            )}
            <TripDescription trips={tripsArr} />
          </section>
          {viewMode === "main" && (
            <section className="btn-container-gap-m">
              <button className="btn-l" onClick={onClickAddComment}>
                Add comment
              </button>
              <button className="btn-l" onClick={onClickViewComments}>
                View comment
              </button>
            </section>
          )}
        </>
      ) : (
        <UpdateTrip
          onClickClose={onClickClose}
          trips={tripsArr}
          onClickReadMode={onClickUpdateMode}
        />
      )}
      {viewMode === "addComment" && (
        <AddComment onClickCancel={onClickCancel} onSendComment={onClickSend} />
      )}
      {viewMode === "viewComments" && (
        <ViewComment comments={comments} closeComments={onClickCancel} />
      )}
      <section className="rating-section">
        <Rating />
      </section>
    </section>
  );
};

export default MainCard;
