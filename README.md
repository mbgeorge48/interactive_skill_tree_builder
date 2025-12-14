# Interactive Skill Tree Builder

## Setup Instructions

This app uses bun to install and run the React app
Follow the instuctions to install bun on your machine

- https://bun.com/
  - `curl -fsSL https://bun.sh/install | bash`

```sh
bun install
bun run dev
```

Follow terminal instuctions to the URL (usually http://localhost:5173/)

## Requirements

- [x] Skill Node Creation:
  - Click the "Add New Skill" button in the bottom right to open the modal.
- [x] Connections (Prerequisites):
  - There are predefined prerequisites in the default data, new ones can created when new skills are created
- [x] Navigation and Interaction:
  - Clicking on a skill node will `select` it and unlock any nodes that are connected to it
- [x] Basic Persistence:
  - Changes are saved into local storage when information changes
  - These changes are fetched from local storage when the page loads
- [x] Unit Tests
  - Added tests for the utils files
  - Added tests for the components
  - Added tests for the core App.jsx

## AI Disclosure

Copliot was used during the work on this task. It was mainly used for the following things:

- Helping to explain parts of the React Flow library when working with custom Node and Edge flows and logic
- Generating CSS styles
- Create the default skill labels/descriptions
