from flask import Flask, request, jsonify
import os
from flask_cors import CORS  # Import the CORS extension


app = Flask(__name__)
CORS(app, resources={r"/audio": {"origins": "http://localhost:3000"}})  # Enable CORS for all routes


@app.route('/')
def hello():
    return 'Hello World!'

@app.route('/audio', methods=['POST'])
def audio():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    # Add your logic to handle the uploaded audio file here
    # You can save it, process it, etc.
    import torch
    from transformers import pipeline


 # Choose a folder where you want to save the uploaded files
    upload_folder = 'audio'
        
        # Create the folder if it doesn't exist
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

        # Save the file to the chosen folder
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    pipe = pipeline(
        "automatic-speech-recognition", model="openai/whisper-base", device=device
    )

    text = pipe(file_path, max_new_tokens=256, return_timestamps=True)

    return text['text'] + os.getcwd()

    

if __name__ == '__main__':
    app.run(debug=True)