import CloseIcon from "../../UIComponents/Icons/Close";
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
}

const ViewComment = ({ comments, closeComments }: ViewCommentProps) => {
  return (
    <section className="comments-section flex-center-column-large-gap">
      <div className="close-comments">
        <CloseIcon color="#fff" onClose={closeComments} />
      </div>
      {comments &&
        comments.map((comment, index) => (
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
            </div>
          </div>
        ))}
    </section>
  );
};

export default ViewComment;
