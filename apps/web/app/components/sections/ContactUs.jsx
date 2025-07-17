'use client';

import { useForm } from '@formspree/react';
import { motion } from 'framer-motion';
import { Inter_Tight } from 'next/font/google';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const interTight = Inter_Tight({
	subsets: ['latin'],
});

export default function ContactUs() {
	const [state, handleSubmit] = useForm('xldjwzjb'); // Replace with your Formspree form ID
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});

	useEffect(() => {
		if (state.succeeded) {
			toast.success('Your message has been sent successfully!');
			setFormData({ name: '', email: '', message: '' }); // Reset form
		}
	}, [state.succeeded]);

	useEffect(() => {
		if (state.errors?.length) {
			toast.error('Error sending message. Please try again later.');
		}
	}, [state.errors]);

	// Validate form fields
	const validateForm = () => {
		if (!formData.name.trim()) {
			toast.error('Name is required!');
			return false;
		}
		if (!formData.email.trim()) {
			toast.error('Email is required!');
			return false;
		}
		if (!/\S+@\S+\.\S+/.test(formData.email)) {
			toast.error('Enter a valid email address!');
			return false;
		}
		if (!formData.message.trim()) {
			toast.error('Message is required!');
			return false;
		}
		return true;
	};

	// Handle form field changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Custom form submission handler with validation and toast
	const handleCustomSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		// Call Formspree's handleSubmit
		handleSubmit(e);
	};

	return (
		<section className="relative w-full py-20 px-8 sm:px-16 lg:px-24">
			<div className="max-w-[1700px] mx-auto px-8 sm:px-16">
				{/* Title & Subtitle */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: 'easeOut' }}
					viewport={{ once: true }}
					className="mb-10 w-full"
				>
					<h2
						className={`text-[44px] font-extrabold mb-4 text-white leading-tight ${interTight.className}`}
					>
						Let’s Build Something Incredible Together.
					</h2>
					<motion.p
						className="text-[#FFFFFF]/65 text-lg leading-relaxed lg:w-[50%] font-medium"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						Have a question, an idea, or just want to say hello?
						We’re here to listen. Tell us how we can help, and we’ll
						get back to you.
					</motion.p>
				</motion.div>

				{/* Form & Image Section */}
				<div className="relative grid grid-cols-1 lg:grid-cols-[0.9fr_1fr] gap-29">
					{/* Left Section: Form */}
					<div className="text-white relative z-10 -mt-1">
						<motion.form
							onSubmit={handleCustomSubmit}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={{
								visible: {
									opacity: 1,
									transition: {
										staggerChildren: 0.15,
										ease: 'easeOut',
									},
								},
								hidden: { opacity: 0 },
							}}
							className="space-y-6"
						>
							{/* Name Input */}
							<motion.div
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0 },
								}}
							>
								<label
									htmlFor="name"
									className="block text-[17px] mb-2 text-[#FFFFFF]/65"
								>
									What should we call you?
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="John Doe"
									className="w-full bg-[#1C1C20] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27BBFF] transition duration-200 ring-[#2E2E30] ring-1"
								/>
							</motion.div>

							{/* Email Input */}
							<motion.div
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0 },
								}}
							>
								<label
									htmlFor="email"
									className="block text-[17px] mb-2 text-[#FFFFFF]/65"
								>
									Where can we reach you?
								</label>
								<input
									type="text"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="you@example.com"
									className="w-full bg-[#1C1C20] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27BBFF] transition duration-200 ring-[#2E2E30] ring-1"
								/>
							</motion.div>

							{/* Message Input */}
							<motion.div
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0 },
								}}
							>
								<label
									htmlFor="message"
									className="block text-[17px] mb-2 text-[#FFFFFF]/65"
								>
									Share your thoughts, questions, or ideas...
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									rows="5"
									placeholder="Let us know how we can help!"
									className="w-full bg-[#1C1C20] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27BBFF] transition duration-200 ring-[#2E2E30] ring-1 resize-none"
								/>
							</motion.div>

							{/* Submit Button with Animation */}
							<motion.div
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0 },
								}}
							>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									type="submit"
									className={`bg-[#27BBFF] text-[#101014] px-5 py-3 rounded-md font-medium cursor-pointer ${
										state.submitting
											? 'opacity-70 cursor-not-allowed'
											: ''
									}`}
									disabled={state.submitting}
								>
									{state.submitting ? (
										<div className="flex items-center space-x-2">
											<span>Sending...</span>
											<div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full"></div>
										</div>
									) : (
										'Send Your Message'
									)}
								</motion.button>
							</motion.div>
						</motion.form>
					</div>

					{/* Right Section: Image with Blurred Background */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						viewport={{ once: true }}
						className="relative w-full h-full hidden lg:block"
					>
						{/* Background Blur Effect Behind the Image */}
						<div className="absolute inset-0 w-full h-full overflow-hidden rounded-lg blur-[100px] opacity-50 scale-105 z-0">
							<Image
								src="/assets/lightbulb.jpeg" // Replace with your image path
								alt="Idea Lightbulb Background"
								width={600}
								height={400}
								className="object-cover w-full h-full"
							/>
						</div>

						{/* Main Foreground Image */}
						<div className="relative w-full h-9/10 z-10">
							<Image
								src="/assets/lightbulb.jpeg" // Replace with your image path
								alt="Idea Lightbulb"
								width={600}
								height={400}
								className="rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] object-cover w-full h-full"
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
