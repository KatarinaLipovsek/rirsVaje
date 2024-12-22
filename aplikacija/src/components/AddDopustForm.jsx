import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Container, Typography, Box, Button } from "@mui/material";
import axios from "axios";

const AddDopustForm = ({ employeeId, onEdit }) => {
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
          console.log("Submitting dopust:", formattedData);
          const response = await axios.post("http://localhost:5000/api/dopust", formattedData);
          alert("Dopust added successfully. ID: " + response.data.id);

          setFormData({ 
            employeeId: "", 
            startDate: "", 
            endDate: "", 
            reason: "" 
          });


        } catch (error) {
          console.error("Error adding dopust:", error);
          alert("Error adding dopust. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Dopust
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Začetek dopusta"
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
                        label="Konec dopusta"
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
                    <TextField
                        label="Razlog"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
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

AddDopustForm.propTypes = {
    employeeId: PropTypes.string, 
    onEdit: PropTypes.func, 
};

export default AddDopustForm;
