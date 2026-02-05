# GUBT Corporate Navigation Portal

This is a modern, beautiful, and efficient internal corporate navigation system. Designed to aggregate core corporate resources and provide a convenient one-click access experience.

![Home Page Preview](./public/uploads/preview-home.png)

## 🌟 Core Features

*   **Fast Search**: Global search in the core area of the homepage to quickly locate applications or documents.
*   **Modern UI Design**:
    *   **iOS Style Large Icons**: Clear visuals and exquisite experience.
    *   **Glassmorphism**: Visual effects with delicate animation interactions.
    *   **Responsive Layout**: Perfectly adapts to various screen sizes; supports **5 columns per row** high-density display on large screens.
*   **Powerful Icon Support**:
    *   **Auto Fetch**: Enter a URL, and the system automatically fetches the website Favicon.
    *   **Local Upload**: Supports direct upload of local images as icons (priority display).
    *   **Custom URL**: Supports entering any network image link.
*   **Simple Admin Dashboard**:
    *   Floating admin entry (bottom right corner) to keep the page clean.
    *   Supports creating, renaming, and deleting categories.
    *   Supports adding, editing, moving, and deleting links.
    *   Data is stored in local JSON, requiring no complex database configuration, easy to backup and migrate.

## 🚀 Quick Start

### 1. Prerequisites
Ensure your computer has [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Install Dependencies
Run in the project root directory:
```bash
npm install
# or
yarn install
```

### 3. Start Development Server
```bash
npm run dev
```
After starting, visit [http://localhost:3000](http://localhost:3000) to view the homepage.

## 📖 User Guide

### Access Admin Dashboard
1.  In the bottom right corner of the homepage, hover to see a lock icon (or gear icon), click it.
2.  Or directly visit [http://localhost:3000/login](http://localhost:3000/login).
3.  Default password: `admin123` (You can modify `ADMIN_PASSWORD` in the `.env` file).

### Content Management
*   **Add Category**: After logging in, click "New Category" in the top right corner.
*   **Add Link**: Click the `+` sign in the top right corner of the corresponding category card.
*   **Upload Icon**: When adding or editing a link, click "Choose File" to upload a local image; the system will automatically save and apply it.
*   **Adjust Layout**: When there are too many links, the system automatically arranges them in a grid (supports 5 columns) to keep it tidy.

## 🛠 Configuration & Deployment

### Data Backup
All navigation data is stored in the `src/lib/data.json` file. You only need to back up this file regularly to preserve all configurations.

### Deployment Suggestions
This project is built on Next.js, very suitable for deployment on:
*   **Vercel** (Recommended, zero configuration)
*   **Docker Container**: Use the provided `Dockerfile` (if available) for building.
*   **Local Server**: Run `npm run build` and then use `npm start` to start production mode.

## 📂 Project Structure
```
src/
├── app/              # Page Routing (Next.js App Router)
│   ├── page.tsx      # Homepage
│   ├── admin/        # Admin Dashboard
│   └── login/        # Login Page
├── components/       # UI Components
├── lib/              # Utility Functions & Data Operations
│   ├── actions.ts    # Server Actions (Backend Logic)
│   └── data.json     # Data Storage File
└── ...
```

---

## 🏭 About GUBT

### [GUBT Casting: High-performance wear parts for crushers](https://gubtcasting.com)

**GUBT** is a specialized manufacturer of aftermarket wear parts for the mining and quarrying industries. Based in China, we produce over 15,000 spare parts compatible with major crusher brands like Metso, Sandvik, and Symons. Our inventory includes manganese liners, mantle and concave sets, and various mechanical components designed to match or exceed OEM specifications.

We manage the entire production process in-house—from initial pattern design and casting to final machining and quality control. This vertical integration allows us to maintain tight tolerances and offer shorter lead times than many international distributors. Whether you are running a large-scale mining operation or a local aggregate plant, GUBT provides the durable parts needed to minimize downtime and lower your cost per ton.

---

## 🧩 Run as Container on Synology DSM

> Goal: Run directly as a container without docker-compose, and persist data and uploaded files.

### Necessary Settings

- Port Mapping: Map host port to container port `3000` (image already `EXPOSE 3000`)
- Environment Variables:
  - `ADMIN_PASSWORD` (Admin login password, default is `admin123`, recommend changing to a safer value)
- Persistence Mounts (Ensure data is not lost on restart):
  - Bind host `data.json` to container `/app/data.json`
  - Bind host `uploads` directory to container `/app/public/uploads`

Recommended host paths on Synology (adjust as needed):

- `/volume1/docker/gubt-daohang/data.json`
- `/volume1/docker/gubt-daohang/uploads/`

### Command Line Execution (Run in Synology SSH Terminal)

```bash
# 1) Prepare host persistence directory
mkdir -p /volume1/docker/gubt-daohang/uploads

# If you need preset data, you can create data.json first (optional, container initializes it if missing)
touch /volume1/docker/gubt-daohang/data.json

# 2) Pull image (replace image name as needed)
docker pull kanedai1/gubt-daohang:latest

# 3) Run container (example maps host 3000 to container 3000)
docker run -d \
  --name gubt-daohang \
  --restart unless-stopped \
  -p 3000:3000 \
  -e ADMIN_PASSWORD="PleaseEnterStrongPassword" \
  -v /volume1/docker/gubt-daohang/data.json:/app/data.json \
  -v /volume1/docker/gubt-daohang/uploads:/app/public/uploads \
  kanedai1/gubt-daohang:latest

# After startup, visit:
# http://<SynologyIP>:3000/
```

> Permission Tip: Container runs as `node` user (UID 1000). If the upload directory is not writable on the host, please grant write permission in Synology, or execute `chmod 777 /volume1/docker/gubt-daohang/uploads` via SSH for quick verification (please tighten permissions as needed for production).

### Create via Synology Container Manager (GUI)

- Image page select `kanedai1/gubt-daohang:latest` -> Create container with this image
- Port Settings: Add mapping `Local Port:3000` -> `Container Port:3000`
- Environment Variables: Add `ADMIN_PASSWORD=YourOwnStrongPassword`
- Volume (Storage) Mounts:
  - Bind host path `/volume1/docker/gubt-daohang/data.json` to container path `/app/data.json`
  - Bind host path `/volume1/docker/gubt-daohang/uploads` to container path `/app/public/uploads`
- Advanced Settings: Enable auto-restart `unless-stopped`
- After creation and startup, visit `http://<SynologyIP>:3000`

### Optional: Multi-platform Image Build & Push (Adapt to different NAS architectures)

If you need to build the image yourself and push to Docker Hub (username set to `kanedai1`), execute on local machine (supports Buildx):

```bash
# Login to Docker Hub
docker login -u kanedai1

# Build and push multi-platform image using Buildx (Apple Silicon adapts to arm64)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t kanedai1/gubt-daohang:latest \
  --push \
  .
```

After completion, you can pull and run this image on Synology, following the persistence mount and port mapping instructions above for container creation.
