import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function Info({ openInfo }) {
  return (
    <div className="info-overlay">
      <div className="info-container">
        <button onClick={openInfo} className="close-info-button">
          <CloseRoundedIcon sx={{ color: "white", fontSize: 35 }} />
        </button>
        <p className="info-title">OnTime: Task Management Pomodoro</p>

        <a style={{ fontWeight: "bold", fontSize: "1.3rem" }}>Contributors: </a>

        <a href="https://web.facebook.com/mar.yel.563552" target="_blank">
          {" "}
          <span>Mariel R. Alagano</span>
        </a>
        <a href="https://web.facebook.com/cmlc.corpuz.75" target="_blank">
          {" "}
          <span>Cesar Mark L. Corpuz</span>
        </a>
        <a href="https://web.facebook.com/rie.cahh" target="_blank">
          {" "}
          <span>Erica B. Pajete</span>
        </a>
        <a href="https://web.facebook.com/jane.atejada.14" target="_blank">
          {" "}
          <span>Jane A. Tejada</span>
        </a>
        <p style={{ fontSize: "8" }} className="copyright">
          OnTime 2025 (Under Development)
        </p>
      </div>
    </div>
  );
}
