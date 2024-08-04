import { FaHeart, FaRegComment } from "react-icons/fa";
import "./style.css";
import { useState } from "react";
import TripDescription from "../TripDescription";
import tripsArr from "../../Data/tripsArr";

const TripCard = () => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  let likeColor = !isLiked ? "white" : "blu";
  return (
    <>
      <section className="trip-card">
        <span className="user-profile"></span>
        <div className="trip-details">
          <h2 className="title">my First Trip</h2>
          <div className="tags">
            <p className="tag">tag 1</p>
            <p className="tag">tag 2</p>
            <p className="tag">tag 3</p>
            <p className="tag">tag 4</p>
          </div>
        </div>
        <div className="trip-description">
          <TripDescription trips={tripsArr} />
        </div>
        <div className="icons">
          <div className="like-area">
            <span>2</span>
            <FaHeart
              onClick={toggleLike}
              className={`like-icon ${likeColor}`}
            />
          </div>
          <FaRegComment />
        </div>
      </section>
    </>
  );
};

export default TripCard;
