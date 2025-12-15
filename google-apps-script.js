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
        // =================================================================================
        // IMPORTANT: YOU MUST PASTE YOUR SPREADSHEET ID BELOW
        // =================================================================================
        var spreadsheetId = '1JANw-aTGbCohFns_26QipzkiTeeQ_GdLHegmJrAgdwU';
        // =================================================================================

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

        // Brand Colors
        var primaryColor = "#FF3E41"; // Red
        var secondaryColor = "#51CFED"; // Light Blue
        var darkColor = "#060315"; // Dark Blue/Black
        var lightColor = "#F8F2F0"; // Off White

        // ==========================================
        // 2. Send Email to ADMIN (with Form Details)
        // ==========================================
        var adminHtmlBody = `
      <div style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: ${primaryColor}; padding: 30px 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">FAIRDEAL</h2>
          <p style="color: #ffffff; margin: 5px 0 0; font-size: 14px; opacity: 0.9;">New Website Inquiry</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: ${lightColor};">
          <p style="color: ${darkColor}; font-size: 18px; margin-bottom: 20px;"><strong>Dear Admin,</strong></p>
          <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">You have received a new inquiry from the website. Here are the details submitted by the visitor:</p>
          
          <table style="width: 100%; border-collapse: separate; border-spacing: 0; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; width: 35%; font-weight: 600;">Name</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor}; font-weight: 500;">${params.name}</td>
            </tr>
            <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; font-weight: 600;">Email</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor};"><a href="mailto:${params.email}" style="color: ${primaryColor}; text-decoration: none; font-weight: 500;">${params.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; font-weight: 600;">Mobile</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor};"><a href="tel:${params.mobile}" style="color: ${primaryColor}; text-decoration: none; font-weight: 500;">${params.mobile}</a></td>
            </tr>
            <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; font-weight: 600;">POL (Loading)</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor};">${params.pol || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; font-weight: 600;">POD (Discharge)</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor};">${params.pod || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; font-weight: 600;">Cargo</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor};">${params.cargo || '-'}</td>
            </tr>
             <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; font-weight: 600;">Containers</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor};">${params.containers || '-'}</td>
            </tr>
             <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; font-weight: 600;">Size</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor};">${params.containersize || '-'}</td>
            </tr>
             <tr>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; background-color: #f8f9fa; color: #495057; font-weight: 600;">Weight</td>
              <td style="padding: 15px 20px; border-bottom: 1px solid #eee; color: ${darkColor};">${params.weight || '-'}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; background-color: #ffffff; padding: 25px; border-radius: 8px; border-left: 5px solid ${primaryColor}; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 10px; color: #6c757d; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Additional Message</p>
            <p style="margin: 0; color: ${darkColor}; line-height: 1.6; font-style: italic;">"${params.message || 'No additional message provided.'}"</p>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="mailto:${params.email}" style="background-color: ${primaryColor}; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(255, 62, 65, 0.2);">Reply to Inquiry</a>
          </div>
        </div>
        
        <div style="background-color: ${darkColor}; padding: 20px; text-align: center; color: #adb5bd; font-size: 12px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Fairdeal Services. All rights reserved.</p>
          <p style="margin: 5px 0 0;">Automated email from website contact form.</p>
        </div>
      </div>
    `;

        var adminRecipient = "abhay.micradigital@gmail.com";
        var adminSubject = "New Inquiry: " + params.name;

        MailApp.sendEmail({
            to: adminRecipient,
            subject: adminSubject,
            htmlBody: adminHtmlBody
        });

        // ==========================================
        // 3. Send Email to USER (Thank You Message)
        // ==========================================
        if (params.email) {
            var userHtmlBody = `
        <div style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
          <!-- Header -->
          <div style="background-color: ${primaryColor}; padding: 40px 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">FAIRDEAL</h2>
            <p style="color: #ffffff; margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Global Logistics Solutions</p>
          </div>
          
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <p style="color: ${darkColor}; font-size: 20px; margin-bottom: 20px;"><strong>Dear ${params.name},</strong></p>
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">Thank you for reaching out to <strong>Fairdeal Services</strong>. We have successfully received your inquiry regarding your logistics requirements.</p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">Our dedicated team is currently reviewing the details you provided and will get back to you shortly with a tailored solution.</p>
            
            <div style="background-color: ${lightColor}; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid ${secondaryColor};">
              <p style="margin: 0 0 15px; color: ${darkColor}; font-weight: 700; font-size: 14px; text-transform: uppercase;">We received the following details:</p>
              <ul style="color: #555; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li><strong>Mobile:</strong> ${params.mobile}</li>
                <li><strong>Port of Loading:</strong> ${params.pol || 'N/A'}</li>
                <li><strong>Port of Discharge:</strong> ${params.pod || 'N/A'}</li>
                <li><strong>Cargo:</strong> ${params.cargo || 'N/A'}</li>
              </ul>
            </div>

            <p style="color: #555; line-height: 1.6; margin-bottom: 10px;">If you have any urgent questions or need immediate assistance, please feel free to contact us directly.</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 30px;">
              <p style="color: ${darkColor}; font-weight: 700; margin: 0 0 5px;">Best Regards,</p>
              <p style="color: #555; margin: 0;">The Fairdeal Services Team</p>
              <p style="color: ${primaryColor}; margin: 5px 0 0;"><a href="https://fairdealforwaders.com" style="color: ${primaryColor}; text-decoration: none; font-weight: 600;">www.fairdealforwaders.com</a></p>
            </div>
          </div>
          
          <div style="background-color: ${darkColor}; padding: 25px; text-align: center; color: #adb5bd; font-size: 12px;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Fairdeal Services. All rights reserved.</p>
            <div style="margin-top: 10px;">
              <a href="#" style="color: #adb5bd; text-decoration: none; margin: 0 10px;">About Us</a>
              <a href="#" style="color: #adb5bd; text-decoration: none; margin: 0 10px;">Services</a>
              <a href="#" style="color: #adb5bd; text-decoration: none; margin: 0 10px;">Contact</a>
            </div>
          </div>
        </div>
      `;

            MailApp.sendEmail({
                to: params.email,
                subject: "Thank you for contacting Fairdeal Services",
                htmlBody: userHtmlBody
            });
        }

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}
