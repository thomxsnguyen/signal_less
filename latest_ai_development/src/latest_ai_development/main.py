#!/usr/bin/env python
import sys
import warnings

from pydantic import BaseModel
from datetime import datetime
from crewai.flow import Flow, listen, start

from .crew import ResearchCrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

class ResearchFlowState(BaseModel):
    topic: str = ""
    report: str = ""

class LatestAiFlow(Flow[ResearchFlowState]):
    @start()
    def prepare_topic(self, crewai_trigger_payload: dict | None = None):
        if crewai_trigger_payload:
            self.state.topic = crewai_trigger_payload.get("topic", "AI Agents")
        else:
            self.state.topic = "AI Agents"
        print(f"Topic: {self.state.topic}")
    
    @listen(prepare_topic)
    def run_research(self):
        result = ResearchCrew().crew().kickoff()
        self.state.report = result.raw
        print("Research crew finished.")
    
    @listen(run_research)
    def summarize(self):
        print("Report path: output/report.md")
    
def kickoff():
    LatestAiFlow().kickoff()

def plot():
    LatestAiFlow().plot()

def run():
    kickoff()

if __name__ == '__main__':
    kickoff()
