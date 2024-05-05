import { useState } from "react";
import "./style.css";
import "../style.css";
import CloseIcon from "../../Icons/Close";
import RadioList from "../../RadioList";
import CountriesList from "../../ContriesList";

const Profile = () => {
  const [imgSrc, setImgSrc] = useState("/images/user.png");
  const [openRadioList, setOpenRadioList] = useState<string | null>(null);
  const [selectedDateOfBirth, setSelectedDateOfBirth] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedReligion, setSelectedReligion] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAccessibility, setSelectedAccessibility] =
    useState<string>("");

  const handleRadioList = (id: string) => {
    if (openRadioList === id) {
      setOpenRadioList(null);
    } else {
      setOpenRadioList(id);
    }
  };

  const handleGenderSelected = (gender: string) => {
    setSelectedGender(gender);
    setOpenRadioList(null);
  };

  const handleReligionSelected = (religion: string) => {
    setSelectedReligion(religion);
    setOpenRadioList(null);
  };
  const handleStatusSelected = (status: string) => {
    setSelectedStatus(status);
    setOpenRadioList(null);
  };

  const handleAccessibilitySelected = (accessibility: string) => {
    setSelectedAccessibility(accessibility);
    setOpenRadioList(null);
  };

  const saveCountryName = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const saveDateOfBirth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDateOfBirth(event.target.value);
  };

  const onClickSend = () => {
    const profileData = {
      dateOfBirth: selectedDateOfBirth,
      gender: selectedGender,
      country: selectedCountry,
      accessibility: selectedAccessibility,
      religion: selectedReligion,
      status: selectedStatus,
    };
    console.log(profileData);
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
        <div className="date-container flex-stretch-column-gap">
          <h3 className="sub-title">date of birth</h3>
          <input
            className="date"
            type="date"
            placeholder="date of birth"
            value={selectedDateOfBirth}
            onChange={saveDateOfBirth}
          />
        </div>

        <section className="gender-container flex-stretch-column-gap">
          <h3 className="sub-title">gender</h3>
          <RadioList
            title="gender"
            optionsList={["Male", "Female", "Other"]}
            isOpen={openRadioList === "gender"}
            onTitleClick={() => handleRadioList("gender")}
            onOptionSelected={handleGenderSelected}
          />
        </section>

        <section className="country-container flex-stretch-column-gap">
          <h3 className="sub-title">country</h3>
          <CountriesList saveCountryName={saveCountryName} />
        </section>

        <section className="accessibility-container flex-stretch-column-gap">
          <h3 className="sub-title">accessibility</h3>
          <RadioList
            title="accessibility"
            optionsList={["Accessible", "Not Accessible"]}
            isOpen={openRadioList === "accessibility"}
            onTitleClick={() => handleRadioList("accessibility")}
            onOptionSelected={handleAccessibilitySelected}
          />
        </section>

        <section className="religion-container flex-stretch-column-gap">
          <h3 className="sub-title">religion</h3>
          <RadioList
            title="religion"
            optionsList={["Religious", "Secular", "Ultra-Orthodox"]}
            isOpen={openRadioList === "religion"}
            onTitleClick={() => handleRadioList("religion")}
            onOptionSelected={handleReligionSelected}
          />
        </section>

        <section className="status-container flex-stretch-column-gap">
          <h3 className="sub-title">status</h3>
          <RadioList
            title="status"
            optionsList={["Single", "Married", "Married +"]}
            isOpen={openRadioList === "status"}
            onTitleClick={() => handleRadioList("status")}
            onOptionSelected={handleStatusSelected}
          />
        </section>

        <button onClick={() => onClickSend()} className="send-btn btn-l">
          send
        </button>
      </section>
    </>
  );
};
export default Profile;
