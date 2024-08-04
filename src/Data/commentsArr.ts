interface Comment {
  owner: string;
  content: string;
  date: Date;
}

const comments: Comment[] = [
  {
    owner: "Alice",
    content: "Great trip, thanks for sharing!",
    date: new Date("2024-01-01T14:48:00"),
  },
  {
    owner: "Bob",
    content: "Amazing pictures!",
    date: new Date("2024-01-02T15:30:00"),
  },
  {
    owner: "Charlie",
    content: "Can't wait to go there myself.",
    date: new Date("2024-01-03T16:15:00"),
  },
  {
    owner: "David",
    content: "What was the highlight of the trip?",
    date: new Date("2024-01-04T17:05:00"),
  },
  {
    owner: "Ella",
    content: "This place looks beautiful.",
    date: new Date("2024-01-05T18:00:00"),
  },
  {
    owner: "Frank",
    content:
      "How much did the whole trip cost, Did you encounter any difficulties, do you think is best for visitin Did you encounter any difficulties,?",
    date: new Date("2024-01-06T19:45:00"),
  },
  {
    owner: "Grace",
    content: "Did you encounter any difficulties?",
    date: new Date("2024-01-07T20:30:00"),
  },
  {
    owner: "Helen",
    content: "Which season do you think is best for visiting?",
    date: new Date("2024-01-08T21:15:00"),
  },
  {
    owner: "Ian",
    content: "Would you recommend this trip to others?",
    date: new Date("2024-01-09T22:00:00"),
  },
  {
    owner: "Jane",
    content: "I've always wanted to visit this place, thanks for the info!",
    date: new Date("2024-01-10T23:45:00"),
  },
];

export default comments;
