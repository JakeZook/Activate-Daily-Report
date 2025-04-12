import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
	const [formData, setFormData] = useState({
		morningGen: "",
		morningCustomer: "",
		morningMaint: "",
		morningSO: "",
		midGen: "",
		midCustomer: "",
		midMaint: "",
		midSO: "",
		eveningGen: "",
		eveningCustomer: "",
		eveningMaint: "",
		eveningSO: "",
		notesForOpen: "",
	});
	const [morningPhoto, setMorningPhoto] = useState(null); // For storing uploaded image
	const [midPhoto, setMidPhoto] = useState(null); // For storing uploaded image
	const [eveningPhoto, setEveningPhoto] = useState(null); // For storing uploaded image
	const [loading, setLoading] = useState(false);
	const [responseMsg, setResponseMsg] = useState("");
	const [error, setError] = useState(null); // For storing error messages

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleMorningPhotoChange = (e) => {
		setMorningPhoto(e.target.files[0]);
	};
	const handleMidPhotoChange = (e) => {
		setMidPhoto(e.target.files[0]);
	};
	const handleEveningPhotoChange = (e) => {
		setEveningPhoto(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setResponseMsg("");
		setError(null);

		const formDataToSend = new FormData();
		formDataToSend.append("morningGen", formData.morningGen);
		formDataToSend.append("morningCustomer", formData.morningCustomer);
		formDataToSend.append("morningMaint", formData.morningMaint);
		formDataToSend.append("morningSO", formData.morningSO);
		formDataToSend.append("midGen", formData.midGen);
		formDataToSend.append("midCustomer", formData.midCustomer);
		formDataToSend.append("midMaint", formData.midMaint);
		formDataToSend.append("midSO", formData.midSO);
		formDataToSend.append("eveningGen", formData.eveningGen);
		formDataToSend.append("eveningCustomer", formData.eveningCustomer);
		formDataToSend.append("eveningMaint", formData.eveningMaint);
		formDataToSend.append("eveningSO", formData.eveningSO);
		formDataToSend.append("notesForOpen", formData.notesForOpen);
		formDataToSend.append("morningPhoto", morningPhoto);
		formDataToSend.append("midPhoto", midPhoto);
		formDataToSend.append("eveningPhoto", eveningPhoto);

		try {
			const response = await axios.post(
				"http://localhost:5000/send-email",
				formDataToSend,
				{
					headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
				}
			);
			setResponseMsg(response.data.message);

			if (response.data.success) {
				setError(false);
			} else setError(true);

			setFormData({
				morningGen: "",
				morningCustomer: "",
				morningMaint: "",
				morningSO: "",
				midGen: "",
				midCustomer: "",
				midMaint: "",
				midSO: "",
				eveningGen: "",
				eveningCustomer: "",
				eveningMaint: "",
				eveningSO: "",
				notesForOpen: "",
			});

			setMorningPhoto(null);
			setMidPhoto(null);
			setEveningPhoto(null);
		} catch (error) {
			console.log(error);
			setResponseMsg("Failed to send email. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div>
				<h1 className="text-center text-2xl font-bold my-10 text-cyan-500">
					Daily Shift Report
				</h1>
			</div>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 items-center justify-center"
			>
				<div className="flex flex-col gap-4 my-12">
					<h1 className="text-center text-green-500">Morning</h1>
					<div className="flex flex-col gap-4">
						<input
							type="text"
							name="morningGen"
							placeholder="General"
							value={formData.morningGen}
							onChange={handleChange}
							required
							className="border p-2 rounded"
						/>
						<input
							type="text"
							name="morningCustomer"
							placeholder="Customers"
							value={formData.morningCustomer}
							onChange={handleChange}
							required
							className="border p-2 rounded"
						/>
						<textarea
							name="morningMaint"
							placeholder="Maintenance"
							value={formData.morningMaint}
							onChange={handleChange}
							required
							className="border p-2 rounded h-24"
						></textarea>
						<textarea
							name="morningSO"
							placeholder="Shout Outs"
							value={formData.morningSO}
							onChange={handleChange}
							required
							className="border p-2 rounded h-24"
						></textarea>
						<input
							type="file"
							accept="image/*"
							onChange={handleMorningPhotoChange}
							required
							className="border p-2 rounded"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4 my-12">
					<h1 className="text-center text-yellow-500">Mid</h1>
					<input
						type="text"
						name="midGen"
						placeholder="General"
						value={formData.midGen}
						onChange={handleChange}
						required
						className="border p-2 rounded"
					/>
					<input
						type="text"
						name="midCustomer"
						placeholder="Customers"
						value={formData.midCustomer}
						onChange={handleChange}
						required
						className="border p-2 rounded"
					/>
					<textarea
						name="midMaint"
						placeholder="Maintenance"
						value={formData.midMaint}
						onChange={handleChange}
						required
						className="border p-2 rounded h-24"
					></textarea>
					<textarea
						name="midSO"
						placeholder="Shout Outs"
						value={formData.midSO}
						onChange={handleChange}
						required
						className="border p-2 rounded h-24"
					></textarea>
					<input
						type="file"
						accept="image/*"
						onChange={handleMidPhotoChange}
						required
						className="border p-2 rounded"
					/>
				</div>
				<div className="flex flex-col gap-4 my-12">
					<h1 className="text-center text-purple-500">Evening</h1>
					<input
						type="text"
						name="eveningGen"
						placeholder="General"
						value={formData.eveningGen}
						onChange={handleChange}
						required
						className="border p-2 rounded"
					/>
					<input
						type="text"
						name="eveningCustomer"
						placeholder="Customers"
						value={formData.eveningCustomer}
						onChange={handleChange}
						required
						className="border p-2 rounded"
					/>
					<textarea
						name="eveningMaint"
						placeholder="Maintenance"
						value={formData.eveningMaint}
						onChange={handleChange}
						required
						className="border p-2 rounded h-24"
					></textarea>
					<textarea
						name="eveningSO"
						placeholder="Shout Outs"
						value={formData.eveningSO}
						onChange={handleChange}
						required
						className="border p-2 rounded h-24"
					></textarea>
					<textarea
						name="notesForOpen"
						placeholder="Notes for Open"
						value={formData.notesForOpen}
						onChange={handleChange}
						className="border p-2 rounded h-24"
					></textarea>
					<input
						type="file"
						accept="image/*"
						onChange={handleEveningPhotoChange}
						required
						className="border p-2 rounded"
					/>
				</div>
				{responseMsg && (
					<p
						className={`text-center ${
							error ? "text-green-500" : "text-red-500"
						}`}
					>
						{responseMsg}
					</p>
				)}
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-600 hover:text-blue-500 text-cyan-500 font-bold py-2 px-4 rounded mb-10 width-full text-lg"
				>
					{loading ? "Sending..." : "Send Message"}
				</button>
			</form>
		</>
	);
}

export default App;
