const BASE_URL = "http://127.0.0.1:8000";

export async function predictCancellation(bookingData) {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  return response.json();
}

export async function getPredictionHistory() {
  const response = await fetch(`${BASE_URL}/predictions`);
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  return response.json();
}
