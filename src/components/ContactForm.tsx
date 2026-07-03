"use client";

export default function ContactForm() {
  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => e.preventDefault()}
    >
      {[
        { label: "Name", type: "text", name: "name" },
        { label: "Email", type: "email", name: "email" },
        { label: "Subject", type: "text", name: "subject" },
      ].map(({ label, type, name }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="label text-gray">{label}</label>
          <input
            type={type}
            name={name}
            className="regular bg-transparent border-b border-dotted border-gray text-black pb-2 focus:outline-none focus:border-black transition-colors"
          />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label className="label text-gray">Message</label>
        <textarea
          name="message"
          rows={4}
          className="regular bg-transparent border-b border-dotted border-gray text-black pb-2 focus:outline-none focus:border-black transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="self-start label text-black border border-dotted border-black px-6 py-3 hover:bg-black hover:text-off-white transition-colors duration-300 cursor-pointer"
      >
        Send Message
      </button>
    </form>
  );
}
