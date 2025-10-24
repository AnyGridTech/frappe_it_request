### Frappe IT Request

This application introduces a new DocType, IT Request, which acts as a centralized support ticket, ensuring that all requests are properly categorized, tracked, and assigned.

## Main Features

- Hierarchical Categorization: Uses a three-level category system (1st Category, 2nd Category, 3rd Category) to accurately classify the type of request (e.g., System > ERPNext > Bug Fixes).
- Onboarding/Offboarding Flows: Includes specific conditional fields for Onboarding Kit and Offboarding Kit requests, facilitating the management of employee arrivals and departures.
- Assignment and Deadline: Allows for assigning requests to specific users and establishing a resolution deadline, visible only to the IT team.
- Data Automation: Automatically fills in requester information, such as email and department, and restricts department selection to a predefined list (e.g., "Administrative", "Logistics", "IT"). - Conditional Fields: The Document Links field (link_doc) is mandatory and displayed only for document Editing or Maintenance requests.

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app frappe_it_request
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/frappe_it_request
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade

### License

mit
