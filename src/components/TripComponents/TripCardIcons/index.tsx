import React, { useEffect, useState } from "react";
import { ThumbsUp, Heart, Share2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ShareButtons from "../../UIComponents/ShareButtons";
import { useNavigate } from "react-router-dom";
import "./style.css";
import i18n from "../../../i18n";

interface TripCardIconsProps {
  tripId: string;
  country: string;
  numOfComments: number;
  numOfLikes: number;
  isLiked: boolean;
  isFavorite: boolean;
  isShareClicked: boolean;
  isExiting: boolean;
  likesDetails: Array<{ userName: string; imgUrl: string }>;
  showLikesDetails: boolean;
  handleLikeClick: (e: React.MouseEvent) => void;
  handleFavoriteClick: (e: React.MouseEvent) => void;
  handleShareClick: () => void;
  handleLikesClick: (e: React.MouseEvent) => void;
  setShowLikesDetails: (value: boolean) => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

const TripCardIcons: React.FC<TripCardIconsProps> = ({
  tripId,
  country,
  numOfComments,
  numOfLikes,
  isLiked,
  isFavorite,
  isShareClicked,
  isExiting,
  likesDetails,
  showLikesDetails,
  handleLikeClick,
  handleFavoriteClick,
  handleShareClick,
  handleLikesClick,
  setShowLikesDetails,
  modalRef,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [changePosition, setChangePosition] = useState("");

  useEffect(() => {
    i18n.language === "he"
      ? setChangePosition("change-position")
      : setChangePosition("");
  }, [t]);

  return (
    <div className="icons-details flex-space-between">
      <div className="icons">
        <div className="icons-area">
          <ThumbsUp
            onClick={handleLikeClick}
            className={`icon ${isLiked ? "true" : "false"}`}
            aria-label={t("tripCardIcons.like")}
          />
        </div>
        <div className="icons-area">
          <Heart
            onClick={handleFavoriteClick}
            className={`icon ${isFavorite ? "true" : "false"}`}
            aria-label={t("tripCardIcons.favorite")}
          />
        </div>
        <div className="icons-area">
          <Share2
            className="icon share-icon"
            onClick={handleShareClick}
            aria-label={t("tripCardIcons.share")}
          />
        </div>
      </div>
      {isShareClicked && !navigator.share && (
        <div className="trip-card-share-buttons">
          <ShareButtons
            url={`https://travel-easily-app.netlify.app/searchTrip/trip/${tripId}`}
            text={t("tripCardIcons.shareText", { country })}
            className={isExiting ? "hide" : "show"}
          />
        </div>
      )}
      <div className="coments-and-likes-details">
        <p onClick={() => navigate(`/searchTrip/trip/${tripId}`)}>
          {numOfComments} {t("tripCardIcons.comments")}
        </p>
        <p onClick={handleLikesClick}>
          {numOfLikes} {t("tripCardIcons.likes")}
        </p>
        {showLikesDetails && likesDetails.length > 0 && (
          <div
            ref={modalRef}
            className={`likes-details-modal ${changePosition}`}
          >
            <X
              onClick={() => setShowLikesDetails(false)}
              className="icon"
              aria-label={t("tripCardIcons.close")}
            />
            {likesDetails.map((like, index) => (
              <ul key={index}>
                <span>{like.userName}</span>
                <img
                  src={like.imgUrl || "/images/user.png"}
                  alt={t("tripCardIcons.altUserProfile")}
                />
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripCardIcons;
