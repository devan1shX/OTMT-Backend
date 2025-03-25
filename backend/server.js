// server.js
import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import cors from "cors";
import { connect } from "mongoose";
import { TechDetail, Event } from "./models.js";

const app = express();
app.use(cors());
app.use(json());

// -----------------------------------------
// Connect to MongoDB
// -----------------------------------------
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// -----------------------------------------
// CRUD API Endpoints for Technologies
// -----------------------------------------

// GET: Fetch all technologies
app.get("/technologies", async (req, res) => {
  try {
    const techs = await TechDetail.find({});
    res.json(techs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching technologies" });
  }
});

// GET: Fetch a single technology by id (custom id field)
app.get("/technologies/:id", async (req, res) => {
  try {
    const tech = await TechDetail.findOne({ id: req.params.id });
    if (!tech) {
      return res.status(404).json({ message: "Technology not found" });
    }
    res.json(tech);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching technology" });
  }
});

// POST: Create a new technology
app.post("/technologies", async (req, res) => {
  try {
    // Create new TechDetail using the request body
    const newTech = new TechDetail(req.body);
    const savedTech = await newTech.save();
    res.status(201).json(savedTech);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating technology" });
  }
});

// PUT: Update an existing technology by id (custom id field)
app.put("/technologies/:id", async (req, res) => {
  try {
    const updatedTech = await TechDetail.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedTech) {
      return res.status(404).json({ message: "Technology not found" });
    }
    res.json(updatedTech);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating technology" });
  }
});

// DELETE: Remove a technology by id (custom id field)
app.delete("/technologies/:id", async (req, res) => {
  try {
    const deletedTech = await TechDetail.findOneAndDelete({ id: req.params.id });
    if (!deletedTech) {
      return res.status(404).json({ message: "Technology not found" });
    }
    res.json({ message: "Technology deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting technology" });
  }
});

// -----------------------------------------
// CRUD API Endpoints for Events
// -----------------------------------------

// GET: Fetch all events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching events" });
  }
});

app.get("/events/:id", async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching event" });
  }
});

// POST: Create a new event with auto-increment id
app.post("/events", async (req, res) => {
  try {
    // Find the event with the highest numeric id that exists
    const lastEvent = await Event.findOne({ id: { $exists: true } }).sort({ id: -1 });
    let newId = 1;
    if (lastEvent && typeof lastEvent.id === 'number' && !isNaN(lastEvent.id)) {
      newId = lastEvent.id + 1;
    }
    // Ensure the client cannot override the id
    req.body.id = newId;
    
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Error creating event" });
  }
});



// PUT: Update an event by custom id
app.put("/events/:id", async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const updatedEvent = await Event.findOneAndUpdate(
      { id: eventId },
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating event" });
  }
});

// DELETE: Remove an event by custom id
app.delete("/events/:id", async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const deletedEvent = await Event.findOneAndDelete({ id: eventId });
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting event" });
  }
});

// -----------------------------------------
// Start the Server
// -----------------------------------------
const PORT = process.env.PORT_CRUD || 5001;
app.listen(PORT, () => {
  console.log(`CRUD server running on port ${PORT}`);
});
