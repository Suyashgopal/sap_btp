# Student Management System

This is a simple Student Management System built using SAP CAP. It allows basic CRUD operations on student data.

## Features

* Add student
* View students
* Update student
* Delete student
* Basic validation (age > 0, valid name and course)

## Tech Stack

* SAP CAP (Node.js)
* SQLite (local) / SAP HANA (cloud)
* HTML, CSS, JavaScript

## Project Structure

student-management/
├── db/
├── srv/
├── app/
├── package.json
├── mta.yaml

## How to Run

1. Install dependencies:
   npm install

2. Start the project:
   cds watch

3. Open in browser:
   http://localhost:4004

## API

* GET /catalog/Students
* POST /catalog/Students
* PATCH /catalog/Students('{ID}')
* DELETE /catalog/Students('{ID}')

## Notes

This project was created as part of a SAP BTP capstone project. It focuses on basic functionality and clean implementation.
