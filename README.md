### This is a simple example of LLM conversation.

The file *"flask_server"* contains the backend code, while the file *"client"* contains the frontend code.

To run backend code, follow the steps below:

`cd flask_server`

`pip install -r requirements.txt`

`python server.py`

To run front end code, follow the steps below:

`cd client`

`npm install`

`npm start`

The frontend code will be running on http://localhost:3000/, while the backend code will be running on http://localhost:5000/.

## Since I used a proxy and Azure for OpenAI API, I recommend commenting out the `init_openai()` function in `server.py` and modifying the relevant code in `send_input_to_llm()` to use the OpenAI API directly.
