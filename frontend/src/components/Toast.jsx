import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">
        {type === "success" ? (
          <CheckCircle2 size={18} color="var(--accent-emerald)" />
        ) : (
          <XCircle size={18} color="var(--accent-red)" />
        )}
      </span>
      <span>{message}</span>
    </div>
  );
}
