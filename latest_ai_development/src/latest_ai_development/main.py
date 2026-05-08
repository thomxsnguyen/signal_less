#!/usr/bin/env python
import sys
import warnings
import json

from pydantic import BaseModel
from datetime import datetime
from crewai.flow import Flow, listen, start

from .crew import ResearchCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

class PCTroubleShooterState(BaseModel):
    user_input: str = ""
    pc_info: str = ""
    report: str = ":"

class PCTroubleShooterFlow(Flow[PCTroubleShooterState]):
    @start()
    def load_pc_info(self):
        self.state.user_input = "my PC is running really slowly"

        try:
            with open("pc_info.json", "r") as f:
                pc_data = json.load(f)
                self.state.pc_info = json.dumps(pc_data)
        except:
            self.state.pc_info = {}
            print("pc_info.json not found - run script.py first")
        
        print(f"User problem: {self.state.user_input}")

    @listen(load_pc_info)
    def run_crew(self):
        result = PCTroubleShooterFlow().crew().kickoff(
            inputs={
                "user_input": self.state.user_inputs, 
                "pc_info": self.state.pc_info
            }
        )
        self.state.result = result.raw  
        print("Crew finished!")

    @listen(run_crew)
    def result(self):
        print("\n RESULT")
        print(self.state.result )
        # Run your 4 agents
        #Pass state.user_input


    
def kickoff():
    PCTroubleShooterFlow().kickoff()

def plot():
    PCTroubleShooterFlow().plot()

def run():
    kickoff()

if __name__ == '__main__':
    kickoff()
