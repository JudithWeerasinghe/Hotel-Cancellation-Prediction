import { ArrowLeft, BrainCircuit } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ResultPanel from "../components/ResultPanel";

export default function PredictionResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  const returnToForm = () => {
    navigate("/predict", {
      state: {
        initialForm: state?.form,
        initialStep: state?.step,
      },
    });
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Hotel Predict</span>
          <span className="breadcrumb-sep">›</span>
          <span>Prediction Result</span>
        </div>
        <h1>Booking Prediction Result</h1>
        <p>Cancellation risk assessment for your booking.</p>
      </div>

      {result?.success ? (
        <div className="prediction-result-content">
          <ResultPanel result={result} />
          <button className="btn btn-secondary" onClick={returnToForm}>
            <ArrowLeft size={16} />
            Back to booking form
          </button>
        </div>
      ) : (
        <div className="card prediction-result-unavailable">
          <BrainCircuit size={28} />
          <p>No prediction result is available. Submit a booking form to get a prediction.</p>
          <button className="btn btn-primary" onClick={() => navigate("/predict")}>
            <BrainCircuit size={16} />
            Go to prediction form
          </button>
        </div>
      )}
    </div>
  );
}
