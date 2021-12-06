# ♥♣🚽 Agile Flush 🚽♠♦

The best place for online planning poker!

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

1. To build the Vue application, run this in the root of the repository:

    ```cmd
    npm run build
    ```

1. To start the Static Web App emulator, run this in the root of the repository:

    ```cmd
    swa start dist --api-location api
    ```

1. Now open the link that is output by the `swa` command.

## Deploying the app to Azure

// TODO

## Tech Stack

// TODO