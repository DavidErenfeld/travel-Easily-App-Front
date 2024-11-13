// HowItWorksSection.jsx
import {
  ArrowRight,
  ChevronRight,
  Edit,
  Edit3,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Share2,
} from "lucide-react";
import "./style.css";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: <Plus />,
    title: "Create a Post",
    description:
      "Share the details of your travel, day-by-day, including descriptions, activities, and photos.",
  },
  {
    icon: <Heart />,
    title: "Save to Favorites",
    description:
      "Save trips you love to easily access them later and get inspired for your next journey.",
  },
  {
    icon: <Share2 />,
    title: "Share Your Itinerary",
    description:
      "Share itineraries easily via social media or email with a single click.",
  },
  {
    icon: <MapPin />,
    title: "Explore Nearby Attractions",
    description:
      "Find nearby attractions using our location-based feature to enhance your journey.",
  },
  {
    icon: <Edit3 />,
    title: "Update & Edit Posts",
    description:
      "Make updates to your itineraries anytime. Add new days, upload more photos, or edit details.",
  },
  {
    icon: <MessageCircle />,
    title: "Interact with Others",
    description:
      "Engage with other travelers by leaving comments, giving likes, or saving posts to favorites.",
  },
];

const HowItWorksSection = () => {
  const navigate = useNavigate();

  return (
    <section className="how-it-works-section">
      <h2 className="section-title">How It Works</h2>
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
        Get Started Now
      </button>
    </section>
  );
};

export default HowItWorksSection;
