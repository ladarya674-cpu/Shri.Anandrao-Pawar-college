import { useState } from "react"

const SUBJECTS = [
  "Junior / Senior College Admission Enquiry",

  "Examinations & Marksheet Verification",

  "Scholarships & Fee Concessions",

  "Library & Facilities",

  "General Institutional Enquiry",
]

function isGmail(email: string) {
  return /^[a-zA-Z0-9._%+\-]+@gmail\.com$/i.test(email.trim())
}

function isValidPhone(phone: string) {
  return !phone || /^\d{10}$/.test(phone)
}

function isValidName(name: string) {
  return /^[A-Za-z ]+$/.test(name.trim())
}

export default function Contact() {
  const [formSent, setFormSent] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const [apiError, setApiError] = useState("")

  const [emailError, setEmailError] = useState("")

  const [phoneError, setPhoneError] = useState("")

  const [nameError, setNameError] = useState("")

  const [formData, setFormData] = useState({
    name: "",

    email: "",

    phone: "",

    subject: SUBJECTS[0],

    message: "",
  })

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    setFormData({ ...formData, email: val })

    if (val && !isGmail(val)) {
      setEmailError(
        "Only Gmail addresses are accepted (e.g. yourname@gmail.com)",
      )
    } else {
      setEmailError("")
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^A-Za-z ]/g, "")

    setFormData({ ...formData, name: val })

    setNameError(
      val && !isValidName(val) ? "Enter letters and spaces only." : "",
    )
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10)

    setFormData({ ...formData, phone: val })

    setPhoneError(
      val && !isValidPhone(val) ? "Enter exactly 10 digits only." : "",
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !isValidName(formData.name)) {
      setNameError("Enter letters and spaces only.")

      return
    }

    if (!isGmail(formData.email)) {
      setEmailError(
        "Only Gmail addresses are accepted (e.g. yourname@gmail.com)",
      )

      return
    }

    if (!isValidPhone(formData.phone)) {
      setPhoneError("Enter exactly 10 digits only.")

      return
    }

    setSubmitting(true)

    setApiError("")

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Submission failed.")

      setFormSent(true)

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: SUBJECTS[0],
        message: "",
      })
    } catch (err: unknown) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div
        className="py-8 sm:py-10 px-4 text-white border-b-4 border-amber-500"
        style={{ backgroundColor: "#1e3764" }}
      >
        <div className="max-w-7xl mx-auto">
          <div>
            <p className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
              Connect With Us
            </p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              Contact &amp; Location
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Reach out to our admissions cell, principal&apos;s office, or
              visit our campus in Chiplun.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-7 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3"
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  color: "#1e3764",
                }}
              >
                College Office &amp; Enquiries
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                Our administrative staff and admission coordinators are
                available during college working hours to assist students,
                parents, and alumni.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="mailto:shriram.society@rediffmail.com"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1e3764] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0d2444] transition-colors"
                >
                  <span aria-hidden="true">✉</span> Email the office
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Kanganewadi%20Khend%20Chiplun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#e07b00] hover:text-[#c06800] transition-colors"
                >
                  <span aria-hidden="true">↗</span> Open directions
                </a>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
              <h3
                className="text-sm font-bold text-[#1e3764] mb-4"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                Visit or write to us
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-slate-600">
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] text-[#e07b00] mb-1.5">
                    Campus address
                  </p>
                  <p>Shriram Education Society&apos;s</p>
                  <p>Shri. Anandrao Pawar Mahavidyalaya</p>
                  <p>Kanganewadi, Khend, Chiplun</p>
                  <p>Dist. Ratnagiri, Maharashtra — 415 605</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[10px] text-[#e07b00] mb-1.5">
                      Office hours
                    </p>
                    <p>Monday – Saturday, 9:00 AM – 5:00 PM</p>
                    <p>Sunday &amp; state holidays: Closed</p>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[10px] text-[#e07b00] mb-1.5">
                      Email
                    </p>
                    <a
                      href="mailto:shriram.society@rediffmail.com"
                      className="font-semibold text-[#1e3764] break-words hover:text-[#e07b00]"
                    >
                      shriram.society@rediffmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Directions */}
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3
                className="text-xl sm:text-2xl font-bold mb-2 text-[#1e3764]"
                style={{ fontFamily: "Fraunces, Georgia, serif" }}
              >
                Send an Online Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-1">
                Have questions regarding course admissions, fee structures, or
                document verification? Submit your details below.
              </p>
              {/* Gmail notice */}
              <div className="flex items-center gap-2 mb-5 mt-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 font-medium">
                <span>📧</span>
                Only <strong className="mx-1">Gmail addresses</strong>{" "}
                (@gmail.com) are accepted for enquiries.
              </div>

              {formSent ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center text-emerald-800 space-y-2 animate-fade-in">
                  <span className="text-4xl block mb-2">✅</span>
                  <h4 className="font-bold text-base">
                    Inquiry Submitted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Thank you for reaching out. Your enquiry has been recorded
                    and the college administrative desk will respond to your
                    Gmail shortly.
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* API Error */}
                  {apiError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-xs font-medium">
                      ⚠️ {apiError}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder="e.g. Rahul Sharma"
                      pattern="[A-Za-z ]+"
                      maxLength={80}
                      aria-invalid={!!nameError}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                        nameError
                          ? "border-red-400 focus:ring-red-400 bg-red-50"
                          : "border-slate-300 focus:ring-[#e07b00]"
                      }`}
                    />
                    {nameError && (
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        {nameError}
                      </p>
                    )}
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Gmail Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleEmailChange}
                        placeholder="yourname@gmail.com"
                        maxLength={120}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                          emailError
                            ? "border-red-400 focus:ring-red-400 bg-red-50"
                            : "border-slate-300 focus:ring-[#e07b00]"
                        }`}
                      />
                      {emailError && (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Contact Mobile No.
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="Enter 10-digit mobile number"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        minLength={10}
                        maxLength={10}
                        aria-invalid={!!phoneError}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                          phoneError
                            ? "border-red-400 focus:ring-red-400 bg-red-50"
                            : "border-slate-300 focus:ring-[#e07b00]"
                        }`}
                      />
                      {phoneError && (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          {phoneError}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Subject / Purpose
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e07b00]"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Message / Inquiry Details{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      maxLength={2000}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Write your questions or details here..."
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e07b00] focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !!emailError}
                    className="w-full py-3 text-white font-semibold rounded-xl text-sm transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#e07b00" }}
                    onMouseEnter={(e) => {
                      if (!submitting)
                        e.currentTarget.style.backgroundColor = "#c06800"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#e07b00"
                    }}
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      "Submit College Inquiry →"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
