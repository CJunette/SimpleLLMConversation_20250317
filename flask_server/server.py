import json

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, send

import os
from openai import AzureOpenAI
import openai

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)


client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-10-21",
    azure_endpoint = os.getenv("AZURE_ENDPOINT"),
)

def init_openai():
    openai.proxy = 'http://127.0.0.1:10809'
    openai.api_type = "openai"


@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(data):
    print(f"Received message: {data}")
    if data == "reset":
        send("reset")
        return

    response = send_input_to_llm(data)
    data.append({"llmResponse": response})
    content = json.dumps(data)
    send(content)

@app.route('/')
def hello_world():
    return 'Hello, World!'


def send_input_to_llm(input):
    deployment_name = "gpt-35-turbo"  # 在 Azure OpenAI Studio 里创建的模型名称
    response = client.chat.completions.create(
        model=deployment_name,
        messages=[
            {"role": "system", "content": "You are a helpful assistant. I will send you a list of conversation history, please continue the conversation."},
            {"role": "user", "content": f"{input}"},
        ],
        max_tokens=1000
    )

    response = response.choices[0].message.content
    print(response)
    return response


if __name__ == '__main__':
    # app.run(debug=True, port=5000)

    init_openai()
    socketio.run(app, port=5001, debug=True)



