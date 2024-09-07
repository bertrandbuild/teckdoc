# Intelligent Documentation : TekDoc

🌐 https://teckdoc-smart-search.vercel.app

## Description

This project is an intelligent documentation site that allows users to search for documents using automated protocols and tools such as Galadriel and Envio for adding analyses. It also provides user authentication via Web3Auth and guarantees secure processing of user requests thanks to integrated anti-spam protection.

## Features

- **Create Documentation:** Allow users to search documentation using the intelligent system.
- **Web3Auth Login:** Secure user authentication and login process via Web3Auth.
- **Galadriel Protocol:** Automate the creation of RAG (Red, Amber, Green) reports.
- **Anti-Spam First Agent:** Initial agent to verify and filter spam from user requests.
- **Second Agent for Request Handling:** Processes legitimate requests and passes them through the system.
- **Envio Protocol for Analytics:** Adds analytics to processed data and enhances insights.
- **View Documentation:** Users can view the generated documentation within the platform.

## Flow Overview

```md
(Create the documentation) ---> (Galadriel Protocol: RAG Creation)
                    (Web3Auth Login) ---> (User Requests)
                                                        |
                    (Galadriel Protocol First Agent: Anti-Spam)
                                                        |
                     (Second Agent: Request Handling) ---> (Envio Protocol: Analytics)
                                                        |
                           (Intelligent Documentation Site) ---> (View in user)
```

## Getting Started

### Prerequisites
Node.js (version X.X.X or above)
npm

### Installation

1) Clone the repository:

```sh
git clone https://github.com/bertrandbuild/teckdoc.git
```

2) Navigate to the project directory:

```sh
cd teckdoc
```

3) Install dependencies:

```sh
npm install
```

4) Running the App

```sh
npm start
```

The app will be running on `http://localhost:3000`.

## Contact

For any questions or support, feel free to contact us at your-email@example.com.