import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'

const EthicalCodeForm = () => {
    const [entityName, setEntityName] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [sector, setSector] = useState('');
    const [year, setYear] = useState('');
    const [location, setLocation] = useState('');
    const [region, setRegion] = useState('');
    const [accountability, setAccountability] = useState(false);
    const [autonomy, setAutonomy] = useState(false);
    const [collaboration, setCollaboration] = useState(false);
    const [explainability, setExplainability] = useState(false);
    const [fairness, setFairness] = useState(false);
    const [human, setHuman] = useState(false);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
        
        if (!entityName) newErrors.entityName = 'Entity Name is required';
        if (!documentName) newErrors.documentName = 'Document Name is required';
        if (!sector) newErrors.sector = 'Sector is required';
        if (!year) newErrors.year = 'Year is required';
        if (!location) newErrors.location = 'Location is required';
        if (!region) newErrors.region = 'Region is required';
        if (!file) newErrors.file = 'File upload is required';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const formData = new FormData();
        formData.append('entity-name', entityName);
        formData.append('document-name', documentName);
        formData.append('sector', sector);
        formData.append('year', year);
        formData.append('location', location);
        formData.append('region', region);
        formData.append('accountability', accountability);
        formData.append('autonomy', autonomy);
        formData.append('collaboration', collaboration);
        formData.append('explainability', explainability);
        formData.append('fairness', fairness);
        formData.append('human', human);
        formData.append('file-upload', file);

        try {
            const response = await axios.post('http://localhost:3001/save', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                alert('Data saved successfully!');
            } else {
                alert('Failed to save data.');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="entity-name">Entity Name:</label>
            <input
                type="text"
                id="entity-name"
                value={entityName}
                onChange={e => setEntityName(e.target.value)}
                placeholder="Enter the entity name (e.g., Australia)"
                required
            />
            {errors.entityName && <span className="error-message">{errors.entityName}</span>}
            
            <label htmlFor="document-name">Document Name:</label>
            <input
                type="text"
                id="document-name"
                value={documentName}
                onChange={e => setDocumentName(e.target.value)}
                placeholder="Enter the document name"
                required
            />
            {errors.documentName && <span className="error-message">{errors.documentName}</span>}
            
            <label htmlFor="sector">Sector:</label>
            <input
                type="text"
                id="sector"
                value={sector}
                onChange={e => setSector(e.target.value)}
                placeholder="Enter the sector (e.g., Government)"
                required
            />
            {errors.sector && <span className="error-message">{errors.sector}</span>}
            
            <label htmlFor="year">Year:</label>
            <input
                type="text"
                id="year"
                value={year}
                onChange={e => setYear(e.target.value)}
                pattern="\d{4}"
                placeholder="Enter year (e.g., 2020)"
                title="Please enter a valid four-digit year (e.g., 2020)"
                required
            />
            {errors.year && <span className="error-message">{errors.year}</span>}
            
            <label htmlFor="location">Location:</label>
            <input
                type="text"
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Enter the location (e.g., Canada)"
                required
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
            
            <label htmlFor="region">Region:</label>
            <input
                type="text"
                id="region"
                value={region}
                onChange={e => setRegion(e.target.value)}
                placeholder="Enter the region (e.g., North America)"
                required
            />
            {errors.region && <span className="error-message">{errors.region}</span>}
            
            <fieldset>
                <legend>Ethical Values</legend>
                <label>
                    <input type="checkbox" checked={accountability} onChange={e => setAccountability(e.target.checked)} /> Accountability
                </label>
                <label>
                    <input type="checkbox" checked={autonomy} onChange={e => setAutonomy(e.target.checked)} /> Autonomy
                </label>
                <label>
                    <input type="checkbox" checked={collaboration} onChange={e => setCollaboration(e.target.checked)} /> Collaboration
                </label>
                <label>
                    <input type="checkbox" checked={explainability} onChange={e => setExplainability(e.target.checked)} /> Explainability
                </label>
                <label>
                    <input type="checkbox" checked={fairness} onChange={e => setFairness(e.target.checked)} /> Fairness
                </label>
                <label>
                    <input type="checkbox" checked={human} onChange={e => setHuman(e.target.checked)} /> Human
                </label>
            </fieldset>
            
            <label htmlFor="file-upload">Upload File:</label>
            <input type="file" id="file-upload" onChange={handleFileChange} required />
            {errors.file && <span className="error-message">{errors.file}</span>}
            
            <button type="submit">Save</button>
        </form>
    );
};

export default EthicalCodeForm;
