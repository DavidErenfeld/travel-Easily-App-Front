import React from "react";
import { ThumbsUp, Heart, Share2, X } from "lucide-react";
import ShareButtons from "../../UIComponents/ShareButtons";
import { useNavigate } from "react-router-dom";
import "./style.css";

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
  const navigate = useNavigate();

  return (
    <div className="icons-details flex-space-between">
      <div className="icons">
        <div className="icons-area">
          <ThumbsUp
            onClick={handleLikeClick}
            className={`icon ${isLiked ? "true" : "false"}`}
          />
        </div>
        <div className="icons-area">
          <Heart
            onClick={handleFavoriteClick}
            className={`icon ${isFavorite ? "true" : "false"}`}
          />
        </div>
        <Share2 className="icon share-icon" onClick={handleShareClick} />
      </div>
      {isShareClicked && !navigator.share && (
        <div className="trip-card-share-buttons">
          <ShareButtons
            url={`https://travel-easily-app.netlify.app/searchTrip/trip/${tripId}`}
            text={`Amazing trip to ${country}! Join me on this adventure!`}
            className={isExiting ? "hide" : "show"}
          />
        </div>
      )}
      <div className="coments-and-likes-details">
        <p onClick={() => navigate(`/searchTrip/trip/${tripId}`)}>
          {numOfComments} comments
        </p>
        <p onClick={handleLikesClick}>{numOfLikes} likes</p>
        {showLikesDetails && likesDetails.length > 0 && (
          <div ref={modalRef} className={`likes-details-modal`}>
            <X onClick={() => setShowLikesDetails(false)} className="icon" />
            {likesDetails.map((like, index) => (
              <ul key={index}>
                <span>{like.userName}</span>
                <img
                  src={like.imgUrl || "/images/user.png"}
                  alt="User profile"
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
