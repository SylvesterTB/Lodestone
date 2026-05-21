import LogoMark from "./LogoMark";

/**
 * @param {object}      props
 * @param {string|null} props.filename     - loaded file name, null if no data
 * @param {function}    props.onUploadClick
 */
export default function Header({ filename, onUploadClick }) {
  return (
    <header className="lds-header">
      <LogoMark size={24} />
      <span className="lds-logo">Lodestone</span>
      <div className="lds-divider" />
      <span className="lds-tagline">Supply Chain Network Analysis</span>

      <div className="lds-hdr-right">
        <div className="lds-badge">
          <div className={`lds-dot ${filename ? "" : "off"}`} />
          {filename ?? "No data loaded"}
        </div>
        <button className="lds-btn-upload" onClick={onUploadClick}>
          Upload CSV
        </button>
      </div>
    </header>
  );
}