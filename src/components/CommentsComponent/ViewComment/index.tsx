import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
import CloseIcon from "../../UIComponents/Icons/Close";
import tripsService from "../../../services/tripsService";
import "./style.css";

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
  onCommentDeleted: () => void;
}

const ViewComment = ({
  comments = [],
  closeComments,
  tripId,
  onCommentDeleted,
}: ViewCommentProps) => {
  const { t } = useTranslation();
  const loggedUserId = localStorage.getItem("loggedUserId");

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm(t("viewComment.deleteConfirmation"))) {
      try {
        await tripsService.deleteComment(tripId, commentId);
        console.log(t("viewComment.deleteSuccess", { id: commentId }));
        onCommentDeleted();
      } catch (error) {
        console.error(t("viewComment.deleteError"), error);
      }
    }
  };

  return (
    <section className="comments-section flex-center-column-large-gap">
      <div className="close-comments">
        <CloseIcon color="#fff" onClose={closeComments} />
      </div>
      {comments.map(
        (comment, index) =>
          comment && (
            <div key={index} className="comment-container">
              <img
                className="user-comment-img"
                src={comment.imgUrl || "/images/user.png"}
                alt={t("viewComment.profileAlt")}
              />
              <div className="comment-content">
                <p>{comment.comment}</p>
                <div className="comment-details">
                  <p className="comment-owner">{comment.owner}</p>
                  <p className="comment-date">
                    {new Date(comment.date).toLocaleDateString(t("locale"), {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {comment.ownerId === loggedUserId && (
                  <MdDelete
                    onClick={() => handleDeleteComment(comment._id!)}
                    className="icon delete-comment-icon"
                  />
                )}
              </div>
            </div>
          )
      )}
    </section>
  );
};

export default ViewComment;
