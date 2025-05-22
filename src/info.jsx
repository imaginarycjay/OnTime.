import close from './assets/close.svg'

export default function Info({openInfo}) {
  return (
    <div className="info-overlay">
      <div className="info-container">
        <button onClick={openInfo} className="close-info-button"><img className='close-info' src={close} alt="close" /></button>
        <p className="info-title">OnTime: Task Management Pomodoro</p>

        <a href="https://www.facebook.com/imaginarycjay">
          {" "}
          Developed by: <span>Christian Perez</span>
        </a>
        <a href="https://github.com/imaginarycjay/OnTime..git">
          {" "}
          Github Source Code: <span>Click Here!</span>
        </a>
        <br />
        <a href="https://www.facebook.com/Kenthsopogi">
          {" "}
          Figma Design by: <span>Ken Carado</span>
        </a>
        <a href="https://www.facebook.com/angelbhertm">
          {" "}
          Documentations by: <span>Angel Pagal</span>
        </a>

        <p className="copyright">OnTime 2025</p>
      </div>
    </div>
  );
}
