import { useLocation, useNavigate } from "react-router-dom";
import PredictionForm from "../components/PredictionForm";

export default function Predict() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleResult = (res, form, step) => {
    if (res?.success) {
      navigate("/prediction-result", { state: { result: res, form, step } });
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

      <div className="predict-layout predict-layout-form-only">
        <PredictionForm
          onResult={handleResult}
          initialForm={location.state?.initialForm}
          initialStep={location.state?.initialStep}
        />
      </div>
    </div>
  );
}
