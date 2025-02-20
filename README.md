
# ZotNFound
A web application developed by the ICSSC at the University of California, Irvine, designed to help UCI students, faculty, and staff report and recover lost items on campus. The app enables users to easily submit details of lost or found items, search existing reports, and connect with others to reunite belongings with their rightful owners. Its goal is to provide a user-friendly platform to streamline the lost-and-found process at UCI.

![Logo](./packages/web/src/assets/images/banner.png)


## Tech Stack

**Frontend:** React Native, Leaflet

**Backend:** Node, Express, Firebase


## AWS Configuration

Step 1: Install the AWS CLI ([Download Link](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)) for your OS

Step 2: To confirm that you have the CLI ready, go to your terminal or powershell and run 
```bash
  aws --version
```

Step 3:

```bash
  aws configure
```

Step 4: Input the respective information:
```bash
AWS Access Key ID [None]: [paste your AWS Access Key]
AWS Secret Key ID [None]: [paste your AWS Secret Key]
Default region name [None]: [just hit enter]
Default output format [None]: [just hit enter]
```
    

## Run Locally

Clone the project

```bash
  git clone https://github.com/icssc/ZotNFound.git
```

Go to the project directory

```bash
  cd zotnfound
```

Install dependencies

```bash
  pnpm install
```

Start backend 

```bash
  cd ./packages/functions
  pnpm run dev

```
    

Start frontend 

```bash
  cd ./packages/web
  pnpm run dev
```
View the local website at http://localhost:3000
