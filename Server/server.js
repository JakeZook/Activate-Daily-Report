require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allows cross-origin requests
// Set up multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// Serve static files from React
app.use(express.static(path.join(__dirname, "../client/dist"))); // if using Vite
// app.use(express.static(path.join(__dirname, "../client/build"))); // if using CRA

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/dist/index.html")); // for Vite
});

const upload = multer({ storage: storage });

// Create an upload route to handle form submission
app.post(
	"/send-email",
	upload.fields([
		{ name: "morningPhoto", maxCount: 1 },
		{ name: "midPhoto", maxCount: 1 },
		{ name: "eveningPhoto", maxCount: 1 },
	]),
	async (req, res) => {
		// Now you can handle form fields and file uploads
		const {
			morningGen,
			morningCustomer,
			morningMaint,
			morningSO,
			midGen,
			midCustomer,
			midMaint,
			midSO,
			eveningGen,
			eveningCustomer,
			eveningMaint,
			eveningSO,
			notesForOpen,
		} = req.body;

		const { morningPhoto, midPhoto, eveningPhoto } = req.files;

		let date = new Date();
		let currentHour = new Date().getHours();
		if (currentHour >= 12 && currentHour < 2) {
			date.setDate(date.getDate() - 1);
		}
		date = date.toLocaleDateString();

		try {
			let transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});

			let mailOptions = {
				from: "jake.zook@playactivate.com",
				to: "jake.zook@playactivate.com",
				cc: "westminster@playactivate.com",
				subject: `Westminster Daily Report ${date}`,
				html: `
				<h2 style="color: blue; text: 4rem;">Daily Report - ${date}</h2>

				<h3 style="color: gold; text: 3rem;">Notes for Open:</h3>
				<p>${notesForOpen}</p>

				<h3 style="color: green;">Morning</h3>
				<ul style="list-style-type: none; margin-bottom: 20px;">
					<li><strong>General:</strong> ${morningGen}</li>
					<li><strong>Customer:</strong> ${morningCustomer}</li>
					<li><strong>Maintenance:</strong> ${morningMaint}</li>
					<li><strong>Shout Outs:</strong> ${morningSO}</li>
				</ul>
				<h3 style="color: yellow; margin-bottom: 20px;">Midday</h3>
				<ul style="list-style-type: none;">
					<li><strong>General:</strong> ${midGen}</li>
					<li><strong>Customer:</strong> ${midCustomer}</li>
					<li><strong>Maintenance:</strong> ${midMaint}</li>
					<li><strong>SO:</strong> ${midSO}</li>
				</ul>
				<h3 style="color: red; margin-bottom: 20px;">Evening</h3>
				<ul style="list-style-type: none;">
					<li><strong>General:</strong> ${eveningGen}</li>
					<li><strong>Customer:</strong> ${eveningCustomer}</li>
					<li><strong>Maintenance:</strong> ${eveningMaint}</li>
					<li><strong>SO:</strong> ${eveningSO}</li>
				</ul>
			`,
				attachments: [
					{
						filename: morningPhoto[0].originalname,
						path: morningPhoto[0].path,
					},
					{ filename: midPhoto[0].originalname, path: midPhoto[0].path },
					{
						filename: eveningPhoto[0].originalname,
						path: eveningPhoto[0].path,
					},
				],
			};

			let info = await transporter.sendMail(mailOptions);
			res.json({ success: true, message: "Email sent!", info });
		} catch (error) {
			console.log(error);
			res
				.status(500)
				.json({ success: false, message: "Email failed to send", error });
		}
	}
);
