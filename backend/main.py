from fastapi import FastAPI, UploadFile, Form, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import json
import sys
import os

# source .venv/bin/activate
# uvicorn main:app --reload

load_dotenv()

sys.path.append(
    os.path.join(
        os.path.dirname(__file__),
        'latest_ai_development',
        'src'
    )
)

from latest_ai_development.crew import PCTroubleshooterCrew

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
    pc_info: UploadFile = File(...),
):
    try:
        pc_info_content = await pc_info.read()
        pc_info_data = json.loads(pc_info_content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file uploaded.")

    try:
        result = PCTroubleshooterCrew().crew().kickoff(
            inputs={
                "user_inputs": user_input,
                "pc_info": json.dumps(pc_info_data),
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnosis failed: {str(e)}")

    return {
        "status": "received",
        "user_input": user_input,
        "result": str(result),
    }


@app.get("/")
def health_check():
    return {"status": "PC Troubleshooter API is running"}