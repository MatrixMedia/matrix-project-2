# Use the public AWS Lambda Python 3.12 base image
FROM --platform=linux/amd64 public.ecr.aws/lambda/python:3.12

# Set the working directory to /var/task (AWS Lambda's default)
WORKDIR /var/task

# Copy the application code and dependencies file (requirements.txt) to the working directory
COPY . .

# Install the dependencies using pip (generated from pyproject.toml)
# We install the dependencies with --no-cache-dir to avoid leaving caches in the final image
RUN pip install --no-cache-dir -r requirements.txt

# Ensure that mangum is installed since it's crucial for adapting FastAPI to AWS Lambda
RUN pip install --no-cache-dir mangum

# Specify the Lambda handler
CMD ["app.server.handler"]
