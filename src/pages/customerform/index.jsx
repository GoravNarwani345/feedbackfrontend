import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

export default function CustomerForm() {
	const [form, setForm] = useState({ name: '', email: '', feedback: '' })
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)
	const [errors, setErrors] = useState({})
	const navigate = useNavigate()

	useEffect(() => {
		// validate on form change
		const e = {}
		if (!form.name.trim()) e.name = 'Name is required'
		else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'

		if (!form.email.trim()) e.email = 'Email is required'
		else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'

		if (!form.feedback.trim()) e.feedback = 'Feedback is required'
		else if (form.feedback.trim().length < 10) e.feedback = 'Feedback should be at least 10 characters'

		setErrors(e)
	}, [form])

	function handleChange(e) {
		const { name, value } = e.target
		setForm(prev => ({ ...prev, [name]: value }))
	}

	async function handleSubmit(e) {
		e.preventDefault()
		setMessage(null)

		if (Object.keys(errors).length) {
			setMessage({ type: 'error', text: 'Please fix form errors before submitting.' })
			toast.error('Please fix form errors before submitting.')
			return
		}

		setLoading(true)
		try {
			const base = import.meta.env.VITE_API_BASE || 'https://feedbackbackend-raa7.onrender.com'
			const payload = {
				customerName: form.name,
				Email: form.email,
				feedbackText: form.feedback,
			}

			const res = await fetch(`${base}/api/feedback`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})
			if (!res.ok) {
				const errBody = await res.json().catch(() => null)
				throw new Error(errBody?.message || 'Network response was not ok')
			}

			setMessage({ type: 'success', text: 'Thanks — feedback submitted.' })
			toast.success('Thanks — feedback submitted.')
			setForm({ name: '', email: '', feedback: '' })
			// redirect to submit page
			setTimeout(() => navigate('/submit'), 700)
		} catch (err) {
			console.error(err)
			setMessage({ type: 'error', text: 'Submission failed. Try again.' })
			toast.error('Submission failed. Try again.')
		} finally {
			setLoading(false)
		}
	}

	const container = {
		hidden: { opacity: 0, y: 12 },
		show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
	}

	const item = {
		hidden: { opacity: 0, y: 8 },
		show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } },
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-gray-50">
			<ToastContainer position="top-right" autoClose={3000} />
			<motion.div initial="hidden" animate="show" variants={container} className="bg-white shadow-lg rounded-xl p-6 ring-1 ring-gray-100">
				<div className="flex justify-between items-center mb-1">
					<motion.h2 variants={item} className="text-2xl font-semibold text-gray-900">Customer Feedback</motion.h2>
					<motion.button 
						variants={item}
						onClick={() => navigate('/admin')}
						className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
					>
						Admin Dashboard &rarr;
					</motion.button>
				</div>
				<motion.p variants={item} className="text-sm text-gray-500 mb-4">We appreciate your feedback — it helps us improve.</motion.p>

				{message && (
					<motion.div variants={item} className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`} role="status">
						{message.text}
					</motion.div>
				)}

				<motion.form onSubmit={handleSubmit} variants={container} className="space-y-4">
					<motion.div variants={item}>
						<label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
						<input
							name="name"
							value={form.name}
							onChange={handleChange}
							aria-required="true"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-600 transition"
							placeholder="Your name"
						/>
						{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
					</motion.div>

					<motion.div variants={item}>
						<label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
						<input
							name="email"
							value={form.email}
							onChange={handleChange}
							type="email"
							aria-required="true"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-600 transition"
							placeholder="you@example.com"
						/>
						{errors.email ? (
							<p className="mt-1 text-xs text-red-600">{errors.email}</p>
						) : (
							<p className="mt-1 text-xs text-gray-400">We only use this to reply — never shared.</p>
						)}
					</motion.div>

					<motion.div variants={item}>
						<label className="block text-sm font-medium text-gray-700">Feedback <span className="text-red-500">*</span></label>
						<textarea
							name="feedback"
							value={form.feedback}
							onChange={handleChange}
							rows={6}
							maxLength={1000}
							aria-required="true"
							className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-600 transition"
							placeholder="Share your thoughts..."
						/>
						{errors.feedback && <p className="mt-1 text-xs text-red-600">{errors.feedback}</p>}
						<div className="mt-1 flex items-center justify-between text-xs text-gray-400">
							<span>Helpful details make our response faster.</span>
							<span>{form.feedback.length}/1000</span>
						</div>
					</motion.div>

					<motion.div variants={item} className="flex items-center justify-between">
						<button
							type="submit"
							disabled={loading || Object.keys(errors).length > 0}
							className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
							aria-disabled={loading || Object.keys(errors).length > 0}
						>
							{loading ? (
								<svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
								</svg>
							) : null}
							{loading ? 'Sending...' : 'Send Feedback'}
						</button>
						<motion.span whileHover={{ scale: 1.03 }} className="text-sm text-gray-500">We reply within 48 hours</motion.span>
					</motion.div>
				</motion.form>
			</motion.div>
		</div>
	)
}

