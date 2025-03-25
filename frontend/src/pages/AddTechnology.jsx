"use client"

import { useState } from "react"
import { TextField, Button, Paper, Grid, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Layout from "./Layout"

const API_BASE_URL = "http://localhost:5001"

const addTech = async (newData) => {
  const response = await fetch(`${API_BASE_URL}/technologies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData),
  })
  if (!response.ok) {
    throw new Error("Failed to add technology")
  }
  const data = await response.json()
  return { status: response.status, data }
}

const AddTechnology = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [addData, setAddData] = useState({
    name: "",
    description: "",
    overview: "",
    detailedDescription: "",
    genre: "",
    docket: "",
    innovators: "",
    advantages: "",
    applications: "",
    useCases: "",
    relatedLinks: "",
    technicalSpecifications: "",
    trl: "", // TRL as a string; we convert it to a number on submit
  })

  const handleAddChange = (e) => {
    const { name, value } = e.target
    setAddData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const processedData = {}
    Object.entries(addData).forEach(([key, value]) => {
      if (value.trim() !== "") {
        if (["advantages", "applications", "useCases"].includes(key)) {
          processedData[key] = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        } else if (key === "relatedLinks") {
          const links = value
            .split(",")
            .map((linkStr) => {
              const parts = linkStr.split("|").map((part) => part.trim())
              if (parts.length === 2 && parts[0] && parts[1]) {
                return { title: parts[0], url: parts[1] }
              }
              return null
            })
            .filter((link) => link !== null)
          if (links.length > 0) {
            processedData[key] = links
          }
        } else if (key === "trl") {
          // Convert the TRL field to a number
          processedData[key] = Number(value)
        } else {
          processedData[key] = value
        }
      }
    })

    // Automatically generate an id using the docket value or fallback to a timestamp
    if (!processedData.id) {
      processedData.id = processedData.docket ? processedData.docket : Date.now().toString()
    }

    // Validate required fields: name, description, genre, docket, and trl.
    if (!processedData.name || !processedData.description || !processedData.genre || !processedData.docket || !processedData.trl) {
      alert("Please fill in the required fields: Name, Description, Genre, Docket, and TRL Level.")
      return
    }

    try {
      const res = await addTech(processedData)
      if (res.status === 201) {
        alert("Technology added successfully!")
        navigate("/admin-dashboard")
      }
    } catch (error) {
      console.error("Error adding technology:", error)
      alert("Error adding technology. Please try again.")
    }
  }

  return (
    <Layout title="Add New Technology">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
          Add New Technology
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Name *" name="name" fullWidth value={addData.name} onChange={handleAddChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description *"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={addData.description}
                onChange={handleAddChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Genre *"
                name="genre"
                fullWidth
                value={addData.genre}
                onChange={handleAddChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Innovators"
                name="innovators"
                fullWidth
                value={addData.innovators}
                onChange={handleAddChange}
              />
            </Grid>
            {/* TRL Level Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="TRL Level *"
                name="trl"
                fullWidth
                value={addData.trl}
                onChange={handleAddChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Overview" name="overview" fullWidth value={addData.overview} onChange={handleAddChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detailed Description"
                name="detailedDescription"
                fullWidth
                multiline
                rows={4}
                value={addData.detailedDescription}
                onChange={handleAddChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Docket *" name="docket" fullWidth value={addData.docket} onChange={handleAddChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Advantages (comma-separated)"
                name="advantages"
                fullWidth
                value={addData.advantages}
                onChange={handleAddChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Applications (comma-separated)"
                name="applications"
                fullWidth
                value={addData.applications}
                onChange={handleAddChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Use Cases (comma-separated)"
                name="useCases"
                fullWidth
                value={addData.useCases}
                onChange={handleAddChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Related Links (format: Title1|URL1, Title2|URL2)"
                name="relatedLinks"
                fullWidth
                value={addData.relatedLinks}
                onChange={handleAddChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Technical Specifications"
                name="technicalSpecifications"
                fullWidth
                value={addData.technicalSpecifications}
                onChange={handleAddChange}
              />
            </Grid>
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
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Layout>
  )
}

export default AddTechnology
