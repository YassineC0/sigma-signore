"use client"

interface ToggleSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <label style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}>{label}</label>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: "56px",
          height: "28px",
          backgroundColor: checked ? "hsl(45 100% 51%)" : "#d1d5db",
          borderRadius: "14px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.3s ease",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          if (checked) {
            e.currentTarget.style.backgroundColor = "hsl(45 100% 45%)"
          } else {
            e.currentTarget.style.backgroundColor = "#9ca3af"
          }
        }}
        onMouseLeave={(e) => {
          if (checked) {
            e.currentTarget.style.backgroundColor = "hsl(45 100% 51%)"
          } else {
            e.currentTarget.style.backgroundColor = "#d1d5db"
          }
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: checked ? "30px" : "2px",
            width: "24px",
            height: "24px",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        />
      </button>
    </div>
  )
}
