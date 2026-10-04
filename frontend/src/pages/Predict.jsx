import { useState } from "react";
import PredictionForm from "../components/PredictionForm";
import ResultPanel from "../components/ResultPanel";
import Toast from "../components/Toast";

export default function Predict() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleResult = (res) => {
    setResult(res);
    if (res?.success) {
      setToast({ message: "Prediction complete!", type: "success" });
      // scroll to result on mobile
      setTimeout(() => {
        document.getElementById("result-panel")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Hotel Predict</span>
          <span className="breadcrumb-sep">›</span>
          <span>New Prediction</span>
        </div>
        <h1>New Booking Prediction</h1>
        <p>Fill in all booking details across 7 steps to get an instant AI cancellation prediction.</p>
      </div>

      <div className="predict-layout">
        <PredictionForm onResult={handleResult} onLoading={setLoading} />
        <div id="result-panel">
          <ResultPanel result={result} loading={loading} />
        </div>
      </div>

      {/* Toast container */}
      <div className="toast-container">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
