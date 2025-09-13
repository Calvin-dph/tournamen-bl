# Google Form Field Mapping Instructions

To get the correct field entry IDs for your Google Form, you need to inspect the form's HTML. Here's how:

## Method 1: Inspect Form HTML

1. **Open your Google Form in a browser:**
   https://docs.google.com/forms/d/e/1FAIpQLSdJNoRz1vlNlj9x1PC_gO0JCWdM6YcD1wBpOrlU8TKu2DEMMA/viewform

2. **Right-click and select "View Page Source" or "Inspect Element"**

3. **Search for input elements with names like "entry.xxxxxxxxx"**

4. **Map each field:**
   - Email field: Look for `name="entry.XXXXXXXXX"` near the email input
   - Bidang field: Look for `name="entry.XXXXXXXXX"` near the dropdown/select
   - Team 1 field: Look for `name="entry.XXXXXXXXX"` near the Team 1 input
   - Team 2 field: Look for `name="entry.XXXXXXXXX"` near the Team 2 input
   - Phone Numbers field: Look for `name="entry.XXXXXXXXX"` near the phone input

## Method 2: Test Submission (Easier)

1. **Open the form and fill it out manually**
2. **Open browser developer tools (F12) and go to Network tab**
3. **Submit the form**
4. **Look for the POST request to `formResponse`**
5. **Check the Form Data in the request to see the entry IDs**

## Current Placeholder Values in Code

In `src/app/api/register/route.ts`, update these lines with the actual entry IDs:

```typescript
const FORM_FIELDS = {
  email: 'entry.1234567890',     // Replace with actual entry ID
  bidang: 'entry.0987654321',    // Replace with actual entry ID  
  team1: 'entry.1111111111',     // Replace with actual entry ID
  team2: 'entry.2222222222',     // Replace with actual entry ID
  phoneNumbers: 'entry.3333333333' // Replace with actual entry ID
};
```

## Example

If you find these in the HTML:
- `<input name="entry.123456789" ...>` for email
- `<select name="entry.987654321" ...>` for bidang
- etc.

Then update the code to:
```typescript
const FORM_FIELDS = {
  email: 'entry.123456789',
  bidang: 'entry.987654321',
  team1: 'entry.111222333',
  team2: 'entry.444555666',
  phoneNumbers: 'entry.777888999'
};
```

Once you have the correct entry IDs, the form will submit directly to your Google Form!