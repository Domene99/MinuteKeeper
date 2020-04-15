import React, { Component } from "react";
import "../../Home.css";
import Button from "@material-ui/core/Button";
import MicRecorder from "mic-recorder-to-mp3";
import AWS from "aws-sdk";
// import { PythonShell } from "python-shell";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const transcribeAudio = async () => {
	var transcribeservice = new AWS.TranscribeService();
	transcribeservice.startTranscriptionJob(
		{
			LanguageCode: "es-ES",
			Media: this.state.blobURL,
			TranscriptionJobName: "helloTranscription",
			mediaFormat: "mp3",
		},
		(err, data) => {
			if (err) console.log(err, err.stack);
			// an error occurred
			else console.log(data); // successful response
		}
	);
};

class Orders extends Component {
	constructor() {
		super();
		this.state = {
			data: [],
			isRecording: false,
			blobURL: "",
			isBlocked: false,
		};
	}

	componentDidMount() {
		navigator.getUserMedia(
			{ audio: true },
			() => {
				console.log("Permission Granted");
				this.setState({ isBlocked: false });
			},
			() => {
				console.log("Permission Denied");
				this.setState({ isBlocked: true });
			}
		);
	}

	start = () => {
		if (this.state.isBlocked) {
			console.log("Permission Denied");
		} else {
			Mp3Recorder.start()
				.then(() => {
					this.setState({ isRecording: true });
				})
				.catch((e) => console.error(e));
		}
	};
	//   python = (blob) => {
	//     PythonShell.run("Python.py", null, function (err) {
	//       if (err) throw err;
	//       console.log("finished");
	//     });
	//   };

	stop = () => {
		Mp3Recorder.stop()
			.getMp3()
			.then(([buffer, blob]) => {
				const blobURL = URL.createObjectURL(blob);
				this.setState({ blobURL, isRecording: false });
				window.open(this.state.blobURL, "_blank");
				transcribeAudio();
			})
			.catch((e) => console.log(e));
	};

	render() {
		return (
			<div className="Dashboard">
				<div className="Container">
					<div>
						<Button onClick={this.start} disabled={this.state.isRecording}>
							Record
						</Button>
						<Button onClick={this.stop} disabled={!this.state.isRecording}>
							Stop
						</Button>
					</div>
				</div>
			</div>
		);
	}
}
export default Orders;
