# Intelligent Documentation : TeckDoc

🌐 https://teckdoc-smart-search.vercel.app

## Description

TeckDoc is a web3 powered documentation using token gated AI. 

## Features

- **Clean Documentation:** clean and easy to read design for developers.
- **Web3Auth Login:** Secure user authentication and login process via Web3Auth.
- **Galadriel Protocol:** Automate the creation of RAG (Retrieval Augmented Generation) reports.
- **Anti-Spam Agent:** Multi agent architecture to verify and filter spam from user requests.
- **Envio Protocol for Analytics:** Adds analytics to learn from user interactions.
- **Multiple Demos:** Multiple demos to choose from: Nillions, Blockless, Avail ...

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

