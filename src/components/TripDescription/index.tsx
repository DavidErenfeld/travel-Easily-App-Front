import "./style.css";

interface Trip {
  dayNum: number;
  description: string;
}

interface TripDescriptionProps {
  trips: Trip[];
}

const TripDescription: React.FC<TripDescriptionProps> = ({ trips }) => {
  return (
    <section className="flex-center-column-large-gap">
      {trips.map((trip, index) => (
        <div key={index}>
          <h2 className="day-name">Day {trip.dayNum}</h2>
          <p className="description">{trip.description}</p>
        </div>
      ))}
    </section>
  );
};

export default TripDescription;
