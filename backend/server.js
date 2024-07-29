const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'build'))); // Serve static files from the React app

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const writeFileWithRetry = async (workbook, filePath, retries = 5, delay = 1000) => {
    for (let i = 0; i <= retries; i++) {
        try {
            xlsx.writeFile(workbook, filePath);
            console.log('Excel file updated successfully.');
            return; // Success, exit the function
        } catch (error) {
            if (i < retries && error.code === 'EBUSY') {
                console.log(`File is busy, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error; // Rethrow the error if retries exhausted or it's not EBUSY
            }
        }
    }
};

app.post('/save', upload.single('file-upload'), async (req, res) => {
    const {
        'entity-name': entityName,
        'document-name': documentName,
        'sector': sector,
        'year': year,
        'location': location,
        'region': region,
        'accountability': accountability,
        'autonomy': autonomy,
        'collaboration': collaboration,
        'explainability': explainability,
        'fairness': fairness,
        'human': human
    } = req.body;
    const file = req.file;

    // Log the received data
    console.log('Received data:', {
        entityName,
        documentName,
        sector,
        year,
        location,
        region,
        accountability,
        autonomy,
        collaboration,
        explainability,
        fairness,
        human,
        file
    });

    // Load or create Excel file
    const filePath = path.join(__dirname, 'ethical_codes.xlsx');
    let workbook;
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
    } else {
        workbook = xlsx.utils.book_new();
        workbook.SheetNames.push('Codes');
        workbook.Sheets['Codes'] = xlsx.utils.aoa_to_sheet([['ID', 'Entity Name', 'Document Name', 'Sector', 'Year', 'Location', 'Region', 'Accountability', 'Autonomy', 'Collaboration', 'Explainability', 'Fairness', 'Human', 'File Name']]);
    }

    // Add new data
    const sheet = workbook.Sheets['Codes'];
    const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const newRowId = sheetData.length;
    const newRow = [newRowId, entityName, documentName, sector, year, location, region, accountability, autonomy, collaboration, explainability, fairness, human, file ? file.filename : ''];

    console.log('New row:', newRow);

    sheetData.push(newRow);
    workbook.Sheets['Codes'] = xlsx.utils.aoa_to_sheet(sheetData);

    // Save Excel file with retry mechanism
    try {
        await writeFileWithRetry(workbook, filePath);
        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error writing to Excel file:', error);
        res.status(500).json({ message: 'Failed to save data.', error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
