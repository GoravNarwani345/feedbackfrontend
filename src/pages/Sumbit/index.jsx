import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

export default function Sumbit() {
	const navigate = useNavigate()

	return (
		<div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-[60vh] flex items-center justify-center">
			<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-white shadow-lg rounded-xl p-8 ring-1 ring-gray-100 text-center">
				<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
					<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
				<p className="text-gray-500 mb-8">Your feedback has been successfully submitted. We appreciate your input!</p>

				<button
					onClick={() => navigate('/')}
					className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
				>
					Submit Another Response
				</button>
			</motion.div>
		</div>
	)
}
