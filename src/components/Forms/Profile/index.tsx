import { useState } from "react";
import MultiSelect from "../../MultiSelect/index";
import "./style.css";
import "../style.css";
import CloseIcon from "../../Icons/Close";
import RadioList from "../../RadioList";

const Profile = () => {
  const [selectedFavouriteFood, setSelectedFavouriteFood] = useState<string[]>(
    []
  );
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>(
    []
  );
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [imgSrc, setImgSrc] = useState("/images/user.png");
  const favouriteFood = ["Kosher", "Vegan", "Meat Eaters", "Dairy"];
  const seasonsOptions = ["Summer", "Winter", "Spring", "Autumn"];
  const travelStyles = [
    "Sightseeing & Attractions",
    "Adventure & Adrenaline",
    "Romantic Getaways",
    "Nature & Scenery",
    "Relaxation & Leisure ",
  ];
  const InterestRegions = [
    "Europe",
    "Asia",
    "South America",
    "North America",
    "Australia & Oceania",
    "Africa",
  ];

  const [openMultiSelect, setOpenMultiSelect] = useState<string | null>(null);

  // פונקציה לעדכון הMultiSelect הפתוח
  const handleOpenMultiSelect = (id: string) => {
    if (openMultiSelect === id) {
      setOpenMultiSelect(null);
    } else {
      setOpenMultiSelect(id);
    }
  };

  const toggleOption = (
    option: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <>
      <section className="profile-container">
        <div className="form-close-icon">
          <CloseIcon onClick={() => console.log("close")} />
        </div>

        <h2 className="form-title main-title">profile</h2>
        <div className="form-image-profile">
          {imgSrc && (
            <img src={imgSrc} alt="Preview" className="register-img" />
          )}
        </div>
        <div className="date-container flex-center-column-gap">
          <h3 className="sub-title">date of birth</h3>
          <input className="date" type="date" placeholder="date of birth" />
        </div>

        <section className="gender-container ">
          <RadioList
            title="gender"
            optionsList={["Male", "Female", "Other"]}
            isOpen={openMultiSelect === "gender"}
            onTitleClick={() => handleOpenMultiSelect("gender")}
          />
        </section>

        <section className="diet-options-container">
          <MultiSelect
            selectedOptions={selectedFavouriteFood}
            toggleOption={(option) =>
              toggleOption(option, setSelectedFavouriteFood)
            }
            options={favouriteFood}
            title="favourite food"
            isOpen={openMultiSelect === "favouriteFood"}
            onTitleClick={() => handleOpenMultiSelect("favouriteFood")}
          />
        </section>

        <section className="seasons-container">
          <MultiSelect
            selectedOptions={selectedSeasons}
            toggleOption={(option) => toggleOption(option, setSelectedSeasons)}
            options={seasonsOptions}
            title=" Favorite Seasons Traveling"
            isOpen={openMultiSelect === "seasonsOptions"}
            onTitleClick={() => handleOpenMultiSelect("seasonsOptions")}
          />
        </section>

        <section className="travel-tyles-container">
          <MultiSelect
            selectedOptions={selectedTravelStyles}
            toggleOption={(option) =>
              toggleOption(option, setSelectedTravelStyles)
            }
            options={travelStyles}
            title=" Travel Styles"
            isOpen={openMultiSelect === "travelStyles"}
            onTitleClick={() => handleOpenMultiSelect("travelStyles")}
          />
        </section>

        <section className="regions-container">
          <MultiSelect
            selectedOptions={selectedRegions}
            toggleOption={(option) => toggleOption(option, setSelectedRegions)}
            options={InterestRegions}
            title=" Interest Regions"
            isOpen={openMultiSelect === "InterestRegions"}
            onTitleClick={() => handleOpenMultiSelect("InterestRegions")}
          />
        </section>

        <button className="send-btn btn-l">send</button>
      </section>
    </>
  );
};
export default Profile;
