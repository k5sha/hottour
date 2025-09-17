export default function Input({ error, label, ...props }) {
    return <>
        <label>{label}</label>
        <input {...props} />
        {error && <span className="error-message">{error}</span>}
    </>
}