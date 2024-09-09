# Star Citizen Cargo Manifest

A web application for managing cargo jobs in the game Star Citizen. This app allows users to track cargo pickups, deliveries, and job details with support for local storage and dark mode.

## Features

- **Add Cargo Jobs**: Easily add new cargo jobs with details about the source, destination, amount, and cargo type.
- **Track Job Status**: Mark jobs as picked up or delivered.
- **Persistent Storage**: Cargo jobs are stored in the browser's local storage.
- **Version Control**: Automatically clear storage when the app version updates to avoid data conflicts.
- **Dark Mode Support**: Switch between light and dark modes for better viewing.
- **Sorting & Filtering**: Sort jobs by source or destination, and filter out delivered jobs.

## Installation

1. Download the project files and open `index.html` in your browser to start using the app.

## Usage

1. Click on the **Add Job** button to create a new cargo job.
2. Select the pickup and delivery locations from the available options.
3. Enter additional job details such as cargo amount and type.
4. Save the job and view it in the job table.
5. Use the **Picked Up** and **Delivered** checkboxes to update the status of each job.
6. Clear all jobs with the **Clear All Jobs** button or hide delivered cargo using the **Hide Delivered Cargo** checkbox.

## Version Control

The app automatically detects version changes and clears the local storage to avoid conflicts. This feature ensures smooth updates between versions and notifies the user when the app version has been updated.

## Dark Mode

Toggle dark mode using the switch in the header. The app will remember your preference using local storage.

## Project Structure

- `index.html`: Main HTML file with the structure of the web page.
- `index.js`: JavaScript logic to handle cargo jobs, local storage, dark mode, and version control.
- `styles.css`: Styling for both light and dark modes, including table and modal designs.

## Contributing

Contributions are welcome! Feel free to open a pull request or issue.

## License

This project is licensed under the MIT License.
