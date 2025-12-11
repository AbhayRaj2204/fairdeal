/**
 * Google Apps Script to handle Contact Form submissions
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com/home
 * 2. Click "New Project"
 * 3. Paste this code into the editor (Code.gs)
 * 4. Save the project (e.g., "Fairdeal Contact Form")
 * 5. Run the 'setup' function once to create the sheet headers (optional, but recommended)
 *    - You might need to authorize the script.
 * 6. Click "Deploy" -> "New deployment"
 * 7. Select type: "Web app"
 * 8. Description: "Contact Form API"
 * 9. Execute as: "Me" (your email)
 * 10. Who has access: "Anyone" (IMPORTANT)
 * 11. Click "Deploy"
 * 12. Copy the "Web app URL"
 * 13. Paste the URL into d:\fairdeal\js\contact-form.js where indicated.
 */

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses');
        if (!sheet) {
            sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Form Responses');
            // Add headers if new sheet
            sheet.appendRow(['Timestamp', 'Name', 'Email', 'Mobile', 'POL', 'POD', 'Cargo', 'Containers', 'Size', 'Weight', 'Message']);
        }

        var params = e.parameter;

        // 1. Save to Google Sheet
        sheet.appendRow([
            new Date(),
            params.name,
            params.email,
            params.mobile,
            params.pol,
            params.pod,
            params.cargo,
            params.containers,
            params.containersize,
            params.weight,
            params.message
        ]);

        // 2. Send Email Notification
        var emailBody = "New Inquiry Received:\n\n" +
            "Name: " + params.name + "\n" +
            "Email: " + params.email + "\n" +
            "Mobile: " + params.mobile + "\n" +
            "POL: " + params.pol + "\n" +
            "POD: " + params.pod + "\n" +
            "Cargo: " + params.cargo + "\n" +
            "Containers: " + params.containers + "\n" +
            "Size: " + params.containersize + "\n" +
            "Weight: " + params.weight + "\n" +
            "Message: " + params.message + "\n";

        // Replace with your email address
        var recipient = "info@fairdealforwaders.com";
        var subject = "New Contact Form Inquiry - " + params.name;

        MailApp.sendEmail(recipient, subject, emailBody);

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function setup() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses');
    if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Form Responses');
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Mobile', 'POL', 'POD', 'Cargo', 'Containers', 'Size', 'Weight', 'Message']);
    }
}
