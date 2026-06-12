import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Sumbit() {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [done, setDone] = useState(false)

	function handleConfirm() {
		setOpen(false)
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
			setDone(true)
		}, 900)
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-[60vh] flex items-start">
			<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white shadow-lg rounded-xl p-6 ring-1 ring-gray-100">
				<h2 className="text-2xl font-semibold text-gray-900">Submit</h2>
				<p className="mt-2 text-sm text-gray-500">Please confirm you want to submit. This action can be confirmed or cancelled.</p>

				<div className="mt-6 grid grid-cols-1 gap-4">
					<div className="rounded-md border border-gray-100 p-4 bg-gray-50">
						<p className="text-sm text-gray-700">Summary</p>
						<p className="mt-2 text-sm text-gray-500">Use this page to confirm your submission. Nothing will be sent until you confirm.</p>
					</div>

					<div className="flex items-center gap-3">
						<button
							className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
							onClick={() => setOpen(true)}
							disabled={loading}
						>
							Confirm Submit
						</button>

						<button className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700" onClick={() => setDone(false)}>
							Reset
						</button>
					</div>

					{done && (
						<div className="mt-4 p-4 rounded-md bg-green-50 text-green-800 border border-green-100">
							<strong>Submitted —</strong> Thank you, your submission completed successfully.
						</div>
					)}
				</div>

				{/* Confirmation modal */}
				{open && (
					<div className="fixed inset-0 z-40 flex items-center justify-center">
						<div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
						<motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-50">
							<h3 className="text-lg font-medium text-gray-900">Confirm Submission</h3>
							<p className="mt-2 text-sm text-gray-500">Are you sure you want to submit? This action cannot be undone.</p>

							<div className="mt-6 flex justify-end gap-3">
								<button className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700" onClick={() => setOpen(false)} disabled={loading}>
									Cancel
								</button>
								<button
									className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
									onClick={handleConfirm}
									disabled={loading}
								>
									{loading ? (
										<svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
										</svg>
									) : null}
									Confirm
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</motion.div>
		</div>
	)
}
