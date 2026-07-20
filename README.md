# WorkflowAutomationPlatform

#  🧩 Workflow Automation platform:
A platform developed for contracting and construction companies to automate some workflows some employees put the time 
to manually do. The platform uses the AI agent: Hermes, to easily, effectively, and quickly automate workflows.  

## ✨ Features: 
- Visully appealing interface. 
- Direct access to Projects' database. 
- Ability to create and delete projects. 
- Viewing all details relating to one projects. 
- Generating a summary of active/on hold projects. 
- Detecting projects' risks by reading emails. 
- Providing a project intelligence analysis on a project. 
- Generating a weekly summary of weekly meetings. 
- Storing all relevant information on the system memory layer for future improvements. 

## AI Usage: 
-  🤖 Hermes:  
Hermes agent was used to automate workflows, view project details, read emails, and generate corresponding reports. 
- 💻 Code Generation:  
Copilot chatbot was used in many instances to generate code, and debugging errors. 
Google AI studio was uesd to generate the frontend layer of the system.  

## Workflow 
```text 
Project creation/deletion
↓
Projects' details and emails as input to Hermes
↓
Structured Output.
↓
Results appear on the interface. 
```

## 📁 Project Structure: 
```text
/backend
	/alembic
		/versions
			initial_tables.py
		env.py
		README.md
		script_py_mako.txt
	/app
		/agents
			/hermes
				/providers
					ollama_custom.py
				/tools
					db.py
					projects_tools.py
				/workflows
					chat.py
					material_price_intelligence.py
					project_intelligence.py
					risk_detection.py
					summarize_active_projects.py
					weekly_meetings_summary.py
				client.py
		/api
			/v1
				ai_copilot.py
				chat.py
				material_intelligence.py
				meetings.py
				memory.py
				project_memory.py
				projects_risks.py
				projects.py	
				risk_detection.py
		/database
			base.py
			session.py
		/models
			__init__.py
			generated_documents.py
			material_prices.py
			meetings.py
			memory.py
			price_change_alerts.py
			project_budgets.py
			project_decisions.py
			project_issues.py
			project_milestones.py
			project_phases.py
			project_risks.py
			projects.py
		/schemas
			meetings.py
			memory.py
			project_budgets.py
			project_decisions.py
			project_issues.py
			project_milestones.py
			project_phases.py
			project_risks.py
			projects.py
		/services
			budgets_service.py
			decisions_service.py
			issues_service.py
			material_price_service.py
			meetings_service.py
			memory_service.py
			milestones_service.py
			phases_service.py
			projects_service.py
			risk_detection_service.py
		main.py
	alembic.ini
	Dockerfile
	requirements.txt
/frontend
	/src
		/api
			ai.ts
			budgets.ts
			config.ts
			decisions.ts
			issues.ts
			meetings.ts
			memory.ts
			milestones.ts
			phases.ts
			projectIntelligence.ts
			projects.ts
			risks.ts
		/components
			AIIntelligenceCenter.tsx
			ApiSourceSwitcher.tsx
			BudgetForm.tsx 
			DecisionForm.tsx
			MilestoneForm.tsx
			ProjectDetails.tsx
			ProjectForm.tsx
			ProjectIntelligence.tsx
			ProjectMemory.tsx
			ProjectTable.tsx
			RiskDetection.tsx
			RiskForm.tsx
			WeeklyMeetingSummary.tsx
			WeeklySummary.tsx
		/pages
			CreateProject.tsx
			ProjectsDashboard.tsx
			ProjectView.tsx
		App.tsx
		index.css
		main.tsx
		types.ts
	.env.example
	.gitignore
	index.html
	metadata.json
	package-lock.json
	package.json
	README.md
	tsconfig.json
	vite.config.ts
docker-compose.yml
package-lock.json
README.md
			
```

## ⚙️ How it works: 

1- Projects' database: 
Connect to a database (Built and configured in PostgreSQL server). Using Alembic migrations, view, creatw, and delete
through the interface. 
2- Analyze database: 
Read and analyze projects' details, meetings information, and emails. Then prompt Hermes to understand them and generate
summaries and reports when requested by the user. 

Prompt example: 
```text
prompt = f"""
    Analyze the following construction project email and extract any risks mentioned.

    For each risk, return lines in this exact format:
    Risk Type: <one of Delay, Safety, Procurement, NCR, Approval, Coordination>
    Severity: <Low, Medium, High>
    Description: <1–2 sentences>

    If no risks are found, return:
    Risk Type: None
    Severity: None
    Description: No risks found.

    Email:
    {email_body}
    """
``` 

## 🚀 Running the application: 
This project includes a FastAPI backend, a local vision‑language model (LLaVA‑Phi3), and a browser‑based frontend. Follow the steps below to run everything smoothly.
1. Install Requirements
You need:
Python 3.10+
PostgreSQL
Redis (optional)
Ollama (optional, for local AI nodes)

Install backend dependencies:
```text
pip install -r backend/requirements.txt
``` 
2. Apply Database Migrations
```text
alembic upgrade head
```
3. Start the Backend
In the backend directory, run: 
```text
uvicorn app.main:app --reload --port 8000
```
4. Open the Frontend
In 'frontend' directory, run: 
```text 
npm install
npm run dev
```
Visit:
```text
http://localhost:3000
```
5. Run Workflows
Explore the system, and run AI generated workflows. 

## ⭐ Additional Details: 
#### There is room for great improvements: 
This projects has a big room for improvements, which will be added with time. 