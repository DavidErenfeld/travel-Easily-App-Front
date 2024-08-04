import CloseIcon from "../../Icons/Close";
import "./style.css";

interface Comment {
  owner: string;
  content: string;
  date: Date;
}

interface ViewCommentProps {
  comments: Comment[];
  closeComments: () => void;
}

const ViewComment = ({ comments }: ViewCommentProps) => {
  const formatDateTime = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <section className="comments-section flex-center-column-large-gap ">
      <div className="close-comments">
        <CloseIcon color="#fff" />
      </div>
      {comments.map((comment, index) => (
        <div key={index} className="comment-container">
          <p className="comment-content">{comment.content}</p>
          <div className="comment-details">
            <p className="comment-owner">{comment.owner}</p>
            <p className="comment-date">{formatDateTime(comment.date)}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ViewComment;
