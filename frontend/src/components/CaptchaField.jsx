/** Honeypot anti-spam — hidden from users, bots often fill it */
export default function CaptchaField({ value, onChange }) {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label htmlFor="companyWebsite">Company website</label>
      <input
        id="companyWebsite"
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
