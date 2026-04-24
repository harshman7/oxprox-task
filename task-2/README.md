Data Pipeline Design: OxProx Quarterly Voting Records
By Harshmanpreet Singh

When designing this pipeline, I heavily drew upon my recent work building DocSage, an end-to-end Intelligent Document Processing (IDP) platform. Building DocSage taught me how to handle messy, unpredictable document structures and build robust data extraction pipelines. 

However, my approach to the OxProx pipeline prioritizes pragmatism. While DocSage utilizes LLMs and heavy machine learning to extract unstructured data from messy invoices, applying that same architecture to standardized tabular voting records would be over-engineering. Instead, I propose a lightweight, highly deterministic serverless architecture.

### 1. Architecture & Flow
The pipeline operates on AWS (designed as a managed-cloud mirror of the local architecture I built for DocSage) and follows a standard Extract, Load, Transform (ELT) pattern:
* Trigger: AWS EventBridge fires a quarterly cron job.
* Execution: AWS Lambda spins up a Python container to execute extraction scripts.
* Storage: Raw and standardized data are loaded into an Amazon RDS PostgreSQL database.

### 2. Pragmatic Extraction (The 3 Sources)
Each source requires a bespoke extraction method, unified downstream into a standard pandas DataFrame:
* Australian HTML: Use Python’s requests and BeautifulSoup to traverse the DOM and extract the inline records directly from the HTML elements.
* US CSV (Dynamic URL): A two-step script. BeautifulSoup parses the host page to locate the dynamic href containing the latest .csv extension, followed by pandas.read_csv() to ingest the file.
* UK PDF: To avoid the cost and complexity of AI/OCR tools (which I utilized in DocSage), I would use pdfplumber. Assuming this is a machine-generated PDF, pdfplumber uses spatial geometry to mathematically extract tables into clean, nested lists without heavy OCR overhead.

### 3. Validation & Handling Missing Fields
When building DocSage, I learned that strict guardrails are necessary before allowing data to hit a SQL database. I would use Pydantic to enforce schema contracts on the newly unified DataFrame:
* If an optional field (e.g., "Meeting Notes") is missing, Pydantic applies a safe default (like NULL or an empty string).
* If a critical field (e.g., "Vote Cast") is missing or wildly inconsistent, Pydantic throws a validation error for that specific row. Instead of failing the entire quarterly batch, that specific record is routed to a Dead Letter Queue (DLQ) table for manual review, ensuring only pristine data reaches the production tables.

### 4. Handling Format Changes & Outages
Pipelines break when sources change formats silently. To handle this, the pipeline incorporates strict edge-case detection:
* Zero-Row Checks: If the UK provider suddenly uploads a scanned image instead of a digital PDF, pdfplumber will quietly extract zero rows. The pipeline explicitly checks row counts against historical averages. If the count drops by >90%, it aborts the database INSERT and flags a "Format Change" error.
* HTTP Failures: If a source is offline, the requests module utilizes an exponential backoff retry strategy. If it fails after 3 attempts, the pipeline halts that specific region's extraction and alerts the team, allowing the other two regions to process normally.

### 5. Scheduling & Monitoring
The entire workflow is monitored via AWS CloudWatch. Every Lambda execution logs its status. CloudWatch Alarms are configured to push notifications to a Slack webhook if an HTTP extraction fails, if Pydantic routes more than 5% of records to the DLQ, or if a format change is detected.
