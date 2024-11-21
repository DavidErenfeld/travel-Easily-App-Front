import { useRef, useState, useEffect } from "react";
import "./style.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

interface AddCommentProps {
  onSendComment: (comment: string) => void;
  onClickCancel: () => void;
  isSubmitting: boolean;
}

const AddComment = ({
  onSendComment,
  onClickCancel,
  isSubmitting,
}: AddCommentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const textarea = textareaRef.current;
    const adjustHeight = () => {
      if (textarea) {
        textarea.style.height = "auto";
        const maxHeight = 200;
        textarea.style.height =
          Math.min(textarea.scrollHeight, maxHeight) + "px";
      }
    };

    if (textarea) {
      textarea.addEventListener("input", adjustHeight);
      adjustHeight();
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("input", adjustHeight);
      }
    };
  }, []);

  const handleSend = () => {
    if (comment.trim() !== "" && !isSubmitting) {
      onSendComment(comment);
      setComment("");
    }
  };

  return (
    <section className="add-comment-section flex-center-column-large-gap">
      <textarea
        placeholder={t("addComment.placeholder")}
        ref={textareaRef}
        className="comment-input"
        rows={1}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="btn-container-gap-m">
        <button
          className="btn-m"
          onClick={onClickCancel}
          disabled={isSubmitting}
        >
          {t("addComment.cancel")}
        </button>
        <button
          className="btn-cta-m"
          onClick={handleSend}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("addComment.sending") : t("addComment.send")}
        </button>
      </div>
    </section>
  );
};

export default AddComment;
