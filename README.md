# Entyre Frontend

Entyre Frontend is a modern, feature-rich web application built with [React](https://react.dev/) and [Vite](https://vitejs.dev/). It serves as the user interface for the Entyre platform, enabling advanced multi-criteria decision analysis (MCDA), interactive data visualization, and content management. The frontend communicates with the [entyre-backend](https://github.com/2hangz/ENTYRE/tree/main/entyre-backend) API to provide dynamic, data-driven experiences.

---

## Contributors

- [**Jiaming Li**](https://github.com/JiamingLi-star): MCDA Tool
- **Hang Zhou**: All other features

---

## Key Features

- **MCDA Tool**
  - **Supported Methods**: Weighted Sum, Compromise Programming (CP), and TOPSIS.
  - **Dynamic Weighting**: Adjust and lock weights for each project/criterion interactively.
  - **Data Manipulation**: Edit, lock, and reset input data for each project and criterion.
  - **Pareto Analysis**: Automatic identification and visualization of Pareto optimal solutions.
  - **Visualization**: Switch between bar, line, and radar charts for result comparison.
  - **Excel Integration**: Load and parse Excel files directly in the browser for MCDA analysis.

- **Content Management**
  - **Articles**: Fetch and display articles from the backend, with markdown rendering and image support.
  - **Videos**: Display video content (YouTube or direct links) with embedded players and thumbnails.
  - **Sectioned Content**: Render markdown-based content sections for documentation and outputs.

- **Excel Data File Management**
  - **File Listing**: Browse available Excel files on the backend.
  - **Online Selection**: Select and load Excel files without manual upload.
  - **Parsing**: Automatic parsing and structuring of Excel data for MCDA.

- **Responsive UI**
  - **Modern Design**: Clean, accessible, and visually appealing interface.
  - **Mobile Friendly**: Responsive layouts for desktop, tablet, and mobile devices.
  - **Interactive Controls**: Sliders, input fields, and toggles for real-time data manipulation.

- **Backend API Integration**
  - **RESTful Endpoints**: Communicates with backend for files, articles, videos, and more.
  - **Live Data**: All content and data are fetched dynamically from the backend API.

---

## Tech Stack

- [React](https://react.dev/) – UI development
- [Vite](https://vitejs.dev/) – Fast development/build tool
- [D3.js](https://d3js.org/) – Data visualization (bar, line, radar charts)
- [XLSX](https://github.com/SheetJS/sheetjs) – Excel file parsing in-browser
- [React Router](https://reactrouter.com/) – Client-side routing
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for styling and responsive design
- [gh-pages](https://github.com/tschaub/gh-pages) – Static deployment to GitHub Pages (optional)
- [remark-gfm](https://github.com/remarkjs/remark-gfm) – GitHub Flavored Markdown support for content rendering

---

## Directory Structure

- `src/`
  - `components/` – Reusable React components (e.g., MCDA tool, charts)
  - `pages/` – Top-level pages (e.g., Home, Key Outputs)
  - `styles/` – CSS modules and global styles
  - `assets/` – Static assets (images, icons)
- `public/`
  - `content/` – Markdown files for documentation and outputs
- `README.md` – This documentation
- `package.json` – Project dependencies and scripts

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```
4. **Preview the production build:**
   ```bash
   npm run preview
   ```

> **Note:** The frontend expects the backend API to be running and accessible at the configured URL (see `baseApi` in the code).

---

## Further Information

- **Backend Repository:** [entyre-backend](https://github.com/2hangz/ENTYRE/tree/main/entyre-backend)
- **Deployment:** Supports static deployment via GitHub Pages or other static hosts.
- **Customization:** Easily extendable for new MCDA methods, data sources, or content types.

For more details, see the code comments and documentation within each component and page.
