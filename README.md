
# ZotNFound
A web application developed by the ICSSC at the University of California, Irvine, designed to help UCI students, faculty, and staff report and recover lost items on campus. The app enables users to easily submit details of lost or found items, search existing reports, and connect with others to reunite belongings with their rightful owners. Its goal is to provide a user-friendly platform to streamline the lost-and-found process at UCI.

![Logo](./packages/web/src/assets/images/banner.png)

## ICSSC
ZotNFound is a project under the [ICSSC Projects Committee](https://github.com/icssc), which provides funding, marketing, and technical support for a variety of UCI-focused applications. As part of ICSSC's commitment to open-source development, these projects are freely available for collaboration, allowing students and developers to contribute, learn, and enhance the UCI community.

## Tech Stack

**Frontend:** React Native, Leaflet

**Backend:** Node, Express, Firebase


## SST (Serverless Stack)

SST is a framework designed for building serverless applications, allowing full-stack developers to build applications without managing servers and infrastructure directly while taking advantage of AWS services. ([Link to docs](https://v2.sst.dev/))

## AWS Configuration

### Step 1:  Install the AWS CLI
Install the AWS CLI ([Download Link](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)) for your OS

### Step 2: Confirm Installation
To confirm that you have the CLI ready, go to your terminal or powershell and run 
```bash
  aws --version
```

Step 3: Configure AWS CLI
Run the following command to configure the AWS CLI:
```bash
  aws configure
```

### Step 4: Input the Required Information:
When prompted, enter the following details:
```bash
AWS Access Key ID [None]: [paste your AWS Access Key]
AWS Secret Key ID [None]: [paste your AWS Secret Key]
Default region name [None]: [just hit enter]
Default output format [None]: [just hit enter]
```
    

## Run Locally
To run the ZotNFound app locally, follow these steps:

### Step 1: Clone the Repository
Clone the repository to your local machine:

```bash
  git clone https://github.com/icssc/ZotNFound.git
```

### Step 2: Navigate to the Project Directory
Change into the project directory:

```bash
  cd zotnfound
```

### Step 3: Install Backend Dependencies
Install the backend dependencies using pnpm:

```bash
  pnpm install
```

### Step 4: Start the Backend
Start the backend server with:

```bash
  pnpm run dev
```
    
### Step 5: Start the Frontend
Navigate to the frontend directory and start the frontend server:

```bash
  cd ./packages/web
  pnpm run dev
```

### Step 6: Access the Local Website
Once both the backend and frontend servers are running, you can view the application at:
http://localhost:3000
