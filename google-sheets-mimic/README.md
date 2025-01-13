# Google Sheets Mimic

Google Sheets Mimic is a project that emulates the core functionalities of Google Sheets, providing users with a web-based spreadsheet application.

## Features

- **Cell Editing**: Modify cell content with ease.
- **Formulas**: Support for basic arithmetic operations.
- **Data Persistence**: Save and load spreadsheets.
- **User Interface**: Intuitive design for seamless interaction.

## Data Structures Used

- **2D Array**: Represents the spreadsheet grid, allowing efficient access and manipulation of cell data.
- **HashMap**: Stores cell references and their computed values, facilitating quick formula evaluations.
- **Stack**: Manages function calls and operations during formula parsing and execution, adhering to the Last-In-First-Out (LIFO) principle. 

## Tech Stack

- **Frontend**: Developed using HTML, CSS, and JavaScript to create a responsive and interactive user interface.
- **Backend**: Implemented with Node.js and Express.js, providing robust server-side logic and API endpoints.
- **Database**: Utilizes MongoDB for storing spreadsheet data, ensuring scalability and flexibility.

## Rationale for Choices

- **2D Array**: Offers a straightforward method to model the spreadsheet's tabular structure, enabling direct cell access.
- **HashMap**: Allows for rapid retrieval of cell values, essential for efficient formula computation.
- **Stack**: Facilitates the evaluation of nested functions and operations within formulas, maintaining correct execution order.
- **HTML, CSS, JavaScript**: Chosen for their ubiquity and effectiveness in building dynamic web interfaces.
- **Node.js and Express.js**: Selected for their non-blocking, event-driven architecture, suitable for handling multiple user requests concurrently.
- **MongoDB**: Preferred for its schema-less design, accommodating the flexible nature of spreadsheet data.

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mrrdl/Google_Sheet_Mimic.git
   ```
2. **Install Dependencies**:
   ```bash
   cd Google_Sheet_Mimic
   npm install
   ```
3. **Run the Application**:
   ```bash
   npm start
   ```
4. **Access via Browser**:
   Navigate to `http://localhost:3000` to use the application.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements.

## License

This project is licensed under the MIT License.

For a visual explanation of stacks, you might find the following video helpful:

 
