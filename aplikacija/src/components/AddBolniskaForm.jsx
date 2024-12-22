import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Container, Typography, Box, Button } from "@mui/material";
import axios from "axios";

const AddBolniskaForm = ({ employeeId, onEdit }) => {
    const [formData, setFormData] = useState({
        employeeId: employeeId || "",
        startDate: "",
        endDate: "",
        reason: "",
    });

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const formattedData = {
            employeeId: formData.employeeId,
            startDate: new Date(formData.startDate).toISOString().split("T")[0], 
            endDate: new Date(formData.endDate).toISOString().split("T")[0],
            reason: formData.reason,
          };
          console.log("Submitting bolniska:", formattedData);
          const response = await axios.post("http://localhost:5000/api/bolniska", formattedData);
          alert("Bolniska added successfully. ID: " + response.data.id);

          setFormData({ 
            employeeId: "", 
            startDate: "", 
            endDate: "", 
            reason: "" 
          });


        } catch (error) {
          console.error("Error adding bolniska:", error);
          alert("Error adding bolniska. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Bolniska
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Začetek"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="Konec"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Dodaj
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

AddBolniskaForm.propTypes = {
    employeeId: PropTypes.string, 
    onEdit: PropTypes.func, 
};

export default AddBolniskaForm;
