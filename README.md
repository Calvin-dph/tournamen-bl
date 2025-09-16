# TI Billiard Cup 2025 - Registration Landing Page

A modern, responsive landing page for the TI Billiard Cup 2025 tournament registration built with Next.js, React, and Tailwind CSS.

## Features

- **🎨 Beautiful Design**: Recreated the original poster design with responsive layout
- **📝 Registration Form**: Complete form with all required fields and validation
- **🔒 Secure API**: Server-side form processing with validation and sanitization
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **⚡ Fast**: Built with Next.js for optimal performance
- **🛡️ Validated**: Client and server-side validation with error handling

## Form Fields

- **Bidang**: Department selection (dropdown with all 15 departments)
- **Team 1**: Required team names (format: "Name1 & Name2")
- **Team 2**: Optional second team names
- **Phone Numbers**: WhatsApp numbers for all participants

## Business Rules

- Maximum 2 teams per department (4 employees total)
- Team names should contain 2 names separated by "&"
- Phone numbers should include all participants' WhatsApp numbers
- Registration closes on October 7, 2025

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Custom CSS animations
- **API**: Next.js API Routes
- **Validation**: Client-side and server-side validation
- **Data Storage**: JSON file storage (easily replaceable with database)

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### POST /api/register
Register a new team for the tournament.

**Request Body**:
```json
{
  "bidang": "Marketing",
  "team1": "John Doe & Jane Smith",
  "team2": "Bob Wilson & Alice Brown",
  "phoneNumbers": "081234567890 & 081234567891 & 081234567892 & 081234567893"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Pendaftaran berhasil!",
  "id": "1234567890"
}
```

### GET /api/register
View registration summary (for admin purposes).

## Tournament Details

- **Event**: TI Billiard Cup 2025
- **Game**: 8-Ball Billiard
- **Date**: October 13-18, 2025
- **Time**: 17:15 - 20:00 WIB
- **Location**: Greenlight Cafe & Billiard, Jl. Purnawarman No.3, Bandung
- **Format**: Group System, Semi-Competition
- **Registration Deadline**: October 7, 2025

## Prizes

- 🥇 **1st Place**: Rp 500,000 + Trophy + Plaque
- 🥈 **2nd Place**: Rp 300,000 + Plaque  
- 🥉 **3rd Place**: Rp 200,000 + Plaque
- 🏅 **4th & 5th Place**: Plaque + Certificate

## Contact

For registration assistance:
📱 085624055869 (Novi - TI)
📱 085189970998 ( Sean - TI )

## License

This project is created for the TI Billiard Cup 2025 tournament registration.
