/**
 * Google Apps Script to handle Contact Form submissions
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet where you want the data to go.
 * 2. Look at the URL. It looks like: https://docs.google.com/spreadsheets/d/1aBcD...xyz/edit
 * 3. Copy the long ID part between '/d/' and '/edit'. This is your SPREADSHEET_ID.
 * 4. Paste that ID into the code below where it says 'PASTE_YOUR_SPREADSHEET_ID_HERE'.
 * 5. Copy all this code and paste it into your Google Apps Script editor (Code.gs).
 * 6. Save.
 * 7. Click "Deploy" -> "Manage deployments".
 * 8. Click the "Edit" (pencil) icon on your active deployment.
 * 9. **CRITICAL**: In the "Version" dropdown, select "New version".
 * 10. Click "Deploy".
 */

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        // REPLACE THIS WITH YOUR ACTUAL SPREADSHEET ID
        var spreadsheetId = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

        var doc = SpreadsheetApp.openById(spreadsheetId);
        var sheet = doc.getSheetByName('Form Responses');

        if (!sheet) {
            sheet = doc.insertSheet('Form Responses');
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

        var recipient = "info@fairdealforwaders.com";
        var subject = "New Contact Form Inquiry - " + params.name;

        MailApp.sendEmail(recipient, subject, emailBody);

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}
