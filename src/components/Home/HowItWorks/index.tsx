import {
  Edit3,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Share2,
} from "lucide-react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HowItWorksSection = () => {
  const { t } = useTranslation(); // Translation hook
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Plus />,
      title: t("howItWorks.createPost.title"),
      description: t("howItWorks.createPost.description"),
    },
    {
      icon: <Heart />,
      title: t("howItWorks.saveFavorites.title"),
      description: t("howItWorks.saveFavorites.description"),
    },
    {
      icon: <Share2 />,
      title: t("howItWorks.shareItinerary.title"),
      description: t("howItWorks.shareItinerary.description"),
    },
    {
      icon: <MapPin />,
      title: t("howItWorks.exploreNearby.title"),
      description: t("howItWorks.exploreNearby.description"),
    },
    {
      icon: <Edit3 />,
      title: t("howItWorks.updateEdit.title"),
      description: t("howItWorks.updateEdit.description"),
    },
    {
      icon: <MessageCircle />,
      title: t("howItWorks.interactOthers.title"),
      description: t("howItWorks.interactOthers.description"),
    },
  ];

  return (
    <section className="how-it-works-section">
      <h2 className="section-title">{t("howItWorks.title")}</h2>
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <span className="step-icon">{step.icon}</span>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/addTrip")} className="btn-cta-exl">
        {t("howItWorks.cta")}
      </button>
    </section>
  );
};

export default HowItWorksSection;
