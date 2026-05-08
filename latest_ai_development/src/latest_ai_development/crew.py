from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import SerperDevTool
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class PCTroubleshooterCrew():
    '''PC Troubleshoot Crew'''

    agents: list[BaseAgent]
    tasks: list[Task]

    agents_config = "config/agents.yaml"
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
            config=self.agents_config['diagnostic_agent'],
            verbose=True
        )

    @agent
    def solution_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['solution_agent'],
            verbose=True
        )

    # Tasks
    @task
    def intake_task(self) -> Task:
        return Task(config=self.tasks_config['intake_task'])

    @task
    def classifier_task(self) -> Task:
        return Task(config=self.tasks_config['classifier_task'])
    
    @task
    def diagnostic_task(self) -> Task:
        return Task(config=self.tasks_config['diagnostic_task'])

    @task
    def solution_task(self) -> Task:
        return Task(config=self.tasks_config['solution_task'])

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )