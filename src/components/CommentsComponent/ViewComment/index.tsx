import CloseIcon from "../../UIComponents/Icons/Close";
import "./style.css";
import tripsService from "../../../services/tripsService"; // ייבוא הפונקציה למחיקת תגובה

interface Comment {
  _id?: string;
  imgUrl?: string;
  ownerId?: string;
  owner?: string;
  comment: string;
  date: string;
}

interface ViewCommentProps {
  comments?: Comment[];
  closeComments: () => void;
  tripId: string;
  onCommentDeleted: () => void; // הוספת הפרופס החדש
}

const ViewComment = ({
  comments = [],
  closeComments,
  tripId,
  onCommentDeleted, // הוספת הפרופס
}: ViewCommentProps) => {
  const loggedUserId = localStorage.getItem("loggedUserId"); // קבלת מזהה המשתמש המחובר

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await tripsService.deleteComment(tripId, commentId); // מחיקת התגובה דרך tripsService
        console.log(`Comment with ID: ${commentId} deleted successfully.`);
        onCommentDeleted(); // קריאה לפונקציה לאחר מחיקת תגובה
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  return (
    <section className="comments-section flex-center-column-large-gap">
      <div className="close-comments">
        <CloseIcon color="#fff" onClose={closeComments} />
      </div>
      {comments.map((comment, index) => (
        <div key={index} className="comment-container">
          <img
            className="user-comment-img"
            src={comment.imgUrl || "/images/user.png"}
            alt="Profile"
          />
          <div className="comment-content">
            <p>{comment.comment}</p>
            <div className="comment-details">
              <p className="comment-owner">{comment.owner}</p>
              <p className="comment-date">{comment.date}</p>
            </div>
            {comment.ownerId === loggedUserId && (
              <button
                className="delete-comment-btn"
                onClick={() => handleDeleteComment(comment._id!)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ViewComment;
