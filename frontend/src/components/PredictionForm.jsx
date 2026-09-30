import { useState } from "react";
import { predictCancellation } from "../services/api";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const ROOM_TYPES = ["A","B","C","D","E","F","G","H","I","K","L"];
const MEALS = ["BB","FB","HB","SC","Undefined"];
const SEGMENTS = ["Online TA","Offline TA/TO","Direct","Corporate","Complementary","Groups","Aviation"];
const CHANNELS = ["TA/TO","Direct","Corporate","GDS","Undefined"];
const DEPOSITS = ["No Deposit","Non Refund","Refundable"];
const CUSTOMERS = ["Transient","Transient-Party","Contract","Group"];

function Stepper({ value, onChange, min = 0, max = 99 }) {
  return (
    <div className="stepper">
      <button className="stepper-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <span className="stepper-value">{value}</span>
      <button className="stepper-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function OptionCards({ options, value, onChange }) {
  return (
    <div className="option-cards">
      {options.map((opt) => (
        <div
          key={opt}
          className={`option-card ${value === opt ? "selected" : ""}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}

function Toggle({ value, onChange, labelOn = "Yes", labelOff = "No" }) {
  return (
    <div className="toggle-wrap">
      <label className="toggle">
        <input type="checkbox" checked={value === 1} onChange={(e) => onChange(e.target.checked ? 1 : 0)} />
        <span className="toggle-track" />
      </label>
      <span className="toggle-label">{value === 1 ? labelOn : labelOff}</span>
    </div>
  );
}

const STEPS = [
  { label: "Hotel & Dates", desc: "Basic hotel and arrival information" },
  { label: "Stay Details", desc: "Duration and lead time" },
  { label: "Guests", desc: "Number of guests staying" },
  { label: "Room & Meal", desc: "Room type and meal plan" },
  { label: "Booking Info", desc: "Market segment and channels" },
  { label: "Guest History", desc: "Previous booking behaviour" },
  { label: "Pricing & Extras", desc: "Rate, parking and special requests" },
];

const DEFAULT_FORM = {
  hotel: "Resort Hotel",
  arrival_date_year: 2025,
  arrival_date_month: "July",
  arrival_date_week_number: 28,
  arrival_date_day_of_month: 1,
  stays_in_weekend_nights: 2,
  stays_in_week_nights: 3,
  lead_time: 90,
  adults: 2,
  children: 0,
  babies: 0,
  meal: "BB",
  reserved_room_type: "A",
  assigned_room_type: "A",
  market_segment: "Online TA",
  distribution_channel: "TA/TO",
  deposit_type: "No Deposit",
  customer_type: "Transient",
  is_repeated_guest: 0,
  previous_cancellations: 0,
  previous_bookings_not_canceled: 0,
  booking_changes: 0,
  country_encoded: 63,
  days_in_waiting_list: 0,
  adr: 125.0,
  required_car_parking_spaces: 0,
  total_of_special_requests: 0,
};

export default function PredictionForm({ onResult, onLoading }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async () => {
    setSubmitting(true);
    onLoading(true);
    setErrors([]);
    try {
      const data = { ...form, children: parseFloat(form.children) };
      const result = await predictCancellation(data);
      if (!result.success) {
        setErrors(result.errors);
        onResult(null);
      } else {
        onResult(result);
      }
    } catch (e) {
      setErrors(["Cannot reach the server. Make sure the backend is running on port 8000."]);
      onResult(null);
    } finally {
      setSubmitting(false);
      onLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="step-body">
            <div className="step-title">{STEPS[0].label}</div>
            <div className="step-desc">{STEPS[0].desc}</div>
            <div className="form-grid">
              <div className="form-group span-2">
                <label className="form-label">Hotel Type</label>
                <OptionCards
                  options={["Resort Hotel", "City Hotel"]}
                  value={form.hotel}
                  onChange={(v) => set("hotel", v)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Arrival Month</label>
                <select className="form-input" value={form.arrival_date_month} onChange={(e) => set("arrival_date_month", e.target.value)}>
                  {MONTHS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <select className="form-input" value={form.arrival_date_year} onChange={(e) => set("arrival_date_year", +e.target.value)}>
                  {[2024,2025,2026,2027,2028].map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Week Number (1–53)</label>
                <input type="number" className="form-input" min={1} max={53}
                  value={form.arrival_date_week_number}
                  onChange={(e) => set("arrival_date_week_number", +e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Day of Month (1–31)</label>
                <input type="number" className="form-input" min={1} max={31}
                  value={form.arrival_date_day_of_month}
                  onChange={(e) => set("arrival_date_day_of_month", +e.target.value)} />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="step-body">
            <div className="step-title">{STEPS[1].label}</div>
            <div className="step-desc">{STEPS[1].desc}</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Weekend Nights</label>
                <Stepper value={form.stays_in_weekend_nights} onChange={(v) => set("stays_in_weekend_nights", v)} max={7} />
              </div>
              <div className="form-group">
                <label className="form-label">Week Nights</label>
                <Stepper value={form.stays_in_week_nights} onChange={(v) => set("stays_in_week_nights", v)} max={14} />
              </div>
              <div className="form-group span-2">
                <label className="form-label">Lead Time (days before arrival): {form.lead_time}</label>
                <div className="slider-wrap">
                  <div className="slider-row">
                    <input type="range" min={0} max={500} value={form.lead_time}
                      onChange={(e) => set("lead_time", +e.target.value)} />
                    <span className="slider-val">{form.lead_time}d</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-body">
            <div className="step-title">{STEPS[2].label}</div>
            <div className="step-desc">{STEPS[2].desc}</div>
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label className="form-label">Adults</label>
                <Stepper value={form.adults} onChange={(v) => set("adults", v)} min={1} max={10} />
              </div>
              <div className="form-group">
                <label className="form-label">Children</label>
                <Stepper value={form.children} onChange={(v) => set("children", v)} max={5} />
              </div>
              <div className="form-group">
                <label className="form-label">Babies</label>
                <Stepper value={form.babies} onChange={(v) => set("babies", v)} max={5} />
              </div>
            </div>
            <div style={{ marginTop: 20, padding: 16, background: "rgba(59,130,246,0.06)", borderRadius: "var(--radius-md)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <span style={{ fontSize: 13, color: "var(--accent-blue)" }}>
                👥 Total guests: <strong>{form.adults + form.children + form.babies}</strong>
                &nbsp;·&nbsp;{(form.children > 0 || form.babies > 0) ? "Family booking" : "Adult-only booking"}
              </span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-body">
            <div className="step-title">{STEPS[3].label}</div>
            <div className="step-desc">{STEPS[3].desc}</div>
            <div className="form-grid">
              <div className="form-group span-2">
                <label className="form-label">Meal Plan</label>
                <OptionCards options={MEALS} value={form.meal} onChange={(v) => set("meal", v)} />
                <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  BB=Bed &amp; Breakfast · FB=Full Board · HB=Half Board · SC=Self-Catering
                </span>
              </div>
              <div className="form-group">
                <label className="form-label">Reserved Room Type</label>
                <select className="form-input" value={form.reserved_room_type} onChange={(e) => set("reserved_room_type", e.target.value)}>
                  {ROOM_TYPES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Room Type</label>
                <select className="form-input" value={form.assigned_room_type} onChange={(e) => set("assigned_room_type", e.target.value)}>
                  {ROOM_TYPES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-body">
            <div className="step-title">{STEPS[4].label}</div>
            <div className="step-desc">{STEPS[4].desc}</div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Market Segment</label>
                <select className="form-input" value={form.market_segment} onChange={(e) => set("market_segment", e.target.value)}>
                  {SEGMENTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Distribution Channel</label>
                <select className="form-input" value={form.distribution_channel} onChange={(e) => set("distribution_channel", e.target.value)}>
                  {CHANNELS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group span-2">
                <label className="form-label">Deposit Type</label>
                <OptionCards options={DEPOSITS} value={form.deposit_type} onChange={(v) => set("deposit_type", v)} />
              </div>
              <div className="form-group span-2">
                <label className="form-label">Customer Type</label>
                <OptionCards options={CUSTOMERS} value={form.customer_type} onChange={(v) => set("customer_type", v)} />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-body">
            <div className="step-title">{STEPS[5].label}</div>
            <div className="step-desc">{STEPS[5].desc}</div>
            <div className="form-grid">
              <div className="form-group span-2">
                <label className="form-label">Repeated Guest</label>
                <Toggle value={form.is_repeated_guest} onChange={(v) => set("is_repeated_guest", v)} labelOn="Yes – Returning Guest" labelOff="No – New Guest" />
              </div>
              <div className="form-group">
                <label className="form-label">Previous Cancellations</label>
                <Stepper value={form.previous_cancellations} onChange={(v) => set("previous_cancellations", v)} max={26} />
              </div>
              <div className="form-group">
                <label className="form-label">Previous Not Cancelled</label>
                <Stepper value={form.previous_bookings_not_canceled} onChange={(v) => set("previous_bookings_not_canceled", v)} max={72} />
              </div>
              <div className="form-group">
                <label className="form-label">Booking Changes</label>
                <Stepper value={form.booking_changes} onChange={(v) => set("booking_changes", v)} max={20} />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="step-body">
            <div className="step-title">{STEPS[6].label}</div>
            <div className="step-desc">{STEPS[6].desc}</div>
            <div className="form-grid">
              <div className="form-group span-2">
                <label className="form-label">Average Daily Rate (€): {form.adr.toFixed(0)}</label>
                <div className="slider-row">
                  <input type="range" min={0} max={5000} step={5} value={form.adr}
                    onChange={(e) => set("adr", +e.target.value)} />
                  <span className="slider-val">€{form.adr}</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Country (Encoded)</label>
                <input type="number" className="form-input" min={0} max={177}
                  value={form.country_encoded}
                  onChange={(e) => set("country_encoded", +e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Days in Waiting List</label>
                <input type="number" className="form-input" min={0}
                  value={form.days_in_waiting_list}
                  onChange={(e) => set("days_in_waiting_list", +e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Car Parking Spaces</label>
                <Stepper value={form.required_car_parking_spaces} onChange={(v) => set("required_car_parking_spaces", v)} max={8} />
              </div>
              <div className="form-group">
                <label className="form-label">Special Requests</label>
                <Stepper value={form.total_of_special_requests} onChange={(v) => set("total_of_special_requests", v)} max={5} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card" style={{ padding: 32 }}>
      {/* Step Progress */}
      <div className="step-progress">
        {STEPS.map((s, i) => (
          <div key={i} className={`step-item ${i < step ? "done" : i === step ? "active" : ""}`}>
            {i > 0 && <div className={`step-line ${i <= step ? "done" : ""}`} />}
            <div className="step-circle">
              {i < step ? "✓" : i + 1}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div style={{ padding: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--radius-md)", marginBottom: 20 }}>
          {errors.map((e, i) => (
            <p key={i} style={{ fontSize: 13, color: "var(--accent-red)", marginBottom: i < errors.length - 1 ? 4 : 0 }}>⚠ {e}</p>
          ))}
        </div>
      )}

      {/* Step Content */}
      {renderStep()}

      {/* Actions */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          <ChevronLeft size={16} /> Back
        </button>

        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Step {step + 1} of {STEPS.length}
        </span>

        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Predicting…</> : <><Send size={16} /> Predict Now</>}
          </button>
        )}
      </div>
    </div>
  );
}
