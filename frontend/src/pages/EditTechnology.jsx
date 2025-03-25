"use client"

import { useEffect, useState } from "react"
import { TextField, Button, Paper, Grid, Typography, CircularProgress, useTheme, useMediaQuery } from "@mui/material"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "./Layout"

const API_BASE_URL = "http://localhost:5001"

const getTechnologyById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/technologies/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch technology details")
  }
  const data = await response.json()
  return data
}

const updateTechnology = async (id, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/technologies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  })
  if (!response.ok) {
    throw new Error("Failed to update technology")
  }
  const data = await response.json()
  return data
}

const EditTechnology = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [techData, setTechData] = useState({
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
    trl: "", // Added TRL field
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const data = await getTechnologyById(id)
        setTechData({
          name: data.name || "",
          description: data.description || "",
          overview: data.overview || "",
          detailedDescription: data.detailedDescription || "",
          genre: data.genre || "",
          docket: data.docket ? data.docket.toString() : "",
          innovators: data.innovators || "",
          advantages: Array.isArray(data.advantages) ? data.advantages.join(", ") : "",
          applications: Array.isArray(data.applications) ? data.applications.join(", ") : "",
          useCases: Array.isArray(data.useCases) ? data.useCases.join(", ") : "",
          relatedLinks: Array.isArray(data.relatedLinks)
            ? data.relatedLinks.map((link) => `${link.title}|${link.url}`).join(", ")
            : "",
          technicalSpecifications: data.technicalSpecifications || "",
          trl: data.trl ? data.trl.toString() : "", // Ensure TRL is a string
        })
      } catch (error) {
        console.error("Error fetching technology:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTech()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setTechData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const processedData = {}
    Object.entries(techData).forEach(([key, value]) => {
      // Convert value to string if not already
      const stringValue = typeof value === "string" ? value : value.toString()
      if (stringValue.trim() !== "") {
        if (["advantages", "applications", "useCases"].includes(key)) {
          processedData[key] = stringValue
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        } else if (key === "relatedLinks") {
          const links = stringValue
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
        } else {
          processedData[key] = stringValue
        }
      }
    })

    try {
      await updateTechnology(id, processedData)
      alert("Technology updated successfully!")
      navigate("/admin-dashboard")
    } catch (error) {
      console.error("Error updating technology:", error)
      alert("Failed to update technology. Please try again.")
    }
  }

  if (loading) {
    return (
      <Layout title="Edit Technology">
        <CircularProgress />
      </Layout>
    )
  }

  return (
    <Layout title="Edit Technology">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
          Edit Technology
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Name *" name="name" fullWidth value={techData.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description *"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={techData.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Genre *"
                name="genre"
                fullWidth
                value={techData.genre}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Innovators"
                name="innovators"
                fullWidth
                value={techData.innovators}
                onChange={handleChange}
              />
            </Grid>
            {/* New TRL Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="TRL Level *"
                name="trl"
                fullWidth
                value={techData.trl}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Overview" name="overview" fullWidth value={techData.overview} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detailed Description"
                name="detailedDescription"
                fullWidth
                multiline
                rows={4}
                value={techData.detailedDescription}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Docket" name="docket" fullWidth value={techData.docket} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Advantages (comma-separated)"
                name="advantages"
                fullWidth
                value={techData.advantages}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Applications (comma-separated)"
                name="applications"
                fullWidth
                value={techData.applications}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Use Cases (comma-separated)"
                name="useCases"
                fullWidth
                value={techData.useCases}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Related Links (format: Title1|URL1, Title2|URL2)"
                name="relatedLinks"
                fullWidth
                value={techData.relatedLinks}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Technical Specifications"
                name="technicalSpecifications"
                fullWidth
                value={techData.technicalSpecifications}
                onChange={handleChange}
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
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Layout>
  )
}

export default EditTechnology
