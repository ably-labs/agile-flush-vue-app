# ♥♣🚽 Agile Flush 🚽♠♦

The Nr 1 and Nr 2 place for online planning poker!

This project is an example of how an online collaboration tool can be built that depends on realtime data synchronization between clients.

// TODO Diagram

The live version can be used here: [TODO]().

## The tech stack

The project uses the following components:

- [Vue](https://vuejs.org/) as the front-end framework.
- [Ably](https://ably.com/) as the realtime communications platform.
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/overview) to host the application.

## Running the app locally

Ensure you have the following dependencies installed:

- [Node 16](https://nodejs.org/en/download/)
- [Azure Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli)
- [Azure Functions Core Tools v4](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4)

For more info developing Static Web Apps locally see the [official docs](https://docs.microsoft.com/en-us/azure/static-web-apps/local-development).

1. Clone this repository to your local machine.
1. [Sign up](https://ably.com/signup) or [log in](https://ably.com/login) to [ably.com](https://www.ably.com), [create a new app and copy the API key](https://faqs.ably.com/setting-up-and-managing-api-keys).
1. Add a file named `local.settings.json` to the `api` folder and add the following content:

    ```json
    {
        "IsEncrypted": false,
        "Values": {
            "AzureWebJobsStorage": "",
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "ABLY_API_KEY": "<YOUR_ABLY_APP_KEY>"
        }
    }
    ```

    - Replace `<YOUR_ABLY_APP_KEY>` with the key you copied in step 2.
1. To install the dependencies, run this in the root of the repository:

    ```cmd
    npm install
    ```

1. To run the Vue application, run this in the root of the repository:

    ```cmd
    npm run serve
    ```

    The Vue app will be available at `http://localhost:8080`.

1. To start the Azure Functions runtime, run this in the `api` folder of the repository:

    ```cmd
    func start
    ```

    The Azure Functions app will be available at `http://localhost:7071`.

1. To start the Static Web App emulator, run this in the root of the repository:

    ```cmd
    swa start http://localhost:8080 --api-location http://localhost:7071
    ```

1. Now open the link that is output by the `swa` command (`http://localhost:4280`).

## Deploying the app to Azure

// TODO


## CodeTour

This repository has a CodeTour that guides your through the solution. You can either start the tour on GitHub or run it in VSCode using the [CodeTour extension](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour).
