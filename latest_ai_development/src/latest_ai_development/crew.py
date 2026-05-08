from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import SerperDevTool
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class PCTroubleshooter():
    '''PC Troubleshoote Crew'''

    agents: list[BaseAgent]
    tasks: list[Task]

    agent_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def intake_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['intake_agent'],
            verbose=True
        )

    @agent
    def classifier_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['classifier_agent'],
            verbose=True
        )

    @agent
    def diagnostic_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['diagnostic_agent']
        )

    @agent
    def solution_agent(self) -> Agent:
        pass

    # Tasks
    @task
    def intake_task(self) -> Task:
        pass

    @task
    def classifier_agent(self) -> Task:
        pass
    
    @task
    def diagnostic_agent(self) -> Task:
        pass

    @task
    def diagnostic_agent(self) -> Task:
        pass

    @crew
    def crew(self) -> Crew:
        pass
