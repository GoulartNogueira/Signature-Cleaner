# Signature Cleaner

A Next.js application that removes backgrounds from handmade signatures using the Photoroom API.

![Signature Cleaner Interface](https://github.com/user-attachments/assets/458e306f-ec15-465d-ad94-eec65c19d6a9)

## Features

- 📤 **Simple Upload Interface**: Drag and drop or click to upload signature images
- 🎨 **Background Removal**: Uses Photoroom API to automatically remove backgrounds
- 🔄 **Side-by-Side Comparison**: View original and processed images simultaneously
- 📥 **Download**: Download the processed signature as PNG
- 🔗 **Webhook Support**: Optionally send processed images to a webhook URL
- 🌓 **Dark Mode**: Full dark mode support

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- Photoroom API key ([Get it here](https://www.photoroom.com/api/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GoulartNogueira/Signature-Cleaner.git
cd Signature-Cleaner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Photoroom API key to the `.env` file:
```env
PHOTOROOM_API_KEY=your_photoroom_api_key_here
WEBHOOK_URL=  # Optional: default webhook URL
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build:**
```bash
npm run build
npm start
```

## Usage

1. **Upload an Image**: Click the upload area or drag and drop a signature image (PNG, JPG, or GIF)
2. **Optional Webhook**: Enter a webhook URL if you want the processed image sent to an external service
3. **Remove Background**: Click the "Remove Background" button to process the image
4. **Download**: Once processed, download the cleaned signature with transparent background

## API Endpoints

### POST `/api/remove-background`

Removes the background from an uploaded image using the Photoroom API.

**Request Body (multipart/form-data):**
- `image` (File): The signature image to process
- `webhookUrl` (string, optional): URL to send the processed image to

**Response:**
- Success: Returns the processed image as PNG with transparent background
- Error: Returns JSON with error message and appropriate status code

## Technology Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Background Removal**: Photoroom API

## Project Structure

```
Signature-Cleaner/
├── app/
│   ├── api/
│   │   └── remove-background/
│   │       └── route.ts          # API endpoint for background removal
│   ├── components/
│   │   └── ImageUploader.tsx     # Main upload component
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PHOTOROOM_API_KEY` | Your Photoroom API key | Yes |
| `WEBHOOK_URL` | Default webhook URL (can be overridden per request) | No |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.