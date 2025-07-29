const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function generateCertificate(data, filePath, res) {
    const {
        registerId,
        email,
        phone,
        address,
        certificateTitle,
        name,
        description,
        dob,
        gender,
        bloodGroup,
        dateTime
    } = data;

    //Border related data
    const outerMargin = 6;
    const borderPadding = 18;
    const innerPadding = 35;

    const doc = new PDFDocument({
        size: [707, 500],
        margin: outerMargin
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const fundamentoFontPath = path.join(__dirname, '../fonts/Fondamento-Regular.ttf');
    doc.registerFont('Fondamento', fundamentoFontPath);

    const pageWidth = doc.page.width;
    const pagerHeight = doc.page.height;

    //Dimension for border
    const borderX = outerMargin;
    const borderY = outerMargin;
    const borderWidth = pageWidth - 2 * outerMargin;
    const borderHeight = pagerHeight - 2 * outerMargin;

    //Dimension for content area
    const contentX = borderX + borderPadding + innerPadding;
    const contentY = borderY + borderPadding + innerPadding;
    const contentWidth = borderWidth - 2 * (borderPadding + innerPadding) + 2;
    const centerX = pageWidth/2;
    const contentRightX = contentX + contentWidth;

    //Draw outer border
    doc.save()
    .lineWidth(borderPadding)
    .strokeColor('#047DB7')
    .roundedRect(
        borderX + borderPadding / 2,
        borderY + borderPadding / 2,
        borderWidth - borderPadding,
        borderHeight - borderPadding,
        1
    )
    .stroke()
    .restore();

    let y = contentY;



    //Top section
    doc.fontSize(12).font('Helvetica')
    .text(`Register-Id:- ${registerId}`, contentX, y )
    .text(`E-Mail: ${email}`, contentX, y+18)
    .text(`Phone No.: ${phone}`, contentX, y+36)

    const logoPath = path.join(__dirname, '../images/logo.png');
    if(fs.existsSync(logoPath)){
        doc.image(logoPath, centerX - 53, y - 34, {width: 101});
    }

    doc.fontSize(12).font('Helvetica')
    .text(address, contentRightX - 140, y, {
        width: 140,
        align: 'right'
    });

    y += 70;

    //Middle Texts
    doc.fontSize(32).fillColor('#047DB7').font('Fondamento')
    .text(certificateTitle, contentX, y, {
        width: contentWidth,
        align: 'center'
    });

    y = doc.y + 18;

    doc.fontSize(16).fillColor('black').font('Fondamento')
    .text("This certificate is presented to", contentX, y, {
        width: contentWidth,
        align: 'center'
    });

    y = doc.y + 2;

    doc.fontSize(20).fillColor('#A0522D').font('Times-Roman')
    .text(name, contentX, y, {
        width: contentWidth,
        align: 'center'
    });

    y = doc.y + 12;

    doc.fontSize(12).fillColor('black').font('Times-Roman')
    .text(description, centerX - 200, y, {
        width: 380,
        align: 'center',
        lineGap: 4
    });

    y = doc.y + 25;



    //Personal Info
    const sectionWidth = contentWidth / 3;
     doc.fontSize(13).font('Times-Roman')
    .text(`Date of Birth: ${dob}`, contentX, y, {
        width: sectionWidth,
        align: 'left'
    });

     doc.text(`Gender: ${gender}`, contentX + sectionWidth, y, {
        width: sectionWidth,
        align: 'center'
    });

     doc.text(`Blood Group: ${bloodGroup}`, contentX + 2 * sectionWidth, y, {
        width: sectionWidth,
        align: 'right'
    });

    y = doc.y + 20;



    //Below section
    doc.fontSize(12).fillColor('black')
    .text(dateTime, contentX, y+30, {
        width: 140,
        align: 'center'
    })
    .text('_______________________', contentX, doc.y - 2)
    .text('DATE-TIME', contentX, doc.y + 2, {
        width: 140,
        align: 'center'
    })

    const badgePath = path.join(__dirname, '../images/badge.png');
    if(fs.existsSync(badgePath)){
        doc.image(badgePath, centerX - 58, y-2, {width: 112});
    }

    const signatureSectionWidth = 140;
    const signatureX = pageWidth - outerMargin - borderPadding- innerPadding- signatureSectionWidth;
     doc.text('______________________', signatureX , y+45, {
        width: signatureSectionWidth,
        align: 'right'
     })
    .text('SIGNATURE', signatureX, doc.y + 2, {
        width: signatureSectionWidth,
        align: 'center'
    })


    doc.end();

    stream.on('finish', () => {
        res.status(200).json({message: 'Certificate generated!', filePath});
    });

    stream.on('error', (err) => {
        res.status(500).json({message: 'Failed to generate certificate.', error: err.message});
    });
}

module.exports = generateCertificate;