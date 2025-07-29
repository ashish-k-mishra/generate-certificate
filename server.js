const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const generateCertificate = require('./utils/generateCertificate');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());


app.get('/', (req,res) => {
    res.json({message: 'App is working!'})
});

app.post('/generate-certificate', (req,res) => {
    const data = req.body;
    console.log("data:", data)

    const filenName = `${data.name.replace(/ /g, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "certificates", filenName);

    generateCertificate(data, filePath, res);
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});