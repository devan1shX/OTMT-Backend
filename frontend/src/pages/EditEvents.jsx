"use client"

import React, { useState, useEffect } from "react"
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "./Layout"

const EditEvents = () => {
  const { id } = useParams() // Get event id from the URL
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [eventData, setEventData] = useState({
    title: "",
    month: "",
    day: "",
    location: "",
    time: "",
    description: "",
    registration: ""
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  // Load event details when component mounts
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5001/events/${id}`)
        if (!res.ok) {
          setMessage("Event not found")
          setLoading(false)
          return
        }
        const data = await res.json()
        setEventData(data)
      } catch (error) {
        console.error("Error loading event:", error)
        setMessage("Error loading event")
      }
      setLoading(false)
    }
    loadEvent()
  }, [id])

  // Update form state when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  // Submit updated event data to the backend and redirect to events page on success
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
      const res = await fetch(`http://localhost:5001/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })
      if (res.ok) {
        // Redirect to events page after successful update
        navigate("/events")
      } else {
        setMessage("Error updating event")
      }
    } catch (error) {
      console.error("Error updating event:", error)
      setMessage("Error updating event")
    }
  }

  if (loading) {
    return (
      <Layout title="Edit Event">
        <Grid container justifyContent="center" sx={{ marginTop: "2rem" }}>
          <CircularProgress />
        </Grid>
      </Layout>
    )
  }

  return (
    <Layout title="Edit Event">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
          Edit Event
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={eventData.title || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Month"
                name="month"
                fullWidth
                value={eventData.month || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Day"
                name="day"
                fullWidth
                value={eventData.day || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                fullWidth
                value={eventData.location || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                name="time"
                fullWidth
                value={eventData.time || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={eventData.description || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Registration"
                name="registration"
                fullWidth
                value={eventData.registration || ""}
                onChange={handleChange}
              />
            </Grid>
            {message && (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {message}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  background: "linear-gradient(45deg, #000000, #333333)",
                  color: "white",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Layout>
  )
}

export default EditEvents
