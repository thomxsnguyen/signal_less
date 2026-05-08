from fastapi import FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.post("/diagnose")
async def diagnose(
  user_input: str = Form(...),
  pc_info: UploadFile = File(...)
):
  pc_info_content = await pc_info.read()
  pc_info_data = json.loads(pc_info_content)

  return {"status": "received", "user_input": user_input}

  

@app.get("/")
def health_check():
  return {"status": "PC Troubleshooter API is running"}