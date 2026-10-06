# Hotel Cancellation Prediction

A full-stack application that estimates the cancellation risk of a hotel booking. Users enter booking details in a seven-step React form; a FastAPI backend validates and preprocesses the details, runs a pretrained XGBoost model, and stores successful predictions in a local SQLite database.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Project layout](#project-layout)
- [Prerequisites](#prerequisites)
- [Run locally on Windows](#run-locally-on-windows)
- [Run locally on macOS or Linux](#run-locally-on-macos-or-linux)
- [Using the application](#using-the-application)
- [API reference](#api-reference)
- [Model and data files](#model-and-data-files)
- [Development commands](#development-commands)
- [Troubleshooting](#troubleshooting)

## Features

- Seven-step booking form with required-field validation.
- Arrival date calendar with year, month, day, and automatically calculated ISO week number.
- Cancellation prediction with a probability and High/Low risk classification.
- Dedicated prediction-results page, with a way to return to the submitted form.
- Dashboard with summary statistics and recent predictions.
- Prediction history with search, filtering, sorting, and CSV export.
- SQLite storage for successful prediction history.
- Interactive backend API documentation through Swagger UI.

## Technology

**Frontend**

- React
- React Router
- Vite
- Lucide React

**Backend**

- Python
- FastAPI and Uvicorn
- Pydantic
- SQLAlchemy and SQLite
- pandas and NumPy
- XGBoost and scikit-learn

## Project layout

```text
Hotel-Cancellation-Prediction/
├── backend/
│   ├── database.py             # SQLite engine and session setup
│   ├── database_models.py      # Prediction history table
│   ├── main.py                 # FastAPI application and endpoints
│   ├── model.py                # Model loading and prediction
│   ├── preprocessing.py        # Input validation and feature preparation
│   └── schemas.py              # Request schema
├── frontend/
│   ├── src/
│   │   ├── components/         # Form, result, and shared UI components
│   │   ├── pages/              # Dashboard, prediction, result, and history pages
│   │   └── services/api.js     # Frontend API requests
│   ├── package.json
│   └── vite.config.js
├── models/
│   └── final_model.json        # Trained XGBoost model
├── X_train.csv                 # Feature-column reference used in preprocessing
└── requirements.txt            # Backend Python dependencies
```

The backend expects both `models/final_model.json` and `X_train.csv` at the project root-relative locations shown above. Keep these files in place.

## Prerequisites

- Git
- Python 3.11 or newer
- Node.js 22.12 or newer and npm

Vite 8 requires a supported recent Node.js release. If your installed versions are older, upgrade them before installing dependencies.

## Run locally on Windows

Clone the repository and enter its directory:

```powershell
git clone https://github.com/JudithWeerasinghe/Hotel-Cancellation-Prediction.git
cd Hotel-Cancellation-Prediction
```

Create a virtual environment and install backend dependencies:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Install frontend dependencies:

```powershell
cd frontend
npm install
cd ..
```

Start the backend and frontend in **two separate PowerShell windows**, both opened at the repository root.

**Terminal 1 — backend:**

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 — frontend:**

```powershell
Set-Location frontend
npm run dev
```

Open the local URL printed by Vite, normally <http://localhost:5173/>.

## Run locally on macOS or Linux

Clone the repository and enter its directory:

```bash
git clone https://github.com/JudithWeerasinghe/Hotel-Cancellation-Prediction.git
cd Hotel-Cancellation-Prediction
```

Create a virtual environment and install backend dependencies:

```bash
python3 -m venv .venv
./.venv/bin/python -m pip install --upgrade pip
./.venv/bin/python -m pip install -r requirements.txt
```

Install frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

Start the backend and frontend in **two separate terminal windows**, both opened at the repository root.

**Terminal 1 — backend:**

```bash
./.venv/bin/python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 — frontend:**

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite, normally <http://localhost:5173/>.

## Using the application

The frontend provides these pages:

| Page | Route | Purpose |
|---|---|---|
| Dashboard | `/` | Summary statistics and recent predictions |
| New Prediction | `/predict` | Enter booking information across seven stages |
| Prediction Result | `/prediction-result` | View a successful prediction |
| History | `/history` | Search, filter, sort, and export saved predictions |

On the prediction form, complete each stage and submit at the final stage. The arrival calendar fills the existing Year, Arrival Month, and Day of Month fields; the Week Number is calculated using ISO week numbering. A successful result is shown on its own page. Use **Back to booking form** to return to the submitted form.

Some inputs begin blank; the booking-type choices default to **Resort Hotel** and **Yes – Returning Guest**, and selected count fields default to zero. Review the values before submitting.

## API reference

With the backend running:

- Health check: <http://127.0.0.1:8000/>
- Swagger UI: <http://127.0.0.1:8000/docs>
- ReDoc: <http://127.0.0.1:8000/redoc>

### `GET /`

Returns a message indicating that the API is running.

### `POST /predict`

Accepts a JSON booking object. All fields in the example below are required by the backend schema:

```json
{
  "hotel": "Resort Hotel",
  "lead_time": 30,
  "arrival_date_year": 2027,
  "arrival_date_month": "January",
  "arrival_date_week_number": 2,
  "arrival_date_day_of_month": 17,
  "stays_in_weekend_nights": 1,
  "stays_in_week_nights": 2,
  "adults": 2,
  "children": 0,
  "babies": 0,
  "meal": "BB",
  "country_encoded": 63,
  "market_segment": "Online TA",
  "distribution_channel": "TA/TO",
  "is_repeated_guest": 0,
  "previous_cancellations": 0,
  "previous_bookings_not_canceled": 0,
  "reserved_room_type": "A",
  "assigned_room_type": "A",
  "booking_changes": 0,
  "deposit_type": "No Deposit",
  "days_in_waiting_list": 0,
  "customer_type": "Transient",
  "adr": 125.0,
  "required_car_parking_spaces": 0,
  "total_of_special_requests": 0
}
```

Example using `curl`:

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "hotel": "Resort Hotel",
    "lead_time": 30,
    "arrival_date_year": 2027,
    "arrival_date_month": "January",
    "arrival_date_week_number": 2,
    "arrival_date_day_of_month": 17,
    "stays_in_weekend_nights": 1,
    "stays_in_week_nights": 2,
    "adults": 2,
    "children": 0,
    "babies": 0,
    "meal": "BB",
    "country_encoded": 63,
    "market_segment": "Online TA",
    "distribution_channel": "TA/TO",
    "is_repeated_guest": 0,
    "previous_cancellations": 0,
    "previous_bookings_not_canceled": 0,
    "reserved_room_type": "A",
    "assigned_room_type": "A",
    "booking_changes": 0,
    "deposit_type": "No Deposit",
    "days_in_waiting_list": 0,
    "customer_type": "Transient",
    "adr": 125.0,
    "required_car_parking_spaces": 0,
    "total_of_special_requests": 0
  }'
```

A successful response has this general shape:

```json
{
  "success": true,
  "errors": [],
  "prediction": "Not Cancelled",
  "cancellation_probability": 0.1234,
  "risk_level": "Low"
}
```

The cancellation probability is a decimal from `0` to `1`. Risk is classified as **High** when the model probability is at least `0.5`, otherwise **Low**. Invalid values can return `success: false` with an `errors` array; requests that fail schema validation are rejected by FastAPI.

Successful predictions are saved to the local history database.

### `GET /predictions`

Returns saved prediction-history records, newest first. The stored history includes hotel, lead time, guest counts, ADR, prediction, cancellation probability, risk level, and creation time.

## Model and data files

- `models/final_model.json` contains the pretrained XGBoost classifier loaded by the backend.
- `X_train.csv` is read by preprocessing to obtain the expected feature-column names. It is used to align encoded booking data with the model's expected input columns.
- The backend derives features such as total nights, total guests, family status, and arrival season before encoding the input.
- This repository contains the prediction-serving code and model artifact; it does not include a documented model-training workflow.

The UI offers arrival years from 2024 through 2035. This is an input range, not a guarantee that the model was trained on every one of those years; the model may be less reliable on inputs outside its training distribution.

## Development commands

Run these commands from the `frontend` directory:

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build in frontend/dist
npm run preview  # Preview the production build locally
npm run lint     # Run Oxlint
```

Run the backend from the repository root:

```bash
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

On macOS/Linux, use `./.venv/bin/python` in place of `.\.venv\Scripts\python.exe`.

## Troubleshooting

### The frontend cannot reach the API

- Confirm the backend is running at `http://127.0.0.1:8000`.
- Keep the browser frontend on `localhost` or `127.0.0.1`, normally port `5173`. The backend CORS configuration also allows port `5174`.
- The frontend API service is configured to call `http://127.0.0.1:8000`.

### Vite uses a different port

If port `5173` is already occupied, Vite may select the next available port. Open the exact URL printed in the frontend terminal. The backend CORS settings include ports `5173` and `5174`.

### The model or training-column file cannot be found

Run Uvicorn from the repository root and confirm `models/final_model.json` and `X_train.csv` exist in the repository.

### Python dependency installation fails

Confirm that the active interpreter is Python 3.11 or newer, then recreate the virtual environment and install from `requirements.txt`.

### Prediction history is empty

The SQLite database and its tables are initialized when the backend starts. History records are added after successful predictions. The local database is stored at `backend/hotel_predictions.db` and is not tracked by Git.
